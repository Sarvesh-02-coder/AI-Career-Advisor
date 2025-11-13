// ✅ Define API base URL once
const API = "http://localhost:5050";

export async function getCareerMatches(user) {
  const res = await fetch(`${API}/match-careers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return res.json().then(r => r.recommendations);
}

export async function getRoleSkills(role: string) {
  const res = await fetch(`${API}/role-skills?role=${encodeURIComponent(role)}`);
  return await res.json();
}

export async function getLearningRoadmap(role: string, userSkills: string[]) {
  const res = await fetch(`${API}/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, userSkills })
  });
  return await res.json();
}



export async function getJobInsights(role: string) {
  const res = await fetch(`${API}/job-insights?role=${encodeURIComponent(role)}`);
  return await res.json();
}
