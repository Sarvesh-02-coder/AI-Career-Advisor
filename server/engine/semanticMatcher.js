// server/engine/semanticMatcher.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { embedText, cosineSim } from "./embeddings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "..", "data", "occupations.json");
const INDEX_PATH = path.join(__dirname, "..", "data", "roles_index.json");

let roles = [];     // raw roles
let index = [];     // [{ role, vector, skills:[], meta:{} }, ...]

/** Load occupations dataset */
function loadRoles() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  roles = JSON.parse(raw);
}

/** Build or load cached embedding index */
export async function ensureIndex() {
  loadRoles();

  // Try loading cached index with same role count
  if (fs.existsSync(INDEX_PATH)) {
    try {
      const cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
      if (Array.isArray(cached) && cached.length === roles.length) {
        index = cached;
        return;
      }
    } catch {}
  }

  // Build fresh
  index = [];
  for (const r of roles) {
    const roleText = [
      r.role,
      ...(r.technicalSkills || []),
      ...(r.softSkills || []),
      ...(r.domains || []),
      ...(r.tasks || [])
    ];
    const vector = await embedText(roleText);
    index.push({
      role: r.role,
      vector,
      skills: (r.technicalSkills || []),
      meta: {
        softSkills: r.softSkills || [],
        domains: r.domains || [],
      }
    });
  }

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index));
}

/**
 * Semantic match: userProfile -> topK roles
 * Combines:
 *  - Embedding similarity on combined user text
 *  - Light skill-overlap booster
 */
export async function matchCareersSemantic(userProfile, topK = 5) {
  if (index.length === 0) await ensureIndex();

  const userText = [
    "technical skills:", ...(userProfile.technicalSkills || []),
    "soft skills:", ...(userProfile.softSkills || []),
    "interests:", ...(userProfile.interests || []),
    "preferred domains:", ...(userProfile.preferredDomains || [])
  ];

  const userVec = await embedText(userText);
  const userSkillSet = new Set((userProfile.technicalSkills || []).map(s => s.toLowerCase()));

  const scored = index.map((entry) => {
    const sim = cosineSim(userVec, entry.vector); // 0..1 typically ~0.2..0.8
    // overlap booster: fraction of role skills the user already has
    const roleSkills = (entry.skills || []).map(s => s.toLowerCase());
    const overlap = roleSkills.length
      ? roleSkills.filter(s => userSkillSet.has(s)).length / roleSkills.length
      : 0;

    // final score: 80% semantic + 20% overlap
    const score = 0.8 * sim + 0.2 * overlap;
    return { role: entry.role, score, roleSkills: entry.skills };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/** Get skills for a role (for roadmap) */
export function getRoleSkills(roleName) {
  const r = roles.find(r => (r.role || "").toLowerCase() === String(roleName || "").toLowerCase());
  return r ? (r.technicalSkills || []) : [];
}
