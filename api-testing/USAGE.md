# Installation and Usage Guide

## Quick Start

1. **Navigate to the api-testing directory:**
   ```bash
   cd api-testing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Add your test files:**
   - Copy test images to `test-files/images/`
   - Copy test videos to `test-files/videos/`
   - See `test-files/README.md` for file requirements

4. **Start your backend server** (in another terminal):
   ```bash
   cd ../backend
   npm run dev
   ```

5. **Run the API tests:**
   ```bash
   npm test
   # or
   node test-api.js
   ```

## What the Test Script Does

The comprehensive test script will:

### Authentication Tests
- ✅ Test user registration with file uploads
- ✅ Test user login and token management
- ✅ Test user logout
- ✅ Test user profile updates

### Video Management Tests
- ✅ Test video upload with files
- ✅ Test get all videos with pagination
- ✅ Test get video by ID (with view count increment)
- ✅ Test video like/unlike functionality

### Comment Tests
- ✅ Test adding comments to videos
- ✅ Test getting video comments with pagination

### Playlist Tests
- ✅ Test creating playlists
- ✅ Test adding videos to playlists

### Social Features Tests
- ✅ Test creating tweets
- ✅ Test getting user tweets
- ✅ Test tweet like/unlike functionality
- ✅ Test channel subscription/unsubscription

### Analytics Tests
- ✅ Test dashboard statistics
- ✅ Test getting channel videos
- ✅ Test getting liked videos

### Health Check
- ✅ Test API health endpoint

## Output

The script provides colored console output showing:
- ✅ Successful tests in green
- ❌ Failed tests in red
- ℹ️ Information messages in blue
- ⚠️ Warnings in yellow

## Final Report

After all tests complete, you'll see:
- Total number of passed tests
- Total number of failed tests  
- Success percentage
- Summary message

## Troubleshooting

If tests fail:
1. Ensure backend server is running on `http://localhost:8000`
2. Check that all required test files are present
3. Verify database connection is working
4. Check console logs for specific error messages

## Customization

You can modify `test-api.js` to:
- Change the base URL if your server runs on a different port
- Add more test cases
- Modify test data
- Add custom validation logic
