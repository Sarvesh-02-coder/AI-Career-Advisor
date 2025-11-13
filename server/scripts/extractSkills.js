import fs from "fs";
import path from "path";

const rolesPath = path.resolve("data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));

const skillSet = new Set();

for (const role in roles) {
  const skills = roles[role];
  skills.forEach(s => skillSet.add(s.toLowerCase()));
}

const skillList = Array.from(skillSet).sort();

const outputPath = path.resolve("data/skills.json");
fs.writeFileSync(outputPath, JSON.stringify(skillList, null, 2));

console.log(`✅ Extracted ${skillList.length} unique skills → server/data/skills.json`);
