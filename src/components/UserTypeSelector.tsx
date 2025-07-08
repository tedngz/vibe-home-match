
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building, Sparkles } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelect: (type: 'renter' | 'realtor') => void;
}

export const UserTypeSelector = ({ onSelect }: UserTypeSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/e6e36f1b-c1ac-4aa8-a584-dac48543e870.png" 
              alt="Hausto Logo" 
              className="w-16 h-16 mr-4"
            />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Hausto
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-2">Find your perfect home match</p>
          <p className="text-slate-500">Choose how you'd like to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Renter Card */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I'm Looking for a Home</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Discover apartments that match your lifestyle and personality. Swipe through curated listings tailored just for you.
              </p>
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                  <span>Personalized recommendations</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                  <span>Direct realtor contact</span>
                </div>
              </div>
              <Button 
                onClick={() => onSelect('renter')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Swiping
              </Button>
            </div>
          </Card>

          {/* Realtor Card */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">I'm a Realtor</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Showcase your properties and connect with qualified renters. Upload listings and manage your portfolio with ease.
              </p>
              <div className="space-y-2 mb-8">
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Property management</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Qualified leads</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Analytics dashboard</span>
                </div>
              </div>
              <Button 
                onClick={() => onSelect('realtor')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Manage Properties
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            Join thousands of users who've found their perfect match
          </p>
        </div>
      </div>
    </div>
  );
};
