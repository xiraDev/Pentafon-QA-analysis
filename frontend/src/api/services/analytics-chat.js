import axios from '../../utils/axios';

export const configUrl = '/api/v1/analytics-chat';

// Obtener la configuración actual
export const startProcess = async (messages) => {
  const response = await axios.post(configUrl, { messages });
  console.log('response', response.data);
  return response.data;
};