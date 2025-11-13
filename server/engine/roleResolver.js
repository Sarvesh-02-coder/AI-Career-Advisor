import fs from "fs";
import path from "path";

const rolesPath = path.resolve("data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));

// Very simple fuzzy match
export function resolveRoleName(inputRole) {
  inputRole = inputRole.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const role of Object.keys(roles)) {
    const score = similarity(inputRole, role);
    if (score > bestScore) {
      bestScore = score;
      best = role;
    }
  }
  return best || inputRole; // fallback
}

// string similarity helper
function similarity(a, b) {
  const setA = new Set(a.split(" "));
  const setB = new Set(b.split(" "));
  const inter = [...setA].filter(x => setB.has(x)).length;
  return inter / Math.max(setA.size, setB.size);
}
