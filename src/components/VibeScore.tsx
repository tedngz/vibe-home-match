
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
  const getVibeLevel = (scoreValue: number) => {
    if (scoreValue >= 85) return { level: 'Perfect Vibe', color: 'bg-emerald-500 text-white border-emerald-400', emoji: '🔥' };
    if (scoreValue >= 70) return { level: 'Strong Vibe', color: 'bg-blue-500 text-white border-blue-400', emoji: '✨' };
    if (scoreValue >= 55) return { level: 'Good Vibe', color: 'bg-orange-500 text-white border-orange-400', emoji: '⭐' };
    return { level: 'Vibe', color: 'bg-gray-500 text-white border-gray-400', emoji: '💭' };
  };

  const getStyleTags = (styleScore: number, apartment: any) => {
    // Mock style tags based on style score and apartment vibe
    const tags = ['Modern', 'Minimalist', 'Cozy', 'Bright', 'Spacious', 'Industrial', 'Scandinavian'];
    return tags.slice(0, Math.max(3, Math.min(4, Math.floor(styleScore / 20) + 3)));
  };

  const getColorPalette = (colorScore: number) => {
    // Mock color palette based on color score
    const palettes = [
      ['Neutral Tones', 'Warm Whites', 'Soft Grays'],
      ['Earth Tones', 'Natural Wood', 'Warm Beige'],
      ['Cool Blues', 'Fresh Whites', 'Light Grays'],
      ['Bold Accents', 'Vibrant Colors', 'Rich Textures']
    ];
    const paletteIndex = Math.min(3, Math.floor(colorScore / 25));
    return palettes[paletteIndex] || palettes[0];
  };

  const getActivities = (activityScore: number) => {
    // Mock activities based on activity score
    const activities = [
      ['Reading', 'Relaxing', 'Working'],
      ['Cooking', 'Entertaining', 'Family Time'],
      ['Creating', 'Exercising', 'Socializing'],
      ['Meditating', 'Studying', 'Hosting']
    ];
    const activityIndex = Math.min(3, Math.floor(activityScore / 25));
    return activities[activityIndex] || activities[0];
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5'
  };

  const roundedScore = {
    overall: Math.round(score.overall),
    breakdown: {
      style: Math.round(score.breakdown.style),
      color: Math.round(score.breakdown.color),
      activities: Math.round(score.breakdown.activities),
      price: Math.round(score.breakdown.price)
    }
  };

  const vibeLevel = getVibeLevel(roundedScore.overall);

  return (
    <div className="space-y-2">
      <Badge className={`${vibeLevel.color} ${sizeClasses[size]} font-semibold flex items-center gap-1 shadow-lg border`}>
        <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        {vibeLevel.emoji} {vibeLevel.level}
      </Badge>

      {showBreakdown && (
        <div className="space-y-3 text-xs">
          <div className="space-y-3">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-gray-600 font-medium">Style</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {getStyleTags(roundedScore.breakdown.style, null).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <span className="text-gray-600 font-medium">Color</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {getColorPalette(roundedScore.breakdown.color).map((color, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <span className="text-gray-600 font-medium">Lifestyle Activities</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {getActivities(roundedScore.breakdown.activities).map((activity, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
