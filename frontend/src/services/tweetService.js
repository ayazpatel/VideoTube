import api from './api';

const tweetService = {
  createTweet: (tweetData) => {
    return api.post('/tweets', tweetData);
  },

  getUserTweets: (userId) => {
    return api.get(`/tweets/user/${userId}`);
  },

  updateTweet: (tweetId, tweetData) => {
    return api.patch(`/tweets/${tweetId}`, tweetData);
  },

  deleteTweet: (tweetId) => {
    return api.delete(`/tweets/${tweetId}`);
  },
};

export default tweetService;
