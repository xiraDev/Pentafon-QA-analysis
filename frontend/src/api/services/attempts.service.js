import axios from '../../utils/axios';

export const attemptsBaseUrl = '/api/v1/attempts';

export const getAttempts = async ({ url, params }) => {
  const res = await axios.get(attemptsBaseUrl + url, { params });
  return res.data;
};
