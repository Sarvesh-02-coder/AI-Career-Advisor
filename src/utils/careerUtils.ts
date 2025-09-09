import { useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
  educationLevel: string;
  graduationYear: string;
  technicalSkills: string[];
  softSkills: string[];
  interests: string[];
  preferredDomains: string[];
  workPreference: string;
  timeframe: string;
  resume: File | null;
  github: string;
  linkedin: string;
  portfolio: string;
}

const STORAGE_KEY = 'ai-career-advisor-profile';

export function useProfilePersistence() {
  const saveProfile = (profile: UserProfile) => {
    try {
      // Don't save file objects to localStorage
      const profileToSave = {
        ...profile,
        resume: null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileToSave));
    } catch (error) {
      console.warn('Failed to save profile to localStorage:', error);
    }
  };

  const loadProfile = (): Partial<UserProfile> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load profile from localStorage:', error);
      return null;
    }
  };

  const clearProfile = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear profile from localStorage:', error);
    }
  };

  return { saveProfile, loadProfile, clearProfile };
}

// Career matching engine with hardcoded logic
export function useCareerMatching() {
  const calculateMatch = (profile: UserProfile) => {
    const { technicalSkills, softSkills, interests, preferredDomains } = profile;
    
    // Career roles with their required skills and preferences
    const careerRoles = [
      {
        title: "Frontend Developer",
        requiredTechnical: ["JavaScript", "React", "CSS"],
        preferredTechnical: ["TypeScript", "Vue.js", "Angular"],
        requiredSoft: ["Problem Solving", "Creativity"],
        interests: ["Web Development", "UI/UX Design"],
        domains: ["Software Development"],
        salary: "$75,000 - $120,000",
        growth: "+15%",
        description: "Build user interfaces and experiences for web applications",
        demandScore: 95
      },
      {
        title: "Full Stack Developer",
        requiredTechnical: ["JavaScript", "Node.js", "SQL"],
        preferredTechnical: ["Python", "React", "AWS"],
        requiredSoft: ["Problem Solving", "Team Collaboration"],
        interests: ["Web Development", "Backend Systems"],
        domains: ["Software Development"],
        salary: "$80,000 - $130,000",
        growth: "+13%",
        description: "Work on both frontend and backend development",
        demandScore: 90
      },
      {
        title: "Data Scientist",
        requiredTechnical: ["Python", "Data Analysis", "Machine Learning"],
        preferredTechnical: ["SQL", "R", "TensorFlow"],
        requiredSoft: ["Critical Thinking", "Problem Solving"],
        interests: ["Data Science", "AI/ML"],
        domains: ["Data Science", "Research"],
        salary: "$95,000 - $160,000",
        growth: "+22%",
        description: "Extract insights from data to drive business decisions",
        demandScore: 88
      },
      {
        title: "Product Manager",
        requiredTechnical: [],
        preferredTechnical: ["Analytics", "SQL"],
        requiredSoft: ["Leadership", "Communication", "Project Management"],
        interests: ["Strategy", "Business"],
        domains: ["Product Management", "Consulting"],
        salary: "$90,000 - $150,000",
        growth: "+11%",
        description: "Lead product development and strategy",
        demandScore: 85
      },
      {
        title: "UX/UI Designer",
        requiredTechnical: ["UI/UX Design"],
        preferredTechnical: ["Figma", "Adobe Creative"],
        requiredSoft: ["Creativity", "Empathy", "Communication"],
        interests: ["Design", "User Experience"],
        domains: ["UX/UI Design", "Product Management"],
        salary: "$70,000 - $115,000",
        growth: "+9%",
        description: "Design user-centered digital experiences",
        demandScore: 82
      }
    ];

    return careerRoles.map(role => {
      let score = 0;
      let maxScore = 0;

      // Technical skills matching (40% weight)
      const techWeight = 40;
      const requiredTechMatch = role.requiredTechnical.filter(skill => 
        technicalSkills.includes(skill)
      ).length;
      const preferredTechMatch = role.preferredTechnical.filter(skill => 
        technicalSkills.includes(skill)
      ).length;
      
      const techScore = role.requiredTechnical.length > 0 
        ? (requiredTechMatch / role.requiredTechnical.length) * 0.7 + 
          (preferredTechMatch / Math.max(role.preferredTechnical.length, 1)) * 0.3
        : 0.5; // Neutral score for roles with no tech requirements
      
      score += techScore * techWeight;
      maxScore += techWeight;

      // Soft skills matching (30% weight)
      const softWeight = 30;
      const softMatch = role.requiredSoft.filter(skill => 
        softSkills.includes(skill)
      ).length;
      const softScore = role.requiredSoft.length > 0 
        ? softMatch / role.requiredSoft.length 
        : 0.8; // High score for roles with no specific soft skill requirements
      
      score += softScore * softWeight;
      maxScore += softWeight;

      // Interests matching (20% weight)
      const interestWeight = 20;
      const interestMatch = role.interests.filter(interest => 
        interests.includes(interest)
      ).length;
      const interestScore = role.interests.length > 0 
        ? interestMatch / role.interests.length 
        : 0.5;
      
      score += interestScore * interestWeight;
      maxScore += interestWeight;

      // Domain preference matching (10% weight)
      const domainWeight = 10;
      const domainMatch = role.domains.filter(domain => 
        preferredDomains.includes(domain)
      ).length;
      const domainScore = role.domains.length > 0 
        ? domainMatch / role.domains.length 
        : 0.5;
      
      score += domainScore * domainWeight;
      maxScore += domainWeight;

      const matchPercentage = Math.round((score / maxScore) * 100);

      return {
        ...role,
        match: Math.min(matchPercentage, 98), // Cap at 98% for realism
        skills: [...role.requiredTechnical, ...role.preferredTechnical].slice(0, 4)
      };
    }).sort((a, b) => b.match - a.match);
  };

  return { calculateMatch };
}