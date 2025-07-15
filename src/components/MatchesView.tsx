
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Heart, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { ContactModal } from '@/components/ContactModal';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';
import { VibeScoreBar } from '@/components/VibeScoreBar';
import { UserProfile } from '@/components/LoginModal';
import { useMatches } from '@/hooks/useMatches';
import { useCurrency } from '@/contexts/CurrencyContext';

interface MatchesViewProps {
  userPreferences?: UserPreferences;
  userProfile?: UserProfile;
}

export const MatchesView = ({ userPreferences, userProfile }: MatchesViewProps) => {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const { renterMatches, isLoadingMatches } = useMatches();
  const { formatPrice } = useCurrency();

  const nextImage = (apartmentId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [apartmentId]: ((prev[apartmentId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (apartmentId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [apartmentId]: prev[apartmentId] === 0 || !prev[apartmentId] 
        ? totalImages - 1 
        : prev[apartmentId] - 1
    }));
  };

  const toggleDescription = (apartmentId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [apartmentId]: !prev[apartmentId]
    }));
  };

  // Transform PropertyMatch to Apartment
  const transformMatchToApartment = (match: any): Apartment => {
    const property = match.properties;
    return {
      id: property.id,
      images: property.images || [],
      title: property.title,
      location: property.location,
      price: Number(property.price),
      size: property.size || '',
      vibe: property.vibe || '',
      description: property.description || '',
      highlights: property.highlights || [],
      realtor: {
        id: property.realtor_id,
        name: 'Licensed Realtor',
        phone: '+1-234-567-8900',
        email: 'contact@realtor.com'
      }
    };
  };

  const apartments = renterMatches.map(transformMatchToApartment);

  if (isLoadingMatches) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Loading your matches</h3>
          <p className="text-gray-600">Finding your perfect properties...</p>
        </Card>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
          <p className="text-gray-600">Start swiping to find your perfect home!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Your Matches
          </h2>
          <p className="text-gray-600 mt-1">{apartments.length} perfect vibe{apartments.length !== 1 ? 's' : ''} found!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {apartments.map((apartment) => {
            const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;
            const currentImageIndex = imageIndices[apartment.id] || 0;
            const isExpanded = expandedDescriptions[apartment.id] || false;
            
            return (
              <Card key={apartment.id} className="overflow-hidden bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="relative">
                  <img 
                    src={apartment.images[currentImageIndex]} 
                    alt={apartment.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Image navigation for multiple images */}
                  {apartment.images.length > 1 && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
                        onClick={() => prevImage(apartment.id, apartment.images.length)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
                        onClick={() => nextImage(apartment.id, apartment.images.length)}
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
                
                <div className="p-5">
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 flex-1 mr-3">{apartment.title}</h3>
                      {vibeScore && <VibeScore score={vibeScore} size="sm" />}
                    </div>
                    
                    {/* Score Breakdown */}
                    {vibeScore && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-2">
                        <VibeScoreBar score={vibeScore} showBreakdown={true} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {apartment.location}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                      {apartment.vibe}
                    </Badge>
                    <Badge className="bg-primary text-primary-foreground font-semibold">
                      {formatPrice(apartment.price)}/mo
                    </Badge>
                  </div>


                  <div className="mb-4">
                    <div className={`text-gray-700 text-sm leading-relaxed ${
                      isExpanded ? '' : 'line-clamp-3'
                    }`}>
                      {apartment.description}
                    </div>
                    {apartment.description && apartment.description.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-orange-600 hover:text-orange-700 mt-2"
                        onClick={() => toggleDescription(apartment.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Read more
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Key highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {apartment.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-white/50">
                          {highlight}
                        </Badge>
                      ))}
                      {apartment.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-white/50">
                          +{apartment.highlights.length - 3} more
                        </Badge>
                      )}
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
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
                        onClick={() => setSelectedApartment(apartment)}
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedApartment && (
        <ContactModal 
          apartment={selectedApartment}
          userProfile={userProfile}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
};
