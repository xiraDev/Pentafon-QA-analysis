/**
 *   /api/v1/analytics-chat
 */
const express = require("express");
const router = express.Router();
// middlewares
const { validateJWT } = require("../middlewares");
// controllers
const { answer } = require("../controllers/analytics-chat.controller");

//
// ! validate <<x-token>> o Bearer token in request headers
router.use(validateJWT);

// ----------------------------------------------------------------------

router.post("/", answer);

module.exports = router;
