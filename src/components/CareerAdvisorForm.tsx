import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Upload, User, Brain, Target, FileText, Sparkles } from "lucide-react";
import { useProfilePersistence } from "@/utils/careerUtils";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Step 1: Basic Info
  name: string;
  email: string;
  educationLevel: string;
  graduationYear: string;
  
  // Step 2: Skills & Interests
  technicalSkills: string[];
  softSkills: string[];
  interests: string[];
  
  // Step 3: Career Goals
  preferredDomains: string[];
  workPreference: string;
  timeframe: string;
  
  // Step 4: Uploads
  resume: File | null;
  github: string;
  linkedin: string;
  portfolio: string;
}

interface CareerAdvisorFormProps {
  onSubmit: (data: FormData) => void;
}

const softSkillsOptions = [
  "Leadership", "Communication", "Problem Solving", "Team Collaboration", 
  "Project Management", "Critical Thinking", "Adaptability", "Creativity"
];

const interestsOptions = [
  "Web Development", "Mobile Apps", "Data Science", "AI/ML", "Cybersecurity", 
  "Cloud Computing", "Game Development", "IoT", "Blockchain", "AR/VR"
];

const domainOptions = [
  "Software Development", "Data Science", "Product Management", "UX/UI Design",
  "DevOps", "Cybersecurity", "Consulting", "Research", "Startups", "Enterprise"
];

export function CareerAdvisorForm({ onSubmit }: CareerAdvisorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [dynamicSkills, setDynamicSkills] = useState<string[]>([]);
  const { toast } = useToast();
  const { saveProfile, loadProfile } = useProfilePersistence();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    educationLevel: "",
    graduationYear: "",
    technicalSkills: [],
    softSkills: [],
    interests: [],
    preferredDomains: [],
    workPreference: "",
    timeframe: "",
    resume: null,
    github: "",
    linkedin: "",
    portfolio: "",
  });

  // Load saved profile on component mount
  useEffect(() => {
  const savedProfile = loadProfile();
  if (savedProfile) {
    setFormData(prev => ({ ...prev, ...savedProfile }));
    toast({
      title: "Profile loaded",
      description: "Your previously saved information has been restored.",
    });
  }

  // ✅ Fetch dynamic skills from backend
  fetch("http://localhost:5050/skills")
    .then(res => res.json())
    .then(data => {
      if (data.skills) setDynamicSkills(data.skills);
    })
    .catch(() => console.warn("⚠️ Could not load dynamic skills"));
}, []);


  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const stepIcons = [User, Brain, Target, FileText];
  const stepTitles = ["Basic Info", "Skills & Interests", "Career Goals", "Documents"];

  const handleNext = () => {
    // Save profile to localStorage on each step
    saveProfile(formData);
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Generating your career report...",
        description: "Please wait while we analyze your profile.",
      });
      setTimeout(() => onSubmit(formData), 1500); // Add slight delay for better UX
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSkillToggle = (skill: string, type: 'technical' | 'soft' | 'interests' | 'domains') => {
    const field = type === 'domains' ? 'preferredDomains' : 
                 type === 'interests' ? 'interests' :
                 type === 'technical' ? 'technicalSkills' : 'softSkills';
    
    const currentSkills = formData[field] as string[];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    updateFormData({ [field]: updatedSkills });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select value={formData.educationLevel} onValueChange={(value) => updateFormData({ educationLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="bootcamp">Bootcamp</SelectItem>
                    <SelectItem value="self-taught">Self-taught</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduation">Graduation Year</Label>
                <Input
                  id="graduation"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => updateFormData({ graduationYear: e.target.value })}
                  placeholder="2024"
                  min="2020"
                  max="2030"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dynamicSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${skill}`}
                      checked={formData.technicalSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill, 'technical')}
                    />
                    <Label htmlFor={`tech-${skill}`} className="text-sm capitalize">
                      {skill}
                    </Label>
                  </div>
                ))}

              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Soft Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {softSkillsOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`soft-${skill}`}
                      checked={formData.softSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill, 'soft')}
                    />
                    <Label htmlFor={`soft-${skill}`} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Areas of Interest</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestsOptions.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${interest}`}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={() => handleSkillToggle(interest, 'interests')}
                    />
                    <Label htmlFor={`interest-${interest}`} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Preferred Career Domains</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {domainOptions.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={`domain-${domain}`}
                      checked={formData.preferredDomains.includes(domain)}
                      onCheckedChange={() => handleSkillToggle(domain, 'domains')}
                    />
                    <Label htmlFor={`domain-${domain}`} className="text-sm">{domain}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workPreference">Work Preference</Label>
                <Select value={formData.workPreference} onValueChange={(value) => updateFormData({ workPreference: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeframe">Career Goal Timeframe</Label>
                <Select value={formData.timeframe} onValueChange={(value) => updateFormData({ timeframe: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                    <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                    <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                    <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume">Resume Upload (PDF)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="text-sm text-muted-foreground">
                  <Button variant="secondary" className="mb-2">
                    Choose file
                  </Button>
                  <p>or drag and drop your resume here</p>
                  <p className="text-xs mt-1">PDF, up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile (optional)</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => updateFormData({ github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => updateFormData({ linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website (optional)</Label>
                <Input
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => updateFormData({ portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Floating decorative elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-accent opacity-20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <Card className="w-full max-w-4xl mx-auto bg-gradient-soft shadow-card border-0 relative overflow-hidden">
        {/* Progress indicator background */}
        <div className="absolute top-0 left-0 h-1 bg-gradient-primary transition-all duration-500 ease-out" 
             style={{ width: `${progress}%` }}></div>
        
        <CardHeader className="pb-6 bg-gradient-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {stepIcons.map((Icon, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                    index + 1 <= currentStep 
                      ? 'bg-gradient-primary text-primary-foreground shadow-glow scale-110' 
                      : 'bg-muted text-muted-foreground hover:scale-105'
                  }`}
                >
                  <Icon className="h-6 w-6" />
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
          
          <Progress value={progress} className="mb-6 h-2" />
          
          <div className="text-center">
            <CardTitle className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              {stepTitles[currentStep - 1]}
            </CardTitle>
            <CardDescription className="text-lg">
              {currentStep === 1 && "Let's start with your basic information to personalize your experience"}
              {currentStep === 2 && "Tell us about your skills and interests to find the perfect match"}
              {currentStep === 3 && "What are your career aspirations and work preferences?"}
              {currentStep === 4 && "Upload your documents and connect your professional profiles"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          <div className="animate-fade-in">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between pt-8 border-t border-border/50">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 hover:scale-105 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-primary hover:shadow-glow px-8 py-3 hover:scale-105 transition-all"
            >
              {currentStep === totalSteps && <Sparkles className="h-4 w-4" />}
              <span>{currentStep === totalSteps ? 'Generate My Career Report' : 'Continue'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}