-- Fix search path for the new functions created in the previous migration
CREATE OR REPLACE FUNCTION public.get_realtor_contact_for_renter(realtor_id uuid)
RETURNS TABLE(id uuid, name text, email text, phone text, bio text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Only return contact info if the requesting renter has a match with this realtor
  SELECT p.id, p.name, p.email, COALESCE(p.phone, '') as phone, COALESCE(p.bio, '') as bio
  FROM public.profiles p
  WHERE p.id = realtor_id
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.property_matches m
      WHERE m.realtor_id = realtor_id 
        AND m.renter_id = auth.uid()
    );
$function$;

-- Fix search path for renter profile function  
CREATE OR REPLACE FUNCTION public.get_renter_profile_for_realtor(renter_id uuid)
RETURNS TABLE(id uuid, name text, bio text)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Only return basic info if the requesting realtor has a match with this renter
  SELECT p.id, p.name, COALESCE(p.bio, '') as bio
  FROM public.profiles p
  WHERE p.id = renter_id
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.property_matches m
      WHERE m.renter_id = renter_id 
        AND m.realtor_id = auth.uid()
    );
$function$;