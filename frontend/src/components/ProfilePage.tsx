import { useState } from 'react';
import { ArrowLeft, Heart, ThumbsDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isOwnProfile] = useState(true); // This would come from auth context
  
  // Mock data
  const profileData = {
    name: "Creator Name",
    avatar: "/api/placeholder/100/100",
    followers: 1250,
    following: 485,
    uploads: 142,
  };

  const mockPosts = [
    { id: 1, type: 'image', thumbnail: '/api/placeholder/200/300', likes: 45, dislikes: 2 },
    { id: 2, type: 'video', thumbnail: '/api/placeholder/200/250', likes: 128, dislikes: 5 },
    { id: 3, type: 'image', thumbnail: '/api/placeholder/200/350', likes: 67, dislikes: 1 },
    { id: 4, type: 'video', thumbnail: '/api/placeholder/200/280', likes: 234, dislikes: 8 },
    { id: 5, type: 'image', thumbnail: '/api/placeholder/200/320', likes: 89, dislikes: 3 },
    { id: 6, type: 'video', thumbnail: '/api/placeholder/200/380', likes: 156, dislikes: 7 },
  ];

  const recentNotifications = [
    { type: 'like', count: 12, timeframe: 'today' },
    { type: 'dislike', count: 2, timeframe: 'today' },
    { type: 'follow', count: 5, timeframe: 'this week' },
  ];

  const handlePostClick = (post: any) => {
    if (post.type === 'video') {
      // Would navigate to TikTok-style feed
      console.log('Opening video in TikTok-style feed:', post);
    } else {
      // Would open scrollable detail viewer
      console.log('Opening image detail viewer:', post);
    }
  };

  const handleStatClick = (type: 'followers' | 'following') => {
    console.log(`Opening ${type} list`);
  };

  return (
    <div className="h-full bg-paperboy-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-paperboy-white/10">
        <Button 
          variant="paperboy-ghost" 
          size="icon"
          onClick={() => navigate('/app')}
        >
          <ArrowLeft className="h-5 w-5 text-paperboy-red" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Top Section - Profile Info */}
        <div className="p-6 text-center">
          {/* Profile Picture */}
          <div className="mb-4">
            <Avatar className="w-24 h-24 mx-auto border-2 border-paperboy-red">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="bg-paperboy-dark-bg text-paperboy-white text-xl">
                {profileData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Display Name */}
          <h1 className="text-paperboy-white text-xl font-bold mb-4">
            {profileData.name}
          </h1>

          {/* Stats Row */}
          <div className="flex justify-center space-x-8 mb-6">
            <button 
              onClick={() => handleStatClick('followers')}
              className="text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-paperboy-red text-lg font-semibold">
                {profileData.followers.toLocaleString()}
              </div>
              <div className="text-paperboy-white text-sm">Followers</div>
            </button>
            
            <button 
              onClick={() => handleStatClick('following')}
              className="text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-paperboy-red text-lg font-semibold">
                {profileData.following.toLocaleString()}
              </div>
              <div className="text-paperboy-white text-sm">Following</div>
            </button>
            
            <div className="text-center">
              <div className="text-paperboy-red text-lg font-semibold">
                {profileData.uploads}
              </div>
              <div className="text-paperboy-white text-sm">Uploads</div>
            </div>
          </div>

          {/* Action Button */}
          <Button variant="paperboy" className="mb-6">
            {isOwnProfile ? 'Edit Preferences' : 'Follow'}
          </Button>
        </div>

        {/* Notifications Area (only for own profile) */}
        {isOwnProfile && (
          <div className="px-6 mb-6">
            <h2 className="text-paperboy-white font-semibold mb-3">Recent Activity</h2>
            <div className="bg-paperboy-dark-bg border border-paperboy-white/10 rounded-lg p-4">
              <div className="space-y-2">
                {recentNotifications.map((notification, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-paperboy-white text-sm">
                      {notification.count} new {notification.type}s {notification.timeframe}
                    </span>
                    <span className="text-paperboy-red text-sm font-medium">
                      +{notification.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="px-4 pb-6">
          <div className="columns-2 gap-4 space-y-4">
            {mockPosts.map((post) => (
              <div
                key={post.id}
                className="break-inside-avoid bg-paperboy-dark-bg border border-paperboy-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-paperboy-red/50 transition-colors"
                onClick={() => handlePostClick(post)}
              >
                <div className="relative">
                  <div 
                    className="w-full bg-gray-300 bg-cover bg-center"
                    style={{ 
                      height: `${200 + (post.id % 4) * 50}px`,
                      backgroundImage: `url(${post.thumbnail})`
                    }}
                  />
                  {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-paperboy-black/50 rounded-full p-3">
                        <Play className="h-6 w-6 text-paperboy-white fill-current" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Stats */}
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-paperboy-red" />
                      <span className="text-paperboy-red text-xs">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="h-3 w-3 text-paperboy-red" />
                      <span className="text-paperboy-red text-xs">{post.dislikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;