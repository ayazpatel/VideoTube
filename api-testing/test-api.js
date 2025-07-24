import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_FILES_DIR = path.join(__dirname, 'test-files');

// Test data storage
let testData = {
    users: [],
    videos: [],
    comments: [],
    tweets: [],
    playlists: []
};

// Utility functions
const log = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const colors = {
        success: '\x1b[32m',
        error: '\x1b[31m',
        warning: '\x1b[33m',
        info: '\x1b[36m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkFileExists = (filePath) => {
    if (!fs.existsSync(filePath)) {
        log(`File not found: ${filePath}`, 'warning');
        return false;
    }
    return true;
};

// API Testing Functions
class VideoTubeAPITester {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 30000
        });
    }

    async testHealthCheck() {
        log('Testing Health Check...', 'info');
        try {
            const response = await this.axiosInstance.get('/healthcheck');
            log('✅ Health Check: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Health Check: FAILED - ${error.message}`, 'error');
            return false;
        }
    }

    async testUserRegistration() {
        log('Testing User Registration...', 'info');
        try {
            const avatarPath = path.join(TEST_FILES_DIR, 'images', 'avatar1.jpg');
            const coverPath = path.join(TEST_FILES_DIR, 'images', 'cover1.jpg');

            if (!checkFileExists(avatarPath)) {
                log('Creating placeholder avatar file...', 'warning');
                fs.writeFileSync(avatarPath, 'placeholder avatar content');
            }

            const formData = new FormData();
            formData.append('fullName', 'Test User 1');
            formData.append('email', `testuser1_${Date.now()}@example.com`);
            formData.append('username', `testuser1_${Date.now()}`);
            formData.append('password', 'TestPass123!');
            
            if (fs.existsSync(avatarPath)) {
                formData.append('avatar', fs.createReadStream(avatarPath));
            }
            if (fs.existsSync(coverPath)) {
                formData.append('coverImage', fs.createReadStream(coverPath));
            }

            const response = await this.axiosInstance.post('/users/register', formData, {
                headers: formData.getHeaders()
            });

            testData.users.push({
                id: response.data.data._id,
                email: response.data.data.email,
                username: response.data.data.username,
                fullName: response.data.data.fullName
            });

            log('✅ User Registration: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ User Registration: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testUserLogin() {
        log('Testing User Login...', 'info');
        try {
            if (testData.users.length === 0) {
                throw new Error('No registered users available for login test');
            }

            const user = testData.users[0];
            const response = await this.axiosInstance.post('/users/login', {
                email: user.email,
                password: 'TestPass123!'
            });

            // Store tokens for authenticated requests
            this.accessToken = response.data.data.accessToken;
            this.refreshToken = response.data.data.refreshToken;
            
            // Set default authorization header
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;

            log('✅ User Login: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ User Login: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testVideoUpload() {
        log('Testing Video Upload...', 'info');
        try {
            const videoPath = path.join(TEST_FILES_DIR, 'videos', 'test-video1.mp4');
            const thumbnailPath = path.join(TEST_FILES_DIR, 'images', 'thumbnail1.jpg');

            if (!checkFileExists(videoPath)) {
                log('Creating placeholder video file...', 'warning');
                fs.writeFileSync(videoPath, 'placeholder video content');
            }
            if (!checkFileExists(thumbnailPath)) {
                log('Creating placeholder thumbnail file...', 'warning');
                fs.writeFileSync(thumbnailPath, 'placeholder thumbnail content');
            }

            const formData = new FormData();
            formData.append('title', 'Test Video 1');
            formData.append('description', 'This is a test video for API testing');
            formData.append('videoFile', fs.createReadStream(videoPath));
            formData.append('thumbnail', fs.createReadStream(thumbnailPath));

            const response = await this.axiosInstance.post('/videos', formData, {
                headers: formData.getHeaders()
            });

            testData.videos.push({
                id: response.data.data._id,
                title: response.data.data.title,
                description: response.data.data.description
            });

            log('✅ Video Upload: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Video Upload: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetAllVideos() {
        log('Testing Get All Videos...', 'info');
        try {
            const response = await this.axiosInstance.get('/videos?page=1&limit=10');
            
            log(`✅ Get All Videos: PASSED - Found ${response.data.data.videos?.length || 0} videos`, 'success');
            return true;
        } catch (error) {
            log(`❌ Get All Videos: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetVideoById() {
        log('Testing Get Video By ID...', 'info');
        try {
            if (testData.videos.length === 0) {
                throw new Error('No videos available for testing');
            }

            const videoId = testData.videos[0].id;
            const response = await this.axiosInstance.get(`/videos/${videoId}`);

            log('✅ Get Video By ID: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Get Video By ID: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testVideoLike() {
        log('Testing Video Like Toggle...', 'info');
        try {
            if (testData.videos.length === 0) {
                throw new Error('No videos available for testing');
            }

            const videoId = testData.videos[0].id;
            
            // Like the video
            const likeResponse = await this.axiosInstance.post(`/likes/toggle/v/${videoId}`);
            log('Video liked successfully', 'info');

            // Unlike the video
            const unlikeResponse = await this.axiosInstance.post(`/likes/toggle/v/${videoId}`);
            log('Video unliked successfully', 'info');

            log('✅ Video Like Toggle: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Video Like Toggle: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testAddComment() {
        log('Testing Add Comment...', 'info');
        try {
            if (testData.videos.length === 0) {
                throw new Error('No videos available for testing');
            }

            const videoId = testData.videos[0].id;
            const response = await this.axiosInstance.post(`/comments/${videoId}`, {
                content: 'This is a test comment for the video!'
            });

            testData.comments.push({
                id: response.data.data._id,
                content: response.data.data.content,
                videoId: videoId
            });

            log('✅ Add Comment: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Add Comment: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetVideoComments() {
        log('Testing Get Video Comments...', 'info');
        try {
            if (testData.videos.length === 0) {
                throw new Error('No videos available for testing');
            }

            const videoId = testData.videos[0].id;
            const response = await this.axiosInstance.get(`/comments/${videoId}?page=1&limit=10`);

            log(`✅ Get Video Comments: PASSED - Found ${response.data.data.docs?.length || 0} comments`, 'success');
            return true;
        } catch (error) {
            log(`❌ Get Video Comments: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testCreatePlaylist() {
        log('Testing Create Playlist...', 'info');
        try {
            const response = await this.axiosInstance.post('/playlist', {
                name: 'Test Playlist 1',
                description: 'This is a test playlist for API testing'
            });

            testData.playlists.push({
                id: response.data.data._id,
                name: response.data.data.name,
                description: response.data.data.description
            });

            log('✅ Create Playlist: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Create Playlist: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testAddVideoToPlaylist() {
        log('Testing Add Video to Playlist...', 'info');
        try {
            if (testData.videos.length === 0 || testData.playlists.length === 0) {
                throw new Error('No videos or playlists available for testing');
            }

            const videoId = testData.videos[0].id;
            const playlistId = testData.playlists[0].id;

            const response = await this.axiosInstance.patch(`/playlist/add/${videoId}/${playlistId}`);

            log('✅ Add Video to Playlist: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Add Video to Playlist: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testCreateTweet() {
        log('Testing Create Tweet...', 'info');
        try {
            const response = await this.axiosInstance.post('/tweets', {
                content: 'This is a test tweet for API testing! 🚀'
            });

            testData.tweets.push({
                id: response.data.data._id,
                content: response.data.data.content
            });

            log('✅ Create Tweet: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Create Tweet: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetUserTweets() {
        log('Testing Get User Tweets...', 'info');
        try {
            if (testData.users.length === 0) {
                throw new Error('No users available for testing');
            }

            const userId = testData.users[0].id;
            const response = await this.axiosInstance.get(`/tweets/user/${userId}`);

            log(`✅ Get User Tweets: PASSED - Found ${response.data.data?.length || 0} tweets`, 'success');
            return true;
        } catch (error) {
            log(`❌ Get User Tweets: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testTweetLike() {
        log('Testing Tweet Like Toggle...', 'info');
        try {
            if (testData.tweets.length === 0) {
                throw new Error('No tweets available for testing');
            }

            const tweetId = testData.tweets[0].id;
            
            // Like the tweet
            await this.axiosInstance.post(`/likes/toggle/t/${tweetId}`);
            log('Tweet liked successfully', 'info');

            // Unlike the tweet
            await this.axiosInstance.post(`/likes/toggle/t/${tweetId}`);
            log('Tweet unliked successfully', 'info');

            log('✅ Tweet Like Toggle: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Tweet Like Toggle: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testSubscription() {
        log('Testing Subscription Toggle...', 'info');
        try {
            // Register another user to test subscription
            const formData = new FormData();
            formData.append('fullName', 'Test User 2');
            formData.append('email', `testuser2_${Date.now()}@example.com`);
            formData.append('username', `testuser2_${Date.now()}`);
            formData.append('password', 'TestPass123!');

            const avatarPath = path.join(TEST_FILES_DIR, 'images', 'avatar2.jpg');
            if (!checkFileExists(avatarPath)) {
                fs.writeFileSync(avatarPath, 'placeholder avatar content');
            }
            formData.append('avatar', fs.createReadStream(avatarPath));

            const registerResponse = await this.axiosInstance.post('/users/register', formData, {
                headers: formData.getHeaders()
            });

            const channelId = registerResponse.data.data._id;

            // Subscribe to the channel
            await this.axiosInstance.post(`/subscriptions/c/${channelId}`);
            log('Subscribed to channel successfully', 'info');

            // Unsubscribe from the channel
            await this.axiosInstance.post(`/subscriptions/c/${channelId}`);
            log('Unsubscribed from channel successfully', 'info');

            log('✅ Subscription Toggle: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Subscription Toggle: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testDashboardStats() {
        log('Testing Dashboard Stats...', 'info');
        try {
            const response = await this.axiosInstance.get('/dashboard/stats');

            log('✅ Dashboard Stats: PASSED', 'success');
            log(`Stats: ${JSON.stringify(response.data.data, null, 2)}`, 'info');
            return true;
        } catch (error) {
            log(`❌ Dashboard Stats: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetChannelVideos() {
        log('Testing Get Channel Videos...', 'info');
        try {
            const response = await this.axiosInstance.get('/dashboard/videos');

            log(`✅ Get Channel Videos: PASSED - Found ${response.data.data?.length || 0} videos`, 'success');
            return true;
        } catch (error) {
            log(`❌ Get Channel Videos: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testUpdateUserProfile() {
        log('Testing Update User Profile...', 'info');
        try {
            // Update account details
            await this.axiosInstance.patch('/users/update-account', {
                fullName: 'Updated Test User',
                email: testData.users[0].email
            });
            log('Account details updated successfully', 'info');

            // Update avatar
            const avatarPath = path.join(TEST_FILES_DIR, 'images', 'avatar2.jpg');
            if (checkFileExists(avatarPath)) {
                const formData = new FormData();
                formData.append('avatar', fs.createReadStream(avatarPath));

                await this.axiosInstance.patch('/users/avatar', formData, {
                    headers: formData.getHeaders()
                });
                log('Avatar updated successfully', 'info');
            }

            log('✅ Update User Profile: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Update User Profile: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testGetLikedVideos() {
        log('Testing Get Liked Videos...', 'info');
        try {
            const response = await this.axiosInstance.get('/likes/videos');

            log(`✅ Get Liked Videos: PASSED - Found ${response.data.data?.length || 0} liked videos`, 'success');
            return true;
        } catch (error) {
            log(`❌ Get Liked Videos: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testLogout() {
        log('Testing User Logout...', 'info');
        try {
            await this.axiosInstance.post('/users/logout');
            
            // Clear tokens
            delete this.axiosInstance.defaults.headers.common['Authorization'];
            
            log('✅ User Logout: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ User Logout: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async testTogglePublishStatus() {
        log('Testing Toggle Publish Status...', 'info');
        try {
            if (testData.videos.length === 0) {
                throw new Error('No videos available for testing');
            }

            const videoId = testData.videos[0].id;
            
            // Toggle publish status
            const response = await this.axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
            log(`Video publish status toggled to: ${response.data.data.isPublished}`, 'info');

            // Toggle back
            const response2 = await this.axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
            log(`Video publish status toggled back to: ${response2.data.data.isPublished}`, 'info');

            log('✅ Toggle Publish Status: PASSED', 'success');
            return true;
        } catch (error) {
            log(`❌ Toggle Publish Status: FAILED - ${error.response?.data?.message || error.message}`, 'error');
            return false;
        }
    }

    async runAllTests() {
        log('🚀 Starting VideoTube API Testing Suite...', 'info');
        log('='.repeat(50), 'info');

        const tests = [
            { name: 'Health Check', fn: () => this.testHealthCheck() },
            { name: 'User Registration', fn: () => this.testUserRegistration() },
            { name: 'User Login', fn: () => this.testUserLogin() },
            { name: 'Video Upload', fn: () => this.testVideoUpload() },
            { name: 'Get All Videos', fn: () => this.testGetAllVideos() },
            { name: 'Get Video By ID', fn: () => this.testGetVideoById() },
            { name: 'Toggle Publish Status', fn: () => this.testTogglePublishStatus() },
            { name: 'Video Like Toggle', fn: () => this.testVideoLike() },
            { name: 'Add Comment', fn: () => this.testAddComment() },
            { name: 'Get Video Comments', fn: () => this.testGetVideoComments() },
            { name: 'Create Playlist', fn: () => this.testCreatePlaylist() },
            { name: 'Add Video to Playlist', fn: () => this.testAddVideoToPlaylist() },
            { name: 'Create Tweet', fn: () => this.testCreateTweet() },
            { name: 'Get User Tweets', fn: () => this.testGetUserTweets() },
            { name: 'Tweet Like Toggle', fn: () => this.testTweetLike() },
            { name: 'Subscription Toggle', fn: () => this.testSubscription() },
            { name: 'Dashboard Stats', fn: () => this.testDashboardStats() },
            { name: 'Get Channel Videos', fn: () => this.testGetChannelVideos() },
            { name: 'Update User Profile', fn: () => this.testUpdateUserProfile() },
            { name: 'Get Liked Videos', fn: () => this.testGetLikedVideos() },
            { name: 'User Logout', fn: () => this.testLogout() }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
            try {
                log(`\n📋 Running: ${test.name}`, 'info');
                const result = await test.fn();
                if (result) {
                    passed++;
                } else {
                    failed++;
                }
            } catch (error) {
                log(`❌ ${test.name}: UNEXPECTED ERROR - ${error.message}`, 'error');
                failed++;
            }
            
            // Small delay between tests
            await sleep(1000);
        }

        log('\n' + '='.repeat(50), 'info');
        log('🏁 Testing Complete!', 'info');
        log(`✅ Passed: ${passed}`, 'success');
        log(`❌ Failed: ${failed}`, 'error');
        log(`📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(2)}%`, 'info');
        
        if (failed === 0) {
            log('🎉 All tests passed! Your API is working perfectly!', 'success');
        } else {
            log('⚠️  Some tests failed. Please check the error messages above.', 'warning');
        }

        return { passed, failed, total: passed + failed };
    }
}

// Main execution
async function main() {
    try {
        // Check if backend is running
        log('Checking if backend server is running...', 'info');
        const healthResponse = await axios.get(`${BASE_URL}/healthcheck`);
        log('✅ Backend server is running!', 'success');

        const tester = new VideoTubeAPITester();
        await tester.runAllTests();
    } catch (error) {
        log('❌ Cannot connect to backend server. Please make sure it\'s running on http://localhost:8000', 'error');
        log(`Error: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Run the tests
main().catch(console.error);
