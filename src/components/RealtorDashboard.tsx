
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, User, MapPin, ArrowLeftRight, Upload, Edit, Trash2 } from 'lucide-react';
import { PropertyUploadModal } from '@/components/PropertyUploadModal';
import { MessagingModal } from '@/components/MessagingModal';
import { useProperties } from '@/hooks/useProperties';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Match } from '@/pages/Index';

interface RealtorDashboardProps {
  matches: Match[];
  onSwitchUserType: () => void;
}

export const RealtorDashboard = ({ matches, onSwitchUserType }: RealtorDashboardProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { realtorProperties, isLoading } = useProperties();
  const { formatPrice } = useCurrency();

  const unreadMatches = matches.filter(match => !match.timestamp || new Date(match.timestamp).getTime() > Date.now() - 86400000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/e6e36f1b-c1ac-4aa8-a584-dac48543e870.png" 
              alt="Hausto Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Realtor Dashboard
              </h1>
              <p className="text-slate-600">Manage your properties and connect with renters</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button
              variant="outline"
              onClick={onSwitchUserType}
              className="border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Switch to Renter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Listed Properties</p>
                <p className="text-2xl font-bold text-slate-900">{realtorProperties.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Matches</p>
                <p className="text-2xl font-bold text-slate-900">{matches.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">New Today</p>
                <p className="text-2xl font-bold text-slate-900">{unreadMatches.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* My Properties */}
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">My Properties</h2>
            <p className="text-slate-600 text-sm">Manage your listed properties</p>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-600">Loading properties...</p>
              </div>
            ) : realtorProperties.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No properties yet</h3>
                <p className="text-slate-600">Upload your first property to start getting matches!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {realtorProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow">
                    {property.images && property.images.length > 0 && (
                      <div className="relative">
                        <img 
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-slate-800 font-semibold">
                            {formatPrice(property.price)}/mo
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{property.title}</h3>
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.location}
                      </div>
                      {property.vibe && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 mb-3">
                          {property.vibe}
                        </Badge>
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Matches */}
        <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Recent Matches</h2>
            <p className="text-slate-600 text-sm">Renters interested in your properties</p>
          </div>
          
          <div className="p-6">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No matches yet</h3>
                <p className="text-slate-600">Your properties will start getting matches once renters discover them!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={match.apartment.images[0]}
                        alt={match.apartment.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium text-slate-900">{match.apartment.title}</h3>
                        <div className="flex items-center text-sm text-slate-600 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {match.apartment.location}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                            {formatPrice(match.apartment.price)}/mo
                          </Badge>
                          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800">
                            {match.apartment.vibe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(match.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(match.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedMatch(match)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <PropertyUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {selectedMatch && (
        <MessagingModal 
          selectedMatch={selectedMatch}
          matches={[selectedMatch]}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};
