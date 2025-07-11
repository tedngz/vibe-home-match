
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, User, ChevronLeft, ChevronRight, RotateCcw, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { UserPreferences, Apartment } from '@/pages/Index';
import { UserProfile } from '@/components/LoginModal';
import { sampleProperties } from '@/data/sampleProperties';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useProperties, Property } from '@/hooks/useProperties';

interface SwipeInterfaceProps {
  userPreferences: UserPreferences;
  onMatch: (apartment: Apartment) => void;
  userProfile?: UserProfile;
  onRestartOnboarding?: () => void;
}

export const SwipeInterface = ({ userPreferences, onMatch, userProfile, onRestartOnboarding }: SwipeInterfaceProps) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [currentApartmentIndex, setCurrentApartmentIndex] = useState(0);
  const [likedApartmentIds, setLikedApartmentIds] = useState<string[]>([]);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [noMatchReason, setNoMatchReason] = useState<string>('');
  const [expandedDescription, setExpandedDescription] = useState(false);
  const { formatPrice } = useCurrency();
  const { properties: realProperties, isLoading } = useProperties();

  // Transform Property to Apartment
  const transformPropertyToApartment = (property: Property): Apartment => {
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
        name: 'Licensed Realtor', // Default name since we don't have realtor details
        phone: '+1-234-567-8900', // Default phone
        email: 'contact@realtor.com' // Default email
      }
    };
  };

  useEffect(() => {
    // Transform real properties to apartments
    const transformedRealProperties = (realProperties || []).map(transformPropertyToApartment);
    const allProperties = [...transformedRealProperties, ...sampleProperties];
    
    const filteredApartments = allProperties.filter(apartment => {
      const locationMatch = userPreferences.location.some(loc => 
        apartment.location.toLowerCase().includes(loc.toLowerCase())
      );
      
      const vibeScore = calculateVibeScore(apartment, userPreferences);
      const hasGoodVibeMatch = vibeScore.overall > 35;
      
      const [minPrice, maxPrice] = userPreferences.priceRange;
      const priceInRange = apartment.price <= maxPrice * 1.3;
      
      return locationMatch && hasGoodVibeMatch && priceInRange;
    })
    .sort((a, b) => {
      const scoreA = calculateVibeScore(a, userPreferences).overall;
      const scoreB = calculateVibeScore(b, userPreferences).overall;
      
      const aIsReal = realProperties?.some(p => p.id === a.id) || false;
      const bIsReal = realProperties?.some(p => p.id === b.id) || false;
      
      if (aIsReal && !bIsReal) return -1;
      if (!aIsReal && bIsReal) return 1;
      
      return scoreB - scoreA;
    });
    
    console.log(`Found ${filteredApartments.length} apartments matching preferences`);
    console.log(`Real properties: ${realProperties?.length || 0}, Sample properties: ${sampleProperties.length}`);
    
    setApartments(filteredApartments);
    
    if (filteredApartments.length === 0) {
      if (!realProperties || realProperties.length === 0) {
        setNoMatchReason('limited-listings');
      } else if (!userPreferences.location.length) {
        setNoMatchReason('no-location');
      } else {
        const locationMatch = allProperties.filter(apartment => 
          userPreferences.location.some(loc => 
            apartment.location.toLowerCase().includes(loc.toLowerCase())
          )
        );
        
        if (locationMatch.length === 0) {
          setNoMatchReason('no-location-match');
        } else {
          const [minPrice, maxPrice] = userPreferences.priceRange;
          const budgetMatch = locationMatch.filter(apartment => 
            apartment.price <= maxPrice * 1.3
          );
          
          if (budgetMatch.length === 0) {
            setNoMatchReason('budget-mismatch');
          } else {
            setNoMatchReason('style-mismatch');
          }
        }
      }
    }
  }, [userPreferences, realProperties]);

  const handleLike = () => {
    if (apartments.length === 0) return;
    const currentApartment = apartments[currentApartmentIndex];
    setLikedApartmentIds(prev => [...prev, currentApartment.id]);
    onMatch(currentApartment);
    nextApartment();
  };

  const handleDislike = () => {
    nextApartment();
  };

  const nextApartment = () => {
    if (currentApartmentIndex < apartments.length - 1) {
      setCurrentApartmentIndex(currentApartmentIndex + 1);
      setExpandedDescription(false);
    } else {
      // No more apartments available
      setNoMatchReason('no-more-matches');
    }
  };

  const prevImage = (apartmentId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [apartmentId]: prev[apartmentId] === 0 || !prev[apartmentId] 
        ? totalImages - 1 
        : prev[apartmentId] - 1
    }));
  };

  const nextImage = (apartmentId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [apartmentId]: ((prev[apartmentId] || 0) + 1) % totalImages
    }));
  };

  const getNoMatchMessage = () => {
    switch (noMatchReason) {
      case 'no-more-matches':
        return {
          title: "You've seen all available matches!",
          message: "You've reviewed all properties that match your current preferences. Great job exploring your options!",
          suggestion: "Consider adjusting your preferences to discover more properties, or ask Hausto AI for personalized recommendations."
        };
      case 'limited-listings':
        return {
          title: "Limited listings available",
          message: "We're still building our network of trusted realtors in your area. New properties are added regularly, so check back soon!",
          suggestion: "Try expanding your search to nearby districts or ask Hausto AI for personalized recommendations."
        };
      case 'no-location':
        return {
          title: "Location not specified",
          message: "You haven't selected any preferred locations. We need to know where you'd like to live to find suitable properties.",
          suggestion: "Restart your preferences to select your preferred areas."
        };
      case 'no-location-match':
        return {
          title: "No properties in selected areas",
          message: "We couldn't find any properties in your selected districts. Our realtor network is expanding to cover more areas.",
          suggestion: "Try selecting additional districts or ask Hausto AI about upcoming listings in your preferred areas."
        };
      case 'budget-mismatch':
        return {
          title: "Budget constraints",
          message: "Available properties in your selected areas are outside your budget range. Consider adjusting your budget or exploring different districts.",
          suggestion: "Restart your preferences to adjust your budget or ask Hausto AI for budget-friendly alternatives."
        };
      case 'style-mismatch':
        return {
          title: "Style preferences too specific",
          message: "Your style and lifestyle preferences are quite specific. While we have properties in your area and budget, none match your vibe preferences closely enough.",
          suggestion: "Consider broadening your style preferences or ask Hausto AI to find properties that might surprise you."
        };
      default:
        return {
          title: "No matches found",
          message: "We couldn't find properties that match all your criteria. This could be due to limited inventory or very specific preferences.",
          suggestion: "Try adjusting your preferences or ask Hausto AI for personalized recommendations."
        };
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Finding your perfect match</h3>
          <p className="text-gray-600">Searching through available properties...</p>
        </Card>
      </div>
    );
  }

  if (apartments.length === 0 || currentApartmentIndex >= apartments.length) {
    const noMatchInfo = getNoMatchMessage();
    
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md max-w-md">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{noMatchInfo.title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{noMatchInfo.message}</p>
          <p className="text-sm text-orange-600 mb-6 font-medium">{noMatchInfo.suggestion}</p>
          
          <div className="space-y-3">
            {onRestartOnboarding && (
              <Button 
                onClick={onRestartOnboarding}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Adjust Preferences
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              onClick={() => {
                console.log('Opening Hausto AI chat');
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Hausto AI
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentApartment = apartments[currentApartmentIndex];
  const vibeScore = calculateVibeScore(currentApartment, userPreferences);
  const currentImageIndex = imageIndices[currentApartment.id] || 0;
  const isRealProperty = realProperties?.some(p => p.id === currentApartment.id) || false;

  return (
    <div className="pt-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="overflow-hidden bg-white/80 backdrop-blur-md">
          <div className="relative">
            <img
              src={currentApartment.images[currentImageIndex]}
              alt={currentApartment.title}
              className="w-full h-64 object-cover"
            />
            
            {isRealProperty && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-500 text-white text-xs">
                  ✓ Verified Listing
                </Badge>
              </div>
            )}
            
            {currentApartment.images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
                  onClick={() => prevImage(currentApartment.id, currentApartment.images.length)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white p-0"
                  onClick={() => nextImage(currentApartment.id, currentApartment.images.length)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {currentApartment.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {currentApartment.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-gray-800 font-semibold">
                {formatPrice(currentApartment.price)}/mo
              </Badge>
            </div>

            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/20">
                <VibeScore score={vibeScore} size="sm" />
              </div>
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentApartment.title}</h2>
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              {currentApartment.location}
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 mb-4">
              {currentApartment.vibe}
            </Badge>

            <div className="mb-4">
              <VibeScore score={vibeScore} showBreakdown={true} size="sm" />
            </div>

            <div className="mb-4">
              <div className={`text-gray-700 text-sm leading-relaxed ${
                expandedDescription ? '' : 'line-clamp-3'
              }`}>
                {currentApartment.description}
              </div>
              {currentApartment.description && currentApartment.description.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-orange-600 hover:text-orange-700 mt-2"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                >
                  {expandedDescription ? (
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

            <div className="flex flex-wrap gap-1 mb-5">
              {currentApartment.highlights.slice(0, 3).map((highlight, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-white/50">
                  {highlight}
                </Badge>
              ))}
              {currentApartment.highlights.length > 3 && (
                <Badge variant="outline" className="text-xs bg-white/50">
                  +{currentApartment.highlights.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{currentApartment.realtor.name}</span>
                  <p className="text-xs text-gray-500">Licensed Realtor</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="destructive" size="lg" className="w-24" onClick={handleDislike}>
            <X className="w-5 h-5 mr-2" />
            Pass
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md w-24" size="lg" onClick={handleLike}>
            <Heart className="w-5 h-5 mr-2" />
            Like
          </Button>
        </div>
      </div>
    </div>
  );
};
