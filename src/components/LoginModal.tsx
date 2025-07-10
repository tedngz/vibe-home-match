import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
}

export const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // If user is authenticated, auto-populate and call onLogin
  useState(() => {
    if (user && isOpen) {
      const profile: UserProfile = {
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      };
      onLogin(profile);
      toast({
        title: "Welcome back!",
        description: `Hi ${profile.name || 'there'}, you're already signed in.`,
      });
      onClose();
    }
  });

  // This modal is now handled by the main auth system
  // but keeping for backward compatibility
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Authentication Required</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You're already signed in! Redirecting...
          </p>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
