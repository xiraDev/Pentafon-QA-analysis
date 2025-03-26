import axios from 'src/utils/axios';

export const whatsappConversationsUrl = '/api/v1/whatsapp-conversations';

export const getAll = (url) => axios.get(url).then((res) => res.data);
