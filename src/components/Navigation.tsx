
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';

interface NavigationProps {
  currentView: 'swipe' | 'matches';
  setCurrentView: (view: 'swipe' | 'matches') => void;
  matchCount: number;
  userType: 'renter' | 'realtor';
  onSwitchUserType: () => void;
  onOpenAIChat: () => void;
  onRestartOnboarding?: () => void;
}

export const Navigation = ({ 
  currentView, 
  setCurrentView, 
  matchCount, 
  userType, 
  onSwitchUserType,
  onOpenAIChat,
  onRestartOnboarding
}: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Hausto
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={currentView === 'swipe' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('swipe')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            >
              <Heart className="w-4 h-4 mr-2" />
              Discover
            </Button>
            
            <Button
              variant={currentView === 'matches' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('matches')}
              className="relative"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Matches
              {matchCount > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white text-xs h-5 min-w-5 flex items-center justify-center rounded-full">
                  {matchCount}
                </Badge>
              )}
            </Button>

            <UserMenu 
              userType={userType}
              onSwitchUserType={onSwitchUserType}
              onRestartOnboarding={onRestartOnboarding}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
