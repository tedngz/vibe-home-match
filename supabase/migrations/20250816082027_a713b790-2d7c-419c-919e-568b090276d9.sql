-- Allow public access to basic realtor info for property listings
-- This ensures renters can see realtor names when browsing properties
CREATE POLICY "Public can view realtor names for properties" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow access to own profile
  auth.uid() = id 
  OR 
  -- Allow access if user has matches with this profile
  EXISTS (
    SELECT 1 FROM public.property_matches m
    WHERE (m.renter_id = profiles.id AND m.realtor_id = auth.uid())
       OR (m.realtor_id = profiles.id AND m.renter_id = auth.uid())
  )
  OR
  -- Allow public access to realtor name if they have published properties
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.realtor_id = profiles.id
  )
);

-- Drop the old policy to avoid conflicts
DROP POLICY IF EXISTS "Matched users can view each other's basic profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view only their own profile" ON public.profiles;