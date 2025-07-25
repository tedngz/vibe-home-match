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
  vibe_analysis: any | null;
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

  // Analyze image vibes using AI
  const analyzeImageVibes = async (imageUrls: string[], generateContent = false): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-vibe', {
        body: { imageUrls, generateContent }
      });

      if (error) throw error;
      return data.analysis || {};
    } catch (error) {
      console.error('Error analyzing image vibes:', error);
      return {};
    }
  };

  // Create property mutation with vibe analysis
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

      // Analyze vibes and generate content from uploaded images
      const vibeAnalysis = await analyzeImageVibes(imageUrls, true);

      // Use AI-generated content if available and fields are empty/generic
      const finalTitle = propertyData.title && propertyData.title.trim() && propertyData.title !== 'New Property' ? 
        propertyData.title : 
        (vibeAnalysis?.generated_content?.title || 'Beautiful Rental Property');
      
      const finalDescription = propertyData.description && propertyData.description.trim() && propertyData.description !== 'Property description' ? 
        propertyData.description : 
        (vibeAnalysis?.generated_content?.description || 'A wonderful space perfect for your next home.');
      
      const finalHighlights = propertyData.highlights?.length && propertyData.highlights.some(h => h.trim()) ? 
        propertyData.highlights : 
        (vibeAnalysis?.generated_content?.highlights || ['Great location', 'Modern amenities', 'Spacious rooms']);

      // Create property record
      const { data, error } = await supabase
        .from('properties')
        .insert({
          realtor_id: user.id,
          title: finalTitle,
          description: finalDescription,
          location: propertyData.location,
          price: propertyData.price,
          size: propertyData.size,
          vibe: propertyData.vibe,
          highlights: finalHighlights,
          images: imageUrls,
          vibe_analysis: vibeAnalysis,
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
        description: "Your property has been successfully added with AI vibe analysis.",
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

  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: async (propertyData: {
      id: string;
      title: string;
      description: string;
      location: string;
      price: number;
      size?: string;
      vibe?: string;
      highlights: string[];
      newImageFiles?: File[];
      existingImages?: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      let imageUrls = propertyData.existingImages || [];

      // Upload new images if any
      if (propertyData.newImageFiles && propertyData.newImageFiles.length > 0) {
        const newImageUrls = await Promise.all(
          propertyData.newImageFiles.map(file => uploadImage(file))
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update property record
      const { data, error } = await supabase
        .from('properties')
        .update({
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          price: propertyData.price,
          size: propertyData.size,
          vibe: propertyData.vibe,
          highlights: propertyData.highlights,
          images: imageUrls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyData.id)
        .eq('realtor_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['realtor-properties'] });
      toast({
        title: "Property Updated!",
        description: "Your property has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('realtor_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['realtor-properties'] });
      toast({
        title: "Property Deleted!",
        description: "Your property has been successfully removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
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
    updateProperty: updatePropertyMutation.mutate,
    isUpdating: updatePropertyMutation.isPending,
    deleteProperty: deletePropertyMutation.mutate,
    isDeleting: deletePropertyMutation.isPending,
  };
};
