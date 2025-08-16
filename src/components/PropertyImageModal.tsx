import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Apartment } from '@/pages/Index';

interface PropertyImageModalProps {
  apartment: Apartment;
  isOpen: boolean;
  onClose: () => void;
  initialImageIndex?: number;
}

export const PropertyImageModal = ({ 
  apartment, 
  isOpen, 
  onClose, 
  initialImageIndex = 0 
}: PropertyImageModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);
  };

  // Get AI generated highlights for overlay
  const aiHighlights = apartment.vibe_analysis?.generated_content?.highlights || [];
  const selectedHighlight = aiHighlights.length > 0 ? aiHighlights[currentImageIndex % aiHighlights.length] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-4xl h-[85vh] sm:h-[90vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="relative w-full h-full bg-transparent">

          {/* Main image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={apartment.images[currentImageIndex] || '/placeholder-property.jpg'}
              alt={apartment.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* AI Highlights overlay */}
            {selectedHighlight && (
              <div className="absolute top-3 left-3 z-10">
                <span className="text-sm text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                  {selectedHighlight}
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            {apartment.images.length > 1 && (
              <>
                <Button
                  size="lg"
                  variant="ghost"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Image counter and dots */}
          {apartment.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-3">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {apartment.images.length}
                </span>
                <div className="flex space-x-1">
                  {apartment.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};