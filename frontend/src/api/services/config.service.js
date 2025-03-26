import axios from '../../utils/axios';

export const configUrl = '/api/v1/config';

// Obtener la configuración actual
export const getConfig = async () => {
  const response = await axios.get(configUrl);
  return response.data;
};

// Actualizar la configuración parcialmente
export const updateConfig = async (data) => {
  const response = await axios.patch(configUrl, data);
  return response.data;
};
