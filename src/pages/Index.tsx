import { useState } from "react";
import { LandingHero } from "@/components/LandingHero";
import { CareerAdvisorForm } from "@/components/CareerAdvisorForm";
import { CareerDashboard } from "@/components/CareerDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'form' | 'dashboard'>('landing');
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleGetStarted = () => {
    setCurrentView('form');
  };

  const handleFormSubmit = (data: any) => {
    setUserProfile(data);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingHero onGetStarted={handleGetStarted} />;
      case 'form':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
            <div className="container mx-auto px-6">
              <CareerAdvisorForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12">
            <div className="container mx-auto px-6">
              <CareerDashboard userProfile={userProfile} />
            </div>
          </div>
        );
      default:
        return <LandingHero onGetStarted={handleGetStarted} />;
    }
  };

  return renderCurrentView();
};

export default Index;
