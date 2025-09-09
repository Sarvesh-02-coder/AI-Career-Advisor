import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  BookOpen, 
  Target,
  Download,
  ExternalLink,
  Award,
  Brain,
  Briefcase,
  FileText,
  Share
} from "lucide-react";
import { ConfidenceIndex } from "@/components/ConfidenceIndex";
import { JobMarketInsights } from "@/components/JobMarketInsights";
import { useCareerMatching } from "@/utils/careerUtils";
import { useExportKit } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import careerTeamImage from "@/assets/career-team.jpg";
import successImage from "@/assets/success-celebration.jpg";

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
}

export function CareerDashboard({ userProfile }: CareerDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { calculateMatch } = useCareerMatching();
  const { exportToPDF, exportToMarkdown } = useExportKit();
  
  // Use the career matching engine - create a safe profile for matching
  const safeProfile = {
    ...userProfile,
    graduationYear: (userProfile as any).graduationYear || '2024',
    workPreference: (userProfile as any).workPreference || 'flexible',
    timeframe: (userProfile as any).timeframe || 'medium-term',
    resume: (userProfile as any).resume || null,
    github: (userProfile as any).github || '',
    linkedin: (userProfile as any).linkedin || '',
    portfolio: (userProfile as any).portfolio || ''
  };
  const calculatedRecommendations = calculateMatch(safeProfile);
  
  const skillsData = {
    strengths: ["JavaScript", "React", "Problem Solving", "Communication"],
    emerging: ["Python", "Data Analysis", "Machine Learning"],
    gaps: ["AWS", "Docker", "System Design"]
  };

  const careerRecommendations = [
    {
      title: "Frontend Developer",
      match: 92,
      salary: "$75,000 - $120,000",
      growth: "+15%",
      description: "Build user interfaces and experiences for web applications",
      skills: ["JavaScript", "React", "CSS", "TypeScript"]
    },
    {
      title: "Full Stack Developer",
      match: 85,
      salary: "$80,000 - $130,000",
      growth: "+13%",
      description: "Work on both frontend and backend development",
      skills: ["JavaScript", "Node.js", "SQL", "React"]
    },
    {
      title: "Product Manager",
      match: 78,
      salary: "$90,000 - $150,000",
      growth: "+11%",
      description: "Lead product development and strategy",
      skills: ["Communication", "Leadership", "Analytics", "Strategy"]
    }
  ];

  const learningRoadmap = [
    {
      week: 1,
      title: "Advanced React Patterns",
      type: "Tutorial",
      duration: "5 hours",
      completed: true
    },
    {
      week: 2,
      title: "Build a Portfolio Project",
      type: "Project",
      duration: "10 hours",
      completed: true
    },
    {
      week: 3,
      title: "System Design Basics",
      type: "Course",
      duration: "8 hours",
      completed: false
    },
    {
      week: 4,
      title: "Resume Optimization",
      type: "Workshop",
      duration: "3 hours",
      completed: false
    },
    {
      week: 5,
      title: "Mock Interviews",
      type: "Practice",
      duration: "4 hours",
      completed: false
    },
    {
      week: 6,
      title: "Network & Apply",
      type: "Action",
      duration: "6 hours",
      completed: false
    }
  ];

  const jobInsights = {
    trending: ["AI/ML Engineer", "DevOps Engineer", "Data Scientist"],
    inDemand: ["React", "Python", "AWS", "Kubernetes"],
    locations: ["San Francisco", "New York", "Austin", "Remote"]
  };

  const mentorSuggestions = [
    {
      name: "Sarah Chen",
      role: "Senior Frontend Developer",
      company: "Google",
      match: "95% skill overlap"
    },
    {
      name: "Mike Johnson",
      role: "Full Stack Engineer",
      company: "Meta",
      match: "88% career path similarity"
    }
  ];

  const getSkillColor = (type: 'strength' | 'emerging' | 'gap') => {
    switch (type) {
      case 'strength': return 'bg-success text-success-foreground';
      case 'emerging': return 'bg-warning text-warning-foreground';
      case 'gap': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Your Career Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Welcome back, {userProfile.name}! Here's your personalized career guidance.
        </p>
      </div>

      {/* Skill Map Visualization */}
      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>Skill Analysis Map</span>
          </CardTitle>
          <CardDescription>
            Your current skill profile and development opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-success mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Strengths
              </h4>
              <div className="space-y-2">
                {skillsData.strengths.map((skill) => (
                  <Badge key={skill} className={getSkillColor('strength')}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-warning mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Emerging Skills
              </h4>
              <div className="space-y-2">
                {skillsData.emerging.map((skill) => (
                  <Badge key={skill} className={getSkillColor('emerging')}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-destructive mb-3 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Skill Gaps
              </h4>
              <div className="space-y-2">
                {skillsData.gaps.map((skill) => (
                  <Badge key={skill} className={getSkillColor('gap')}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Recommendations */}
      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span>Career Path Recommendations</span>
          </CardTitle>
          <CardDescription>
            Top career matches based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {careerRecommendations.map((career, index) => (
              <Card key={career.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{career.title}</CardTitle>
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      {career.match}% match
                    </Badge>
                  </div>
                  <CardDescription>{career.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Salary:</span>
                      <p className="font-semibold">{career.salary}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth:</span>
                      <p className="font-semibold text-success">{career.growth}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Key Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    View Roadmap
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Roadmap */}
      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>6-Week Learning Roadmap</span>
          </CardTitle>
          <CardDescription>
            Your personalized path to career success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningRoadmap.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors ${
                  item.completed 
                    ? 'border-success/50 bg-success/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.completed ? '✓' : item.week}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
                
                <Badge variant={item.completed ? "default" : "secondary"}>
                  {item.completed ? "Completed" : "Upcoming"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span>Job Market Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Trending Roles</h4>
              <div className="space-y-2">
                {jobInsights.trending.map((role) => (
                  <div key={role} className="flex items-center justify-between">
                    <span>{role}</span>
                    <Badge variant="secondary">Hot</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">In-Demand Skills</h4>
              <div className="flex flex-wrap gap-2">
                {jobInsights.inDemand.map((skill) => (
                  <Badge key={skill} className="bg-info text-info-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Top Locations</h4>
              <div className="space-y-2">
                {jobInsights.locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{location}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Mentor Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentorSuggestions.map((mentor, index) => (
              <div key={index} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <h4 className="font-semibold">{mentor.name}</h4>
                <p className="text-sm text-muted-foreground">{mentor.role} at {mentor.company}</p>
                <p className="text-sm text-primary mt-1">{mentor.match}</p>
                <Button size="sm" className="mt-3">
                  Connect
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resume Feedback */}
      <Card className="bg-gradient-card shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-primary" />
            <span>Resume & Portfolio Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">85</div>
              <p className="text-sm text-muted-foreground">ATS Score</p>
              <Progress value={85} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">7.2</div>
              <p className="text-sm text-muted-foreground">Readability Score</p>
              <Progress value={72} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">92%</div>
              <p className="text-sm text-muted-foreground">Skill Match</p>
              <Progress value={92} className="mt-2" />
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Suggested LinkedIn Headlines:</h4>
            <ul className="space-y-1 text-sm">
              <li>• "Frontend Developer | React & JavaScript Expert | Building User-Centric Web Experiences"</li>
              <li>• "Full Stack Developer | Modern Web Technologies | Problem Solver & Team Collaborator"</li>
              <li>• "Software Engineer | Frontend Focus | Passionate about Clean Code & User Experience"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-gradient-primary text-primary-foreground shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Export Your Career Kit</h3>
              <p className="opacity-90">
                Download your complete roadmap, recommendations, and feedback as a PDF
              </p>
            </div>
            <Button variant="secondary" size="lg" className="shadow-lg">
              <Download className="mr-2 h-5 w-5" />
              Download Kit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}