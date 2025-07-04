import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Home, MapPin, User, X } from 'lucide-react';
import { UserPreferences, Apartment } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';

interface SwipeInterfaceProps {
  userPreferences: UserPreferences;
  onMatch: (apartment: Apartment) => void;
}

// Mock apartment data
const MOCK_APARTMENTS: Apartment[] = [
  {
    id: '1',
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400'],
    title: 'Cozy Modern Loft',
    location: 'Brooklyn Heights',
    price: 2800,
    size: '1br',
    vibe: 'Urban Sanctuary',
    description: 'A perfect blend of industrial charm and cozy comfort. Exposed brick walls meet warm wooden accents, creating an inviting atmosphere perfect for both relaxation and entertaining.',
    highlights: ['Natural light', 'Exposed brick', 'Modern kitchen', 'Quiet neighborhood'],
    realtor: {
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah@homevibes.com'
    }
  },
  {
    id: '2',
    images: ['https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400'],
    title: 'Minimalist Studio',
    location: 'Manhattan',
    price: 2200,
    size: 'studio',
    vibe: 'Zen Retreat',
    description: 'Clean lines and neutral tones create a serene living space. Perfect for those who appreciate simplicity and mindful living in the heart of the city.',
    highlights: ['Floor-to-ceiling windows', 'Built-in storage', 'Hardwood floors', 'Gym access'],
    realtor: {
      name: 'Michael Chen',
      phone: '(555) 987-6543',
      email: 'michael@urbanspaces.com'
    }
  },
  {
    id: '3',
    images: ['https://images.unsplash.com/photo-1483058712412-e9573fc25ebb?w=400'],
    title: 'Bohemian Garden Apartment',
    location: 'Williamsburg',
    price: 3200,
    size: '2br',
    vibe: 'Creative Haven',
    description: 'Eclectic charm meets artistic flair in this unique space. Rich textures, vibrant colors, and plenty of plants create an inspiring environment for creative souls.',
    highlights: ['Private garden', 'High ceilings', 'Artist community', 'Pet-friendly'],
    realtor: {
      name: 'Emma Rodriguez',
      phone: '(555) 456-7890',
      email: 'emma@creativeliving.com'
    }
  }
];

export const SwipeInterface = ({ userPreferences, onMatch }: SwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
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
              src={currentApartment.images[0]} 
              alt={currentApartment.title}
              className="w-full h-64 object-cover"
            />
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
          
          <div className="p-6 space-y-4">
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
              <h4 className="font-semibold text-sm">Highlights:</h4>
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
