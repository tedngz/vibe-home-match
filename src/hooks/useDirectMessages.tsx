import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DirectMessage {
  id: string;
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  deleted_by: string[];
}

interface MatchConversation {
  id: string;
  match_id: string;
  last_message_at: string;
  last_message_preview: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data from property_matches
  property_matches?: {
    id: string;
    property_id: string;
    realtor_id: string;
    renter_id: string;
    properties?: {
      id: string;
      title: string;
      location: string;
      price: number;
      images: string[];
    };
  };
}

export const useDirectMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  // Fetch conversations for current user
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['match-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('match_conversations')
        .select(`
          *,
          property_matches!inner(
            id,
            property_id,
            realtor_id,
            renter_id,
            properties(id, title, location, price, images)
          )
        `)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data as MatchConversation[];
    },
    enabled: !!user?.id,
  });

  // Fetch messages for current match
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['direct-messages', currentMatchId],
    queryFn: async () => {
      if (!currentMatchId) return [];
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('match_id', currentMatchId)
        .not('deleted_by', 'cs', `{${user?.id}}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as DirectMessage[];
    },
    enabled: !!currentMatchId && !!user?.id,
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ matchId, content, receiverId }: { 
      matchId: string; 
      content: string; 
      receiverId: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          receiver_id: receiverId,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct-messages', currentMatchId] });
      queryClient.invalidateQueries({ queryKey: ['match-conversations'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete conversation (delete everything for both users)
  const deleteConversationMutation = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Delete all messages in the match
      const { error: messagesError } = await supabase
        .from('direct_messages')
        .delete()
        .eq('match_id', matchId);

      if (messagesError) throw messagesError;

      // Delete the conversation
      const { error: convError } = await supabase
        .from('match_conversations')
        .delete()
        .eq('match_id', matchId);

      if (convError) throw convError;

      return matchId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
      setCurrentMatchId(null);
      toast({
        title: "Conversation Deleted",
        description: "The conversation has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (matchId: string) => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('direct_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['direct-messages', currentMatchId] });
    },
  });

  return {
    conversations,
    messages,
    currentMatchId,
    setCurrentMatchId,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    deleteConversation: deleteConversationMutation.mutate,
    isDeletingConversation: deleteConversationMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    loadingConversations,
    loadingMessages,
  };
};