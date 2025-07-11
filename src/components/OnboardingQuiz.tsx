
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserPreferences } from '@/pages/Index';
import { BudgetRangeSelector } from '@/components/BudgetRangeSelector';
import { CityDistrictSelector } from '@/components/CityDistrictSelector';

interface OnboardingQuizProps {
  onComplete: (preferences: UserPreferences) => void;
}

export const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    styles: [],
    colors: [],
    activities: [],
    priceRange: [8000000, 15000000],
    size: '',
    location: [],
    moveInDate: ''
  });

  const totalSteps = 7;

  // Type guard functions - only declared once
  const isMultiSelect = (step: any): step is { type: "multi-select", key: keyof UserPreferences, options: { id: string, label: string, emoji: string, description: string, image?: string }[] } => {
    return step.type === "multi-select";
  };

  const isSingleSelect = (step: any): step is { type: "single-select", key: keyof UserPreferences, options: { id: string, label: string, emoji: string, description: string }[] } => {
    return step.type === "single-select";
  };

  const isBudgetStep = (step: any): step is { type: "budget", key: keyof UserPreferences } => {
    return step.type === "budget";
  };

  const isLocationStep = (step: any): step is { type: "location", key: keyof UserPreferences } => {
    return step.type === "location";
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleMultiSelect = (optionId: string, key: keyof UserPreferences) => {
    const currentValues = (preferences[key] as string[]) || [];
    const isSelected = currentValues.includes(optionId);

    if (isSelected) {
      setPreferences(prev => ({
        ...prev,
        [key]: currentValues.filter(id => id !== optionId)
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: [...currentValues, optionId]
      }));
    }
  };

  const handleSingleSelect = (optionId: string, key: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: optionId
    }));
  };

  const handleBudgetChange = (value: [number, number]) => {
    setPreferences(prev => ({
      ...prev,
      priceRange: value
    }));
  };

  const handleLocationChange = (value: string[]) => {
    setPreferences(prev => ({
      ...prev,
      location: value
    }));
  };

  const handleSubmit = () => {
    const finalPreferences: UserPreferences = {
      styles: preferences.styles as string[],
      colors: preferences.colors as string[],
      activities: preferences.activities as string[],
      priceRange: preferences.priceRange as [number, number],
      size: preferences.size as string,
      location: preferences.location as string[],
      moveInDate: preferences.moveInDate as string
    };
    onComplete(finalPreferences);
  };

  const steps = [
    {
      title: "What's your style vibe?",
      subtitle: "Pick styles that speak to you",
      type: "multi-select" as const,
      key: "styles" as keyof UserPreferences,
      options: [
        { 
          id: 'modern', 
          label: 'Modern', 
          emoji: '🏢', 
          description: 'Clean lines, minimalist',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        { 
          id: 'cozy', 
          label: 'Cozy', 
          emoji: '🏠', 
          description: 'Warm, comfortable',
          image: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=400&h=300&fit=crop'
        },
        { 
          id: 'industrial', 
          label: 'Industrial', 
          emoji: '🏭', 
          description: 'Raw, urban feel',
          image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop'
        },
        { 
          id: 'bohemian', 
          label: 'Bohemian', 
          emoji: '🌸', 
          description: 'Artistic, eclectic',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        },
        { 
          id: 'scandinavian', 
          label: 'Scandinavian', 
          emoji: '❄️', 
          description: 'Light, functional',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
        },
        { 
          id: 'minimalist', 
          label: 'Minimalist', 
          emoji: '⚪', 
          description: 'Simple, uncluttered',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      title: "Color palette preference?",
      subtitle: "What colors make you feel at home?",
      type: "multi-select" as const,
      key: "colors" as keyof UserPreferences,
      options: [
        { id: 'neutral', label: 'Neutral', emoji: '🤍', description: 'Whites, grays, beiges' },
        { id: 'warm', label: 'Warm', emoji: '🧡', description: 'Oranges, reds, yellows' },
        { id: 'cool', label: 'Cool', emoji: '💙', description: 'Blues, greens, purples' },
        { id: 'earth', label: 'Earth', emoji: '🤎', description: 'Browns, terracotta' },
        { id: 'bold', label: 'Bold', emoji: '🌈', description: 'Vibrant, contrasting' }
      ]
    },
    {
      title: "How do you spend time at home?",
      subtitle: "Your lifestyle shapes your space",
      type: "multi-select" as const,
      key: "activities" as keyof UserPreferences,
      options: [
        { id: 'working', label: 'Working', emoji: '💻', description: 'Home office, productivity' },
        { id: 'entertaining', label: 'Entertaining', emoji: '🎉', description: 'Hosting friends' },
        { id: 'relaxing', label: 'Relaxing', emoji: '🛋️', description: 'Chilling, unwinding' },
        { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳', description: 'Culinary adventures' },
        { id: 'exercising', label: 'Exercising', emoji: '🏋️', description: 'Home workouts' },
        { id: 'reading', label: 'Reading', emoji: '📚', description: 'Quiet study time' }
      ]
    },
    {
      title: "What's your budget range?",
      subtitle: "Let's find options that fit your budget",
      type: "budget" as const,
      key: "priceRange" as keyof UserPreferences
    },
    {
      title: "Preferred space size?",
      subtitle: "How much room do you need?",
      type: "single-select" as const,
      key: "size" as keyof UserPreferences,
      options: [
        { id: 'studio', label: 'Studio', emoji: '🏠', description: '25-35 m², compact living' },
        { id: '1br', label: '1 Bedroom', emoji: '🛏️', description: '40-60 m², separate bedroom' },
        { id: '2br', label: '2 Bedroom', emoji: '🏡', description: '70-90 m², extra room' },
        { id: '3br+', label: '3+ Bedroom', emoji: '🏘️', description: '100+ m², family sized' }
      ]
    },
    {
      title: "Where do you want to live?",
      subtitle: "Choose your preferred areas",
      type: "location" as const,
      key: "location" as keyof UserPreferences
    },
    {
      title: "When do you want to move?",
      subtitle: "Your timeline helps us prioritize",
      type: "single-select" as const,
      key: "moveInDate" as keyof UserPreferences,
      options: [
        { id: 'asap', label: 'ASAP', emoji: '⚡', description: 'Ready to move now' },
        { id: '1month', label: '1 Month', emoji: '📅', description: 'Within 30 days' },
        { id: '3months', label: '3 Months', emoji: '🗓️', description: 'In next quarter' },
        { id: '6months', label: '6+ Months', emoji: '⏰', description: 'Planning ahead' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <Card className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-2">{currentStepData.title}</h2>
              <p className="text-sm md:text-lg text-gray-600">{currentStepData.subtitle}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            {isMultiSelect(currentStepData) && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                {currentStepData.options.map(option => (
                  <Button
                    key={option.id}
                    variant={((preferences[currentStepData.key] as string[]) || []).includes(option.id) ? 'default' : 'outline'}
                    className="h-auto p-0 flex flex-col items-center justify-center text-center overflow-hidden hover:shadow-md transition-all duration-200"
                    onClick={() => handleMultiSelect(option.id, currentStepData.key)}
                  >
                    {option.image ? (
                      <div className="w-full h-32 relative">
                        <img 
                          src={option.image} 
                          alt={option.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-2xl md:text-3xl">{option.emoji}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                        <span className="text-2xl md:text-3xl">{option.emoji}</span>
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <span className="font-semibold text-sm md:text-base">{option.label}</span>
                      <span className="text-xs text-gray-500 leading-tight">{option.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {isSingleSelect(currentStepData) && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-4xl">
                {currentStepData.options.map(option => (
                  <Button
                    key={option.id}
                    variant={(preferences[currentStepData.key] === option.id) ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center justify-center text-center space-y-2 hover:shadow-md transition-all duration-200"
                    onClick={() => handleSingleSelect(option.id, currentStepData.key)}
                  >
                    <span className="text-2xl md:text-3xl">{option.emoji}</span>
                    <span className="font-semibold text-sm md:text-base">{option.label}</span>
                    <span className="text-xs text-gray-500 leading-tight">{option.description}</span>
                  </Button>
                ))}
              </div>
            )}

            {isBudgetStep(currentStepData) && (
              <div className="w-full max-w-2xl">
                <BudgetRangeSelector
                  value={preferences.priceRange as [number, number]}
                  onChange={handleBudgetChange}
                />
              </div>
            )}

            {isLocationStep(currentStepData) && (
              <div className="w-full max-w-2xl">
                <CityDistrictSelector
                  value={preferences.location as string[]}
                  onChange={handleLocationChange}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button 
              variant="secondary" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="min-w-[100px]"
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {totalSteps}
            </div>

            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext} className="min-w-[100px]">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="min-w-[100px]">
                Complete
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
