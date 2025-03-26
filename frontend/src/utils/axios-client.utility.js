import axios from 'axios';

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  return instance;
};

export default createAxiosInstance;
