import { VibeScore } from '@/utils/vibeScoring';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Home, Palette, Activity, DollarSign } from 'lucide-react';

interface VibeScoreBarProps {
  score: VibeScore;
  showBreakdown?: boolean;
  className?: string;
}

export const VibeScoreBar = ({ score, showBreakdown = false, className = "" }: VibeScoreBarProps) => {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'text-green-600 bg-green-100';
    if (scoreValue >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'bg-green-500';
    if (scoreValue >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!showBreakdown) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className={`text-xs font-medium ${getScoreColor(score.overall)}`}>
          {score.overall}% Match
        </Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Home className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-gray-600 flex-1">Style</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(score.breakdown.style)} transition-all duration-300`}
              style={{ width: `${score.breakdown.style}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">{score.breakdown.style}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <Palette className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-gray-600 flex-1">Color</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(score.breakdown.color)} transition-all duration-300`}
              style={{ width: `${score.breakdown.color}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">{score.breakdown.color}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-3 h-3 text-green-500" />
          <span className="text-xs text-gray-600 flex-1">Activity</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(score.breakdown.activities)} transition-all duration-300`}
              style={{ width: `${score.breakdown.activities}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">{score.breakdown.activities}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <DollarSign className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-gray-600 flex-1">Price</span>
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(score.breakdown.price)} transition-all duration-300`}
              style={{ width: `${score.breakdown.price}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">{score.breakdown.price}%</span>
        </div>
      </div>
    </div>
  );
};