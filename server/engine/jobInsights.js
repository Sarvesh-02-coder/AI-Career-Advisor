// engine/jobInsights.js
// Robust India-focused job insights with multiple sources + safe fallbacks.
// Order: JSearch (RapidAPI) → Naukri → Foundit → Heuristic

const SKILL_LEXICON = [
  "python","sql","machine learning","ml","tensorflow","pytorch","statistics",
  "power bi","tableau","excel","nlp","deep learning","spark","aws","azure",
  "react","node.js","javascript","docker","kubernetes","git","linux"
];

function countByCityAndSkills(posts) {
  const cityCount = {};
  const skillCount = {};

  for (const p of posts) {
    // City
    const city = (p.city || p.location || "Multiple Cities").toString();
    cityCount[city] = (cityCount[city] || 0) + 1;

    // Skills (from description/title)
    const blob = `${p.title || ""} ${p.description || ""}`.toLowerCase();
    for (const s of SKILL_LEXICON) {
      // simple contains; avoid double counting within one post
      if (blob.includes(s)) {
        skillCount[s] = (skillCount[s] || 0) + 1;
      }
    }
    // also count explicit skills arrays if present
    if (Array.isArray(p.skills)) {
      for (const s of p.skills) {
        const key = s.toLowerCase();
        skillCount[key] = (skillCount[key] || 0) + 1;
      }
    }
  }

  const topCities = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, jobs]) => ({ city, jobs }));

  const trendingSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name.replace(/\bml\b/, "machine learning"));

  return { topCities, trendingSkills };
}

// ---------- Source 1: JSearch (RapidAPI) ----------
async function fromJSearch(role) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(role + " in India")}&page=1&num_pages=1`;
    const resp = await fetch(url, {
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
      },
      method: "GET",
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const rows = Array.isArray(data?.data) ? data.data : [];
    const posts = rows.map(j => ({
      title: j.job_title,
      city: j.job_city || j.job_state || j.job_country || "India",
      description: j.job_description || "",
      skills: [] // JSearch may not provide a structured skills array
    }));
    return posts.length ? posts : null;
  } catch {
    return null;
  }
}

// ---------- Source 2: Naukri (best-effort; may be blocked) ----------
async function fromNaukri(role) {
  try {
    const url = `https://www.naukri.com/jobapi/v3/search?noOfResults=40&keyword=${encodeURIComponent(role)}&location=india`;
    const resp = await fetch(url, {
      headers: {
        "appid": "105",
        "systemid": "Naukri",
        "clientid": "d3skt0p",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    });
    // guard: if HTML returned, bail
    const text = await resp.text();
    if (!text || text.trim().startsWith("<")) return null;
    const data = JSON.parse(text);
    const rows = Array.isArray(data?.jobDetails) ? data.jobDetails : [];
    const posts = rows.map(j => ({
      title: j?.title || "",
      city: j?.placeholders?.[0]?.label || "Multiple Cities",
      description: (j?.jobDescription || "").toString(),
      skills: Array.isArray(j?.tags) ? j.tags.map(t => t?.label).filter(Boolean) : []
    }));
    return posts.length ? posts : null;
  } catch {
    return null;
  }
}

// ---------- Source 3: Foundit (best-effort; may be thin/blocked) ----------
async function fromFoundit(role) {
  try {
    const url = `https://www.foundit.in/api/jobsearch/v4/search?query=${encodeURIComponent(role)}&location=India`;
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    // Foundit also may return HTML; guard parse
    const text = await resp.text();
    if (!text || text.trim().startsWith("<")) return null;
    const data = JSON.parse(text);
    const rows = data?.jobSearchResult?.jobs || [];
    const posts = rows.map(j => ({
      title: j?.title || j?.jobTitle || "",
      city: j?.location?.city || "Multiple Cities",
      description: (j?.jobDescription || "").toString(),
      skills: Array.isArray(j?.skills) ? j.skills : []
    }));
    return posts.length ? posts : null;
  } catch {
    return null;
  }
}

// ---------- Heuristic fallback (never empty) ----------
function heuristic(role) {
  const defaults = {
    "data scientist": {
      topCities: [
        { city: "Bengaluru", jobs: 120 },
        { city: "Hyderabad", jobs: 85 },
        { city: "Pune", jobs: 70 },
        { city: "Gurugram", jobs: 55 },
        { city: "Remote", jobs: 40 },
      ],
      trendingSkills: ["python","sql","machine learning","tensorflow","power bi","statistics","pandas","tableau"]
    },
    "ml engineer": {
      topCities: [
        { city: "Bengaluru", jobs: 110 },
        { city: "Hyderabad", jobs: 80 },
        { city: "Pune", jobs: 60 },
        { city: "Chennai", jobs: 45 },
        { city: "Remote", jobs: 40 },
      ],
      trendingSkills: ["python","pytorch","tensorflow","docker","kubernetes","ml ops","aws","spark"]
    },
    "frontend developer": {
      topCities: [
        { city: "Bengaluru", jobs: 140 },
        { city: "Hyderabad", jobs: 95 },
        { city: "Pune", jobs: 90 },
        { city: "Noida", jobs: 65 },
        { city: "Remote", jobs: 60 },
      ],
      trendingSkills: ["react","javascript","typescript","html","css","redux","next.js","git"]
    }
  };
  const key = role.toLowerCase();
  return defaults[key] || {
    topCities: [
      { city: "Bengaluru", jobs: 100 },
      { city: "Hyderabad", jobs: 80 },
      { city: "Pune", jobs: 60 },
      { city: "Gurugram", jobs: 50 },
      { city: "Remote", jobs: 40 },
    ],
    trendingSkills: ["python","sql","aws","react","docker","kubernetes","git","linux"]
  };
}

export async function fetchJobInsights(role) {
  // 1) Try JSearch (RapidAPI)
  const jsearch = await fromJSearch(role);
  if (jsearch && jsearch.length) {
    const { topCities, trendingSkills } = countByCityAndSkills(jsearch);
    if (topCities.length || trendingSkills.length) {
      return { trendingRoles: [role], topCities, trendingSkills };
    }
  }

  // 2) Try Naukri
  const naukri = await fromNaukri(role);
  if (naukri && naukri.length) {
    const { topCities, trendingSkills } = countByCityAndSkills(naukri);
    if (topCities.length || trendingSkills.length) {
      return { trendingRoles: [role], topCities, trendingSkills };
    }
  }

  // 3) Try Foundit
  const foundit = await fromFoundit(role);
  if (foundit && foundit.length) {
    const { topCities, trendingSkills } = countByCityAndSkills(foundit);
    if (topCities.length || trendingSkills.length) {
      return { trendingRoles: [role], topCities, trendingSkills };
    }
  }

  // 4) Heuristic fallback
  const fallback = heuristic(role);
  return { trendingRoles: [role], ...fallback };
}
