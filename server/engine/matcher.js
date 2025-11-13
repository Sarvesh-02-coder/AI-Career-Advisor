import fs from "fs";
import path from "path";

const rolesPath = path.resolve("data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));

// Convert list to lowercase set
function normalize(list = []) {
  return new Set(list.map(s => s.toLowerCase().trim()));
}

// Cosine similarity for sets
function similarity(userSet, roleSet) {
  const intersection = [...userSet].filter(s => roleSet.has(s)).length;
  if (intersection === 0) return 0;
  return intersection / Math.sqrt(userSet.size * roleSet.size);
}

export function matchCareers(userProfile) {
  const userSkills = normalize([
    ...(userProfile.technicalSkills || []),
    ...(userProfile.softSkills || []),
    ...(userProfile.interests || []),
  ]);

  const results = [];

  for (const roleName in roles) {
    const roleSkills = normalize(roles[roleName]);
    const score = similarity(userSkills, roleSkills);
    if (score > 0) { // Only include roles with real similarity
      results.push({ role: roleName, score: Number(score.toFixed(3)) });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // top 6 dynamic recommendations
}

export function getSkillsForRole(roleName) {
  const key = roleName.toLowerCase();
  return roles[key] || [];
}
