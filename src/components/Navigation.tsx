
import { Heart, Home, User, Building, ArrowLeftRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: 'swipe' | 'matches';
  setCurrentView: (view: 'swipe' | 'matches') => void;
  matchCount: number;
  userType: 'renter' | 'realtor';
  onSwitchUserType: () => void;
  onOpenAIChat?: () => void;
}

export const Navigation = ({ currentView, setCurrentView, matchCount, userType, onSwitchUserType, onOpenAIChat }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/e6e36f1b-c1ac-4aa8-a584-dac48543e870.png" 
            alt="Hausto Logo" 
            className="w-8 h-8"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Hausto
            </h1>
            {userType === 'realtor' && (
              <p className="text-xs text-gray-500">Realtor</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {userType === 'renter' && (
            <>
              <Button
                variant={currentView === 'swipe' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('swipe')}
                className="relative"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'matches' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('matches')}
                className="relative"
              >
                <Heart className="w-4 h-4" />
                {matchCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {matchCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenAIChat}
                className="text-purple-600"
              >
                <Bot className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSwitchUserType}
            className="text-gray-600"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
