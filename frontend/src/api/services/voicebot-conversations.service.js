import axios from 'src/utils/axios';

export const vbtConversationsUrl = '/api/v1/voicebot-conversations';

export const getAll = (url) => axios.get(url).then((res) => res.data);
