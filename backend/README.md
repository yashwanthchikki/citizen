# Cirtizen Backend - Express.js API Server

Backend server for Cirtizen news streaming platform. Handles authentication, content recommendation, AI-powered newspaper generation, and user engagement.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Development server with auto-reload
npm run dev

# Production server
npm start
```

**Server runs on**: `http://localhost:3001`

---

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cirtizen

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=cirtizen-bucket

# AI/LLM
GOOGLE_API_KEY=your_google_genai_api_key

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 🏗️ Project Structure

```
backend/
├── auth service/               # Authentication module
│   ├── controller.js          # Auth logic
│   ├── db.js                  # Database operations
│   └── index.js               # Express routes
│
├── models/                     # Database schemas
│   ├── users.js               # User schema
│   └── assets.js              # Asset schema
│
├── middlewheres/              # Middleware
│   ├── authntication.js       # JWT verification
│   ├── autharisation.js       # Role-based access
│   └── errhandaling.js        # Error handling
│
├── newspaper/                 # Newspaper generation
│   ├── index.js               # Routes
│   └── newspaperservice.js    # AI curation
│
├── section_B,C/               # Feed systems
│   ├── section_b/
│   │   └── index.js           # Main feed routes
│   ├── commen relationship/
│   │   └── index.js           # Comments & likes
│   ├── functions.js           # Utilities
│   ├── vector.js              # Vector DB
│   └── s3.js                  # Cloud storage
│
├── app.js                     # Express server
├── mangodb.js                 # MongoDB connection
├── vectordb.js                # Vector DB setup
├── package.json
└── .env                       # Environment variables
```

---

## 🔐 Authentication

### Sign Up

```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "User Name"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGc..."
}
```

### Sign In

```bash
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Verify Token

```bash
curl -X GET http://localhost:3001/verifytoken \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response**:
```json
{
  "message": "token valid"
}
```

---

## 📰 Newspaper Service (`/newspaper`)

### Generate Custom Newspaper

**Endpoint**: `POST /newspaper/generate`

**Authentication**: Required ✅

**Request**:
```bash
curl -X POST http://localhost:3001/newspaper/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "artificial intelligence",
    "country": "us",
    "dateRange": "2024-01-01"
  }'
```

**Request Body**:
```json
{
  "query": "search topic",
  "country": "us|uk|ca|au|de|fr|ind",
  "dateRange": "YYYY-MM-DD"
}
```

**Response**:
```json
{
  "success": true,
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "summary": "Article summary text...",
      "source": "News Source Name",
      "timestamp": "2 hours ago",
      "url": "https://source.com/article",
      "category": "Technology"
    }
  ],
  "count": 3,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

**Features**:
- 🤖 AI-powered article selection using Google GenAI
- 🌍 Multi-country support
- 📅 Date filtering
- 🔎 Semantic search matching
- 📝 Automatic summarization

---

## 📸 Main Feed Service (`/recc`)

### Fetch Feed Assets

**Endpoint**: `GET /recc/sectionbimages?search=query`

**Authentication**: Required ✅

**Query Parameters**:
- `search` (optional): Search term for filtering

**Example Requests**:
```bash
# Fetch all assets
curl -X GET http://localhost:3001/recc/sectionbimages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "token=YOUR_TOKEN"

# Search for specific assets
curl -X GET "http://localhost:3001/recc/sectionbimages?search=technology" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "assets": [
    {
      "assetid": "asset_123",
      "title": "Article Title",
      "creator": "Creator Name",
      "url": "https://s3.amazonaws.com/image.jpg"
    }
  ]
}
```

### Upload Asset

**Endpoint**: `POST /recc/upload`

**Authentication**: Required ✅

**Request**:
```bash
curl -X POST http://localhost:3001/recc/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg" \
  -F "title=Image Title"
