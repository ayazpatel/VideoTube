# API Testing Setup

This directory contains all the files needed to test the VideoTube backend APIs.

## Directory Structure
```
api-testing/
├── test-api.js          # Main test file
├── package.json         # Dependencies for testing
├── test-files/          # Test media files
│   ├── images/          # Test images for avatars, covers, thumbnails
│   └── videos/          # Test video files
└── README.md           # This file
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd api-testing
   npm install
   ```

2. **Add Test Files:**
   - Add test images (JPG, PNG) to `test-files/images/`
   - Add test videos (MP4, etc.) to `test-files/videos/`

3. **Configure Environment:**
   - Make sure your backend server is running on `http://localhost:8000`
   - Update the base URL in `test-api.js` if different

4. **Run Tests:**
   ```bash
   node test-api.js
   ```

## Test Files Needed

### Images (test-files/images/)
- `avatar1.jpg` - Test avatar image
- `avatar2.png` - Alternative avatar image
- `cover1.jpg` - Test cover image
- `cover2.png` - Alternative cover image
- `thumbnail1.jpg` - Test thumbnail image
- `thumbnail2.png` - Alternative thumbnail image

### Videos (test-files/videos/)
- `test-video1.mp4` - Primary test video
- `test-video2.mp4` - Secondary test video

## What Gets Tested

The test script will test all major API endpoints including:
- User registration and authentication
- Video upload and management
- Comments and likes
- Playlists and subscriptions
- Tweets and dashboard analytics

## Notes

- The script will create test users and clean up after testing
- All uploaded files will be properly managed
- Console output will show detailed test results
- Failed tests will be clearly marked with error details
