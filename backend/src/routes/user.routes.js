/**
 *   .-. .-. .----..----..----.
 *   | { } |{ {__  | {_  | {}  }
 *   | {_} |.-._} }| {__ | .-. \
 *   `-----'`----' `----'`-' `-'
 *
 *   /api/v1/users
 */
const express = require("express");
const router = express.Router();
// middlewares
const { validateJWT } = require("../middlewares");
// validators
const {
  validateCreate,
  validateUpdate,
} = require("../validators/user.validator");
// controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  toggleUserStatus,
} = require("../controllers/user.controller");

//
// ! validate <<x-token>> o Bearer token in request headers

// ----------------------------------------------------------------------

router.get("/:id", getUser);

router.use(validateJWT);

router.get("/", getUsers);

router.post("/", validateCreate(), createUser);

router.put("/:id", validateUpdate(), updateUser);

router.delete("/:id", toggleUserStatus);

module.exports = router;
