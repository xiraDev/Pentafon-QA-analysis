const { response } = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../db/sql/models");

const validateJWT = async (req, res = response, next) => {
  // headers -> x-token
  let token = req.header("x-access-token") || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "There is no token in the request",
    });
  }

  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    // Buscar al usuario en la base de datos por uid (ID del usuario)
    const user = await Users.findByPk(uid, {
      attributes: ["id", "role_id", "username", "email"],
    });

    req.user = user;

    // console.log(uid);
    req.id = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
