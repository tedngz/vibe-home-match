
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserPreferences } from '@/pages/Index';
import { BudgetRangeSelector } from '@/components/BudgetRangeSelector';
import { CityDistrictSelector } from '@/components/CityDistrictSelector';
import { Heart, Sparkles, Home, MapPin, Calendar, DollarSign, Ruler } from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: (preferences: UserPreferences) => void;
  onSkip?: () => void;
}

export const OnboardingQuiz = ({ onComplete, onSkip }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);
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

  useEffect(() => {
    setShowContent(true);
    setIsAnimating(false);
  }, [currentStep]);

  const handleNext = () => {
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
    }, 150);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setShowContent(false);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
    }, 150);
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
      title: "Hey there! 👋 Let's find your dream home together!",
      subtitle: "I'm here to help you discover spaces that truly feel like *you*. What style makes your heart skip a beat?",
      type: "multi-select" as const,
      key: "styles" as keyof UserPreferences,
      icon: Sparkles,
      options: [
        { 
          id: 'modern', 
          label: 'Modern', 
          description: 'Clean lines, sleek vibes',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format'
        },
        { 
          id: 'cozy', 
          label: 'Cozy', 
          description: 'Warm hugs everywhere',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format'
        },
        { 
          id: 'industrial', 
          label: 'Industrial', 
          description: 'Raw, urban edge',
          image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400&h=300&fit=crop&auto=format'
        },
        { 
          id: 'bohemian', 
          label: 'Bohemian', 
          description: 'Artistic, free spirit',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format'
        },
        { 
          id: 'scandinavian', 
          label: 'Scandinavian', 
          description: 'Light, airy perfection',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&auto=format'
        },
        { 
          id: 'minimalist', 
          label: 'Minimalist', 
          description: 'Less is more magic',
          image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop&auto=format'
        }
      ]
    },
    {
      title: "Amazing choices! 🎨 Now, what colors speak to your soul?",
      subtitle: "Colors have this incredible power to transform how we feel in a space. Which palette makes you go 'yes, this is me!'?",
      type: "multi-select" as const,
      key: "colors" as keyof UserPreferences,
      icon: Heart,
      options: [
        { id: 'neutral', label: 'Peaceful Neutrals', emoji: '🤍', description: 'Calming whites & grays' },
        { id: 'warm', label: 'Warm Embrace', emoji: '🧡', description: 'Cozy oranges & reds' },
        { id: 'cool', label: 'Cool Serenity', emoji: '💙', description: 'Refreshing blues & greens' },
        { id: 'earth', label: 'Earthy Grounding', emoji: '🤎', description: 'Natural browns & terracotta' },
        { id: 'bold', label: 'Bold & Vibrant', emoji: '🌈', description: 'Life in full color!' }
      ]
    },
    {
      title: "Perfect! 🏠 Tell me about your home life...",
      subtitle: "Everyone uses their space differently. What activities make you happiest at home? (Don't worry, we won't judge if it's mostly Netflix!)",
      type: "multi-select" as const,
      key: "activities" as keyof UserPreferences,
      icon: Home,
      options: [
        { id: 'working', label: 'Focus Zone', emoji: '💻', description: 'Home office productivity' },
        { id: 'entertaining', label: 'Party Central', emoji: '🎉', description: 'Friends & gatherings' },
        { id: 'relaxing', label: 'Chill Master', emoji: '🛋️', description: 'Pure relaxation mode' },
        { id: 'cooking', label: 'Kitchen Wizard', emoji: '👨‍🍳', description: 'Culinary adventures' },
        { id: 'exercising', label: 'Home Gym Hero', emoji: '🏋️', description: 'Fitness at home' },
        { id: 'reading', label: 'Book Lover', emoji: '📚', description: 'Quiet reading nooks' }
      ]
    },
    {
      title: "Let's talk numbers! 💰 What's your comfort zone?",
      subtitle: "No judgment here - everyone has a budget! Let's find something amazing within yours. What range feels right?",
      type: "budget" as const,
      key: "priceRange" as keyof UserPreferences,
      icon: DollarSign
    },
    {
      title: "Space to breathe! 📏 How much room do you need?",
      subtitle: "Some love cozy spaces, others need room to spread out. What feels like 'just right' for your lifestyle?",
      type: "single-select" as const,
      key: "size" as keyof UserPreferences,
      icon: Ruler,
      options: [
        { id: 'studio', label: 'Cozy Studio', emoji: '🏠', description: 'Efficient & intimate' },
        { id: '1br', label: '1 Bedroom', emoji: '🛏️', description: 'Perfect for one or two' },
        { id: '2br', label: '2 Bedroom', emoji: '🏡', description: 'Room to grow' },
        { id: '3br+', label: '3+ Bedrooms', emoji: '🏘️', description: 'Space for everyone' }
      ]
    },
    {
      title: "Location, location! 📍 Where do you want to call home?",
      subtitle: "Jakarta has so many amazing neighborhoods! Which areas are calling your name? Pick as many as you'd like to explore.",
      type: "location" as const,
      key: "location" as keyof UserPreferences,
      icon: MapPin
    },
    {
      title: "Almost done! ⏰ When are you ready to make the move?",
      subtitle: "This helps me prioritize the perfect matches for you. Don't stress - we can always adjust as things change!",
      type: "single-select" as const,
      key: "moveInDate" as keyof UserPreferences,
      icon: Calendar,
      options: [
        { id: 'asap', label: 'Right Now!', emoji: '⚡', description: "I'm ready to go!" },
        { id: '1month', label: 'Within a Month', emoji: '📅', description: 'Soon but not rushing' },
        { id: '3months', label: 'Next 3 Months', emoji: '🗓️', description: 'Planning ahead' },
        { id: '6months', label: '6+ Months', emoji: '⏰', description: 'Just exploring for now' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <Card className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border-0 overflow-hidden">
          {/* Header with icon */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 md:p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              {currentStepData.icon && (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                  <currentStepData.icon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className={`text-center transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{currentStepData.title}</h2>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">{currentStepData.subtitle}</p>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="p-6 md:p-8">
            <div className={`min-h-[400px] flex items-center justify-center transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {currentStepData.type === "multi-select" && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected = ((preferences[currentStepData.key] as string[]) || []).includes(option.id);
                    return (
                      <Button
                        key={option.id}
                        variant="outline"
                        className={`h-auto p-0 flex flex-col items-center justify-center text-center overflow-hidden 
                          hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 rounded-2xl min-h-[200px]
                          animate-fade-in ${isSelected ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleMultiSelect(option.id, currentStepData.key)}
                      >
                        {currentStep === 0 && option.image ? (
                          <div className="w-full h-32 relative">
                            <img 
                              src={option.image} 
                              alt={option.label}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 transition-all duration-300 ${isSelected ? 'bg-purple-500/30' : 'bg-black/10'}`}></div>
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : option.emoji ? (
                          <div className={`w-full h-32 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-purple-50' : 'bg-gray-50'}`}>
                            <span className="text-5xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>{option.emoji}</span>
                          </div>
                        ) : null}
                        <div className="p-6 space-y-3 w-full flex-1 flex flex-col justify-center">
                          <span className={`font-bold text-lg transition-colors ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>{option.label}</span>
                          <div className={`text-sm leading-relaxed transition-colors ${isSelected ? 'text-purple-600' : 'text-gray-600'}`}>
                            {option.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === "single-select" && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
                  {currentStepData.options?.map((option, index) => {
                    const isSelected = preferences[currentStepData.key] === option.id;
                    return (
                      <Button
                        key={option.id}
                        variant="outline"
                        className={`h-auto p-6 flex flex-col items-center justify-center text-center space-y-4 
                          hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 rounded-2xl min-h-[180px]
                          animate-fade-in ${isSelected ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                        `}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handleSingleSelect(option.id, currentStepData.key)}
                      >
                        <span className="text-4xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>{option.emoji}</span>
                        <span className={`font-bold text-lg transition-colors ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>{option.label}</span>
                        <span className={`text-sm leading-relaxed transition-colors ${isSelected ? 'text-purple-600' : 'text-gray-600'}`}>{option.description}</span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-scale-in">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === "budget" && (
                <div className="w-full max-w-lg space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <DollarSign className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 mb-6">Drag the sliders to set your comfortable budget range</p>
                  </div>
                  <BudgetRangeSelector
                    value={preferences.priceRange as [number, number]}
                    onChange={handleBudgetChange}
                  />
                </div>
              )}

              {currentStepData.type === "location" && (
                <div className="w-full max-w-3xl space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <MapPin className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 mb-6">Select all the neighborhoods that interest you</p>
                  </div>
                  <CityDistrictSelector
                    value={preferences.location as string[]}
                    onChange={handleLocationChange}
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 0}
                className="min-w-[120px] rounded-full hover:shadow-lg transition-all duration-200"
              >
                ← Previous
              </Button>
              
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {currentStep < totalSteps - 1 ? (
                <Button 
                  onClick={handleNext} 
                  className="min-w-[120px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Next →
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="min-w-[120px] rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  🎉 Let's Go!
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
