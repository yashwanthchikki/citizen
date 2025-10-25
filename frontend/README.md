# Cirtizen Frontend - React TypeScript Application

Modern news streaming platform frontend built with React, TypeScript, and Tailwind CSS. Features swipe-based navigation, Pinterest-style feeds, and TikTok-style video content.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

**Frontend runs on**: `http://localhost:5173`

---

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
```

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MainApp.tsx              # Main swipe container
│   │   ├── sections/
│   │   │   ├── PaperboySection.tsx  # Section A: News curation
│   │   │   ├── MainFeedSection.tsx  # Section B: Pinterest feed
│   │   │   └── VideoFeedSection.tsx # Section C: Video feed
│   │   ├── SignInPage.tsx           # Login page
│   │   ├── SignUpPage.tsx           # Registration page
│   │   ├── ProfilePage.tsx          # User profile
│   │   ├── SplashScreen.tsx         # Loading/splash screen
│   │   └── ui/                      # shadcn/ui components
│   ├── pages/                       # Page components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility functions
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript config
├── package.json
└── index.html
```

---

## 🛠️ Technology Stack

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **React Router 6** - Navigation
- **TanStack React Query 5** - Data fetching
- **Zod** - Schema validation
- **Lucide React** - Icons
- **date-fns** - Date utilities

---

## 🎯 Component Architecture

### Component Hierarchy

```
App
└── MainApp (Swipe Navigation)
    ├── PaperboySection (Section A)
    │   └── Newspaper Generation UI
    ├── MainFeedSection (Section B)
    │   └── Asset Masonry Grid
    └── VideoFeedSection (Section C)
        └── Full-Screen Video Player
    └── Section Indicator (Navigation Dots)
```

---

## 📱 Main Components

### MainApp Component

**Location**: `src/components/MainApp.tsx`

Main container managing horizontal swipe navigation between three sections.

**Features**:
- 🎯 Touch-based swipe detection
- 📱 Responsive full-screen layout
- ✨ Smooth CSS transitions
- 🔴 Visual section indicators
- ⌨️ Click-based navigation

**State Management**:
```typescript
const [currentSection, setCurrentSection] = useState(1); // 0-2
const touchStartX = useRef(0);
const touchEndX = useRef(0);
```

**Key Methods**:
- `handleTouchStart()` - Record touch start position
- `handleTouchMove()` - Update current touch position
- `handleTouchEnd()` - Calculate swipe and navigate

**CSS Classes**:
- `transition-transform duration-300 ease-out` - Smooth animation
- `translate-x` - Applied via transform: translateX()

**Usage**:
```tsx
import MainApp from '@/components/MainApp';

export default function App() {
  return <MainApp />;
}
```

---

### PaperboySection Component

**Location**: `src/components/sections/PaperboySection.tsx`

AI-powered custom newspaper generation section.

**Features**:
- 📝 Search query input
- 🌍 Country dropdown selector
- 📅 Date range picker
- 🔄 Loading state with spinner
- 📰 Article list display

**State**:
```typescript
const [country, setCountry] = useState('');
const [query, setQuery] = useState('');
const [dateRange, setDateRange] = useState<Date>(new Date());
const [articles, setArticles] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(false);
```

**Supported Countries**:
- US (United States)
- UK (United Kingdom)
- CA (Canada)
- AU (Australia)
- DE (Germany)
- FR (France)
- IND (India)

**API Integration**:
```typescript
// Expected endpoint: POST /newspaper/generate
const handleGenerateNewspaper = async () => {
  const response = await fetch('/newspaper/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, country, dateRange }),
    credentials: 'include'
  });
};
```

**UI Components Used**:
- `Input` - Query text field
- `Select` - Country dropdown
- `Calendar` - Date picker
- `Button` - Generate button
- `Popover` - Calendar wrapper

---

### MainFeedSection Component

**Location**: `src/components/sections/MainFeedSection.tsx`

Pinterest-style masonry feed for visual content discovery.

