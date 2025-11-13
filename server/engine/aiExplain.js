export function explainRoadmap(role, roadmap) {
  const header = `Your Personalized Learning Roadmap for ${role}\n\n`;
  const intro =
    `This roadmap focuses on developing the most important skills needed to perform well as a ${role}. ` +
    `Each week builds on your existing strengths and gradually closes the skill gaps.\n\n`;

  const steps = roadmap
    .map(r => `• **Week ${r.week}:** Learn **${r.skill}** (~${r.estimatedHours} hours)`)
    .join("\n");

  const strategy = `\n\n**Learning Strategy:**\n` +
    `- Focus on practical, hands-on problem-solving.\n` +
    `- Practice at least 1 real-world mini project per skill.\n` +
    `- Document progress on GitHub and LinkedIn weekly.\n`;

  const resources = `\n**Recommended Resource Types:**\n` +
    `- YouTube tutorials for quick conceptual introduction.\n` +
    `- Free structured courses on Coursera / Kaggle / DataCamp.\n` +
    `- GitHub repositories to review real project structures.\n\n`;

  const closing =
    `If you'd like, I can now generate:\n` +
    `✔ Course links\n` +
    `✔ Project suggestions\n` +
    `✔ Interview preparation resources\n`;

  return header + intro + steps + strategy + resources + closing;
}
