
import { useState } from 'react';
import { OnboardingQuiz } from '@/components/OnboardingQuiz';
import { SwipeInterface } from '@/components/SwipeInterface';
import { MatchesView } from '@/components/MatchesView';
import { Navigation } from '@/components/Navigation';

export type UserPreferences = {
  styles: string[];
  colors: string[];
  activities: string[];
  priceRange: [number, number];
  size: string;
  location: string;
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
    name: string;
    phone: string;
    email: string;
  };
};

const Index = () => {
  const [currentView, setCurrentView] = useState<'onboarding' | 'swipe' | 'matches'>('onboarding');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<Apartment[]>([]);

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setCurrentView('swipe');
  };

  const handleMatch = (apartment: Apartment) => {
    setMatches(prev => [...prev, apartment]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100">
      {currentView !== 'onboarding' && (
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          matchCount={matches.length}
        />
      )}
      
      {currentView === 'onboarding' && (
        <OnboardingQuiz onComplete={handleOnboardingComplete} />
      )}
      
      {currentView === 'swipe' && userPreferences && (
        <SwipeInterface 
          userPreferences={userPreferences}
          onMatch={handleMatch}
        />
      )}
      
      {currentView === 'matches' && (
        <MatchesView matches={matches} />
      )}
    </div>
  );
};

export default Index;
