import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Building,
  Heart,
  MessageCircle,
  TrendingUp,
  Home,
  Palette,
  Activity,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProfileProps {
  userType: 'renter' | 'realtor';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  preferences?: any;
}

// Preferences card component for renters
const PreferencesCard = ({ userId }: { userId?: string }) => {
  const { formatPrice } = useCurrency();
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // Get preferences from localStorage since that's where they're stored
      const stored = localStorage.getItem(`userPreferences_${userId}`);
      return stored ? JSON.parse(stored) : null;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Complete the onboarding quiz to see your preferences here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const styleLabels: { [key: string]: string } = {
    'modern': 'Modern',
    'traditional': 'Traditional',
    'minimalist': 'Minimalist',
    'bohemian': 'Bohemian',
    'industrial': 'Industrial',
    'scandinavian': 'Scandinavian'
  };

  const colorLabels: { [key: string]: string } = {
    'warm': 'Warm tones',
    'cool': 'Cool tones', 
    'neutral': 'Neutral colors',
    'bold': 'Bold colors'
  };

  const activityLabels: { [key: string]: string } = {
    'working': 'Working from home',
    'entertaining': 'Entertaining guests',
    'relaxing': 'Relaxing & unwinding',
    'cooking': 'Cooking & dining',
    'exercising': 'Exercising',
    'reading': 'Reading',
    'creating': 'Creative activities'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Your Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Style Preferences */}
        {preferences.styles?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-sm">Style</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.styles.map((style: string) => (
                <Badge key={style} variant="secondary" className="bg-blue-50 text-blue-700">
                  {styleLabels[style] || style}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Color Preferences */}
        {preferences.colors?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-sm">Colors</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.colors.map((color: string) => (
                <Badge key={color} variant="secondary" className="bg-purple-50 text-purple-700">
                  {colorLabels[color] || color}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Activity Preferences */}
        {preferences.activities?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="font-medium text-sm">Activities</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.activities.map((activity: string) => (
                <Badge key={activity} variant="secondary" className="bg-green-50 text-green-700">
                  {activityLabels[activity] || activity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Budget Range */}
        {preferences.priceRange && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-sm">Budget Range</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm text-orange-700 mb-2">
                <span>{formatPrice(preferences.priceRange[0])}</span>
                <span>{formatPrice(preferences.priceRange[1])}</span>
              </div>
              <Progress 
                value={75} 
                className="h-2 bg-orange-100" 
              />
            </div>
          </div>
        )}

        {/* Location Preferences */}
        {preferences.location?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium text-sm">Preferred Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.location.map((location: string) => (
                <Badge key={location} variant="secondary" className="bg-red-50 text-red-700">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const Profile = ({ userType }: ProfileProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: '',
    location: ''
  });

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  // Fetch stats based on user type
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', user?.id, userType],
    queryFn: async () => {
      if (!user?.id) return null;
      
      if (userType === 'realtor') {
        // Get properties count and matches
        const [propertiesRes, matchesRes] = await Promise.all([
          supabase
            .from('properties')
            .select('id')
            .eq('realtor_id', user.id),
          supabase
            .from('property_matches')
            .select('id')
            .eq('realtor_id', user.id)
        ]);

        return {
          properties: propertiesRes.data?.length || 0,
          matches: matchesRes.data?.length || 0,
          type: 'realtor'
        };
      } else {
        // Get matches for renter
        const matchesRes = await supabase
          .from('property_matches')
          .select('id')
          .eq('renter_id', user.id);

        return {
          matches: matchesRes.data?.length || 0,
          type: 'renter'
        };
      }
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: updates.email || user?.email || '',
          name: updates.name || '',
          phone: updates.phone || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfileMutation.mutate({
      ...editForm,
      email: profile?.email || user?.email || '',
    });
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid gap-6">
        {/* Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  userType === 'realtor' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <User className={`w-8 h-8 ${
                    userType === 'realtor' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {profile?.name || user?.email || 'User Profile'}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {userType === 'realtor' ? 'Property Owner' : 'Property Seeker'}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "ghost" : "outline"}
                className={isEditing ? "text-red-600 hover:text-red-700" : ""}
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder={userType === 'realtor' 
                          ? "Tell potential renters about yourself and your properties..."
                          : "Tell property owners about yourself and what you're looking for..."
                        }
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile?.email || user?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {profile?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{profile.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile?.bio && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Bio</p>
                        <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
                      </div>
                    )}
                    
                    {!profile?.phone && !profile?.location && !profile?.bio && (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Complete your profile to help others connect with you!</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userType === 'realtor' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Properties</span>
                      </div>
                      <Badge variant="outline">{stats?.properties || 0}</Badge>
                    </div>
                    <Separator />
                  </>
                ) : null}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Matches</span>
                  </div>
                  <Badge variant="outline">{stats?.matches || 0}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Messages</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {userType === 'renter' && (
              <PreferencesCard userId={user?.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};