**Features**:
- 🔎 Real-time search filtering
- 📸 Masonry grid layout
- 📤 File upload capability
- 🎨 Dynamic asset heights
- ♾️ Scalable for infinite scroll
- 🏷️ Asset metadata display

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [showUploadMenu, setShowUploadMenu] = useState(false);
const [assets, setAssets] = useState<Asset[]>([]);
const [loading, setLoading] = useState(true);
const [heights, setHeights] = useState<{ [key: string]: number }>({});
```

**Asset Type**:
```typescript
interface Asset {
  assetid: string;
  title: string;
  creator: string;
  url: string;
}
```

**API Integration**:
```typescript
// Fetch assets with optional search
const fetchAssets = async (search?: string) => {
  let url = '/recc/sectionbimages';
  if (search?.trim()) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url, { credentials: 'include' });
};

// Upload new asset
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  await fetch('/recc/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
};
```

**Search Debounce**:
```typescript
// Implement debouncing to avoid excessive API calls
const debouncedSearch = useCallback(
  debounce((query: string) => {
    fetchAssets(query);
  }, 500),
  []
);
```

**Masonry Layout**:
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 1rem;
```

**Height Variation**:
```typescript
// Random heights for visual interest (250-350px range)
h[asset.assetid] = 250 + Math.random() * 100;
```

---

### VideoFeedSection Component

**Location**: `src/components/sections/VideoFeedSection.tsx`

TikTok-style full-screen vertical video feed with engagement features.

**Features**:
- 🎬 Full-screen video playback
- ⬆️⬇️ Mouse wheel/scroll navigation
- ❤️ Like/dislike system with counters
- 👥 Creator follow functionality
- 🚩 Content reporting
- 📄 Article context popup
- 🎯 Creator information display

**State**:
```typescript
const [videos, setVideos] = useState<VideoPost[]>([]);
const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
const [showArticle, setShowArticle] = useState(false);
const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
const [loading, setLoading] = useState(true);
```

**VideoPost Interface**:
```typescript
interface VideoPost {
  assetid: string;
  creator: string;
  url: string;
  likes: number;
  dislikes: number;
  isSubscribed: boolean;
  article?: string;
}
```

**Scroll Navigation**:
```typescript
// Wheel scroll handling
const handleScroll = (e: WheelEvent) => {
  if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
    setCurrentVideoIndex(prev => prev + 1);
  } else if (e.deltaY < 0 && currentVideoIndex > 0) {
    setCurrentVideoIndex(prev => prev - 1);
  }
};

// Add listener on mount
useEffect(() => {
  const container = document.getElementById('video-container');
  if (container) {
    container.addEventListener('wheel', handleScroll, { passive: true });
    return () => container.removeEventListener('wheel', handleScroll);
  }
}, [currentVideoIndex, videos.length]);
```

**Engagement Actions**:
```typescript
// Like video
const handleLike = async (assetid: string) => {
  const res = await fetch(`/commen/like?assetid=${assetid}`, {
    credentials: 'include'
  });
};

// Dislike video
const handleDislike = async (assetid: string) => {
  const res = await fetch(`/commen/dislike?assetid=${assetid}`, {
    credentials: 'include'
  });
};

// Follow creator
const handleFollow = async (creatorid: string) => {
  const res = await fetch(`/commen/follow?creatorid=${creatorid}`, {
    credentials: 'include'
  });
};
```

**API Endpoints Used**:
- `GET /recc/tiktok` - Fetch video feed
- `POST /commen/like?assetid=id` - Like action
- `POST /commen/dislike?assetid=id` - Dislike action
- `POST /commen/follow?creatorid=id` - Follow creator

---

## 🎨 Styling

### Tailwind CSS Configuration

**File**: `tailwind.config.ts`

Custom color scheme for Paperboy theme:

```typescript
colors: {
  'paperboy-black': '#0a0a0a',
  'paperboy-red': '#ef4444',
  'paperboy-white': '#ffffff'
}
```

### Global Styles

**File**: `src/index.css`

Contains base styles, component styles, and utility classes.

### Component-Specific Styles

