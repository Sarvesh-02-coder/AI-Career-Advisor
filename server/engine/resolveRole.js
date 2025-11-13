import fs from "fs";
import path from "path";

const rolesPath = path.resolve("data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));

function similarity(a, b) {
  const A = new Set(String(a).toLowerCase().split(/[\s/-]+/).filter(Boolean));
  const B = new Set(String(b).toLowerCase().split(/[\s/-]+/).filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / Math.sqrt(A.size * B.size);
}

export function resolveRole(inputRole) {
  const q = String(inputRole || "").toLowerCase().trim();
  if (!q) return null;

  let best = null;
  let score = 0;

  for (const title of Object.keys(roles)) {
    const s = similarity(q, title);
    if (s > score) {
      score = s;
      best = title; // title is already the key in roles.json
    }
  }

  if (!best || score < 0.25) return null;
  console.log(`🔍 Role mapped: "${q}" → "${best}" (score=${score.toFixed(2)})`);
  return best; // return the key as-is; caller lowercases if needed
}
