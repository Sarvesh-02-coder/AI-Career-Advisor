import express from "express"; 
import cors from "cors";
import "dotenv/config";

import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";
import { roleSkillMap } from "./data/roleSkills.js"; // legacy (we'll not use it for matching now)

import { computeRoadmap } from "./engine/roadmap.js";
import { explainRoadmap } from "./engine/aiExplain.js";

import { ensureIndex, matchCareersSemantic, getRoleSkills } from "./engine/semanticMatcher.js";
import { fetchJobInsights } from "./engine/jobInsights.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { matchCareers } from "./engine/matcher.js"; 



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rolesPath = path.join(__dirname, "./data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));
const app = express();

app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

app.get("/", (req, res) => res.json({ message: "Backend is running ✅" }));


// Build the semantic index once at boot
ensureIndex().then(() => console.log("🔎 Role index ready")).catch(console.error);


/**
 * @swagger
 * /match-careers:
 *   post:
 *     summary: Get top career recommendations (semantic).
 *     description: Matches user profile to a large dynamic role dataset using embeddings.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicalSkills: { type: array, items: { type: string } }
 *               softSkills: { type: array, items: { type: string } }
 *               interests: { type: array, items: { type: string } }
 *            
 *     responses:
 *       200: { description: Successful ranked recommendations. }
 *       500: { description: Server error. }
 */
app.post("/match-careers", (req, res) => {
  try {
    const userProfile = req.body || {};
    const results = matchCareers(userProfile);
    res.json({ recommendations: results });
  } catch (e) {
    console.error("Career matching error:", e);
    res.status(500).json({ error: "Career match failed" });
  }
});


/**
 * @swagger
 * /role-skills:
 *   get:
 *     summary: Get canonical technical skills for a role.
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Role skills. }
 */
// ✅ Direct skill lookup from roles.json (no semantic fallback)
import { getSkillsForRole } from "./engine/matcher.js";
// ✅ Direct skill lookup from roles.json with optional mainstream filter
app.get("/role-skills", (req, res) => {
  const role = String(req.query.role || "").toLowerCase().trim();
  const mainstream = String(req.query.mainstream || "0") === "1";

  let skills = roles[role] || [];
  if (!skills || skills.length === 0) {
    return res.status(404).json({ error: `No skills found for role: ${role}` });
  }

  if (mainstream) {
    const MAINSTREAM = [
      "python","java","javascript","typescript","c++","c#","go","rust","php","ruby",
      "html","css","react","vue","angular","node","express","django","flask","spring",
      "sql","mysql","postgresql","postgres","sqlite","mongodb","redis",
      "git","github","gitlab","docker","kubernetes","linux","bash","shell",
      "aws","gcp","azure","firebase","terraform","ansible",
      "machine learning","deep learning","pytorch","tensorflow","scikit-learn",
      "nlp","computer vision","opencv","pandas","numpy","matplotlib","seaborn",
      "hadoop","spark","kafka",
      "ci/cd","jenkins","circleci","github actions"
    ];
    const lower = new Set(MAINSTREAM);
    skills = skills.filter(s => {
      const x = String(s).toLowerCase();
      return [...lower].some(k => x.includes(k));
    });
  }

  // De-dupe and normalize casing a bit for prettier UI
  skills = Array.from(new Set(skills)).map(s => {
    const t = String(s).trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  });

  res.json({ role, skills });
});



/**
 * @swagger
 * /generate-roadmap:
 *   post:
 *     summary: Generate a personalized learning roadmap.
 *     description: Automatically detects missing skills based on role dataset and builds a weekly plan.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: 
 *                 type: string
 *                 example: "full stack developer"
 *               userSkills:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["html", "css", "javascript"]
 *     responses:
 *       200: { description: Roadmap generated successfully. }
 *       500: { description: Error. }
 */


import { resolveRole } from "./engine/resolveRole.js";

app.post("/generate-roadmap", (req, res) => {
  try {
    let { role, userSkills, requiredSkills } = req.body || {};
    userSkills = Array.isArray(userSkills) ? userSkills : [];
    requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : [];

    // 1) Map fuzzy input → canonical O*NET role name
    const resolved = resolveRole(String(role || ""));
    if (!resolved) {
      return res.status(400).json({ error: `Role not recognized: "${role}". Try a different job title.` });
    }

    // 2) Normalize role lookup
    const roleKey = resolved.toLowerCase();
    const fullRoleSkills = roles[roleKey] || [];

    // 3) If frontend didn’t send requiredSkills, fallback to dataset role skills
    if (requiredSkills.length === 0) {
      requiredSkills = fullRoleSkills;
    }

    console.log(`🧭 /generate-roadmap`);
    console.log(`   → Input Role: "${role}"`);
    console.log(`   → Resolved Role Key: "${roleKey}"`);
    console.log(`   → Skills in dataset: ${fullRoleSkills.length}`);
    console.log(`   → Skills sent from FE: ${requiredSkills.length}`);
    console.log(`   → User skills: ${userSkills.length}`);

    // 4) ✅ Pass requiredSkills to computeRoadmap
    const roadmap = computeRoadmap(userSkills, roleKey, requiredSkills);
    const explanation = explainRoadmap(roleKey, roadmap);

    res.json({ role: roleKey, roadmap, explanation });

  } catch (error) {
    console.error("Roadmap generation error:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
});

/**
 * @swagger
 * /job-insights:
 *   get:
 *     summary: Get real-time job market insights for a career role (India region).
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job market insights retrieved successfully. }
 */
app.get("/job-insights", async (req, res) => {
  try {
    const role = req.query.role || "Software Developer";
    const insights = await fetchJobInsights(role);
    res.json(insights);
  } catch (error) {
    console.error("Job insights error:", error);
    res.status(500).json({ error: "Failed to fetch job insights" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📄 Swagger UI available at http://localhost:${PORT}/docs`);
});

const skillsPath = path.resolve("data/skills.json");
const skills = JSON.parse(fs.readFileSync(skillsPath, "utf8"));


app.get("/skills", (req, res) => {
  res.json({ skills });
});
