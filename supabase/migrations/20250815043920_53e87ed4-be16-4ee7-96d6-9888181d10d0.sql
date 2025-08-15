-- Add contact permission field for realtors
ALTER TABLE public.profiles 
ADD COLUMN allow_contact_sharing boolean DEFAULT false,
ADD COLUMN bio text;

-- Add RLS policy to allow realtors to see renter preferences
CREATE POLICY "Realtors can view renter preferences through matches" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow users to see their own profile
  auth.uid() = id 
  OR 
  -- Allow realtors to see matched renters' profiles (with preferences)
  EXISTS (
    SELECT 1 FROM public.property_matches m
    WHERE m.renter_id = profiles.id 
    AND m.realtor_id = auth.uid()
  )
  OR
  -- Allow renters to see matched realtors' profiles (with contact if permission granted)
  EXISTS (
    SELECT 1 FROM public.property_matches m
    WHERE m.realtor_id = profiles.id 
    AND m.renter_id = auth.uid()
  )
);