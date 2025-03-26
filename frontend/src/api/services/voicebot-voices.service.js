import axios from '../../utils/axios';

export const voicebotVoicesBaseUrl = '/api/v1/voicebot-voices';

export const getVoices = async () => {
  const res = await axios.get(voicebotVoicesBaseUrl);
  // console.log('res.data', res.data);
  return res.data.meta;
};