Most components use Tailwind utility classes directly:

```tsx
<div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

---

## 🔌 API Integration

### Base URL Configuration

```typescript
// In .env
VITE_API_URL=http://localhost:3001

// Usage in components
const API_URL = import.meta.env.VITE_API_URL;
const response = await fetch(`${API_URL}/endpoint`);
```

### Authentication

All API calls include credentials:

```typescript
fetch('/endpoint', {
  method: 'GET',
  credentials: 'include', // Includes cookies with JWT
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Error Handling

```typescript
try {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();
  if (data.success) {
    // Handle success
  } else {
    console.error(data.error);
  }
} catch (err) {
  console.error('Error:', err);
  // Show user-friendly error message
}
```

---

## 🪝 Custom Hooks

### Using React Query (TanStack)

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['assets'],
  queryFn: async () => {
    const res = await fetch('/recc/sectionbimages', { 
      credentials: 'include' 
    });
    return res.json();
  }
});
```

### Example: Create useFetchAssets Hook

```typescript
// hooks/useFetchAssets.ts
import { useState, useCallback } from 'react';

export const useFetchAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      let url = '/recc/sectionbimages';
      if (search) url += `?search=${search}`;
      
      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { assets, loading, error, fetchAssets };
};
```

---

## 📝 TypeScript Best Practices

### Define Interfaces for Data

```typescript
// models/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Use Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T extends { id: string }>({ items, renderItem }: ListProps<T>) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
```

---

## 🧪 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates during development:

```bash
npm run dev
# Changes to files are reflected instantly in browser
```

### Console Debugging

```typescript
// Log component renders
useEffect(() => {
  console.log('Component mounted or dependencies changed');
}, [dependency]);

// Log API responses
const response = await fetch(url);
const data = await response.json();
console.log('API Response:', data);
```

### React DevTools

1. Install [React DevTools browser extension](https://react-devtools-tutorial.vercel.app/)
2. Inspect components, props, state, and hooks
3. Trace re-renders to optimize performance

---

## 🚀 Building for Production

### Production Build

```bash
npm run build
```

This creates an optimized `dist/` folder with:
- Minified JavaScript
- Tree-shaken unused code
- Optimized CSS
- Hashed filenames for caching

### Preview Production Build

```bash
npm run preview
# Runs local preview of production build
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── vendor-ghi789.js
└── placeholder.svg
```

---

## 🔧 Configuration Files

### Vite Config

**File**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### TypeScript Config

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tailwind Config

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paperboy-black': '#0a0a0a',
        'paperboy-red': '#ef4444',
      }
    }
  },
  plugins: []
} satisfies Config
```

---

## 🎯 Common Tasks

### Add a New Component

```typescript
// src/components/NewComponent.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NewComponentProps {
  title: string;
  onAction?: () => void;
}

const NewComponent = ({ title, onAction }: NewComponentProps) => {
  const [state, setState] = useState(false);

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold">{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  );
};

export default NewComponent;
```

### Add a New Route

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainApp from '@/components/MainApp';
import ProfilePage from '@/components/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Use Form Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
    </form>
  );
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Components not updating | Check React DevTools, verify state updates |
| API calls failing | Check CORS, verify backend URL, check network tab |
| Tailwind classes not applied | Run `npm run build`, restart dev server |
| TypeScript errors | Check types, use `as const`, add interfaces |
| Hot reload not working | Restart dev server, check vite.config |

---

## 📊 Performance Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const VideoFeed = lazy(() => import('./sections/VideoFeedSection'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoFeed />
    </Suspense>
  );
}
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

const MemoizedComponent = memo(({ items }) => {
  const processedItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);

  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);

  return <div>{processedItems.length}</div>;
});
```

### Image Optimization

```typescript
// Use responsive images
<img 
  src="/image.jpg"
  alt="Description"
  loading="lazy"
  width={300}
  height={300}
/>
```

---

## 🔗 Related Documentation

- [Main README](../README.md) - Overall project documentation
- [Backend README](../backend/README.md) - Backend documentation

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Active Development
