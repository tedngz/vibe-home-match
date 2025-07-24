import { VibeScore } from '@/utils/vibeScoring';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Home, Palette, Activity, DollarSign } from 'lucide-react';

interface VibeScoreBarProps {
  score: VibeScore;
  showBreakdown?: boolean;
  className?: string;
  apartment?: any;
}

export const VibeScoreBar = ({ score, showBreakdown = false, className = "", apartment }: VibeScoreBarProps) => {
  const getVibeLevel = (scoreValue: number) => {
    if (scoreValue >= 80) return { level: 'Perfect Vibe', color: 'text-emerald-600 bg-emerald-100', emoji: '🔥' };
    if (scoreValue >= 65) return { level: 'Strong Vibe', color: 'text-blue-600 bg-blue-100', emoji: '✨' };
    if (scoreValue >= 50) return { level: 'Good Vibe', color: 'text-orange-600 bg-orange-100', emoji: '⭐' };
    return { level: 'Casual Vibe', color: 'text-gray-600 bg-gray-100', emoji: '💭' };
  };

  const getStyleTags = (styleScore: number, vibeAnalysis?: any): string[] => {
    const aiStyleTags: string[] = [];
    
    if (vibeAnalysis) {
      // Add style characteristics based on AI analysis scores
      if (vibeAnalysis.modern >= 7) aiStyleTags.push('Modern');
      if (vibeAnalysis.cozy >= 7) aiStyleTags.push('Cozy');
      if (vibeAnalysis.luxurious >= 7) aiStyleTags.push('Luxurious');
      if (vibeAnalysis.minimalist >= 7) aiStyleTags.push('Minimalist');
      if (vibeAnalysis.colorful >= 7) aiStyleTags.push('Colorful');
      if (vibeAnalysis.spacious >= 7) aiStyleTags.push('Spacious');
      if (vibeAnalysis.natural_light >= 8) aiStyleTags.push('Bright & Airy');
      if (vibeAnalysis.urban >= 7) aiStyleTags.push('Urban');
      if (vibeAnalysis.rustic >= 7) aiStyleTags.push('Rustic');
      if (vibeAnalysis.elegant >= 7) aiStyleTags.push('Elegant');
      
      if (aiStyleTags.length > 0) return aiStyleTags.slice(0, 3);
    }
    
    // Fallback based on score
    const tags = ['Modern', 'Minimalist', 'Cozy', 'Bright', 'Spacious', 'Industrial', 'Scandinavian'];
    return tags.slice(0, Math.max(3, Math.min(4, Math.floor(styleScore / 20) + 3)));
  };

  const getColorPalette = (colorScore: number) => {
    const palettes = [['Neutral', 'Warm'], ['Earth', 'Natural'], ['Cool', 'Fresh']];
    return palettes[Math.min(2, Math.floor(colorScore / 30))] || palettes[0];
  };

  const getActivities = (activityScore: number) => {
    const activities = [['Reading', 'Relaxing'], ['Cooking', 'Family'], ['Creating', 'Social']];
    return activities[Math.min(2, Math.floor(activityScore / 30))] || activities[0];
  };

  const vibeLevel = getVibeLevel(score.overall);
  const vibeAnalysis = apartment?.vibe_analysis;

  if (!showBreakdown) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className={`text-xs font-medium ${vibeLevel.color}`}>
          {vibeLevel.emoji} {vibeLevel.level}
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
          <div className="flex flex-wrap gap-1">
            {getStyleTags(score.breakdown.style, vibeAnalysis).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Palette className="w-3 h-3 text-purple-500" />
          <span className="text-xs text-gray-600 flex-1">Color</span>
          <div className="flex flex-wrap gap-1">
            {getColorPalette(score.breakdown.color).map((color, index) => (
              <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0.5 bg-purple-50 text-purple-700 border-purple-200">
                {color}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-3 h-3 text-green-500" />
          <span className="text-xs text-gray-600 flex-1">Activities</span>
          <div className="flex flex-wrap gap-1">
            {getActivities(score.breakdown.activities).map((activity, index) => (
              <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200">
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};