```

**Response**:
```json
{
  "success": true,
  "assetid": "asset_123",
  "url": "https://s3.amazonaws.com/image.jpg",
  "message": "Asset uploaded successfully"
}
```

---

## 🎬 Video Feed Service (`/recc/tiktok`)

### Fetch Video Feed

**Endpoint**: `GET /recc/tiktok`

**Authentication**: Required ✅

**Example**:
```bash
curl -X GET http://localhost:3001/recc/tiktok \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "assets": [
    {
      "assetid": "video_123",
      "creator": "Creator Name",
      "url": "https://s3.amazonaws.com/video.mp4",
      "likes": 245,
      "dislikes": 5,
      "isSubscribed": false,
      "article": "Related news article..."
    }
  ]
}
```

---

## ❤️ Comments & Engagement (`/commen`)

### Like Asset

**Endpoint**: `POST /commen/like?assetid=ASSET_ID`

**Authentication**: Required ✅

**Example**:
```bash
curl -X POST "http://localhost:3001/commen/like?assetid=video_123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "message": "Liked successfully",
  "likes": 246
}
```

### Dislike Asset

**Endpoint**: `POST /commen/dislike?assetid=ASSET_ID`

**Authentication**: Required ✅

**Response**:
```json
{
  "message": "Disliked successfully",
  "dislikes": 6
}
```

### Follow Creator

**Endpoint**: `POST /commen/follow?creatorid=CREATOR_ID`

**Authentication**: Required ✅

**Response**:
```json
{
  "message": "Following successfully",
  "isSubscribed": true
}
```

### Add Comment

**Endpoint**: `POST /commen/comment`

**Authentication**: Required ✅

**Request Body**:
```json
{
  "assetid": "video_123",
  "text": "Great video!"
}
```

**Response**:
```json
{
  "success": true,
  "commentid": "comment_456",
  "message": "Comment added successfully"
}
```

### Get Comments

**Endpoint**: `GET /commen/comments?assetid=ASSET_ID`

**Authentication**: Required ✅

**Response**:
```json
{
  "success": true,
  "comments": [
    {
      "commentid": "comment_456",
      "userid": "user_123",
      "username": "User Name",
      "text": "Great video!",
      "timestamp": "2024-01-15T10:30:00Z",
      "likes": 5
    }
  ],
  "count": 1
}
```

---

## 🔍 Vector Search Implementation

Vector DB is used for semantic content matching.

**File**: `backend/vectordb.js`

### How It Works

1. **Embedding Generation**: Content text is converted to vector embeddings
2. **FAISS Index**: Vectors stored in FAISS for fast similarity search
3. **Query Matching**: User queries converted to vectors and compared
4. **Ranking**: Results ranked by similarity score

**Example Usage** (in code):
```javascript
const { vectorSearch } = require('./section_B,C/vector.js');

// Search for similar content
const results = vectorSearch(queryEmbedding, topK=10);
// Returns: [{ assetid, similarity_score, content }]
```

---

## 💾 Database Schemas

### User Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  profile: {
    avatar: String,
    bio: String
  },
  followers: [userId],
  following: [userId],
  createdAt: Date,
  updatedAt: Date
}
```

