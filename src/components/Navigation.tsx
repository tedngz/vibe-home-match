
import { Heart, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: 'swipe' | 'matches';
  setCurrentView: (view: 'swipe' | 'matches') => void;
  matchCount: number;
}

export const Navigation = ({ currentView, setCurrentView, matchCount }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            VibeHome
          </h1>
        </div>
        
        <div className="flex space-x-2">
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
        </div>
      </div>
    </nav>
  );
};
