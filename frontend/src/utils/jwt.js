import jwtDecode from 'jwt-decode';

//
import axios from './axios';

// ----------------------------------------------------------------------

/**
 * If the access token exists and the expiration time is greater than the current time, then the token
 * is valid
 * @param accessToken - The access token to validate.
 * @returns A function that takes in an accessToken and returns a boolean.
 */
const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  // ----------------------------------------------------------------------

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

/**
 * It takes the expiry time of the token, and sets a timer to the time left until the token expires.
 * When the timer runs out, it removes the token from local storage and reloads the page
 * @param exp - The expiration time of the token in seconds.
 */
const handleTokenExpired = (exp) => {
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  console.log(timeLeft);
  expiredTimer = window.setTimeout(() => {
    console.log('session expired');
    localStorage.removeItem('accessToken');
    window.location.reload();
    // You can do what ever you want here, like show a notification
  }, timeLeft);
};

// ----------------------------------------------------------------------

/**
 * It will set the access token to the local storage and set the Authorization header to the axios
 * instance
 * @param accessToken - The access token that we get from the server.
 */
const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { setSession, isValidToken };
