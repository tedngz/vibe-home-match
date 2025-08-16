import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { PropertyCard } from '@/components/PropertyCard';
import { ContactModal } from '@/components/ContactModal';
import { PropertyDetailModal } from '@/components/PropertyDetailModal';
import { UserProfile } from '@/components/LoginModal';
import { useMatches } from '@/hooks/useMatches';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MatchesViewProps {
  userPreferences?: UserPreferences;
  userProfile?: UserProfile;
}

export const MatchesView = ({ userPreferences, userProfile }: MatchesViewProps) => {
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [detailModalApartment, setDetailModalApartment] = useState<Apartment | null>(null);
  const { renterMatches, isLoadingMatches, removeMatch, isRemovingMatch } = useMatches();

  const transformMatchToApartment = (match: any): Apartment => {
    const rawVA = match.properties?.vibe_analysis;
    let parsedVA = rawVA;
    if (rawVA && typeof rawVA === 'string') {
      try { parsedVA = JSON.parse(rawVA); } catch { parsedVA = null; }
    }
    return {
      id: match.properties.id,
      images: match.properties.images || [],
      title: match.properties.title,
      location: match.properties.location,
      price: Number(match.properties.price),
      size: match.properties.size || '',
      vibe: match.properties.vibe || '',
      description: match.properties.description || '',
      highlights: match.properties.highlights || [],
      vibe_analysis: parsedVA,
      realtor: {
        id: match.properties.realtor_id || '',
        name: match.properties.profiles?.name || 'Licensed Realtor',
        phone: '+1-234-567-8900',
        email: 'contact@realtor.com'
      },
      matchId: match.id
    };
  };

  const handleRemoveMatch = async (matchId: string) => {
    await removeMatch(matchId);
  };

  if (isLoadingMatches) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const apartments = renterMatches?.map(transformMatchToApartment) || [];

  if (apartments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">💕</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
        <p className="text-gray-600 mb-6">Start swiping to find your perfect place!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Matches</h2>
        <p className="text-gray-600">Properties that match your preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map((apartment) => {
          return (
            <div key={apartment.id} className="relative">
                <PropertyCard
                  apartment={apartment}
                  userPreferences={userPreferences}
                  onContact={() => setSelectedApartment(apartment)}
                  showContactButton={true}
                  showFullTitle={true}
                  showFullDescription={false}
                  showAllHighlights={true}
                  className="sm:h-auto"
                />
              {apartment.matchId && (
                <div className="absolute top-4 right-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 w-8 h-8 p-0 bg-white/90 backdrop-blur-sm"
                        disabled={isRemovingMatch}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove from matches?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{apartment.title}" from your matches. You can always find it again by swiping.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleRemoveMatch(apartment.matchId!)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedApartment && (
        <ContactModal
          apartment={selectedApartment}
          onClose={() => setSelectedApartment(null)}
          userProfile={userProfile}
        />
      )}

      {detailModalApartment && (
        <PropertyDetailModal
          apartment={detailModalApartment}
          isOpen={!!detailModalApartment}
          onClose={() => setDetailModalApartment(null)}
          userPreferences={userPreferences}
        />
      )}
    </div>
  );
};