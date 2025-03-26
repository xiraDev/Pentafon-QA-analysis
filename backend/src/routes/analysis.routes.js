/**
 *     .--.  .-. .-.  .--.  .-. .-.  .-..----..-. .----.
 *    / {} \ |  `| | / {} \ | |  \ \/ /{ {__  | |{ {__  
 *   /  /\  \| |\  |/  /\  \| `--.}  { .-._} }| |.-._} }
 *   `-'  `-'`-' `-'`-'  `-'`----'`--' `----' `-'`----'
 *
 *   /api/v1/analysis
 */


const express = require("express");
const router = express.Router();

// controllers
const { analyzeConversationsHandler, getAllAnalysis } = require("../controllers/qa/analysis.controller")

// ----------------------------------------------------------------------

router.get("/", getAllAnalysis)

router.post("/text", analyzeConversationsHandler);

// router.post("/audio", );

module.exports = router;


