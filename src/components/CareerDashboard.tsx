import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  MapPin,
  Star,
  Users,
  BookOpen,
  Target,
  Download,
  ExternalLink,
  Award,
  Brain,
  Briefcase
} from "lucide-react";

import { useExportKit } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { getCareerMatches, getLearningRoadmap, getJobInsights, getRoleSkills } from "@/utils/api";


interface CareerDashboardProps {
  userProfile: {
    name: string;
    email: string;
    educationLevel: string;
    technicalSkills: string[];
    softSkills: string[];
    interests: string[];
    preferredDomains: string[];
  };
  onBack: () => void;

}

type CareerRecommendation = {
  title: string;
  match: number;
  skills: string[];
  salary?: string;
  growth?: string;
};

type RoadmapStep = {
  week: number;
  skill: string;
  estimatedHours: number;
};

export function CareerDashboard({ userProfile, onBack }: CareerDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { exportToPDF } = useExportKit();
  const { toast } = useToast();

  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [learningRoadmap, setLearningRoadmap] = useState<RoadmapStep[]>([]);
  const [showAllRoadmap, setShowAllRoadmap] = useState(false);
  const [jobInsights, setJobInsights] = useState({
    trendingRoles: [] as string[],
    topCities: [] as { city: string; jobs: number }[],
    trendingSkills: [] as string[]
  });
  const [strengths, setStrengths] = useState<string[]>([]);
  const [emergingSkills, setEmergingSkills] = useState<string[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  // Track which topics are completed per phase
  const [completed, setCompleted] = useState<Record<string, Record<number, boolean>>>({});

  // Track phase expand/collapse
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  const [loading, setLoading] = useState(true);

  const toggleTopic = (phase: string, week: number) => {
    setCompleted(prev => {
      const updated = {
        ...prev,
        [phase]: {
          ...prev[phase],
          [week]: !prev[phase]?.[week]
        }
      };
      return updated;
    });
  };

  // ✅ Load career match + roadmap
  useEffect(() => {
    async function load() {
      setLoading(true);

      const matches = await getCareerMatches(userProfile);
      const mapped = matches.slice(0, 6).map((m: any) => ({
        title: m.role
          .replace(/,/g, "")
          .replace(/\b(\w)/g, c => c.toUpperCase()),
        rawRole: m.role.toLowerCase(),   // ✅ store original role key
        match: Math.round(m.score * 100),
        skills: []
      }));


      setCareerRecommendations(mapped);

      setLoading(false);
    }
    load();
  }, [userProfile]);

// Enrich cards with skills the user already has that match the role
useEffect(() => {
  if (careerRecommendations.length === 0) return;

  async function enrich() {
    const enriched = await Promise.all(
      careerRecommendations.map(async rec => {
        const { skills: roleSkills = [] } = await getRoleSkills(rec.rawRole);

        const required = roleSkills.map(s => s.toLowerCase().trim());
        const userSkills = (userProfile.technicalSkills || [])
          .map(s => s.toLowerCase().trim());

        // show only skills user has + required by role
        const matchedSkills = required
          .filter(s => userSkills.includes(s))
          .filter(s => looksMainstream(s))
          .slice(0, 3);

        return {
          ...rec,
          skills: matchedSkills
        };
      })
    );

    setCareerRecommendations(enriched);
  }

  enrich();
}, [careerRecommendations.length]);

  // ✅ Load job insights dynamically for top recommended role
  useEffect(() => {
    async function loadInsights() {
      if (careerRecommendations.length === 0) return;
      const bestRole = careerRecommendations[0].title;
      const insights = await getJobInsights(bestRole);
      setJobInsights(insights);
    }
    loadInsights();
  }, [careerRecommendations]);

const MAINSTREAM = [
  "python","java","javascript","typescript","c++","c#","go","rust","php","ruby",
  "html","css","react","vue","angular","node","express","django","flask","spring",
  "sql","mysql","postgresql","postgres","sqlite","mongodb","redis",
  "git","github","gitlab","docker","kubernetes","linux","bash","shell",
  "aws","gcp","azure","firebase","terraform","ansible",
  "machine learning","deep learning","pytorch","tensorflow","scikit-learn",
  "nlp","computer vision","opencv","pandas","numpy"
];

const MAINSTREAM_SET = new Set(MAINSTREAM);

const looksMainstream = (s: string) => {
  const x = s.toLowerCase();
  return MAINSTREAM.some(k => x.includes(k));
};

const handleRoleClick = async (roleName: string) => {
  // 1) Get required role skills raw
  const { skills: requiredSkillsRaw } = await getRoleSkills(roleName);

  const requiredLower = (requiredSkillsRaw || []).map(s => s.toLowerCase().trim());
  const userLower = (userProfile.technicalSkills || []).map(s => s.toLowerCase().trim());

  // Strengths
  const strengthsAll = requiredLower.filter(s => userLower.includes(s));

  // Gaps
  const gapsAll = requiredLower.filter(s => !userLower.includes(s));

  // Emerging (simple prefix heuristic)
  const emergingAll = userLower.filter(u =>
    gapsAll.some(g => g.startsWith(u.slice(0, 3)))
  );

  // ✅ SHOW ONLY MAINSTREAM SKILLS IN UI (not in roadmap logic)
  const filtered = (list: string[]) =>
    list.filter(looksMainstream).slice(0, 20);

  setStrengths(filtered(strengthsAll));
  setEmergingSkills(filtered(emergingAll));
  setSkillGaps(filtered(gapsAll));

  // ✅ Roadmap uses ALL skills → no filtering → only send userSkills + role
  const roadmapResult = await getLearningRoadmap(
      roleName,
      userProfile.technicalSkills
    );


  const grouped = groupRoadmapIntoPhases(roadmapResult.roadmap || []);
setLearningRoadmap(grouped);


  toast({
    title: `Roadmap generated for ${roleName}! ✅`,
    description: "Scroll down to view your personalized learning steps.",
  });
};

const groupRoadmapIntoPhases = (roadmap: RoadmapStep[]) => {
  const phases = {
    "Phase 1: Foundations (Weeks 1–2)": [],
    "Phase 2: Core Skills (Weeks 3–5)": [],
    "Phase 3: Applied Development (Weeks 6–8)": [],
    "Phase 4: Tools & Ecosystem (Weeks 9–10)": [],
    "Phase 5: Projects (Weeks 11–13)": [],
    "Phase 6: Job Readiness (Week 14+)": []
  };

  roadmap.forEach(step => {
    if (step.week <= 2) phases["Phase 1: Foundations (Weeks 1–2)"].push(step);
    else if (step.week <= 5) phases["Phase 2: Core Skills (Weeks 3–5)"].push(step);
    else if (step.week <= 8) phases["Phase 3: Applied Development (Weeks 6–8)"].push(step);
    else if (step.week <= 10) phases["Phase 4: Tools & Ecosystem (Weeks 9–10)"].push(step);
    else if (step.week <= 13) phases["Phase 5: Projects (Weeks 11–13)"].push(step);
    else phases["Phase 6: Job Readiness (Week 14+)"].push(step);
  });

  return phases;
};

  return (
  <div ref={dashboardRef} className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">

    {/* Header */}
    <div className="text-center space-y-4">
      <div className="flex justify-start mb-4">
        <Button 
          variant="outline" 
          className="rounded-full border-primary/30 hover:bg-primary/10"
          onClick={onBack}
        >
          ← Back to Home
        </Button>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        Your Career Dashboard
      </h1>
      <p className="text-xl text-muted-foreground">
        Welcome back, {userProfile.name}! Here is your personalized career guidance.
      </p>
    </div>

    {/* Career Recommendations */}
    <Card className="bg-gradient-card shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span>Career Recommendations</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Analyzing your profile...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {careerRecommendations.map((c) => (
              <Card
                key={c.rawRole}
                onClick={() => handleRoleClick(c.rawRole)}
                className="hover-tilt border border-transparent backdrop-blur-md bg-white/70
                          hover:bg-white/90 transition-all duration-300 cursor-pointer
                          hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 rounded-2xl p-3"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {c.title}
                    </CardTitle>

                    <div className="w-20 text-right">
                      <div className="text-sm font-semibold text-primary">{c.match}%</div>
                      <Progress value={c.match} className="h-2 mt-1 rounded-full" />
                    </div>
                  </div>

                  <CardDescription className="text-sm mt-1">
                    Based on your skills & interests
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-1">
                  {/* Top Skills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {c.skills?.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

    </Card>

    {/* Job Market Insights */}
    <Card className="bg-gradient-card shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span>Job Market Insights (India)</span>
        </CardTitle>
        <CardDescription>Real-time hiring trends for your best matched role</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Trending Skills</h4>
          <div className="flex flex-wrap gap-2">
            {jobInsights.trendingSkills.map((skill) => (
              <Badge key={skill} className="bg-info text-info-foreground">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Top Hiring Cities</h4>
          <div className="space-y-1">
            {jobInsights.topCities.map((city) => (
              <div key={city.city} className="flex justify-between">
                <span>{city.city}</span>
                <span className="text-muted-foreground">{city.jobs} openings</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

      {/* Skill Analysis Map */}
      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>Skill Analysis Map</span>
          </CardTitle>
          <CardDescription>Your current skill profile and development opportunities (click on a career role to see)</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Strengths */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 text-green-600">
              ✅ Strengths
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {strengths.slice(0, 12).map(skill => (
                <Badge key={skill} className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {skill}
                </Badge>
              ))}

            </div>
          </div>

          {/* Emerging Skills */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 text-yellow-600">
              ⚡ Emerging Skills
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {emergingSkills
                .slice(0, 12)
                .map(skill => (
                  <Badge key={skill} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    {skill}
                  </Badge>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 text-red-600">
              🎯 Skill Gaps
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillGaps
                .slice(0, 12)
                .map(skill => (
                  <Badge key={skill} className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                    {skill}
                  </Badge>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

    {/* =====================  ROADMAP PHASE GRID (3×2)  ===================== */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(learningRoadmap).map(([phase, steps]) => {
        const shown = steps.slice(0, 3);
        const hidden = steps.slice(3);

        const phaseCompleted =
          steps.length > 0 &&
          steps.every(step => completed[phase]?.[step.week]);

        return (
          <Card
            key={phase}
            className={`p-5 rounded-xl shadow-lg transition-all border-2 ${
              phaseCompleted ? "border-green-500 bg-green-50" : "border-primary/40 bg-white"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>{phase}</span>

                {phaseCompleted && (
                  <span className="text-green-600 text-sm font-semibold">✓ Completed</span>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* --- Visible First 3 Topics --- */}
              {shown.map(step => (
                <div
                  key={step.week}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
                >
                  <input
                    type="checkbox"
                    checked={completed[phase]?.[step.week] || false}
                    onChange={() => toggleTopic(phase, step.week)}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="text-sm">
                    <div className="font-semibold">Week {step.week}</div>
                    <div className="text-muted-foreground">{step.skill}</div>
                  </div>
                </div>
              ))}

              {/* --- Hidden Toggle --- */}
              {hidden.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={() =>
                    setExpanded(prev => ({ ...prev, [phase]: !prev[phase] }))
                  }
                >
                  {expanded[phase]
                    ? "Hide Additional Topics"
                    : `View ${hidden.length} More Topics`}
                </Button>
              )}

              {/* --- Expanded Hidden Topics --- */}
              {expanded[phase] && hidden.length > 0 && (
                <div className="space-y-3 pt-2">
                  {hidden.map(step => (
                    <div
                      key={step.week}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition"
                    >
                      <input
                        type="checkbox"
                        checked={completed[phase]?.[step.week] || false}
                        onChange={() => toggleTopic(phase, step.week)}
                        className="mt-1 h-4 w-4"
                      />
                      <div className="text-sm">
                        <div className="font-semibold">Week {step.week}</div>
                        <div className="text-muted-foreground">{step.skill}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>


    {/* Export */}
    <Card className="bg-gradient-primary text-primary-foreground shadow-lg">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold mb-1">Export Your Personalized Career Kit</h3>
          <p className="opacity-90">Includes recommendations, market insights & learning roadmap</p>
        </div>
        <Button variant="secondary" size="lg" onClick={() => exportToPDF && exportToPDF(dashboardRef.current)}>
          <Download className="mr-2 h-5 w-5" />
          Download PDF
        </Button>
      </CardContent>
    </Card>

  </div>
);
}
