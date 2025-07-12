
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Sparkles, Home, Palette, Activity, MapPin, Calendar, DollarSign } from 'lucide-react';
import { BudgetRangeSelector } from '@/components/BudgetRangeSelector';
import { CityDistrictSelector } from '@/components/CityDistrictSelector';
import { UserPreferences } from '@/pages/Index';

interface OnboardingQuizProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip: () => void;
}

const TOTAL_STEPS = 6;

export const OnboardingQuiz = ({ onComplete, onSkip }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    styles: [],
    colors: [],
    activities: [],
    location: [],
    priceRange: [5000000, 20000000],
    size: '',
    moveInDate: ''
  });

  const steps = [
    {
      id: 'styles',
      title: 'Your Style Vibe',
      subtitle: 'What aesthetic speaks to your soul?',
      icon: <Home className="w-6 h-6" />,
      type: 'multiple-choice' as const,
      options: [
        { id: 'modern', label: 'Modern Minimalist', emoji: '🏢' },
        { id: 'cozy', label: 'Cozy Traditional', emoji: '🏠' },
        { id: 'industrial', label: 'Urban Industrial', emoji: '🏭' },
        { id: 'bohemian', label: 'Bohemian Chic', emoji: '🌸' },
        { id: 'scandinavian', label: 'Scandinavian', emoji: '🌲' },
        { id: 'luxurious', label: 'Luxury Living', emoji: '✨' }
      ]
    },
    {
      id: 'colors',
      title: 'Color Palette',
      subtitle: 'Which colors make you feel at home?',
      icon: <Palette className="w-6 h-6" />,
      type: 'multiple-choice' as const,
      options: [
        { id: 'neutral', label: 'Warm Neutrals', emoji: '🤎' },
        { id: 'bright', label: 'Bold & Bright', emoji: '🌈' },
        { id: 'dark', label: 'Deep & Moody', emoji: '🖤' },
        { id: 'pastel', label: 'Soft Pastels', emoji: '🌸' },
        { id: 'monochrome', label: 'Black & White', emoji: '⚫' },
        { id: 'earthy', label: 'Earthy Tones', emoji: '🌿' }
      ]
    },
    {
      id: 'activities',
      title: 'Lifestyle Activities',
      subtitle: 'How do you love to spend your time?',
      icon: <Activity className="w-6 h-6" />,
      type: 'multiple-choice' as const,
      options: [
        { id: 'cooking', label: 'Cooking & Dining', emoji: '👨‍🍳' },
        { id: 'entertaining', label: 'Hosting Friends', emoji: '🎉' },
        { id: 'relaxing', label: 'Quiet Relaxation', emoji: '🧘‍♀️' },
        { id: 'working', label: 'Working from Home', emoji: '💻' },
        { id: 'exercising', label: 'Home Workouts', emoji: '💪' },
        { id: 'reading', label: 'Reading & Study', emoji: '📚' }
      ]
    },
    {
      id: 'location',
      title: 'Preferred Areas',
      subtitle: 'Where would you like to call home?',
      icon: <MapPin className="w-6 h-6" />,
      type: 'location' as const
    },
    {
      id: 'budget',
      title: 'Budget Range',
      subtitle: 'What\'s your comfortable monthly budget?',
      icon: <DollarSign className="w-6 h-6" />,
      type: 'budget' as const
    },
    {
      id: 'timeline',
      title: 'Move-in Timeline',
      subtitle: 'When are you planning to move?',
      icon: <Calendar className="w-6 h-6" />,
      type: 'single-choice' as const,
      options: [
        { id: 'asap', label: 'ASAP', subtitle: 'Ready to move immediately' },
        { id: '1-2months', label: '1-2 Months', subtitle: 'Planning ahead' },
        { id: '3-6months', label: '3-6 Months', subtitle: 'Future planning' },
        { id: 'exploring', label: 'Just Exploring', subtitle: 'No rush, just looking' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const handleOptionSelect = (optionId: string) => {
    const stepId = currentStepData.id as keyof UserPreferences;
    
    if (currentStepData.type === 'multiple-choice') {
      const currentValues = (preferences[stepId] as string[]) || [];
      const newValues = currentValues.includes(optionId)
        ? currentValues.filter(id => id !== optionId)
        : [...currentValues, optionId];
      
      setPreferences(prev => ({
        ...prev,
        [stepId]: newValues
      }));
    } else if (currentStepData.type === 'single-choice') {
      setPreferences(prev => ({
        ...prev,
        [stepId]: optionId
      }));
    }
  };

  const handleLocationChange = (districts: string[]) => {
    setPreferences(prev => ({
      ...prev,
      location: districts
    }));
  };

  const handleBudgetChange = (range: [number, number]) => {
    setPreferences(prev => ({
      ...prev,
      priceRange: range
    }));
  };

  const canProceed = () => {
    const stepId = currentStepData.id as keyof UserPreferences;
    const value = preferences[stepId];
    
    if (currentStepData.type === 'multiple-choice') {
      return Array.isArray(value) && value.length > 0;
    } else if (currentStepData.type === 'single-choice') {
      return Boolean(value);
    } else if (currentStepData.type === 'location') {
      return Array.isArray(preferences.location) && preferences.location.length > 0;
    } else if (currentStepData.type === 'budget') {
      return Array.isArray(preferences.priceRange);
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences as UserPreferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                <p className="text-gray-600 mt-1">{currentStepData.subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep + 1} of {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {currentStepData.type === 'location' ? (
            <CityDistrictSelector
              selectedDistricts={preferences.location || []}
              onDistrictsChange={handleLocationChange}
            />
          ) : currentStepData.type === 'budget' ? (
            <BudgetRangeSelector
              value={preferences.priceRange || [5000000, 20000000]}
              onChange={handleBudgetChange}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.options?.map((option) => {
                const isSelected = currentStepData.type === 'multiple-choice'
                  ? (preferences[currentStepData.id as keyof UserPreferences] as string[] || []).includes(option.id)
                  : preferences[currentStepData.id as keyof UserPreferences] === option.id;

                return (
                  <Card
                    key={option.id}
                    className={`p-6 cursor-pointer transition-all duration-200 border-2 hover:scale-105 ${
                      isSelected
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 bg-white/70'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{option.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{option.label}</h3>
                        {'subtitle' in option && (
                          <p className="text-sm text-gray-600">{option.subtitle}</p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-8 pt-4 border-t border-gray-200 bg-gray-50/70">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center space-x-2 px-6"
          >
            <span>{currentStep === TOTAL_STEPS - 1 ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
