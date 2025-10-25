# Cirtizen - News Streaming Platform

Cirtizen is a modern news streaming platform that combines three unique content delivery experiences: **Paperboy** (curated newspaper), **Main Feed** (Pinterest-style news), and **Video Feed** (TikTok-style short videos). Built with React, TypeScript, and Express.js, it leverages AI for content curation and recommendation.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Frontend Documentation](#frontend-documentation)
- [Backend Documentation](#backend-documentation)
- [API Reference](#api-reference)
- [Development Guide](#development-guide)

---

## 🎯 Project Overview

Cirtizen is designed to deliver personalized news content through multiple interfaces:

1. **Paperboy** - Custom newspaper generation based on user queries, country selection, and date filters
2. **Main Feed** - Pinterest-style visual news feed with searchable content
3. **Video Feed** - TikTok-style short video news content with engagement features

The platform uses vector databases for semantic search, AWS S3 for media storage, and MongoDB for user data persistence.

---

## ✨ Features

### 1. **Paperboy Section (Section A)**
- 🔍 Custom newspaper curation
- 📍 Country-based news filtering
- 📅 Date range selection
- 🎯 Keyword-based search
- 📰 Aggregated article summaries

### 2. **Main Feed Section (Section B)**
- 📸 Pinterest-style infinite scroll
- 🔎 Real-time search functionality
- 📤 Asset upload capability
- 🎨 Masonry layout with responsive heights
- ⭐ User interaction tracking

### 3. **Video Feed Section (Section C)**
- 🎬 TikTok-style vertical video streaming
- ⬆️⬇️ Scroll-based navigation
- ❤️ Like/Dislike functionality
- 👥 Creator follow system
- 🚩 Content reporting
- 📄 Article context display

### 4. **Authentication & User Management**
- 🔐 JWT-based authentication
- 🔑 Secure password hashing (bcrypt)
- 👤 User profile management
- 🛡️ Role-based access control

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├────────────────────┬────────────────────┬───────────────────┤
│  Paperboy          │  Main Feed         │  Video Feed       │
│  (News Curation)   │  (Pinterest-style) │  (TikTok-style)   │
└────────┬───────────┴────────┬───────────┴─────────┬──────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Backend (Express) │
                    ├────────────────────┤
                    │  Auth Service      │
                    │  Recommendation    │
                    │  Comments/Likes    │
                    │  Newspaper Service │
                    └────────┬───────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼───┐       ┌────▼────┐    ┌────▼──────┐
       │ MongoDB │       │ Vector  │    │  AWS S3   │
       │         │       │   DB    │    │  Storage  │
       └─────────┘       └─────────┘    └───────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite 5.4** - Build tool & dev server
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Component library
- **React Router 6** - Navigation
- **TanStack React Query 5** - Data fetching
- **Zod** - Schema validation
- **date-fns** - Date utilities

### Backend
- **Express.js 5.1** - Web framework
- **MongoDB & Mongoose 8.19** - Database
- **SQLite3** - Lightweight storage
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **LangChain** - AI integration
- **Google GenAI** - LLM for content curation
- **AWS SDK S3** - Cloud storage
- **FAISS** - Vector similarity search
- **Transformers** - NLP models

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas)
- AWS Account (for S3)
- Google API Key (for GenAI)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (if needed)
# Copy .env.example to .env
# Update VITE_API_URL if using custom backend

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

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Create .env with:
# PORT=3001
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# GOOGLE_API_KEY=your_google_api_key

# Development server with auto-reload
npm run dev

# Production server
npm start
```

**Backend runs on**: `http://localhost:3001`

---

## 📂 Project Structure

```
cirtizen/
├── frontend/                          # React TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainApp.tsx           # Main swipe-enabled container
│   │   │   ├── sections/
│   │   │   │   ├── PaperboySection.tsx    # Section A: News curation
│   │   │   │   ├── MainFeedSection.tsx    # Section B: Pinterest-style feed
│   │   │   │   └── VideoFeedSection.tsx   # Section C: TikTok-style videos
│   │   │   ├── SignInPage.tsx        # Authentication
│   │   │   ├── SignUpPage.tsx        # Registration
│   │   │   ├── ProfilePage.tsx       # User profile
│   │   │   ├── SplashScreen.tsx      # Loading/splash screen
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── pages/                    # Page components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utility functions
│   │   ├── App.tsx                   # Root component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── vite.config.ts                # Vite configuration
│   ├── tailwind.config.ts            # Tailwind configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── package.json
│   └── index.html
│
├── backend/                           # Express.js Backend
│   ├── auth service/                 # Authentication module
│   │   ├── controller.js             # Auth logic
│   │   ├── db.js                     # Auth DB operations
│   │   └── index.js                  # Auth routes
│   ├── models/
│   │   ├── users.js                  # User schema
│   │   └── assets.js                 # Asset schema
│   ├── middlewheres/                 # Middleware
│   │   ├── authntication.js          # JWT verification
│   │   ├── autharisation.js          # Role checking
│   │   └── errhandaling.js           # Error handling
│   ├── newspaper/                    # Paperboy feature
│   │   ├── index.js                  # Routes
│   │   └── newspaperservice.js       # Newspaper generation
│   ├── section_B,C/                  # Main Feed & Video Feed
│   │   ├── section_b/                # Pinterest-style feed
│   │   │   └── index.js              # Routes & logic
│   │   ├── commen relationship/       # Comments & Likes
│   │   │   └── index.js              # Routes & logic
│   │   ├── functions.js              # Utility functions
│   │   ├── vector.js                 # Vector DB operations
│   │   └── s3.js                     # AWS S3 operations
│   ├── app.js                        # Express server setup
│   ├── mangodb.js                    # MongoDB connection
│   ├── vectordb.js                   # Vector DB initialization
│   ├── db.db                         # SQLite database
│   ├── package.json
│   └── .env                          # Environment variables
│
└── README.md                         # This file
```

---

## 📱 Frontend Documentation

### Component Hierarchy

```
App.tsx
└── MainApp.tsx (Swipe Container)
    ├── PaperboySection (Section A)
    ├── MainFeedSection (Section B)
    └── VideoFeedSection (Section C)
    └── Section Indicator (Dots)
```

### MainApp Component

**File**: `frontend/src/components/MainApp.tsx`

Main container handling horizontal swipe navigation between sections.

**Key Features**:
- 🎯 Three-section swipe navigation
- 📱 Touch gesture recognition
- ✨ Smooth transitions (300ms ease-out)
- 🔴 Visual section indicators

**Props**: None (manages internal state)

**State**:
```typescript
currentSection: number // 0: Paperboy, 1: Main Feed, 2: Video Feed
touchStartX: number    // Touch start position
touchEndX: number      // Touch end position
```

**Swipe Threshold**: 50px

**Usage Example**:
```tsx
import MainApp from '@/components/MainApp';

function App() {
  return <MainApp />;
}
```

---

### PaperboySection Component

**File**: `frontend/src/components/sections/PaperboySection.tsx`

Custom newspaper generation based on user inputs.

**Features**:
- 📝 Query input for topics
- 🌍 Country selection dropdown
- 📅 Date range picker
- 🔄 Loading state management
- 📰 Article display

**State**:
```typescript
country: string           // Selected country code
query: string            // Search query
dateRange: Date          // Selected date
articles: Article[]      // Generated articles
isLoading: boolean       // Loading indicator
```

**Supported Countries**: US, UK, Canada, Australia, Germany, France, India

**API Endpoint**: `POST /newspaper/generate` (to be implemented)

**Usage**:
```tsx
<PaperboySection />
```

---

### MainFeedSection Component

**File**: `frontend/src/components/sections/MainFeedSection.tsx`

Pinterest-style masonry feed with search and upload capabilities.

**Features**:
- 🔎 Real-time search
- 📸 Asset masonry layout
- 📤 File upload
- 🎨 Responsive heights
- ♾️ Infinite scroll potential

**State**:
```typescript
searchQuery: string          // Current search query
showUploadMenu: boolean      // Upload menu visibility
assets: Asset[]             // Loaded assets
loading: boolean            // Loading state
heights: {[id: string]: number} // Asset heights for masonry
```

**Asset Interface**:
```typescript
interface Asset {
  assetid: string;
  title: string;
  creator: string;
  url: string;
}
```

**API Endpoints**:
- `GET /recc/sectionbimages?search=query` - Fetch with optional search
- `POST /recc/upload` - Upload new asset

**Usage**:
```tsx
<MainFeedSection />
```

---

### VideoFeedSection Component

**File**: `frontend/src/components/sections/VideoFeedSection.tsx`

TikTok-style vertical video streaming with engagement features.

**Features**:
- 🎬 Full-screen video playback
- ⬆️⬇️ Scroll-based navigation
- ❤️ Like/dislike system
- 👥 Creator follow system
- 🚩 Report content
- 📄 Article context

**State**:
```typescript
videos: VideoPost[]       // Video list
currentVideoIndex: number // Currently displayed video
showArticle: boolean      // Article popup visibility
selectedVideo: VideoPost  // Selected video for details
loading: boolean          // Loading state
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

**API Endpoints**:
- `GET /recc/tiktok` - Fetch video feed
- `POST /commen/like?assetid=id` - Like video
- `POST /commen/dislike?assetid=id` - Dislike video
- `POST /commen/follow?creatorid=id` - Follow creator

**Usage**:
```tsx
<VideoFeedSection />
```

---

## 🔧 Backend Documentation

### Authentication Service

**Location**: `backend/auth service/`

Handles user registration, login, and JWT token management.

**Key Files**:
- `controller.js` - Auth logic (sign up, sign in, verify)
- `db.js` - Database operations
- `index.js` - Express routes

**Features**:
- 🔐 Secure password hashing with bcrypt
- 🎟️ JWT token generation & verification
- 👤 User profile management
- 🛡️ Token validation middleware

---

### Recommendation Engine

**Location**: `backend/section_B,C/`

AI-powered content recommendation system using vector similarity search.

**Key Files**:
- `vector.js` - FAISS vector database operations
- `functions.js` - Utility functions
- `s3.js` - AWS S3 integration
- `section_b/index.js` - Feed logic

**Features**:
- 🤖 Semantic content matching
- 🔍 Vector similarity search
- 📊 User preference learning
- 🖼️ Image/video content processing

---

### Comment & Engagement System

**Location**: `backend/section_B,C/commen relationship/`

Manages likes, dislikes, comments, and creator relationships.

**Features**:
- ❤️ Like/dislike tracking
- 💬 Comment storage
- 👥 Follow/unfollow relationships
- 📊 Engagement analytics

**Database Schema** (MongoDB):
```javascript
{
  assetid: String,
  likes: [userId],
  dislikes: [userId],
  comments: [{
    userId: String,
    text: String,
    timestamp: Date
  }],
  followers: [userId]
}
```

---

### Newspaper Service

**Location**: `backend/newspaper/`

AI-powered newspaper generation using Google GenAI and LangChain.

**Key Files**:
- `index.js` - Routes
- `newspaperservice.js` - Article curation logic

**Features**:
- 🤖 AI-based article selection
- 🌍 Country-specific news filtering
- 📅 Date-based filtering
- 📝 Content summarization
- 🔗 Multi-source aggregation

**Request Format**:
```json
{
  "query": "technology",
  "country": "us",
  "dateRange": "2024-01-01"
}
```

**Response Format**:
```json
{
  "success": true,
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "summary": "Article summary",
      "source": "News Source",
      "timestamp": "2 hours ago",
      "url": "https://example.com"
    }
  ]
}
```

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/signin` | Login user | ❌ |
| GET | `/verifytoken` | Verify JWT token | ✅ |
| POST | `/auth/logout` | Logout user | ✅ |

### Main Feed Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/recc/sectionbimages` | Fetch feed assets (with optional search) | ✅ |
| POST | `/recc/upload` | Upload new asset | ✅ |
| GET | `/recc/search?q=query` | Search assets | ✅ |

### Video Feed Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/recc/tiktok` | Fetch video feed | ✅ |
| POST | `/commen/like?assetid=id` | Like video | ✅ |
| POST | `/commen/dislike?assetid=id` | Dislike video | ✅ |
| POST | `/commen/follow?creatorid=id` | Follow creator | ✅ |

### Newspaper Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/newspaper/generate` | Generate custom newspaper | ✅ |
| GET | `/newspaper/history` | Get past newspapers | ✅ |

### Comments & Interactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/commen/comment` | Add comment | ✅ |
| GET | `/commen/comments?assetid=id` | Get comments | ✅ |
| DELETE | `/commen/comment/:id` | Delete comment | ✅ |

---

## 🚀 Development Guide

### Running Both Frontend & Backend

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**Backend (.env)**:
```env
PORT=3001
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cirtizen
JWT_SECRET=your_super_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=cirtizen-bucket
GOOGLE_API_KEY=your_google_api_key
NODE_ENV=development
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3001
```

### Code Style

- **Frontend**: TypeScript with strict mode
- **Backend**: ES6+ JavaScript (Node.js)
- **Formatting**: ESLint & Prettier
- **CSS**: Tailwind CSS utility classes

### Development Workflow

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make Changes**:
   - Follow existing code patterns
   - Add TypeScript types
   - Update this README if needed

3. **Test Locally**:
   - Run both servers
   - Test swipe navigation
   - Verify API calls

4. **Commit & Push**:
   ```bash
   git add .
   git commit -m "Add feature description"
   git push origin feature/feature-name
   ```

---

### Adding New Components

**Example - Creating a new UI component**:

```tsx
// File: frontend/src/components/NewComponent.tsx
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

---

### Adding New API Routes

**Example - Backend route**:

```javascript
// File: backend/routes/example.js
const express = require('express');
const router = express.Router();
const authentication = require('../middlewheres/authntication');

// GET example
router.get('/data', authentication, async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

### Debugging Tips

**Frontend**:
- Use React Developer Tools browser extension
- Check console for TypeScript errors
- Use `console.log()` for debugging
- Check network tab for API calls

**Backend**:
- Use `nodemon` for auto-restart
- Add `console.log()` statements
- Check MongoDB connection
- Verify JWT tokens in headers

---

## 📊 Key Features Implementation Details

### Swipe Navigation

The swipe detection uses touchstart/touchmove/touchend events:

```typescript
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = touchStartX.current - touchEndX.current;
  if (Math.abs(diff) > 50) { // 50px threshold
    // Change section
  }
};
```

### Vector Search

Content matching uses FAISS vector database:

```javascript
// Converts content to vectors and finds similar items
const results = vectordb.search(queryVector, topK=10);
```

### AWS S3 Upload

Media storage and retrieval:

```javascript
const params = {
  Bucket: process.env.AWS_S3_BUCKET,
  Key: `assets/${filename}`,
  Body: fileContent
};
await s3Client.putObject(params);
```

---

## 🤝 Contributing

1. Follow the existing code structure
2. Add comments for complex logic
3. Update API documentation
4. Test thoroughly before committing
5. Keep TypeScript strict mode enabled

---

## 📝 License

ISC License - See package.json for details

---

## 📞 Support

For issues or questions:
- Check existing documentation
- Review similar implementations in codebase
- Create detailed issue reports

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Active Development