const axios = require("axios");

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json", // Request headers
    },
  });

  return instance;
};

module.exports = { createAxiosInstance };
