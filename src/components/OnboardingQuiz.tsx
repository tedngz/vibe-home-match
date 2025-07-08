
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPreferences } from '@/pages/Index';
import { ArrowUp, MapPin } from 'lucide-react';

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

const LOCATION_OPTIONS = [
  { id: 'ho-chi-minh-city', label: 'Ho Chi Minh City', flag: '🇻🇳' },
  { id: 'hanoi', label: 'Hanoi', flag: '🇻🇳' },
  { id: 'da-nang', label: 'Da Nang', flag: '🇻🇳' },
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md border-slate-200 shadow-2xl rounded-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Find Your Vibe
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{step}/{totalSteps}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What's your style?</h3>
              <p className="text-slate-600 text-sm">Select all that resonate with you</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STYLE_OPTIONS.map(style => (
                <Button
                  key={style.id}
                  variant={preferences.styles?.includes(style.id) ? 'default' : 'outline'}
                  className={`h-auto p-5 flex flex-col items-center space-y-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    preferences.styles?.includes(style.id) 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => handleStyleToggle(style.id)}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="text-sm font-medium">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Color palette preference?</h3>
              <p className="text-slate-600 text-sm">Choose your favorite color schemes</p>
            </div>
            <div className="space-y-3">
              {COLOR_OPTIONS.map(color => (
                <Button
                  key={color.id}
                  variant={preferences.colors?.includes(color.id) ? 'default' : 'outline'}
                  className={`w-full justify-start space-x-4 p-4 rounded-xl transition-all duration-200 ${
                    preferences.colors?.includes(color.id)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => handleColorToggle(color.id)}
                >
                  <div className={`w-5 h-5 rounded-full ${color.color} shadow-sm`} />
                  <span className="font-medium">{color.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">What do you love doing at home?</h3>
              <p className="text-slate-600 text-sm">Select your favorite activities</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ACTIVITY_OPTIONS.map(activity => (
                <Button
                  key={activity.id}
                  variant={preferences.activities?.includes(activity.id) ? 'default' : 'outline'}
                  className={`h-auto p-5 flex flex-col items-center space-y-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    preferences.activities?.includes(activity.id)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                  onClick={() => handleActivityToggle(activity.id)}
                >
                  <span className="text-2xl">{activity.emoji}</span>
                  <span className="text-sm text-center font-medium">{activity.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Budget & Size</h3>
              <p className="text-slate-600 text-sm">Tell us your preferences</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium text-slate-900">Monthly Budget</Label>
                <div className="px-3">
                  <Slider
                    value={preferences.priceRange || [1000, 3000]}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={5000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-2 font-medium">
                    <span>${preferences.priceRange?.[0] || 1000}</span>
                    <span>${preferences.priceRange?.[1] || 3000}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="size" className="text-base font-medium text-slate-900">Preferred Size</Label>
                <Select value={preferences.size || ''} onValueChange={(value) => setPreferences(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger className="w-full p-4 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select apartment size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="1br">1 Bedroom</SelectItem>
                    <SelectItem value="2br">2 Bedrooms</SelectItem>
                    <SelectItem value="3br">3+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Almost there!</h3>
              <p className="text-slate-600 text-sm">Final details to get started</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Preferred Location
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {LOCATION_OPTIONS.map(location => (
                    <Button
                      key={location.id}
                      variant={preferences.location === location.label ? 'default' : 'outline'}
                      className={`w-full justify-start space-x-3 p-4 rounded-xl transition-all duration-200 ${
                        preferences.location === location.label
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                      onClick={() => setPreferences(prev => ({ ...prev, location: location.label }))}
                    >
                      <span className="text-lg">{location.flag}</span>
                      <span className="font-medium">{location.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="moveIn" className="text-base font-medium text-slate-900">Move-in Date</Label>
                <Input
                  id="moveIn"
                  type="date"
                  value={preferences.moveInDate || ''}
                  onChange={(e) => setPreferences(prev => ({ ...prev, moveInDate: e.target.value }))}
                  className="p-4 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-xl border-slate-200 hover:bg-slate-50"
            >
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button 
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
              disabled={
                (step === 1 && !preferences.styles?.length) ||
                (step === 2 && !preferences.colors?.length) ||
                (step === 3 && !preferences.activities?.length) ||
                (step === 4 && !preferences.size)
              }
            >
              Next <ArrowUp className="w-4 h-4 ml-2 rotate-90" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
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
