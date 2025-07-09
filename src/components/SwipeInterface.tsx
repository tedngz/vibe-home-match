import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MapPin, User, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { UserPreferences, Apartment } from '@/pages/Index';
import { UserProfile } from '@/components/LoginModal';
import { sampleProperties } from '@/data/sampleProperties';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';
import { useCurrency } from '@/contexts/CurrencyContext';

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
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // Filter apartments based on user preferences and vibe score > 40%
    const filteredApartments = sampleProperties.filter(apartment => {
      // Basic filtering logic
      const locationMatch = userPreferences.location.some(loc => 
        apartment.location.toLowerCase().includes(loc.toLowerCase())
      );
      
      // Calculate vibe score and only show apartments with score > 40%
      const vibeScore = calculateVibeScore(apartment, userPreferences);
      const hasGoodVibeMatch = vibeScore.overall > 40;
      
      // Check if price is within reasonable range (allow some flexibility)
      const [minPrice, maxPrice] = userPreferences.priceRange;
      const priceInRange = apartment.price <= maxPrice * 1.2; // Allow 20% over budget
      
      return locationMatch && hasGoodVibeMatch && priceInRange;
    })
    .sort((a, b) => {
      // Sort by vibe score (highest first)
      const scoreA = calculateVibeScore(a, userPreferences).overall;
      const scoreB = calculateVibeScore(b, userPreferences).overall;
      return scoreB - scoreA;
    });
    
    console.log(`Found ${filteredApartments.length} apartments with vibe score > 40%`);
    setApartments(filteredApartments);
  }, [userPreferences]);

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
    } else {
      alert("No more apartments available. Check back later!");
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

  if (apartments.length === 0) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md max-w-md">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No good matches found</h3>
          <p className="text-gray-600 mb-6">We couldn't find any apartments with a strong vibe match (&gt;40%) in your selected areas. Try adjusting your preferences or exploring different districts!</p>
          {onRestartOnboarding && (
            <Button 
              onClick={onRestartOnboarding}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Preferences Quiz
            </Button>
          )}
        </Card>
      </div>
    );
  }

  const currentApartment = apartments[currentApartmentIndex];
  const vibeScore = calculateVibeScore(currentApartment, userPreferences);
  const currentImageIndex = imageIndices[currentApartment.id] || 0;

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

            <div className="absolute top-3 left-3">
              <VibeScore score={vibeScore} size="sm" />
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xl font-semibold text-gray-900">{currentApartment.title}</h2>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {currentApartment.location}
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 mt-3">
              {currentApartment.vibe}
            </Badge>

            <div className="mt-4">
              <VibeScore score={vibeScore} showBreakdown={true} size="sm" />
            </div>

            <p className="text-gray-700 text-sm mt-4 line-clamp-3 leading-relaxed">
              {currentApartment.description}
            </p>

            <div className="flex flex-wrap gap-1 mt-4">
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

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-5">
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
