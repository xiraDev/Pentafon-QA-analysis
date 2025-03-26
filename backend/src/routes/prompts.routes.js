/**
 *   .----. .----.  .----. .-.   .-..----.  .---.  .----.
 *   | {}  }| {}  }/  {}  \|  `.'  || {}  }{_   _}{ {__  
 *   | .--' | .-. \\      /| |\ /| || .--'   | |  .-._} }
 *   `-'    `-' `-' `----' `-' ` `-'`-'      `-'  `----' 
 *
 *   /api/v1/prompts
 */


const express = require("express");
const router = express.Router();

// controllers
const {
    activatePrompt,
    createPrompt,
    fetchPromptsByCampaign,
    updatePrompt,
} = require("../controllers/qa/prompts.controller")

// ----------------------------------------------------------------------

router.get("/", fetchPromptsByCampaign)

router.post("/create", createPrompt);

router.patch("/update", updatePrompt);

router.patch("/activate", activatePrompt);

module.exports = router;


