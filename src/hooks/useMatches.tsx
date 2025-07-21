import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface PropertyMatch {
  id: string;
  renter_id: string;
  property_id: string;
  realtor_id: string;
  created_at: string;
  updated_at: string;
  properties?: {
    id: string;
    title: string;
    location: string;
    price: number;
    vibe: string | null;
    images: string[] | null;
  };
}

export const useMatches = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch matches for realtors
  const { data: realtorMatches = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ['realtor-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('property_matches')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            location,
            price,
            vibe,
            images
          )
        `)
        .eq('realtor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyMatch[];
    },
    enabled: !!user?.id,
  });

  // Fetch matches for renters
  const { data: renterMatches = [], isLoading: isLoadingRenterMatches } = useQuery({
    queryKey: ['renter-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('property_matches')
        .select(`
          *,
          properties:property_id (
            id,
            title,
            location,
            price,
            vibe,
            images,
            description,
            highlights,
            size,
            realtor_id
          )
        `)
        .eq('renter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PropertyMatch[];
    },
    enabled: !!user?.id,
  });

  // Remove match mutation
  const removeMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from('property_matches')
        .delete()
        .eq('id', matchId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renter-matches'] });
      toast({
        title: "Match removed",
        description: "Property has been removed from your matches.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove match. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeMatch = (matchId: string) => {
    removeMatchMutation.mutate(matchId);
  };

  return {
    realtorMatches,
    renterMatches,
    isLoadingMatches: isLoadingMatches || isLoadingRenterMatches,
    removeMatch,
    isRemovingMatch: removeMatchMutation.isPending,
  };
};