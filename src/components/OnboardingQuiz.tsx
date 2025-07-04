
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPreferences } from '@/pages/Index';
import { ArrowUp } from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: (preferences: UserPreferences) => void;
}

const STYLE_OPTIONS = [
  { id: 'modern', label: 'Modern', emoji: '🏙️' },
  { id: 'cozy', label: 'Cozy', emoji: '🏠' },
  { id: 'minimalist', label: 'Minimalist', emoji: '⚪' },
  { id: 'bohemian', label: 'Bohemian', emoji: '🌸' },
  { id: 'industrial', label: 'Industrial', emoji: '🏭' },
  { id: 'scandinavian', label: 'Scandinavian', emoji: '🌲' },
];

const COLOR_OPTIONS = [
  { id: 'warm', label: 'Warm tones', color: 'bg-orange-400' },
  { id: 'cool', label: 'Cool tones', color: 'bg-blue-400' },
  { id: 'neutral', label: 'Neutral', color: 'bg-gray-400' },
  { id: 'earth', label: 'Earth tones', color: 'bg-amber-600' },
  { id: 'bold', label: 'Bold colors', color: 'bg-purple-500' },
];

const ACTIVITY_OPTIONS = [
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
  { id: 'entertaining', label: 'Entertaining', emoji: '🎉' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'working', label: 'Remote work', emoji: '💻' },
  { id: 'exercising', label: 'Home workouts', emoji: '🏋️' },
  { id: 'relaxing', label: 'Relaxing', emoji: '🧘' },
];

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    styles: [],
    colors: [],
    activities: [],
    priceRange: [1000, 3000],
  });

  const handleStyleToggle = (styleId: string) => {
    setPreferences(prev => ({
      ...prev,
      styles: prev.styles?.includes(styleId) 
        ? prev.styles.filter(s => s !== styleId)
        : [...(prev.styles || []), styleId]
    }));
  };

  const handleColorToggle = (colorId: string) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors?.includes(colorId)
        ? prev.colors.filter(c => c !== colorId)
        : [...(prev.colors || []), colorId]
    }));
  };

  const handleActivityToggle = (activityId: string) => {
    setPreferences(prev => ({
      ...prev,
      activities: prev.activities?.includes(activityId)
        ? prev.activities.filter(a => a !== activityId)
        : [...(prev.activities || []), activityId]
    }));
  };

  const handleComplete = () => {
    if (preferences.styles && preferences.colors && preferences.activities && 
        preferences.priceRange && preferences.size && preferences.location && 
        preferences.moveInDate) {
      onComplete(preferences as UserPreferences);
    }
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white/70 backdrop-blur-md border-white/30 shadow-xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Find Your Vibe
            </h2>
            <span className="text-sm text-gray-500">{step}/{totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What's your style?</h3>
            <p className="text-gray-600 text-sm">Select all that resonate with you</p>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_OPTIONS.map(style => (
                <Button
                  key={style.id}
                  variant={preferences.styles?.includes(style.id) ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleStyleToggle(style.id)}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="text-sm">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color palette preference?</h3>
            <div className="space-y-3">
              {COLOR_OPTIONS.map(color => (
                <Button
                  key={color.id}
                  variant={preferences.colors?.includes(color.id) ? 'default' : 'outline'}
                  className="w-full justify-start space-x-3"
                  onClick={() => handleColorToggle(color.id)}
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`} />
                  <span>{color.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What do you love doing at home?</h3>
            <div className="grid grid-cols-2 gap-3">
              {ACTIVITY_OPTIONS.map(activity => (
                <Button
                  key={activity.id}
                  variant={preferences.activities?.includes(activity.id) ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleActivityToggle(activity.id)}
                >
                  <span className="text-2xl">{activity.emoji}</span>
                  <span className="text-sm text-center">{activity.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Budget & Size</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Monthly Budget</Label>
                <div className="mt-2">
                  <Slider
                    value={preferences.priceRange || [1000, 3000]}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={5000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${preferences.priceRange?.[0] || 1000}</span>
                    <span>${preferences.priceRange?.[1] || 3000}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="size" className="text-sm font-medium">Preferred Size</Label>
                <select 
                  id="size"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={preferences.size || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, size: e.target.value }))}
                >
                  <option value="">Select size</option>
                  <option value="studio">Studio</option>
                  <option value="1br">1 Bedroom</option>
                  <option value="2br">2 Bedrooms</option>
                  <option value="3br">3+ Bedrooms</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Almost there!</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium">Preferred Area</Label>
                <Input
                  id="location"
                  placeholder="e.g., Downtown, Brooklyn, etc."
                  value={preferences.location || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="moveIn" className="text-sm font-medium">Move-in Date</Label>
                <Input
                  id="moveIn"
                  type="date"
                  value={preferences.moveInDate || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, moveInDate: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button 
              onClick={() => setStep(step + 1)}
              className="ml-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              disabled={
                (step === 1 && !preferences.styles?.length) ||
                (step === 2 && !preferences.colors?.length) ||
                (step === 3 && !preferences.activities?.length) ||
                (step === 4 && !preferences.size)
              }
            >
              Next <ArrowUp className="w-4 h-4 ml-1 rotate-90" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="ml-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              disabled={!preferences.location || !preferences.moveInDate}
            >
              Start Matching! ✨
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
