
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MessageSquare, Bell, User, LogOut } from 'lucide-react';
import { PropertyUploadModal } from '@/components/PropertyUploadModal';
import { MessagingModal } from '@/components/MessagingModal';
import { Match } from '@/pages/Index';

interface RealtorDashboardProps {
  matches: Match[];
  onSwitchUserType: () => void;
}

export const RealtorDashboard = ({ matches, onSwitchUserType }: RealtorDashboardProps) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);

  const unreadMatches = matches.filter(match => !match.read).length;

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/e6e36f1b-c1ac-4aa8-a584-dac48543e870.png" 
              alt="Hausto Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Realtor Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Manage your properties and connections</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMessaging(true)}
                className="relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Matches
                {unreadMatches > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                    {unreadMatches}
                  </Badge>
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchUserType}
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Switch to Renter
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Add New Property</h3>
              <p className="text-sm text-gray-600 mb-4">Upload images and create AI-powered listings</p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                size="sm"
              >
                Upload Property
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Messages</h3>
              <p className="text-sm text-gray-600 mb-4">Connect with interested renters</p>
              <Button 
                onClick={() => setShowMessaging(true)}
                variant="outline"
                className="w-full"
                size="sm"
              >
                View Messages
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Active Matches</h3>
              <p className="text-sm text-gray-600 mb-4">{matches.length} potential renters</p>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800">
                {matches.length} Matches
              </Badge>
            </div>
          </Card>
        </div>

        {/* Recent Matches */}
        <Card className="bg-white/70 backdrop-blur-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Matches</h2>
            <p className="text-gray-600 text-sm">Renters who showed interest in your properties</p>
          </div>
          <div className="p-6">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No matches yet</h3>
                <p className="text-gray-500">Upload your first property to start connecting with renters!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.slice(0, 5).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">New Match</h4>
                        <p className="text-sm text-gray-600">{match.apartment.title}</p>
                        <p className="text-xs text-gray-500">{match.timestamp.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedMatch(match);
                        setShowMessaging(true);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <PropertyUploadModal onClose={() => setShowUploadModal(false)} />
      )}

      {showMessaging && (
        <MessagingModal 
          matches={matches}
          selectedMatch={selectedMatch}
          onClose={() => {
            setShowMessaging(false);
            setSelectedMatch(null);
          }}
        />
      )}
    </div>
  );
};
