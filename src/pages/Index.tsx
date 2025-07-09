import { useState } from 'react';
import { OnboardingQuiz } from '@/components/OnboardingQuiz';
import { SwipeInterface } from '@/components/SwipeInterface';
import { MatchesView } from '@/components/MatchesView';
import { Navigation } from '@/components/Navigation';
import { RealtorDashboard } from '@/components/RealtorDashboard';
import { UserTypeSelector } from '@/components/UserTypeSelector';
import { AIChatAgent } from '@/components/AIChatAgent';
import { LoginModal, UserProfile } from '@/components/LoginModal';

export type UserPreferences = {
  styles: string[];
  colors: string[];
  activities: string[];
  priceRange: [number, number];
  size: string;
  location: string[]; // Changed to array to support multiple districts
  moveInDate: string;
};

export type Apartment = {
  id: string;
  images: string[];
  title: string;
  location: string;
  price: number;
  size: string;
  vibe: string;
  description: string;
  highlights: string[];
  realtor: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
};

export type Match = {
  id: string;
  apartmentId: string;
  renterId: string;
  realtorId: string;
  timestamp: Date;
  apartment: Apartment;
  renterPreferences: UserPreferences;
};

const Index = () => {
  const [userType, setUserType] = useState<'renter' | 'realtor' | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'swipe' | 'matches' | 'dashboard'>('onboarding');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<Apartment[]>([]);
  const [realtorMatches, setRealtorMatches] = useState<Match[]>([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleUserTypeSelect = (type: 'renter' | 'realtor') => {
    setUserType(type);
    if (type === 'realtor') {
      setCurrentView('dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentView('swipe');
  };

  const handleMatch = (apartment: Apartment) => {
    setMatches(prev => [...prev, apartment]);
    
    // Simulate realtor match notification
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      apartmentId: apartment.id,
      renterId: 'current-user',
      realtorId: apartment.realtor.id,
      timestamp: new Date(),
      apartment,
      renterPreferences: userPreferences!
    };
    setRealtorMatches(prev => [...prev, newMatch]);
  };

  const switchUserType = () => {
    setUserType(null);
    setCurrentView('onboarding');
    setUserPreferences(null);
    setMatches([]);
    setRealtorMatches([]);
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {userType && currentView !== 'onboarding' && currentView !== 'dashboard' && (
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          matchCount={matches.length}
          userType={userType}
          onSwitchUserType={switchUserType}
          onOpenAIChat={() => setIsAIChatOpen(true)}
        />
      )}
      
      {!userType && (
        <UserTypeSelector onSelect={handleUserTypeSelect} />
      )}
      
      {userType === 'renter' && currentView === 'onboarding' && userProfile && (
        <OnboardingQuiz onComplete={handleOnboardingComplete} />
      )}
      
      {userType === 'renter' && currentView === 'swipe' && userPreferences && (
        <SwipeInterface 
          userPreferences={userPreferences}
          onMatch={handleMatch}
          userProfile={userProfile}
        />
      )}
      
      {userType === 'renter' && currentView === 'matches' && (
        <MatchesView 
          matches={matches} 
          userPreferences={userPreferences}
          userProfile={userProfile}
        />
      )}

      {userType === 'realtor' && currentView === 'dashboard' && (
        <RealtorDashboard 
          matches={realtorMatches}
          onSwitchUserType={switchUserType}
        />
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <AIChatAgent 
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userPreferences={userPreferences}
      />
    </div>
  );
};

export default Index;
