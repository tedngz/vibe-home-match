-- Restrict profiles SELECT to owners only and expose limited public info via RPC for matched users
-- 1) Update existing SELECT policy to be owner-only
DROP POLICY IF EXISTS "Users and matched parties can view profile" ON public.profiles;

-- 2) Matched-users RPC exposing only non-sensitive fields (id, name)
CREATE OR REPLACE FUNCTION public.get_matched_public_profiles(user_ids uuid[])
RETURNS TABLE (id uuid, name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, COALESCE(p.name, '') AS name
  FROM public.profiles p
  WHERE p.id = ANY (user_ids)
    AND (
      p.id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.property_matches m
        WHERE (m.renter_id = p.id AND m.realtor_id = auth.uid())
           OR (m.realtor_id = p.id AND m.renter_id = auth.uid())
      )
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_matched_public_profiles(uuid[]) TO authenticated;