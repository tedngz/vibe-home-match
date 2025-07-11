
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/hooks/useProperties';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';

interface PropertyPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const PropertyPreviewModal = ({ isOpen, onClose, property }: PropertyPreviewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { formatPrice } = useCurrency();

  if (!isOpen || !property) return null;

  const images = property.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Property Preview</h2>
            <p className="text-gray-600">How your listing appears to renters</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative mb-6">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Property Details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-500">per month</div>
              </div>
            </div>

            {/* Property Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-b py-3">
              {property.size && (
                <div className="flex items-center">
                  <Maximize2 className="w-4 h-4 mr-1" />
                  {property.size}
                </div>
              )}
              {property.vibe && (
                <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800">
                  {property.vibe}
                </Badge>
              )}
            </div>

            {/* Vibes/Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Property Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {property.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {property.description}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
