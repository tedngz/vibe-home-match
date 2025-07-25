
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Apartment } from '@/pages/Index';
import { UserProfile } from '@/components/LoginModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ContactModalProps {
  apartment: Apartment;
  userProfile?: UserProfile;
  onClose: () => void;
}

export const ContactModal = ({ apartment, userProfile, onClose }: ContactModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    message: `Hi ${apartment.realtor.name}, I'm interested in viewing "${apartment.title}" in ${apartment.location}. Could we schedule a viewing?`
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a match first
      const { data: matchData, error: matchError } = await supabase
        .from('property_matches')
        .insert({
          property_id: apartment.id,
          realtor_id: apartment.realtor.id,
          renter_id: user?.id
        })
        .select()
        .single();

      if (matchError && matchError.code !== '23505') { // Ignore duplicate key error
        throw matchError;
      }

      // Get the match ID (either from new insert or existing)
      let matchId = matchData?.id;
      if (!matchId) {
        const { data: existingMatch } = await supabase
          .from('property_matches')
          .select('id')
          .eq('property_id', apartment.id)
          .eq('realtor_id', apartment.realtor.id)
          .eq('renter_id', user?.id)
          .single();
        matchId = existingMatch?.id;
      }

      if (matchId) {
        // Send the initial message
        const { error: messageError } = await supabase
          .from('direct_messages')
          .insert({
            match_id: matchId,
            sender_id: user?.id,
            receiver_id: apartment.realtor.id,
            content: formData.message
          });

        if (messageError) throw messageError;
      }

      toast({
        title: "Message sent!",
        description: `Your interest in "${apartment.title}" has been sent to the property owner.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
    
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Contact Realtor</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={apartment.images[0]} 
              alt={apartment.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-semibold">{apartment.title}</h4>
              <p className="text-sm text-gray-600">{apartment.location}</p>
              <p className="text-sm font-medium text-green-600">${apartment.price}/mo</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">{apartment.realtor.name}</p>
            <p className="text-xs text-gray-600">Licensed Realtor</p>
            <p className="text-xs text-gray-600">{apartment.realtor.phone}</p>
            <p className="text-xs text-gray-600">{apartment.realtor.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-sm">Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
