# VideoTube Backend API Documentation

## Completed APIs Summary

### 1. User Controller (`/api/v1/users`)
- ✅ `POST /register` - Register new user with avatar and cover image
- ✅ `POST /login` - User login with JWT tokens
- ✅ `POST /logout` - User logout (requires auth)
- ✅ `POST /refresh-token` - Refresh access token
- ✅ `POST /change-password` - Change user password (requires auth)
- ✅ `GET /current-user` - Get current user details (requires auth)
- ✅ `PATCH /update-account` - Update account details (requires auth)
- ✅ `PATCH /avatar` - Update user avatar (requires auth, file upload)
- ✅ `PATCH /cover-image` - Update user cover image (requires auth, file upload)
- ✅ `GET /c/:username` - Get user channel profile
- ✅ `GET /history` - Get user watch history (requires auth)

### 2. Video Controller (`/api/v1/videos`)
- ✅ `GET /` - Get all videos with pagination, search, and filtering
- ✅ `POST /` - Publish new video (requires auth, file upload)
- ✅ `GET /:videoId` - Get video by ID (updates view count and watch history)
- ✅ `PATCH /:videoId` - Update video details and thumbnail (requires auth)
- ✅ `DELETE /:videoId` - Delete video (requires auth, deletes files from MinIO)
- ✅ `PATCH /toggle/publish/:videoId` - Toggle video publish status (requires auth)

### 3. Comment Controller (`/api/v1/comments`)
- ✅ `GET /:videoId` - Get all comments for a video with pagination
- ✅ `POST /:videoId` - Add comment to a video (requires auth)
- ✅ `PATCH /c/:commentId` - Update comment (requires auth, owner only)
- ✅ `DELETE /c/:commentId` - Delete comment (requires auth, owner only)

### 4. Like Controller (`/api/v1/likes`)
- ✅ `POST /toggle/v/:videoId` - Toggle like on video (requires auth)
- ✅ `POST /toggle/c/:commentId` - Toggle like on comment (requires auth)
- ✅ `POST /toggle/t/:tweetId` - Toggle like on tweet (requires auth)
- ✅ `GET /videos` - Get all liked videos by user (requires auth)

### 5. Playlist Controller (`/api/v1/playlist`)
- ✅ `POST /` - Create new playlist (requires auth)
- ✅ `GET /:playlistId` - Get playlist by ID with videos
- ✅ `PATCH /:playlistId` - Update playlist details (requires auth, owner only)
- ✅ `DELETE /:playlistId` - Delete playlist (requires auth, owner only)
- ✅ `PATCH /add/:videoId/:playlistId` - Add video to playlist (requires auth, owner only)
- ✅ `PATCH /remove/:videoId/:playlistId` - Remove video from playlist (requires auth, owner only)
- ✅ `GET /user/:userId` - Get user playlists

### 6. Subscription Controller (`/api/v1/subscriptions`)
- ✅ `POST /c/:channelId` - Toggle subscription to channel (requires auth)
- ✅ `GET /c/:channelId` - Get channel subscribers list (requires auth)
- ✅ `GET /u/:subscriberId` - Get subscribed channels list (requires auth)

### 7. Tweet Controller (`/api/v1/tweets`)
- ✅ `POST /` - Create new tweet (requires auth)
- ✅ `GET /user/:userId` - Get user tweets with like details
- ✅ `PATCH /:tweetId` - Update tweet (requires auth, owner only)
- ✅ `DELETE /:tweetId` - Delete tweet (requires auth, owner only)

### 8. Dashboard Controller (`/api/v1/dashboard`)
- ✅ `GET /stats` - Get channel statistics (requires auth)
- ✅ `GET /videos` - Get channel videos with stats (requires auth)

### 9. Health Check Controller (`/api/v1/healthcheck`)
- ✅ `GET /` - Health check endpoint

## Key Features Implemented

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Protected routes using `verifyJWT` middleware
- Owner-only operations for user-generated content

### File Management
- MinIO S3-compatible storage for files
- Automatic cleanup of old files when updating
- Support for video files, thumbnails, avatars, and cover images

### Database Operations
- MongoDB with Mongoose ODM
- Aggregation pipelines for complex queries
- Pagination support using mongoose-aggregate-paginate-v2

### API Patterns
- Consistent error handling using `ApiError` utility
- Standardized responses using `ApiResponse` utility
- Async error handling with `asyncHandler` wrapper

### Advanced Features
- Video view tracking and watch history
- Like/unlike functionality for videos, comments, and tweets
- Subscription system with subscriber/channel relationships
- Playlist management with video collections
- Dashboard analytics for content creators

## Error Handling
All endpoints implement comprehensive error handling for:
- Invalid ObjectIds
- Unauthorized access attempts
- Missing required fields
- File upload failures
- Database operation failures
- Resource not found scenarios

## Security Features
- Password validation with regex patterns
- Secure cookie handling
- File type validation
- Owner verification for protected operations
- Input sanitization and validation

## File Upload Support
- Avatar images (users)
- Cover images (users)
- Video files (videos)
- Thumbnail images (videos)
- Automatic file cleanup on updates/deletions
