/**
 *     .--.  .-. .-. .---. .-. .-.
 *    / {} \ | { } |{_   _}| {_} |
 *   /  /\  \| {_} |  | |  | { } |
 *   `-'  `-'`-----'  `-'  `-' `-'
 *
 *   /api/v1/auth
 */
const express = require("express");
const router = express.Router();
// middlewares
const { validateJWT } = require("../middlewares");
// validators
const {
  validate,
  validateVerified,
  validateResetPass,
  validateSetPass,
  validateRenewPass,
} = require("../validators/auth.validator");
const { validateCreate } = require("../validators/user.validator");
// controllers
const {
  login,
  renewToken,
  myAccount,
  validateAccount,
  resendEmailValidation,
  registerUser,
  sendEmailResetPassword,
  resetPassword,
  renewPassword,
} = require("../controllers/sql/auth.controller");

// ----------------------------------------------------------------------

router.get("/renew", validateJWT, renewToken);

router.get("/me", validateJWT, myAccount);

router.get("/validate-account/resend-email/:id", resendEmailValidation);

router.post("/login", validate(), login);

router.post("/register", validateCreate(), registerUser);

router.put("/validate-account", validateVerified(), validateAccount);

router.put("/reset-password", validateResetPass(), sendEmailResetPassword);

router.put("/set-new-password", validateSetPass(), resetPassword);

router.put(
  "/renew-password",
  [validateJWT, validateRenewPass()],
  renewPassword
);

module.exports = router;
