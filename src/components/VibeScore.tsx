
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
    if (scoreValue >= 80) return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
    if (scoreValue >= 60) return 'bg-amber-500/10 text-amber-700 border-amber-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
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
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="space-y-3">
      <Badge className={`${getScoreColor(score.overall)} ${sizeClasses[size]} font-medium flex items-center gap-1.5 border backdrop-blur-sm`}>
        <Sparkles className="w-3 h-3" />
        {score.overall}% {getScoreEmoji(score.overall)}
      </Badge>

      {showBreakdown && (
        <div className="space-y-2 text-xs bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Style</span>
                <span className="font-semibold text-gray-800">{score.breakdown.style}%</span>
              </div>
              <Progress value={score.breakdown.style} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Colors</span>
                <span className="font-semibold text-gray-800">{score.breakdown.color}%</span>
              </div>
              <Progress value={score.breakdown.color} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Activities</span>
                <span className="font-semibold text-gray-800">{score.breakdown.activities}%</span>
              </div>
              <Progress value={score.breakdown.activities} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Budget</span>
                <span className="font-semibold text-gray-800">{score.breakdown.price}%</span>
              </div>
              <Progress value={score.breakdown.price} className="h-1.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
