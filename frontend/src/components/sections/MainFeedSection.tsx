import { useState, useRef, useEffect } from 'react';
import { Search, User, MoreVertical, Plus, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';


interface Asset {
  assetid: string;
  title: string;
  creator: string;
  url: string;
}
const MainFeedSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [heights, setHeights] = useState<{ [key: string]: number }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ fetchAssets defined outside useEffect
  const fetchAssets = async (search?: string) => {
    setLoading(true);
    try {
      let url = '/recc/sectionbimages';
      if (search && search.trim() !== '') {
        url += `?search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch assets');

      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setAssets(data.assets);
        const h: { [key: string]: number } = {};
data.assets.forEach(asset => {
  h[asset.assetid] = 250 + Math.random() * 100;
});
setHeights(h);
      } else {
        console.error('Unexpected API response:', data);
      }
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount
  useEffect(() => {
    fetchAssets();
  }, []);

 




  const handleUploadClick = () => {
    setShowUploadMenu(!showUploadMenu);
  };

  const handleFileUpload = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileInputRef.current.click();
    }
    setShowUploadMenu(false);
  };

  const handleImageClick = (asset: Asset) => {
  // Store the clicked image ID for the video feed page
  localStorage.setItem('selectedAssetId', asset.assetid);

  // Optional: log for debug
  console.log('Navigating to Video Feed with image:', asset.assetid);

  // Navigate to video feed page
  navigate('/videofeed');
};


  return (
    <div className="h-full bg-paperboy-black flex flex-col">
      {/* 🔍 Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-paperboy-black border-b border-paperboy-white/10">
        <div className="flex-1 relative mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-paperboy-red" />
          <Input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      fetchAssets(searchQuery);
    }
  }}
  placeholder="Search creators, videos, articles..."
  className="pl-10 bg-paperboy-black border-input-border text-paperboy-white placeholder:text-paperboy-white/50 rounded-full"
/>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="paperboy-ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/profile')}
          >
            <User className="h-5 w-5 text-paperboy-red" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="paperboy-ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-paperboy-red" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-paperboy-black border-input-border">
              <DropdownMenuItem className="text-paperboy-white hover:bg-paperboy-red/20">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="text-paperboy-white hover:bg-paperboy-red/20">
                Help
              </DropdownMenuItem>
              <DropdownMenuItem className="text-paperboy-white hover:bg-paperboy-red/20">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🖼️ Pinterest-style Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-paperboy-white/60 mt-10">Loading feed...</p>
        ) : (
          <div className="columns-2 gap-4 space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.assetid}
                className="break-inside-avoid bg-paperboy-dark-bg border border-paperboy-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-paperboy-red/50 transition-colors"
                onClick={() => handleImageClick(asset)}
              >
                <div
  className="w-full bg-gray-300 bg-cover bg-center"
  style={{
    height: `${heights[asset.assetid]}px`,
    backgroundImage: `url(${asset.url})`,
  }}
/>
                <div className="p-3">
                  <h3 className="text-paperboy-white font-medium mb-1">{asset.title}</h3>
                  <p className="text-paperboy-white/70 text-sm">@{asset.creator}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ➕ Floating Upload Button */}
      <div className="absolute bottom-20 right-6">
        {showUploadMenu && (
          <div className="mb-4 space-y-2">
            <Button
              onClick={() => handleFileUpload('image')}
              variant="paperboy"
              size="sm"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Button
              onClick={() => handleFileUpload('video')}
              variant="paperboy"
              size="sm"
              className="w-full"
            >
              <Video className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
        )}

        <Button
          onClick={handleUploadClick}
          variant="paperboy"
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
        >
          <Plus className={`h-6 w-6 transition-transform ${showUploadMenu ? 'rotate-45' : ''}`} />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          console.log('File selected:', e.target.files?.[0]);
        }}
      />
    </div>
  );
};

export default MainFeedSection;
