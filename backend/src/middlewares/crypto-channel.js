const { request, response } = require("express");
// utilities
const {
  encryptSecureCryptoData,
  decryptSecureCryptoData,
} = require("../utilities");

// ----------------------------------------------------------------------

const ENABLE_CRYPTO = process.env.ENABLE_CRYPTO_CHANNEL || false;

/**
 * It returns true if the dataStr is a string that is equal to "true" or if the dataStr is a boolean
 * that is equal to true
 * @param dataStr - The string to convert to a boolean.
 * @returns A function that takes a string and returns a boolean.
 */
const toBoolean = (dataStr) => {
  return !!(dataStr?.toLowerCase?.() === "true" || dataStr === true);
};

console.log("⇒ Encrypted communication enabled:", toBoolean(ENABLE_CRYPTO));

/**
 * If the ENABLE_CRYPTO environment variable is set to true, then encrypt the response data before
 * sending it back to the client.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function in the stack.
 */
function encryptResponseInterceptor(req, res = response, next) {
  const originalSend = res.json;

  if (toBoolean(ENABLE_CRYPTO)) {
    res.json = function () {
      arguments[0] = encryptSecureCryptoData(arguments[0]);
      originalSend.apply(res, arguments);
    };
  }
  next();
}

/**
 * If the ENABLE_CRYPTO environment variable is set to true, then decrypt the request body using the
 * decryptSecureCryptoData function.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function in the stack.
 */
function decryptResponseInterceptor(req = request, res, next) {
  if (toBoolean(ENABLE_CRYPTO)) {
    if (req.body?.xcontent) {
      req.body = decryptSecureCryptoData(req.body.xcontent);
    }
  }

  next();
}

module.exports = { encryptResponseInterceptor, decryptResponseInterceptor };
