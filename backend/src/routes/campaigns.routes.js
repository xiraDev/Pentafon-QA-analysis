/**
 *    .---.   .--.  .-.   .-..----.  .--.  .-. .---. .-. .-. .----.
 *   /  ___} / {} \ |  `.'  || {}  }/ {} \ | |/   __}|  `| |{ {__  
 *   \     }/  /\  \| |\ /| || .--'/  /\  \| |\  {_ }| |\  |.-._} }
 *    `---' `-'  `-'`-' ` `-'`-'   `-'  `-'`-' `---' `-' `-'`----' 
 *
 *   /api/v1/campaigns
 */


const express = require("express");
const router = express.Router();

// controllers
const {
    fetchAllCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
} = require("../controllers/qa/campaigns.controller")

// ----------------------------------------------------------------------

router.get("/", fetchAllCampaigns)

router.post("/create", createCampaign);

router.patch("/:id", updateCampaign);

router.delete("/:id", deleteCampaign);

module.exports = router;


