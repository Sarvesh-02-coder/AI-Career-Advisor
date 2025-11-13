import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("db_30_0_text");
const TECH_FILE = path.join(DATA_DIR, "Technology Skills.txt");
const OCC_FILE = path.join(DATA_DIR, "Occupation Data.txt");

function loadTable(file) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.trim().split("\n");
  const headers = lines[0].split("\t");
  return lines.slice(1).map(row => {
    const cols = row.split("\t");
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i]);
    return obj;
  });
}

console.log("⏳ Loading technical skills...");
const techRows = loadTable(TECH_FILE);
const occupations = loadTable(OCC_FILE);

console.log(`✅ Loaded ${occupations.length} occupations & ${techRows.length} tech rows.`);

// Filter only relevant technical skills
const filtered = techRows.filter(r => r["Hot Technology"] === "Y" && r["Example"]);

const roleSkills = {};

for (const row of filtered) {
  const soc = row["O*NET-SOC Code"];
  const skill = row["Example"].toLowerCase().trim();
  if (!roleSkills[soc]) roleSkills[soc] = new Set();
  roleSkills[soc].add(skill);
}

// Convert SOC → job title
const final = {};

occupations.forEach(o => {
  const soc = o["O*NET-SOC Code"];
  if (roleSkills[soc]) {
    final[o["Title"].toLowerCase()] = Array.from(roleSkills[soc]);
  }
});

const OUTPUT = path.resolve("data/roles.json");
fs.writeFileSync(OUTPUT, JSON.stringify(final, null, 2));

console.log("🎉 Technical roles.json built!");
console.log(`📄 Saved → ${OUTPUT}`);
console.log(`Total roles: ${Object.keys(final).length}`);
