/**
 *    .---.  .----. .-. .-..-. .-..----..----.  .----.  .--.  .---. .-. .----. .-. .-. .----.
 *   /  ___}/  {}  \|  `| || | | || {__ | {}  }{ {__   / {} \{_   _}| |/  {}  \|  `| |{ {__  
 *   \     }\      /| |\  |\ \_/ /| {__ | .-. \.-._} }/  /\  \ | |  | |\      /| |\  |.-._} }
 *    `---'  `----' `-' `-' `---' `----'`-' `-'`----' `-'  `-' `-'  `-' `----' `-' `-'`----' 
 *
 *   /api/v1/conversations
 */
const express = require("express")
const router = express.Router();
// middlewares
// const { validateJWT } = require("../../middlewares");

// controllers
// const {
//     getVoicebotConversationsSimple,
//     getVoicebotConversationsExtended,
//     getGradesAnalysis
// } = require("../controllers/qa/conversation.controller");

const { getAllAnalysis } = require("../controllers/qa/analysis.controller")


// ----------------------------------------------------------------------

// router.use(validateJWT)

// router.get("/simple", getVoicebotConversationsSimple)

// router.get("/extended", getVoicebotConversationsExtended)

// router.get("/grades_analytics", getGradesAnalysis)

router.get("/analysis_analytics", getAllAnalysis)

module.exports = router;
