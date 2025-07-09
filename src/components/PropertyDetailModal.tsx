
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, User, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Apartment, UserPreferences } from '@/pages/Index';
import { calculateVibeScore } from '@/utils/vibeScoring';
import { VibeScore } from '@/components/VibeScore';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PropertyDetailModalProps {
  apartment: Apartment | null;
  userPreferences?: UserPreferences;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (apartment: Apartment) => void;
  onDislike?: (apartment: Apartment) => void;
}

export const PropertyDetailModal = ({ 
  apartment, 
  userPreferences, 
  isOpen, 
  onClose, 
  onLike, 
  onDislike 
}: PropertyDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { formatPrice } = useCurrency();

  if (!apartment) return null;

  const vibeScore = userPreferences ? calculateVibeScore(apartment, userPreferences) : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? apartment.images.length - 1 : prev - 1
    );
  };

  const handleLike = () => {
    if (onLike) {
      onLike(apartment);
    }
    onClose();
  };

  const handleDislike = () => {
    if (onDislike) {
      onDislike(apartment);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{apartment.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image Gallery */}
          <div className="relative">
            <img
              src={apartment.images[currentImageIndex]}
              alt={apartment.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
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

            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-gray-800 font-semibold">
                {formatPrice(apartment.price)}/mo
              </Badge>
            </div>

            {vibeScore && (
              <div className="absolute top-3 left-3">
                <VibeScore score={vibeScore} size="sm" />
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              {apartment.location}
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800">
                {apartment.vibe}
              </Badge>
              <Badge variant="outline">{apartment.size}</Badge>
            </div>

            {vibeScore && (
              <VibeScore score={vibeScore} showBreakdown={true} size="sm" />
            )}

            <p className="text-gray-700 text-sm leading-relaxed">
              {apartment.description}
            </p>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {apartment.highlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="p-3 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{apartment.realtor.name}</p>
                  <p className="text-sm text-gray-500">Licensed Realtor</p>
                  <p className="text-xs text-gray-400">{apartment.realtor.phone}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          {(onLike || onDislike) && (
            <div className="flex justify-center space-x-4 pt-4 border-t">
              {onDislike && (
                <Button variant="destructive" size="lg" className="w-24" onClick={handleDislike}>
                  <X className="w-5 h-5 mr-2" />
                  Pass
                </Button>
              )}
              {onLike && (
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md w-24" 
                  size="lg" 
                  onClick={handleLike}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Like
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
