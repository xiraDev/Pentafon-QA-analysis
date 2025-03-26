import axios from 'axios';

import { CONFIG } from 'src/config-global';

import { toBoolean } from '../helpers';
import { decryptSecureCryptoData, encryptSecureCryptoData } from './crypto.utility';

// ----------------------------------------------------------------------

/* Creating a new instance of axios with the baseURL set to the HOST_API. */
const axiosInstance = axios.create({
  baseURL: CONFIG.site.serverUrl,
});

/* Intercepting the response and decrypting the data if the ENABLE_CRYPTO is true. */
axiosInstance.interceptors.response.use(
  (response) => {
    if (toBoolean(CONFIG.site.enableCrypto)) {
      response.data = decryptSecureCryptoData(response.data);
    }
    return response;
  },
  (error) =>
    Promise.reject(
      toBoolean(CONFIG.site.enableCrypto)
        ? (error.response && decryptSecureCryptoData(error.response.data)) || 'Something went wrong'
        : (error.response && error.response.data) || 'Something went wrong'
    )
);

/* Encrypting the data before sending it to the server. */
axiosInstance.interceptors.request.use(
  (request) => {
    if (toBoolean(CONFIG.site.enableCrypto)) {
      request.data = { xcontent: encryptSecureCryptoData(request.data) };
    }
    return request;
  },
  (error) => Promise.reject(error || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/v1/auth/me',
    signIn: '/api/v1/auth/login',
  },
  channels: '/api/v1/channels',
  contactActions: '/api/v1/contact-actions',
  ruleFilters: '/api/v1/rule-filters',
  strategy: '/api/v1/strategies',
  strategyRules: '/api/v1/strategy-rules',
  voicebot: {
    prompts: '/api/v1/voicebot-prompts',
    typifications: '/api/v1/voicebot-typifications',
  },
  whatsapp: {
    prompts: '/api/v1/whatsapp-prompts',
    typifications: '/api/v1/whatsapp-typifications',
  },
};
