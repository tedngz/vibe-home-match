
import { useState } from 'react';
import { OnboardingQuiz } from '@/components/OnboardingQuiz';
import { SwipeInterface } from '@/components/SwipeInterface';
import { MatchesView } from '@/components/MatchesView';
import { Navigation } from '@/components/Navigation';
import { RealtorDashboard } from '@/components/RealtorDashboard';
import { UserTypeSelector } from '@/components/UserTypeSelector';

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

  const handleUserTypeSelect = (type: 'renter' | 'realtor') => {
    setUserType(type);
    if (type === 'realtor') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('onboarding');
    }
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100">
      {userType && currentView !== 'onboarding' && currentView !== 'dashboard' && (
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          matchCount={matches.length}
          userType={userType}
          onSwitchUserType={switchUserType}
        />
      )}
      
      {!userType && (
        <UserTypeSelector onSelect={handleUserTypeSelect} />
      )}
      
      {userType === 'renter' && currentView === 'onboarding' && (
        <OnboardingQuiz onComplete={handleOnboardingComplete} />
      )}
      
      {userType === 'renter' && currentView === 'swipe' && userPreferences && (
        <SwipeInterface 
          userPreferences={userPreferences}
          onMatch={handleMatch}
        />
      )}
      
      {userType === 'renter' && currentView === 'matches' && (
        <MatchesView 
          matches={matches} 
          userPreferences={userPreferences}
        />
      )}

      {userType === 'realtor' && currentView === 'dashboard' && (
        <RealtorDashboard 
          matches={realtorMatches}
          onSwitchUserType={switchUserType}
        />
      )}
    </div>
  );
};

export default Index;
