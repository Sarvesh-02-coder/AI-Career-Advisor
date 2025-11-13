export class InvertedIndex {
  constructor() {
    this.map = new Map();
  }

  add(skill, career) {
    skill = skill.toLowerCase();
    if (!this.map.has(skill)) {
      this.map.set(skill, new Set());
    }
    this.map.get(skill).add(career);
  }

  getCareers(skill) {
    return Array.from(this.map.get(skill.toLowerCase()) || []);
  }
}
