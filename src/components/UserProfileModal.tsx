import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { User, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfileModalProps {
  userId: string;
  userType: 'renter' | 'realtor';
  isOpen: boolean;
  onClose: () => void;
  onMessage?: () => void;
}

interface ProfileInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export const UserProfileModal = ({ userId, userType, isOpen, onClose, onMessage }: UserProfileModalProps) => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (userType === 'realtor') {
        // Renter viewing realtor - get full contact info
        const { data, error } = await supabase.rpc('get_realtor_contact_for_renter', {
          realtor_id: userId
        });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      } else {
        // Realtor viewing renter - get basic info only (no phone/email)
        const { data, error } = await supabase.rpc('get_renter_profile_for_realtor', {
          renter_id: userId
        });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to basic profile info if RPC fails
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, bio')
        .eq('id', userId)
        .single();
      
      if (!profileError && data) {
        setProfile({
          id: data.id,
          name: data.name,
          bio: data.bio
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-500">
                  {userType === 'realtor' ? 'Licensed Realtor' : 'Renter'}
                </p>
              </div>
            </div>

            {/* Contact Information */}
            {(profile.email || profile.phone) && (
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    {profile.email && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{profile.email}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{profile.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bio */}
            {profile.bio && (
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">About</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              {onMessage && (
                <Button 
                  onClick={onMessage}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}
              {profile.phone && userType === 'realtor' && (
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              )}
            </div>

            {/* Privacy Notice for Realtors */}
            {userType === 'renter' && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <User className="w-3 h-3 mr-1 inline" />
                  Your contact information is only shared with matched realtors.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Profile not available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};