const CryptoJS = require("crypto-js");

const KEY = CryptoJS.enc.Hex.parse("3zTvzr3p67VC61jmV54rIYu1545x4TlY");
const IV = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

/**
 * It takes a JSON object, encrypts it using AES-256-CFB, and returns the encrypted data as a string.
 * @param data - The data to be encrypted.
 * @returns A string.
 */
const encryptSecureCryptoData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), KEY, {
    iv: IV,
    mode: CryptoJS.mode.CFB,
  }).toString();
};

/**
 * It takes a base64 string, decrypts it using AES-256-CFB, and returns the decrypted string as a JSON
 * object
 * @param encryptedBase64 - The encrypted data in base64 format
 * @returns The encrypted data is being returned.
 */
const decryptSecureCryptoData = (encryptedBase64) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CFB,
  });
  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return JSON.parse(str);
      } else {
        return "Malformed data";
      }
    } catch (e) {
      console.log(e);
      return "Something wrong";
    }
  }
  return "There are no data";
};

module.exports = {
  encryptSecureCryptoData,
  decryptSecureCryptoData,
};
