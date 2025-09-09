import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Target, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-career.jpg";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your skills and career potential"
    },
    {
      icon: Target,
      title: "Personalized Roadmaps",
      description: "Custom learning paths tailored to your goals and timeline"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time job market data and trending skill requirements"
    },
    {
      icon: Users,
      title: "Mentor Matching",
      description: "Connect with industry professionals and experienced mentors"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-organic relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-accent opacity-15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-primary opacity-8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>

      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Replaced Brain icon with custom PNG logo */}
            <img 
              src="/my-logo.png"       // <-- your PNG file in public folder
              alt="AI Career Advisor Logo"
              className="w-10 h-10 rounded-xl shadow-glow object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Career Advisor
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={onGetStarted}
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                New: AI-Powered Career Insights
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Your Course
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  To Success
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Discover personalized career paths with AI-driven skill analysis, 
                real-time market insights, and step-by-step roadmaps tailored to your goals.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Ready to Get Started?
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-2xl border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                View Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-hero rounded-[3rem] opacity-90 transform rotate-3 scale-105"></div>
            <div className="absolute inset-0 bg-gradient-primary rounded-[3rem] opacity-30 blur-2xl scale-110"></div>
            
            <div className="relative z-10 bg-gradient-surface rounded-[3rem] p-8 shadow-2xl border border-primary/10">
              <div className="aspect-square bg-gradient-hero rounded-[2rem] p-6 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-glow">
                    <Brain className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-foreground">AI Career Analysis</h3>
                  <p className="text-primary-foreground/80">Personalized insights for your success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-primary/5 border border-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            Explore Our Popular Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">Find the Right</span>
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Career Path for You
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform analyzes your unique profile to deliver personalized 
            career insights and actionable roadmaps for your professional success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-surface shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border-0 group relative overflow-hidden"
            >
              <CardContent className="p-8 text-center space-y-6 relative z-10">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-accent rounded-[3rem] opacity-20 transform -rotate-3"></div>
            <div className="relative bg-gradient-surface rounded-[3rem] p-12 shadow-card">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Career Success Stories</h3>
                  <p className="text-muted-foreground">Join thousands who transformed their careers</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                I will stay with you until you
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  achieve your goals.
                </span>
              </h2>
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Who else do you know who'll do that for you?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI-powered career advisor provides personalized guidance, tracks your progress, 
                  and adapts recommendations based on real-time market insights and your evolving goals.
                </p>
              </div>
            </div>
            
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all"
            >
              Know More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
