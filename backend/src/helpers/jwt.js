const jwt = require("jsonwebtoken");

/**
 * It takes a user id and a user name and returns a promise that resolves to a JWT token
 * @param uid - The user's ID
 * @param name - "John Doe"
 * @returns A promise that will resolve to a token.
 */
const generateJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Failed to generate token");
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
