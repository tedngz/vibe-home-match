
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
    if (scoreValue >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (scoreValue >= 60) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
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
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="space-y-2">
      <Badge className={`${getScoreColor(score.overall)} ${sizeClasses[size]} font-semibold flex items-center gap-1`}>
        <Sparkles className="w-3 h-3" />
        {score.overall}% Vibe Match {getScoreEmoji(score.overall)}
      </Badge>

      {showBreakdown && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Style</span>
                <span className="font-medium">{score.breakdown.style}%</span>
              </div>
              <Progress value={score.breakdown.style} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Colors</span>
                <span className="font-medium">{score.breakdown.color}%</span>
              </div>
              <Progress value={score.breakdown.color} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Activities</span>
                <span className="font-medium">{score.breakdown.activities}%</span>
              </div>
              <Progress value={score.breakdown.activities} className="h-1" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">Budget</span>
                <span className="font-medium">{score.breakdown.price}%</span>
              </div>
              <Progress value={score.breakdown.price} className="h-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
