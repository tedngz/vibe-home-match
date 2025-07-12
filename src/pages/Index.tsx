
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingQuiz } from '@/components/OnboardingQuiz';
import { SwipeInterface } from '@/components/SwipeInterface';
import { MatchesView } from '@/components/MatchesView';
import { Navigation } from '@/components/Navigation';
import { RealtorDashboard } from '@/components/RealtorDashboard';
import { UserTypeSelector } from '@/components/UserTypeSelector';
import { AIChatAgent } from '@/components/AIChatAgent';
import { FloatingAIButton } from '@/components/FloatingAIButton';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

export type UserPreferences = {
  styles: string[];
  colors: string[];
  activities: string[];
  priceRange: [number, number];
  size: string;
  location: string[];
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
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'renter' | 'realtor' | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'swipe' | 'matches' | 'dashboard'>('onboarding');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [matches, setMatches] = useState<Apartment[]>([]);
  const [realtorMatches, setRealtorMatches] = useState<Match[]>([]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    if (user) {
      const savedUserType = localStorage.getItem(`userType_${user.id}`);
      const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
      
      if (savedUserType) {
        setUserType(savedUserType as 'renter' | 'realtor');
        
        if (savedUserType === 'realtor') {
          setCurrentView('dashboard');
        } else if (savedPreferences) {
          try {
            const preferences = JSON.parse(savedPreferences);
            setUserPreferences(preferences);
            setCurrentView('swipe');
          } catch (error) {
            console.error('Error parsing saved preferences:', error);
            setCurrentView('onboarding');
          }
        } else {
          setCurrentView('onboarding');
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleUserTypeSelect = (type: 'renter' | 'realtor') => {
    setUserType(type);
    if (user) {
      localStorage.setItem(`userType_${user.id}`, type);
    }
    
    if (type === 'realtor') {
      setCurrentView('dashboard');
    } else {
      // Check if user has saved preferences
      if (user) {
        const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
        if (savedPreferences) {
          try {
            const preferences = JSON.parse(savedPreferences);
            setUserPreferences(preferences);
            setCurrentView('swipe');
          } catch (error) {
            setCurrentView('onboarding');
          }
        } else {
          setCurrentView('onboarding');
        }
      } else {
        setCurrentView('onboarding');
      }
    }
  };

  const handleOnboardingComplete = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    // Save preferences to localStorage
    if (user) {
      localStorage.setItem(`userPreferences_${user.id}`, JSON.stringify(preferences));
    }
    setCurrentView('swipe');
  };

  const handleRestartOnboarding = () => {
    setUserPreferences(null);
    // Clear saved preferences
    if (user) {
      localStorage.removeItem(`userPreferences_${user.id}`);
    }
    setCurrentView('onboarding');
    setMatches([]);
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
    
    // Clear localStorage
    if (user) {
      localStorage.removeItem(`userType_${user.id}`);
      localStorage.removeItem(`userPreferences_${user.id}`);
    }
  };

  const handleSignOut = async () => {
    // Clear localStorage on sign out
    if (user) {
      localStorage.removeItem(`userType_${user.id}`);
      localStorage.removeItem(`userPreferences_${user.id}`);
    }
    
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {userType && currentView !== 'onboarding' && currentView !== 'dashboard' && (
          <Navigation 
            currentView={currentView} 
            setCurrentView={setCurrentView}
            matchCount={matches.length}
            userType={userType}
            onSwitchUserType={switchUserType}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onRestartOnboarding={userType === 'renter' ? handleRestartOnboarding : undefined}
          />
        )}
        
        {(!userType || currentView === 'onboarding' || currentView === 'dashboard') && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="bg-white/80 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
            userProfile={{ name: user.user_metadata?.name || '', email: user.email || '', phone: user.user_metadata?.phone || '' }}
            onRestartOnboarding={handleRestartOnboarding}
          />
        )}
        
        {userType === 'renter' && currentView === 'matches' && (
          <MatchesView 
            matches={matches} 
            userPreferences={userPreferences}
            userProfile={{ name: user.user_metadata?.name || '', email: user.email || '', phone: user.user_metadata?.phone || '' }}
          />
        )}

        {userType === 'realtor' && currentView === 'dashboard' && (
          <RealtorDashboard 
            matches={realtorMatches}
            onSwitchUserType={switchUserType}
          />
        )}

        {userType === 'renter' && (currentView === 'swipe' || currentView === 'matches') && (
          <FloatingAIButton onClick={() => setIsAIChatOpen(true)} />
        )}

        <AIChatAgent 
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
          userPreferences={userPreferences}
          onMatch={handleMatch}
        />
      </div>
    </CurrencyProvider>
  );
};

export default Index;
