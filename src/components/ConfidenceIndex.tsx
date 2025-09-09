import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Star, TrendingUp } from "lucide-react";

interface ConfidenceIndexProps {
  userProfile: {
    technicalSkills: string[];
    softSkills: string[];
    interests: string[];
    educationLevel: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export function ConfidenceIndex({ userProfile }: ConfidenceIndexProps) {
  // Calculate confidence factors
  const calculateConfidence = () => {
    let totalScore = 0;
    let maxScore = 0;

    // Technical skills (40% weight)
    const techSkillsScore = Math.min(userProfile.technicalSkills.length / 5, 1) * 40;
    totalScore += techSkillsScore;
    maxScore += 40;

    // Soft skills (25% weight)
    const softSkillsScore = Math.min(userProfile.softSkills.length / 4, 1) * 25;
    totalScore += softSkillsScore;
    maxScore += 25;

    // Portfolio presence (20% weight)
    let portfolioScore = 0;
    if (userProfile.github) portfolioScore += 7;
    if (userProfile.linkedin) portfolioScore += 7;
    if (userProfile.portfolio) portfolioScore += 6;
    totalScore += portfolioScore;
    maxScore += 20;

    // Education level (15% weight)
    const educationScores: Record<string, number> = {
      'phd': 15,
      'masters': 12,
      'bachelors': 10,
      'bootcamp': 8,
      'self-taught': 6,
      'high-school': 4
    };
    const educationScore = educationScores[userProfile.educationLevel] || 5;
    totalScore += educationScore;
    maxScore += 15;

    return Math.round((totalScore / maxScore) * 100);
  };

  const confidenceScore = calculateConfidence();
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 70) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 55) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "Developing", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const confidence = getConfidenceLevel(confidenceScore);

  const improvementAreas = [
    {
      area: "Technical Skills",
      current: userProfile.technicalSkills.length,
      target: 5,
      completed: userProfile.technicalSkills.length >= 5
    },
    {
      area: "Soft Skills", 
      current: userProfile.softSkills.length,
      target: 4,
      completed: userProfile.softSkills.length >= 4
    },
    {
      area: "GitHub Profile",
      current: userProfile.github ? 1 : 0,
      target: 1,
      completed: !!userProfile.github
    },
    {
      area: "LinkedIn Presence",
      current: userProfile.linkedin ? 1 : 0,
      target: 1,
      completed: !!userProfile.linkedin
    },
    {
      area: "Portfolio Website",
      current: userProfile.portfolio ? 1 : 0,
      target: 1,
      completed: !!userProfile.portfolio
    }
  ];

  return (
    <Card className="bg-gradient-soft shadow-card border-0">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Star className="h-6 w-6 text-primary" />
          <span>Confidence Index</span>
        </CardTitle>
        <CardDescription>
          Your readiness for career opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="hsl(240 4.8% 95.9%)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - confidenceScore / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(262 67% 50%)" />
                  <stop offset="100%" stopColor="hsl(252 83% 58%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-primary">{confidenceScore}%</span>
              <Badge className={`${confidence.bg} ${confidence.color} border-0 text-xs`}>
                {confidence.level}
              </Badge>
            </div>
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-4">
          <h4 className="font-semibold text-center">Areas for Growth</h4>
          <div className="space-y-3">
            {improvementAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                <div className="flex items-center space-x-3">
                  {area.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">{area.area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {area.current}/{area.target}
                  </span>
                  {area.completed && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-accent/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Quick Wins
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {!userProfile.linkedin && (
              <li>• Complete your LinkedIn profile (+7 points)</li>
            )}
            {!userProfile.github && (
              <li>• Create a GitHub portfolio (+7 points)</li>
            )}
            {userProfile.technicalSkills.length < 5 && (
              <li>• Add {5 - userProfile.technicalSkills.length} more technical skills</li>
            )}
            {userProfile.softSkills.length < 4 && (
              <li>• Develop {4 - userProfile.softSkills.length} more soft skills</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}