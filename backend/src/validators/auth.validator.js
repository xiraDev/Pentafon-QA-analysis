const { body } = require("express-validator");

exports.validate = () => {
  return [
    body("email")
      .exists()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email es inválido"),
    body("password")
      .exists()
      .withMessage("El password es obligatorio")
      .isLength({
        min: 6,
      })
      .withMessage("El password debe tener 6 caracteres minimo"),
  ];
};

exports.validateVerified = () => {
  return [
    body("id")
      .exists()
      .withMessage("El identificador es obligatorio")
      .isUUID()
      .withMessage("El identificador es inválido"),
    body("token_confirmation")
      .exists()
      .withMessage("La llave es obligatoria")
      .isUUID()
      .withMessage("La llave es inválida"),
  ];
};

exports.validateResetPass = () => {
  return [
    body("email")
      .exists()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email es inválido"),
  ];
};

exports.validateSetPass = () => {
  return [
    body("id")
      .exists()
      .withMessage("El identificador es obligatorio")
      .isUUID()
      .withMessage("El identificador es inválido"),
    body("token_confirmation")
      .exists()
      .withMessage("La llave es obligatoria")
      .isUUID()
      .withMessage("La llave es inválida"),
    body("password")
      .exists()
      .withMessage("El password es obligatorio")
      .isLength({
        min: 6,
      })
      .withMessage("El password debe tener 6 caracteres minimo"),
  ];
};

exports.validateRenewPass = () => {
  return [
    body("id")
      .exists()
      .withMessage("El identificador es obligatorio")
      .isUUID()
      .withMessage("El identificador es inválido"),
    body("oldPassword")
      .exists()
      .withMessage("El password es obligatorio")
      .isLength({
        min: 6,
      })
      .withMessage("El password debe tener 6 caracteres minimo"),
    body("newPassword")
      .exists()
      .withMessage("El password es obligatorio")
      .isLength({
        min: 6,
      })
      .withMessage("El password debe tener 6 caracteres minimo"),
  ];
};
