const { body } = require("express-validator");

exports.validateCreate = () => {
  return [
    body("username").exists().withMessage("El nombre es obligatorio"),
    body("email")
      .exists()
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("El email es invalido"),
    body("password")
      .exists()
      .withMessage("El password es obligatorio")
      .isLength({
        min: 6,
      })
      .withMessage("El password debe tener 6 caracteres minimo"),
    body("roleId").exists().withMessage("El rol es obligatorio"),
  ];
};

exports.validateUpdate = () => {
  return [
    body("username")
      .exists()
      .notEmpty()
      .withMessage("El nombre es obligatorio"),
  ];
};