### Asset Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  assetid: String (unique),
  title: String,
  creator: String (userId),
  url: String (S3),
  type: String, // 'image', 'video'
  likes: [userId],
  dislikes: [userId],
  comments: [commentId],
  tags: [String],
  createdAt: Date
}
```

### Engagement Schema (MongoDB)

```javascript
{
  _id: ObjectId,
  assetid: String,
  likes: [userId],
  dislikes: [userId],
  comments: [
    {
      userid: String,
      text: String,
      timestamp: Date
    }
  ],
  views: Number,
  shares: Number
}
```

---

## 🛡️ Middleware

### Authentication Middleware

**File**: `backend/middlewheres/authntication.js`

Verifies JWT token from request headers or cookies.

**Usage**:
```javascript
router.get('/protected', authentication, (req, res) => {
  // req.userId available here
});
```

### Authorization Middleware

**File**: `backend/middlewheres/autharisation.js`

Checks user roles/permissions.

**Usage**:
```javascript
router.delete('/admin/users', authentication, authorize(['admin']), (req, res) => {
  // Only admins can access
});
```

### Error Handling Middleware

**File**: `backend/middlewheres/errhandaling.js`

Centralized error handling.

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 📤 AWS S3 Integration

**File**: `backend/section_B,C/s3.js`

Handles file uploads and retrieval from S3.

**Configuration**:
```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
```

**Upload Example**:
```javascript
const uploadToS3 = async (filename, fileContent) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `assets/${Date.now()}-${filename}`,
    Body: fileContent,
    ContentType: 'image/jpeg'
  };
  return await s3Client.send(new PutObjectCommand(params));
};
```

---

## 🤖 AI Integration

**File**: `backend/newspaper/newspaperservice.js`

Uses Google GenAI and LangChain for:
- Article selection and ranking
- Content summarization
- Category classification
- Relevance scoring

**Example Usage**:
```javascript
const { generateNewspaper } = require('./newspaper/newspaperservice');

const newspaper = await generateNewspaper({
  query: 'artificial intelligence',
  country: 'us'
});
```

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Sign up
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use returned token for authenticated requests
export TOKEN="eyJhbGc..."
curl -X GET http://localhost:3001/recc/sectionbimages \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Create new request
2. Set method (GET/POST/etc)
3. Enter URL: `http://localhost:3001/endpoint`
4. Add headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
5. Add request body (if needed)
6. Send

---

## 🐛 Debugging

### Enable Debug Logging

```javascript
// Add to app.js
const debug = require('debug')('cirtizen:*');

app.use((req, res, next) => {
  debug(`${req.method} ${req.path}`);
  next();
});
```

### Check Database Connection

```bash
# MongoDB Atlas connection test
mongosh "mongodb+srv://user:password@cluster.mongodb.net/cirtizen"
```

### Monitor Server

```bash
# View all active connections
lsof -i :3001

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 🚀 Deployment

### Production Build

```bash
npm install --production
NODE_ENV=production npm start
```

### Environment for Production

Update `.env`:
```env
NODE_ENV=production
PORT=3001
MONGODB_URI=production_mongodb_uri
JWT_SECRET=production_secret_key
FRONTEND_URL=https://yourdomain.com
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t cirtizen-backend .
docker run -p 3001:3001 --env-file .env cirtizen-backend
```

---

## 📊 Performance Optimization

### Database Indexing

```javascript
// Create indexes for faster queries
db.users.createIndex({ email: 1 });
db.assets.createIndex({ creator: 1 });
db.assets.createIndex({ tags: 1 });
```

### Caching Strategy

```javascript
// Use Redis or in-memory cache for frequent queries
const cache = new Map();
const getCachedAssets = (key) => cache.get(key);
```

### Query Optimization

```javascript
// Use projection to fetch only needed fields
Asset.find({}).select('assetid title creator').lean();
```

---

## 🔄 Common Tasks

### Add New API Route

1. Create route file in appropriate directory
2. Import and use in `app.js`
3. Add authentication if needed
4. Update API documentation

### Add New Database Schema

1. Create model file in `/models`
2. Define schema with Mongoose
3. Export model
4. Use in services

### Integrate New AI Model

1. Add integration code in `/newspaper` or relevant service
2. Update API calls accordingly
3. Add error handling
4. Test thoroughly

---

## 📞 Support & Troubleshooting

**Common Issues**:

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Verify MONGODB_URI in .env, check network access |
| JWT token invalid | Ensure JWT_SECRET matches, token not expired |
| S3 upload fails | Check AWS credentials, bucket name, region |
| CORS errors | Verify FRONTEND_URL in .env matches client origin |
| Vector DB errors | Ensure FAISS installed, check embedding model |

---

## 🔗 Related Documentation

- [Main README](../README.md) - Overall project documentation
- [Frontend README](../frontend/README.md) - Frontend documentation

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Active Development