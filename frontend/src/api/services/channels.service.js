import axios, { endpoints } from '../../utils/axios';

export const channelUrl = endpoints.channels;

export const getChannels = (url = channelUrl) => axios.get(url).then((res) => res.data);
