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
    priceRange: [8000000, 15000000], // Updated for Vietnam pricing
    size: '',
    location: [],
    moveInDate: ''
  });

  const totalSteps = 7;

  const isMultiSelect = (step: any): step is { type: "multi-select", key: keyof UserPreferences, options: { id: string, label: string, emoji: string, description: string }[] } => {
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
        { id: 'modern', label: 'Modern', emoji: '🏢', description: 'Clean lines, minimalist' },
        { id: 'cozy', label: 'Cozy', emoji: '🏠', description: 'Warm, comfortable' },
        { id: 'industrial', label: 'Industrial', emoji: '🏭', description: 'Raw, urban feel' },
        { id: 'bohemian', label: 'Bohemian', emoji: '🌸', description: 'Artistic, eclectic' },
        { id: 'scandinavian', label: 'Scandinavian', emoji: '❄️', description: 'Light, functional' },
        { id: 'minimalist', label: 'Minimalist', emoji: '⚪', description: 'Simple, uncluttered' }
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
        { id: 'studio', label: 'Studio', emoji: '🏠', description: '25-35 sqm, compact living' },
        { id: '1br', label: '1 Bedroom', emoji: '🛏️', description: '40-60 sqm, separate bedroom' },
        { id: '2br', label: '2 Bedroom', emoji: '🏡', description: '70-90 sqm, extra room' },
        { id: '3br+', label: '3+ Bedroom', emoji: '🏘️', description: '100+ sqm, family sized' }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-orange-700 mb-2">{currentStepData.title}</h2>
            <p className="text-lg text-gray-600">{currentStepData.subtitle}</p>
            <Progress value={(currentStep / totalSteps) * 100} className="mt-4 h-2" />
          </div>

          {isMultiSelect(currentStepData) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStepData.options.map(option => (
                <Button
                  key={option.id}
                  variant={((preferences[currentStepData.key] as string[]) || []).includes(option.id) ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleMultiSelect(option.id, currentStepData.key)}
                >
                  <span className="text-4xl mb-2">{option.emoji}</span>
                  <span className="text-lg font-semibold">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </Button>
              ))}
            </div>
          )}

          {isSingleSelect(currentStepData) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStepData.options.map(option => (
                <Button
                  key={option.id}
                  variant={(preferences[currentStepData.key] === option.id) ? 'default' : 'outline'}
                  className="flex flex-col items-center justify-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  onClick={() => handleSingleSelect(option.id, currentStepData.key)}
                >
                  <span className="text-4xl mb-2">{option.emoji}</span>
                  <span className="text-lg font-semibold">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </Button>
              ))}
            </div>
          )}

          {isBudgetStep(currentStepData) && (
            <BudgetRangeSelector
              value={preferences.priceRange as [number, number]}
              onChange={handleBudgetChange}
            />
          )}

          {isLocationStep(currentStepData) && (
            <CityDistrictSelector
              value={preferences.location as string[]}
              onChange={handleLocationChange}
            />
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button variant="secondary" onClick={handleBack}>
                Previous
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Complete</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
