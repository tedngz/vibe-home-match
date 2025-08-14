-- Strengthen profiles table security by making policies restrictive and explicit
-- Drop existing policies and recreate with more secure restrictions
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create restrictive (not permissive) policies that explicitly deny access unless conditions are met
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Ensure no DELETE policy exists to prevent profile deletion
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Create a secure function for realtors to get limited profile info of matched renters
CREATE OR REPLACE FUNCTION public.get_realtor_matched_renter_contact(renter_id uuid)
RETURNS TABLE (id uuid, name text, email text, phone text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only return contact info if the requesting realtor has a match with this renter
  SELECT p.id, p.name, p.email, COALESCE(p.phone, '') as phone
  FROM public.profiles p
  WHERE p.id = renter_id
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.property_matches m
      WHERE m.renter_id = renter_id 
        AND m.realtor_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_realtor_matched_renter_contact(uuid) TO authenticated;