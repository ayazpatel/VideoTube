import api from './api';

const subscriptionService = {
  toggleSubscription: (channelId) => {
    return api.post(`/subscriptions/c/${channelId}`);
  },

  getChannelSubscribers: (channelId) => {
    return api.get(`/subscriptions/c/${channelId}`);
  },

  getSubscribedChannels: (subscriberId) => {
    return api.get(`/subscriptions/u/${subscriberId}`);
  },
};

export default subscriptionService;
