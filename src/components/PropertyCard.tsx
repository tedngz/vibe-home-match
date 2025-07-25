import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { VibeScore } from '@/components/VibeScore';
import { VibeScoreBar } from '@/components/VibeScoreBar';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PropertyCardProps {
  apartment: Apartment;
  userPreferences?: UserPreferences;
  onContact?: () => void;
  showContactButton?: boolean;
  className?: string;
}

// Helper function to categorize highlights
const categorizeHighlight = (highlight: string): 'style' | 'color' | 'activity' => {
  const lowerHighlight = highlight.toLowerCase();
  
  // Style keywords
  const styleKeywords = ['modern', 'traditional', 'minimalist', 'bohemian', 'industrial', 'scandinavian', 'contemporary', 'rustic', 'vintage', 'luxury', 'urban', 'cozy', 'sleek', 'elegant', 'chic'];
  
  // Color keywords  
  const colorKeywords = ['warm', 'cool', 'neutral', 'bold', 'bright', 'dark', 'colorful', 'white', 'black', 'grey', 'beige', 'wood', 'natural', 'light'];
  
  // Activity keywords
  const activityKeywords = ['working', 'entertaining', 'relaxing', 'cooking', 'exercising', 'reading', 'creating', 'dining', 'sleeping', 'studying', 'socializing'];
  
  for (const keyword of styleKeywords) {
    if (lowerHighlight.includes(keyword)) return 'style';
  }
  
  for (const keyword of colorKeywords) {
    if (lowerHighlight.includes(keyword)) return 'color';
  }
  
  for (const keyword of activityKeywords) {
    if (lowerHighlight.includes(keyword)) return 'activity';
  }
  
  // Default to style if no match
  return 'style';
};

export const PropertyCard = ({ 
  apartment, 
  userPreferences, 
  onContact, 
  showContactButton = true,
  className = ""
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { formatPrice } = useCurrency();
  
  const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);
  };

  return (
    <Card className={`bg-white/70 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Property Image */}
      <div className="relative h-48">
        <img
          src={apartment.images[currentImageIndex] || '/placeholder-property.jpg'}
          alt={apartment.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image navigation */}
        {apartment.images.length > 1 && (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image dots indicator */}
        {apartment.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {apartment.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          {/* Mobile: Title above vibe score */}
          <div className="block sm:hidden mb-3">
            <h3 className="font-bold text-lg text-gray-900">{apartment.title}</h3>
          </div>
          
          <div className="flex items-start justify-between mb-2">
            {/* Desktop: Title inline with vibe score */}
            <h3 className="hidden sm:block font-bold text-lg text-gray-900 flex-1 mr-3">{apartment.title}</h3>
            {vibeScore && <VibeScore score={vibeScore} size="sm" />}
          </div>
          
          {/* Score Breakdown */}
          {vibeScore && (
            <div className="bg-gray-50 p-3 rounded-lg mb-2">
              <VibeScoreBar score={vibeScore} showBreakdown={true} apartment={apartment} />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            {apartment.location}
          </div>
          <Badge className="bg-primary text-primary-foreground font-semibold">
            {formatPrice(apartment.price)}/mo
          </Badge>
        </div>

        <div className="mb-4">
          <div className="text-gray-700 text-sm leading-relaxed">
            {apartment.description}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">{apartment.realtor.name}</span>
              <p className="text-xs text-gray-500">Licensed Realtor</p>
            </div>
          </div>
          
          {showContactButton && onContact && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
              onClick={onContact}
            >
              Contact
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};