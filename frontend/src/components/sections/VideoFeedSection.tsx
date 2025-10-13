import { useState, useEffect } from 'react';
import { Heart, ThumbsDown, UserPlus, Flag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPost {
  id: number;
  creator: string;
  videoUrl: string;
  likes: number;
  dislikes: number;
  isFollowing: boolean;
  article?: {
    title: string;
    content: string;
  };
}

const VideoFeedSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showArticle, setShowArticle] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);

  // Mock video data
  const mockVideos: VideoPost[] = [
    {
      id: 1,
      creator: '@newsreporter1',
      videoUrl: '/api/placeholder/400/700',
      likes: 1234,
      dislikes: 45,
      isFollowing: false,
      article: {
        title: 'Breaking News: Market Update',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    },
    {
      id: 2,
      creator: '@journalist2',
      videoUrl: '/api/placeholder/400/700',
      likes: 2567,
      dislikes: 23,
      isFollowing: true,
      article: {
        title: 'Technology Trends 2024',
        content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    {
      id: 3,
      creator: '@reporter3',
      videoUrl: '/api/placeholder/400/700',
      likes: 892,
      dislikes: 12,
      isFollowing: false,
      article: {
        title: 'Climate Change Impact',
        content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
      }
    }
  ];

  // Handle scroll/swipe to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentVideoIndex < mockVideos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    };

    const container = document.getElementById('video-container');
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: true });
      return () => container.removeEventListener('wheel', handleScroll);
    }
  }, [currentVideoIndex, mockVideos.length]);

  const handleLike = (videoId: number) => {
    console.log('Liked video:', videoId);
  };

  const handleDislike = (videoId: number) => {
    console.log('Disliked video:', videoId);
  };

  const handleFollow = (videoId: number) => {
    console.log('Followed creator of video:', videoId);
  };

  const handleReport = (videoId: number) => {
    console.log('Reported video:', videoId);
  };

  const handleShowArticle = (video: VideoPost) => {
    setSelectedVideo(video);
    setShowArticle(true);
  };

  const currentVideo = mockVideos[currentVideoIndex];

  return (
    <div className="h-full relative overflow-hidden">
      {/* Video Container */}
      <div 
        id="video-container"
        className="h-full bg-paperboy-light-bg flex flex-col justify-center items-center relative"
      >
        {/* Video Placeholder */}
        <div 
          className="w-full h-full bg-gray-300 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${currentVideo?.videoUrl})`,
            backgroundSize: 'cover'
          }}
        />

        {/* Creator Name Overlay */}
        <div className="absolute top-16 left-4">
          <h3 className="text-paperboy-red font-bold text-lg">
            {currentVideo?.creator}
          </h3>
        </div>

        {/* Left Side Controls */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
          <Button
            onClick={() => handleLike(currentVideo?.id)}
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full"
          >
            <Heart className="h-6 w-6 text-paperboy-red" />
          </Button>
          <span className="text-paperboy-red text-sm font-semibold text-center">
            {currentVideo?.likes}
          </span>

          <Button
            onClick={() => handleDislike(currentVideo?.id)}
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full"
          >
            <ThumbsDown className="h-6 w-6 text-paperboy-red" />
          </Button>
          <span className="text-paperboy-red text-sm font-semibold text-center">
            {currentVideo?.dislikes}
          </span>

          <Button
            onClick={() => handleFollow(currentVideo?.id)}
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full"
          >
            <UserPlus className="h-6 w-6 text-paperboy-red" />
          </Button>

          <Button
            onClick={() => handleReport(currentVideo?.id)}
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full"
          >
            <Flag className="h-6 w-6 text-paperboy-red" />
          </Button>
        </div>

        {/* Right Side Article Button */}
        {currentVideo?.article && (
          <div className="absolute right-4 bottom-32">
            <Button
              onClick={() => handleShowArticle(currentVideo)}
              variant="ghost"
              size="icon"
              className="bg-white/10 hover:bg-white/20 rounded-full"
            >
              <FileText className="h-6 w-6 text-paperboy-red" />
            </Button>
          </div>
        )}

        {/* Video Progress Indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {mockVideos.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-colors ${
                index === currentVideoIndex ? 'bg-paperboy-red' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Article Overlay */}
      {showArticle && selectedVideo?.article && (
        <div className="absolute inset-0 bg-paperboy-black/90 flex items-end z-50">
          <div className="bg-paperboy-black p-6 w-full max-h-2/3 overflow-y-auto rounded-t-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-paperboy-white">
                {selectedVideo.article.title}
              </h2>
              <Button
                onClick={() => setShowArticle(false)}
                variant="paperboy-ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            <p className="text-paperboy-white/80 leading-relaxed">
              {selectedVideo.article.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeedSection;