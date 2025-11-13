import { dijkstra } from "../ds/graph.js";
import { skillGraph } from "../data/skillGraph.js";
import fs from "fs";
import path from "path";

const rolesPath = path.resolve("data/roles.json");
const roles = JSON.parse(fs.readFileSync(rolesPath, "utf8"));

// ⚠️ This file still checks ALL skills (as you requested). We only filter on the UI for Skill Analysis.
const CORE_KEYWORDS = [
  "python","javascript","typescript","java","c++","c#","go","rust","php","ruby",
  "html","css","react","node","express","django","flask","vue","angular",
  "sql","postgres","mysql","sqlite","mongodb","redis",
  "git","docker","kubernetes","linux",
  "aws","gcp","azure","terraform","ansible",
  "machine learning","deep learning","pytorch","tensorflow"
];

export function computeRoadmap(userSkills, role) {
  const targetSkills = (roles[role] || []).map(s => s.toLowerCase());
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Identify missing skills (core logic)
  const missing = targetSkills.filter(skill => !userSet.has(skill));

  // Compute learning effort from graph
  const distances = {};
  for (const skill of userSet) {
    Object.assign(distances, dijkstra(skillGraph, skill));
  }

  const ranked = missing
    .map(skill => {
      let effort = distances[skill];
      if (!effort || effort === Infinity) effort = 4;
      let estimatedHours = Math.max(4, Math.min(Math.round(effort * 4), 14));
      return { skill, estimatedHours };
    })
    // no mainstream bias sorting → keep real skill differences
    .slice(0, 25);

  return ranked.map((entry, index) => ({
    week: index + 1,
    skill: entry.skill,
    estimatedHours: entry.estimatedHours,
  }));
}
