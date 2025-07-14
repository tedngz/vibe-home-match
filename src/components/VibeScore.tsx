
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VibeScore as VibeScoreType } from '@/utils/vibeScoring';
import { Sparkles } from 'lucide-react';

interface VibeScoreProps {
  score: VibeScoreType;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VibeScore = ({ score, showBreakdown = false, size = 'md' }: VibeScoreProps) => {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'bg-green-500 text-white border-green-400';
    if (scoreValue >= 60) return 'bg-yellow-500 text-white border-yellow-400';
    return 'bg-red-500 text-white border-red-400';
  };

  const getScoreEmoji = (scoreValue: number) => {
    if (scoreValue >= 90) return '🔥';
    if (scoreValue >= 80) return '✨';
    if (scoreValue >= 70) return '💫';
    if (scoreValue >= 60) return '⭐';
    return '💭';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5'
  };

  // Round all percentages
  const roundedScore = {
    overall: Math.round(score.overall),
    breakdown: {
      style: Math.round(score.breakdown.style),
      color: Math.round(score.breakdown.color),
      activities: Math.round(score.breakdown.activities),
      price: Math.round(score.breakdown.price)
    }
  };

  return (
    <div className="space-y-2">
      <Badge className={`${getScoreColor(roundedScore.overall)} ${sizeClasses[size]} font-semibold flex items-center gap-1 shadow-lg border`}>
        <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        Vibe Score: {roundedScore.overall}%
      </Badge>

      {showBreakdown && (
        <div className="space-y-2 text-xs bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Style</span>
                <span className="font-semibold text-primary">{roundedScore.breakdown.style}%</span>
              </div>
              <Progress value={roundedScore.breakdown.style} className={`h-1.5 ${getScoreColor(roundedScore.breakdown.style).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(roundedScore.breakdown.style).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Color</span>
                <span className="font-semibold text-primary">{roundedScore.breakdown.color}%</span>
              </div>
              <Progress value={roundedScore.breakdown.color} className={`h-1.5 ${getScoreColor(roundedScore.breakdown.color).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(roundedScore.breakdown.color).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Activity</span>
                <span className="font-semibold text-primary">{roundedScore.breakdown.activities}%</span>
              </div>
              <Progress value={roundedScore.breakdown.activities} className={`h-1.5 ${getScoreColor(roundedScore.breakdown.activities).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(roundedScore.breakdown.activities).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Budget</span>
                <span className="font-semibold text-primary">{roundedScore.breakdown.price}%</span>
              </div>
              <Progress value={roundedScore.breakdown.price} className={`h-1.5 ${getScoreColor(roundedScore.breakdown.price).includes('green') ? '[&>div]:bg-green-500' : getScoreColor(roundedScore.breakdown.price).includes('yellow') ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
