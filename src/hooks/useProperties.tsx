
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Property {
  id: string;
  realtor_id: string;
  title: string;
  description: string | null;
  location: string;
  price: number;
  size: string | null;
  vibe: string | null;
  highlights: string[] | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    },
  });

  // Fetch properties by realtor
  const { data: realtorProperties = [] } = useQuery({
    queryKey: ['realtor-properties', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('realtor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    },
    enabled: !!user?.id,
  });

  // Upload image to storage
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: {
      title: string;
      description: string;
      location: string;
      price: number;
      size?: string;
      vibe?: string;
      highlights: string[];
      imageFiles: File[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Upload images first
      const imageUrls = await Promise.all(
        propertyData.imageFiles.map(file => uploadImage(file))
      );

      // Create property record
      const { data, error } = await supabase
        .from('properties')
        .insert({
          realtor_id: user.id,
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          price: propertyData.price,
          size: propertyData.size,
          vibe: propertyData.vibe,
          highlights: propertyData.highlights,
          images: imageUrls,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['realtor-properties'] });
      toast({
        title: "Property Listed!",
        description: "Your property has been successfully added to the platform.",
      });
    },
    onError: (error) => {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to list property. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    properties,
    realtorProperties,
    isLoading,
    createProperty: createPropertyMutation.mutate,
    isCreating: createPropertyMutation.isPending,
  };
};
