
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Home, MapPin, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserPreferences, Apartment } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';

interface SwipeInterfaceProps {
  userPreferences: UserPreferences;
  onMatch: (apartment: Apartment) => void;
}

// Enhanced mock apartment data with multiple images and detailed descriptions
const MOCK_APARTMENTS: Apartment[] = [
  {
    id: '1',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    ],
    title: 'Cozy Modern Loft',
    location: 'Brooklyn Heights',
    price: 2800,
    size: '1br',
    vibe: 'Urban Sanctuary',
    description: 'Step into your own urban retreat where industrial meets comfort. This stunning loft features soaring 12-foot ceilings, exposed brick walls that tell stories of Brooklyn\'s rich history, and floor-to-ceiling windows that flood the space with natural light throughout the day. The open-concept design seamlessly blends living, dining, and kitchen areas, perfect for both intimate evenings and entertaining friends. Premium hardwood floors warm the industrial elements, while the modern kitchen boasts stainless steel appliances and granite countertops. Located in the heart of Brooklyn Heights, you\'re just minutes from the waterfront promenade with breathtaking Manhattan skyline views.',
    highlights: ['12ft ceilings', 'Exposed brick walls', 'Floor-to-ceiling windows', 'Waterfront proximity', 'Hardwood floors', 'Modern kitchen'],
    realtor: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@homevibes.com'
    }
  },
  {
    id: '2',
    images: [
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'
    ],
    title: 'Minimalist Zen Studio',
    location: 'Manhattan',
    price: 2200,
    size: 'studio',
    vibe: 'Zen Retreat',
    description: 'Find your inner peace in this thoughtfully designed minimalist haven. Every element has been carefully curated to promote tranquility and mindful living. Clean lines, neutral tones, and strategic lighting create a serene atmosphere that feels like a daily retreat from the bustling city below. The studio maximizes every square foot with built-in storage solutions that maintain the clutter-free aesthetic. Premium bamboo flooring adds warmth while remaining sustainable. The spa-like bathroom features a rainfall shower and natural stone accents. Building amenities include a meditation garden, fitness center, and rooftop terrace - perfect for your wellness journey in the heart of Manhattan.',
    highlights: ['Bamboo flooring', 'Built-in storage', 'Spa-like bathroom', 'Meditation garden', 'Fitness center', 'Rooftop terrace'],
    realtor: {
      name: 'Michael Chen',
      phone: '(555) 987-6543',
      email: 'michael@urbanspaces.com'
    }
  },
  {
    id: '3',
    images: [
      'https://images.unsplash.com/photo-1483058712412-e9573fc25ebb?w=400',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400'
    ],
    title: 'Bohemian Garden Apartment',
    location: 'Williamsburg',
    price: 3200,
    size: '2br',
    vibe: 'Creative Haven',
    description: 'Unleash your creativity in this vibrant, eclectic sanctuary that celebrates artistic expression. Rich textures, warm earth tones, and carefully curated vintage pieces create an inspiring environment where imagination flourishes. The apartment features dramatic 14-foot ceilings, original hardwood floors, and oversized windows that frame your private garden oasis. The kitchen is a chef\'s dream with vintage-inspired fixtures and plenty of space for culinary creativity. Both bedrooms offer unique character with built-in reading nooks and custom shelving for your book collection. The private garden is your own secret escape - perfect for morning coffee, evening wine, or hosting intimate gatherings under string lights.',
    highlights: ['Private garden oasis', '14ft cathedral ceilings', 'Chef\'s kitchen', 'Reading nooks', 'Artist community', 'Vintage character'],
    realtor: {
      name: 'Emma Rodriguez',
      phone: '(555) 456-7890',
      email: 'emma@creativeliving.com'
    }
  }
];

export const SwipeInterface = ({ userPreferences, onMatch }: SwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentApartment = MOCK_APARTMENTS[currentIndex];
  const vibeScore = currentApartment ? calculateVibeScore(currentApartment, userPreferences) : null;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      onMatch(currentApartment);
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % MOCK_APARTMENTS.length);
      setCurrentImageIndex(0); // Reset image index for new apartment
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const nextImage = () => {
    if (currentApartment) {
      setCurrentImageIndex(prev => (prev + 1) % currentApartment.images.length);
    }
  };

  const prevImage = () => {
    if (currentApartment) {
      setCurrentImageIndex(prev => prev === 0 ? currentApartment.images.length - 1 : prev - 1);
    }
  };

  if (!currentApartment) {
    return (
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-2">No more apartments!</h3>
          <p className="text-gray-600">Check back later for new listings.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-24 min-h-screen">
      <div className="max-w-sm mx-auto">
        <Card 
          className={`relative overflow-hidden bg-white shadow-2xl transition-transform duration-300 ${
            isAnimating ? (swipeDirection === 'left' ? '-translate-x-full rotate-12' : 'translate-x-full rotate-12') : ''
          }`}
        >
          <div className="relative">
            <img 
              src={currentApartment.images[currentImageIndex]} 
              alt={currentApartment.title}
              className="w-full h-64 object-cover"
            />
            
            {/* Image navigation buttons */}
            {currentApartment.images.length > 1 && (
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

            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-gray-800">
                ${currentApartment.price}/mo
              </Badge>
            </div>
            {vibeScore && (
              <div className="absolute top-4 left-4">
                <VibeScore score={vibeScore} size="sm" />
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold">{currentApartment.title}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{currentApartment.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800">
                {currentApartment.vibe}
              </Badge>
              <span className="text-sm font-medium text-gray-600">
                {currentApartment.size.toUpperCase()}
              </span>
            </div>

            {vibeScore && (
              <VibeScore score={vibeScore} showBreakdown={true} size="sm" />
            )}

            <p className="text-gray-700 text-sm leading-relaxed">
              {currentApartment.description}
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Key Features:</h4>
              <div className="flex flex-wrap gap-2">
                {currentApartment.highlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{currentApartment.realtor.name}</p>
                  <p className="text-xs text-gray-600">Licensed Realtor</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center space-x-8 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
          >
            <Heart className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
