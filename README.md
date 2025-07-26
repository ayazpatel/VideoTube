# VideoTube 🎬

A full-stack YouTube-like video sharing platform built with modern web technologies. VideoTube allows users to upload, share, and interact with videos while providing a comprehensive social media experience with features like comments, likes, playlists, and subscriptions.

![VideoTube Banner](https://img.shields.io/badge/VideoTube-Full--Stack-blue?style=for-the-badge)

## 📖 Table of Contents

- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [🏗️ Project Structure](#project-structure)
- [⚡ Quick Start](#quick-start)
- [🔧 Installation](#installation)
- [🌐 Environment Variables](#environment-variables)
- [📚 API Documentation](#api-documentation)
- [🚀 Deployment](#deployment)
- [🧪 Testing](#testing)
- [📄 License](#license)
- [👤 Author](#author)

## ✨ Features

### 🎥 Video Management

- **Upload & Streaming**: Upload videos with thumbnails and metadata
- **Video Player**: Custom video player with progress tracking
- **Watch History**: Track and display user's viewing history
- **Video Analytics**: View counts, engagement metrics for creators

### 👥 User System

- **Authentication**: Secure JWT-based authentication
- **User Profiles**: Customizable profiles with avatars and cover images
- **Channel System**: Personal channels for content creators
- **Account Management**: Update profile, change passwords, manage settings

### 💬 Social Features

- **Comments**: Threaded commenting system on videos
- **Likes/Dislikes**: Like videos, comments, and tweets
- **Subscriptions**: Subscribe to channels and get updates
- **Playlists**: Create and manage video playlists
- **Tweets**: Twitter-like microblogging feature

### 📊 Creator Dashboard

- **Analytics**: Comprehensive statistics for content creators
- **Video Management**: Bulk operations on uploaded videos
- **Subscriber Insights**: Track subscriber growth and engagement

### 🎨 Frontend Features

- **Responsive Design**: Mobile-first responsive design with Bootstrap
- **Modern UI**: Clean, YouTube-inspired interface
- **State Management**: Redux Toolkit for efficient state management
- **Real-time Updates**: Dynamic content updates without page refresh

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: MinIO (S3-compatible object storage)
- **Video Processing**: FFmpeg integration for video metadata
- **API Documentation**: Comprehensive REST API

### Frontend

- **Framework**: React 18 with modern hooks
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v6
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite for fast development and building

### DevOps & Infrastructure

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes manifests
- **Development**: Hot reload, auto-restart with Nodemon
- **Testing**: Comprehensive API testing suite

## 🏗️ Project Structure

```text
VideoTube/
├── 📁 backend/              # Node.js Express API server
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Route handlers
│   │   ├── 📁 models/       # Mongoose schemas
│   │   ├── 📁 routes/       # API routes
│   │   ├── 📁 middlewares/  # Auth, upload middlewares
│   │   ├── 📁 utils/        # Helper utilities
│   │   └── 📁 db/           # Database connection
│   └── 📁 public/temp/      # Temporary file uploads
├── 📁 frontend/             # React.js client application
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   ├── 📁 pages/        # Page components
│   │   ├── 📁 store/        # Redux store & slices
│   │   ├── 📁 services/     # API service layer
│   │   ├── 📁 routes/       # App routing
│   │   └── 📁 utils/        # Helper functions
│   └── 📁 public/           # Static assets
├── 📁 api-testing/          # API testing scripts
│   ├── test-api.js          # Automated API tests
│   └── 📁 test-files/       # Sample files for testing
├── 📁 infra/                # Infrastructure & deployment
│   ├── 📁 docker/           # Docker configurations
│   ├── 📁 k8s/              # Kubernetes manifests
│   └── 📁 selfhosted_s3/    # MinIO setup
└── 📁 docs/                 # Documentation
```

## ⚡ Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- MinIO or AWS S3
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ayazpatel/VideoTube.git
cd VideoTube
```

### 2. Start MinIO (Object Storage)

```bash
cd infra/docker/backend
docker-compose -f minio-compose.yml up -d
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5000>
- **MinIO Console**: <http://localhost:7001>

## 🔧 Installation

### Backend Setup

1. **Install Dependencies**

```bash
cd backend
npm install
```

2. **Environment Configuration**

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/videotube

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d

# MinIO/S3 Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=7000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=videotube
MINIO_USE_SSL=false
```

3. **Start Development Server**

```bash
npm run dev
```

### Frontend Setup

1. **Install Dependencies**

```bash
cd frontend
npm install
```

2. **Environment Configuration**

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

3. **Start Development Server**

```bash
npm run dev
```

## 🌐 Environment Variables

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | - |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | - |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | `1d` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | - |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | `10d` |
| `MINIO_ENDPOINT` | MinIO server endpoint | - |
| `MINIO_PORT` | MinIO server port | `9000` |
| `MINIO_ACCESS_KEY` | MinIO access key | - |
| `MINIO_SECRET_KEY` | MinIO secret key | - |
| `MINIO_BUCKET_NAME` | Default bucket name | - |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

## 📚 API Documentation

The backend provides a comprehensive REST API with the following endpoints:

### Authentication & Users

- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update user profile

### Videos

- `GET /api/v1/videos` - Get all videos (with pagination)
- `POST /api/v1/videos` - Upload new video
- `GET /api/v1/videos/:id` - Get video by ID
- `PATCH /api/v1/videos/:id` - Update video
- `DELETE /api/v1/videos/:id` - Delete video

### Comments

- `GET /api/v1/comments/:videoId` - Get video comments
- `POST /api/v1/comments/:videoId` - Add comment
- `PATCH /api/v1/comments/c/:commentId` - Update comment
- `DELETE /api/v1/comments/c/:commentId` - Delete comment

### Likes & Subscriptions

- `POST /api/v1/likes/toggle/v/:videoId` - Toggle video like
- `POST /api/v1/subscriptions/c/:channelId` - Toggle subscription

For complete API documentation, see [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🚀 Deployment

### Using Docker

1. **Backend Deployment**

```bash
cd backend
docker build -t videotube-backend .
docker run -p 5000:5000 videotube-backend
```

2. **Frontend Deployment**

```bash
cd frontend
docker build -t videotube-frontend .
docker run -p 3000:3000 videotube-frontend
```

### Using Kubernetes

Deploy using the provided Kubernetes manifests:

```bash
kubectl apply -f infra/k8s/
```

### Production Considerations

- **Database**: Use MongoDB Atlas or a managed MongoDB service
- **File Storage**: Use AWS S3 or another cloud object storage
- **CDN**: Implement CDN for video delivery
- **SSL**: Configure HTTPS for production
- **Environment**: Use production-grade environment variables
- **Monitoring**: Implement logging and monitoring solutions

## 🧪 Testing

### API Testing

Run the comprehensive API test suite:

```bash
cd api-testing
npm install
npm test
```

The test suite covers:

- User registration and authentication
- Video upload and management
- Comment system
- Like/unlike functionality
- Subscription system
- Playlist management

### Frontend Testing

```bash
cd frontend
npm run test
```

## 📄 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👤 Author

### Ayaz Patel

- GitHub: [@ayazpatel](https://github.com/ayazpatel)
- Email: <ayaz@example.com>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ayazpatel/VideoTube/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Built with ❤️ by Ayaz Patel