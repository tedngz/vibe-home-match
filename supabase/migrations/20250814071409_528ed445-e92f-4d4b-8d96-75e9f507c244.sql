-- Fix security vulnerability: Replace insecure get_public_profiles function
-- Drop the insecure function that allows unrestricted access to user profiles
DROP FUNCTION IF EXISTS public.get_public_profiles(uuid[]);

-- Create a secure function for getting post author profiles (only for authenticated users viewing posts)
CREATE OR REPLACE FUNCTION public.get_post_authors_profiles(user_ids uuid[])
RETURNS TABLE (id uuid, name text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only return profiles for users who have made posts, and only if requestor is authenticated
  SELECT DISTINCT p.id, COALESCE(p.name, 'Anonymous User') AS name
  FROM public.profiles p
  WHERE p.id = ANY (user_ids)
    AND auth.uid() IS NOT NULL  -- Require authentication
    AND EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.user_id = p.id
    );  -- Only return profiles of users who have made posts
$$;

GRANT EXECUTE ON FUNCTION public.get_post_authors_profiles(uuid[]) TO authenticated;