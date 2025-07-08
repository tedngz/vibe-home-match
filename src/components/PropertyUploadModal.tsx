
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Sparkles, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyUploadModal = ({ isOpen, onClose }: PropertyUploadModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const vibeOptions = [
    'Modern Minimalist', 'Cozy Traditional', 'Urban Chic', 'Bohemian Eclectic',
    'Industrial Loft', 'Scandinavian Clean', 'Vintage Charm', 'Luxury Executive',
    'Artistic Creative', 'Family Friendly', 'Young Professional', 'Pet Friendly'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const generateVibeDescription = async () => {
    if (!title || selectedVibes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add a title and select at least one vibe before generating description.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const vibeText = selectedVibes.join(', ');
      const generatedDescription = `Welcome to this stunning ${vibeText.toLowerCase()} property that perfectly embodies ${selectedVibes[0].toLowerCase()} living. This exceptional residence features carefully curated spaces that blend comfort with style, creating an atmosphere that truly feels like home.

The open-concept design maximizes natural light and creates a seamless flow between living areas, perfect for both relaxation and entertainment. Every detail has been thoughtfully selected to enhance the ${selectedVibes[0].toLowerCase()} aesthetic while maintaining functionality for modern living.

Located in a vibrant neighborhood, you'll enjoy easy access to local amenities, dining, and transportation. This is more than just a rental - it's a lifestyle choice that reflects your personal style and values.

Experience the perfect harmony of design, comfort, and location that makes this property truly special.`;
      
      setDescription(generatedDescription);
      setIsGenerating(false);
      
      toast({
        title: "Description Generated!",
        description: "AI has created a compelling property description highlighting the selected vibes.",
      });
    }, 2000);
  };

  const handleSubmit = () => {
    if (!title || !location || !price || images.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload at least one image.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Property Listed!",
      description: "Your property has been successfully added to the platform.",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload New Property</h2>
            <p className="text-gray-600">Create an AI-powered listing that highlights your property's vibe</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="images" className="text-base font-semibold">Property Images *</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload property images</p>
                </div>
                <input 
                  id="images" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, index) => (
                    <img key={index} src={img} alt={`Property ${index + 1}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Stunning Downtown Loft"
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Downtown San Francisco"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Monthly Rent *</Label>
              <Input 
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 3500"
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input 
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., 1200 sq ft"
              />
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <Label className="text-base font-semibold">Property Vibes</Label>
            <p className="text-sm text-gray-600 mb-3">Select vibes that best describe your property</p>
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((vibe) => (
                <Badge
                  key={vibe}
                  variant={selectedVibes.includes(vibe) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    selectedVibes.includes(vibe) 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedVibes(prev => 
                      prev.includes(vibe) 
                        ? prev.filter(v => v !== vibe)
                        : [...prev, vibe]
                    );
                  }}
                >
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Description Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description" className="text-base font-semibold">Property Description</Label>
              <Button
                onClick={generateVibeDescription}
                disabled={isGenerating}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what makes this property special..."
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              List Property
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
