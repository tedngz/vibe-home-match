import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  images: string[];
  created_at: string;
  likes_count: number;
  comments_count: number;
  user_id: string;
  user_name?: string;
  post_likes?: { user_id: string }[];
}

export const SocialFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts and then separately fetch user profiles
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          post_likes(user_id)
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch user profiles for the posts
      const userIds = [...new Set(postsData?.map(post => post.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      // Merge posts with profile data
      const postsWithProfiles = postsData?.map(post => ({
        ...post,
        user_name: profilesData?.find(profile => profile.id === post.user_id)?.name || 'Anonymous User'
      })) || [];

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;

    setIsPosting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPost.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      setNewPost('');
      setShowCreatePost(false);
      toast.success('Post created successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    const hasLiked = post?.post_likes?.some(like => like.user_id === user.id);

    try {
      if (hasLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <Button 
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Create Post Section */}
      {showCreatePost && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Create a new post</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Add Photo
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreatePost(false)}
                  disabled={isPosting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={createPost}
                  disabled={!newPost.trim() || isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm">Be the first to share something!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => {
            const hasLiked = post.post_likes?.some(like => like.user_id === user?.id);
            
            return (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {post.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">
                        {post.user_name || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="rounded-lg object-cover aspect-square"
                        />
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(post.id)}
                      className={`gap-2 ${hasLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                      {post.likes_count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments_count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};