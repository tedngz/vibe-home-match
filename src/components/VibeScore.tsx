
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
    if (scoreValue >= 80) return 'bg-emerald-500/90 text-white border-emerald-400';
    if (scoreValue >= 60) return 'bg-amber-500/90 text-white border-amber-400';
    return 'bg-red-500/90 text-white border-red-400';
  };

  const getScoreEmoji = (scoreValue: number) => {
    if (scoreValue >= 90) return '🔥';
    if (scoreValue >= 80) return '✨';
    if (scoreValue >= 70) return '💫';
    if (scoreValue >= 60) return '⭐';
    return '💭';
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
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
    <div className="space-y-3">
      <Badge className={`${getScoreColor(roundedScore.overall)} ${sizeClasses[size]} font-semibold flex items-center gap-1.5 border-2 backdrop-blur-md shadow-lg`}>
        <Sparkles className="w-3 h-3" />
        {roundedScore.overall}% {getScoreEmoji(roundedScore.overall)}
      </Badge>

      {showBreakdown && (
        <div className="space-y-2 text-xs bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Style</span>
                <span className="font-semibold text-gray-800">{roundedScore.breakdown.style}%</span>
              </div>
              <Progress value={roundedScore.breakdown.style} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Colors</span>
                <span className="font-semibold text-gray-800">{roundedScore.breakdown.color}%</span>
              </div>
              <Progress value={roundedScore.breakdown.color} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Activities</span>
                <span className="font-semibold text-gray-800">{roundedScore.breakdown.activities}%</span>
              </div>
              <Progress value={roundedScore.breakdown.activities} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Budget</span>
                <span className="font-semibold text-gray-800">{roundedScore.breakdown.price}%</span>
              </div>
              <Progress value={roundedScore.breakdown.price} className="h-1.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
