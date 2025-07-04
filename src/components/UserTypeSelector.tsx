
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Building } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelect: (type: 'renter' | 'realtor') => void;
}

export const UserTypeSelector = ({ onSelect }: UserTypeSelectorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/e6e36f1b-c1ac-4aa8-a584-dac48543e870.png" 
              alt="Hausto Logo" 
              className="w-12 h-12"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Hausto
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Choose your experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 backdrop-blur-md"
                onClick={() => onSelect('renter')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">I'm Looking for a Home</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Find your perfect rental property by swiping through curated listings that match your vibe and lifestyle preferences.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                size="lg"
              >
                Start Swiping
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/70 backdrop-blur-md"
                onClick={() => onSelect('realtor')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">I'm a Realtor</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload and manage your property listings with AI-powered vibe descriptions and connect directly with interested renters.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                size="lg"
              >
                Manage Properties
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
