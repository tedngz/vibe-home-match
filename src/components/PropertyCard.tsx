import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, User, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { VibeScore } from '@/components/VibeScore';
import { VibeScoreBar } from '@/components/VibeScoreBar';
import { PropertyHighlightTags } from '@/components/PropertyHighlightTags';
import { PropertyImageModal } from '@/components/PropertyImageModal';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PropertyCardProps {
  apartment: Apartment;
  userPreferences?: UserPreferences;
  onContact?: () => void;
  showContactButton?: boolean;
  className?: string;
  showFullTitle?: boolean;
  showFullDescription?: boolean;
  showAllHighlights?: boolean;
}


export const PropertyCard = ({ 
  apartment, 
  userPreferences, 
  onContact, 
  showContactButton = true,
  className = "",
  showFullTitle = false,
  showFullDescription = false,
  showAllHighlights = false
}: PropertyCardProps) => {
  // Use provided image index from SwipeInterface or maintain own state
  const externalImageIndex = (apartment as any)._currentImageIndex;
  const [currentImageIndex, setCurrentImageIndex] = useState(externalImageIndex || 0);
  const [expandedDescription, setExpandedDescription] = useState(showFullDescription);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { formatPrice } = useCurrency();
  
  // Update internal image index when external index changes (for SwipeInterface)
  useEffect(() => {
    if (externalImageIndex !== undefined) {
      setCurrentImageIndex(externalImageIndex);
    }
  }, [externalImageIndex]);
  
  const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;

  // Highlight categorization and styling
  const getHighlightCategory = (highlight: string): 'style' | 'color' | 'activity' => {
    const h = highlight.toLowerCase();
    const style = ['modern','traditional','minimalist','bohemian','industrial','scandinavian','contemporary','rustic','vintage','luxury','urban','cozy','sleek','elegant','chic'];
    const color = ['warm','cool','neutral','bold','bright','dark','colorful','white','black','grey','beige','wood','natural','light'];
    const activity = ['working','entertaining','relaxing','cooking','exercising','reading','creating','dining','sleeping','studying','socializing'];
    if (style.some(k => h.includes(k))) return 'style';
    if (color.some(k => h.includes(k))) return 'color';
    if (activity.some(k => h.includes(k))) return 'activity';
    return 'style';
  };

  const categoryClasses: Record<'style' | 'color' | 'activity', string> = {
    style: 'border-primary/30 bg-primary/5',
    color: 'border-accent/30 bg-accent/10',
    activity: 'border-secondary/30 bg-secondary/10',
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);
  };

  return (
    <Card className={`bg-white/70 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Representative Property Image */}
      <div className="relative h-48">
        <img
          src={apartment.images[0] || '/placeholder-property.jpg'}
          alt={apartment.title}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => setIsImageModalOpen(true)}
        />
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-2">
          {/* Mobile: Title above vibe score */}
          <div className="block sm:hidden mb-3">
            <h2 className={`text-xl font-semibold text-gray-900 ${showFullTitle ? '' : 'line-clamp-2'}`}>{apartment.title}</h2>
          </div>
          
          <div className="flex items-start justify-between mb-2">
            {/* Desktop: Title inline with vibe score */}
            <h2 className={`hidden sm:block text-xl font-semibold text-gray-900 flex-1 mr-3 ${showFullTitle ? '' : 'line-clamp-2'}`}>{apartment.title}</h2>
            {vibeScore && <VibeScore score={vibeScore} size="sm" />}
          </div>
          
          {/* Detailed Score Breakdown */}
          {vibeScore && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <VibeScoreBar score={vibeScore} showBreakdown={true} apartment={apartment} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm mb-3 gap-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{apartment.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {formatPrice(apartment.price)}/mo
            </Badge>
            {apartment.size && (
              <Badge variant="outline" className="text-xs">
                {apartment.size}
              </Badge>
            )}
          </div>
        </div>

        {apartment.description && (
          <div className="mb-4">
            <div className={`text-gray-700 text-sm leading-relaxed ${expandedDescription ? '' : 'line-clamp-3'}`}>
              {apartment.description}
            </div>
            {apartment.description && apartment.description.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-orange-600 hover:text-orange-700 mt-1"
                onClick={() => setExpandedDescription(!expandedDescription)}
              >
                {expandedDescription ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Read less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Read more
                  </>
                )}
              </Button>
            )}
            
            {/* Additional Images with Highlights */}
            {apartment.images.length > 1 && (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">More Photos</p>
                <div className="space-y-4">
                  {apartment.images.slice(1).map((image, index) => {
                    const highlights = apartment.vibe_analysis?.generated_content?.highlights || [];
                    const associatedHighlight = highlights[index % highlights.length];
                    
                    return (
                      <div key={index} className="space-y-2">
                        {associatedHighlight && (
                        <span className="text-xs text-primary">
                          {associatedHighlight}
                        </span>
                        )}
                        <div className="relative h-48">
                          <img
                            src={image}
                            alt={`${apartment.title} - Image ${index + 2}`}
                            className="w-full h-full object-cover rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              setCurrentImageIndex(index + 1);
                              setIsImageModalOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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

      {/* Full-size image modal */}
      <PropertyImageModal
        apartment={apartment}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        initialImageIndex={currentImageIndex}
      />
    </Card>
  );
};