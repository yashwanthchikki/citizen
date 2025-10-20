import { useState, useEffect } from 'react';
import { Heart, ThumbsDown, UserPlus, Flag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPost {
  assetid: string;
  creator: string;
  url: string;
  likes: number;
  dislikes: number;
  isSubscribed: boolean;
  article?: string;
}

const VideoFeedSection = () => {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showArticle, setShowArticle] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/recc/tiktok', { credentials: 'include' });
        const data = await res.json();
        if (data.success) setVideos(data.assets);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
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
  }, [currentVideoIndex, videos.length]);

  const handleLike = async (assetid: string) => {
  try {
    const res = await fetch(`http://localhost:3000/commen/like?assetid=${assetid}`, { credentials: 'include' });
    const data = await res.json();
    if (data.message === 'Liked successfully') {
      // Update local state
      setVideos(prev => prev.map(v => 
        v.assetid === assetid ? { ...v, likes: v.likes + 1 } : v
      ));
    }
  } catch (err) { console.error(err); }
};

const handleDislike = async (assetid: string) => {
  try {
    const res = await fetch(`http://localhost:3000/commen/dislike?assetid=${assetid}`, { credentials: 'include' });
    const data = await res.json();
    if (data.message === 'Disliked successfully') {
      setVideos(prev => prev.map(v => 
        v.assetid === assetid ? { ...v, dislikes: v.dislikes + 1 } : v
      ));
    }
  } catch (err) { console.error(err); }
};

const handleSubscribe = async (assetid: string, subscribed: boolean) => {
  try {
    const url = `http://localhost:3000/commen/${subscribed ? 'unsubscribe' : 'subscribe'}?assetid=${assetid}`;
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json();
    if (data.message.includes('successfully')) {
      setVideos(prev => prev.map(v => 
        v.assetid === assetid ? { ...v, isSubscribed: !subscribed } : v
      ));
    }
  } catch (err) { console.error(err); }
};


  const handleShowArticle = (video: VideoPost) => {
    setSelectedVideo(video);
    setShowArticle(true);
  };

  const currentVideo = videos[currentVideoIndex];

  if (loading) return <p className="text-center mt-10 text-white">Loading videos...</p>;

  return (
    <div className="h-full relative overflow-hidden">
      <div id="video-container" className="h-full bg-paperboy-light-bg flex flex-col justify-center items-center relative">
        {/* Video */}
        <video
          src={currentVideo?.url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
        />

        {/* Creator */}
        <div className="absolute top-16 left-4">
          <h3 className="text-paperboy-red font-bold text-lg">{currentVideo?.creator}</h3>
        </div>

        {/* Left Controls */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
          <Button onClick={() => handleLike(currentVideo.assetid)} variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full">
            <Heart className="h-6 w-6 text-paperboy-red" />
          </Button>
          <span className="text-paperboy-red text-sm font-semibold text-center">{currentVideo.likes}</span>

          <Button onClick={() => handleDislike(currentVideo.assetid)} variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full">
            <ThumbsDown className="h-6 w-6 text-paperboy-red" />
          </Button>
          <span className="text-paperboy-red text-sm font-semibold text-center">{currentVideo.dislikes}</span>

          <Button onClick={() => handleSubscribe(currentVideo.assetid, currentVideo.isSubscribed)} variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full">
            <UserPlus className="h-6 w-6 text-paperboy-red" />
          </Button>
        </div>

        {/* Article button */}
        {currentVideo.article && (
          <div className="absolute right-4 bottom-32">
            <Button onClick={() => handleShowArticle(currentVideo)} variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full">
              <FileText className="h-6 w-6 text-paperboy-red" />
            </Button>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {videos.map((_, idx) => (
            <div key={idx} className={`w-1 h-8 rounded-full transition-colors ${idx === currentVideoIndex ? 'bg-paperboy-red' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* Article Overlay */}
      {showArticle && selectedVideo?.article && (
        <div className="absolute inset-0 bg-paperboy-black/90 flex items-end z-50">
          <div className="bg-paperboy-black p-6 w-full max-h-2/3 overflow-y-auto rounded-t-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-paperboy-white">{selectedVideo.article}</h2>
              <Button onClick={() => setShowArticle(false)} variant="paperboy-ghost" size="sm">✕</Button>
            </div>
            <p className="text-paperboy-white/80 leading-relaxed">{selectedVideo.article}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeedSection;
