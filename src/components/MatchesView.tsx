
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Heart } from 'lucide-react';
import { Apartment } from '@/pages/Index';
import { ContactModal } from '@/components/ContactModal';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';
import { UserPreferences } from '@/pages/Index';

interface MatchesViewProps {
  matches: Apartment[];
  userPreferences?: UserPreferences;
}

export const MatchesView = ({ matches, userPreferences }: MatchesViewProps) => {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  if (matches.length === 0) {
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Your Matches
          </h2>
          <p className="text-gray-600 mt-1">{matches.length} perfect vibe{matches.length !== 1 ? 's' : ''} found!</p>
        </div>

        <div className="space-y-4">
          {matches.map((apartment) => {
            const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;
            
            return (
              <Card key={apartment.id} className="overflow-hidden bg-white/70 backdrop-blur-md hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="relative">
                    <img 
                      src={apartment.images[0]} 
                      alt={apartment.title}
                      className="w-32 h-32 object-cover"
                    />
                    {vibeScore && (
                      <div className="absolute top-2 left-2">
                        <VibeScore score={vibeScore} size="sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{apartment.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-3 h-3 mr-1" />
                          {apartment.location}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ${apartment.price}/mo
                      </Badge>
                    </div>

                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 mb-2">
                      {apartment.vibe}
                    </Badge>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {apartment.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium">{apartment.realtor.name}</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
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
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
};
