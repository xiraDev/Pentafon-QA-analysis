/**
 *    .--.  .-. .-..----. .-. .----. 
 *   / {} \ | { } || {}  \| |/  {}  \
 *  /  /\  \| {_} ||     /| |\      /
 *  `-'  `-'`-----'`----' `-' `----' 
 *
 *   /api/v1/audios
 */


const express = require("express");
const router = express.Router();

//Validators
const { validateAudioUpload } = require("../validators/qa_audios.validator")

// controllers
const { uploadAudio } = require("../controllers/qa/audio.controller")

// ----------------------------------------------------------------------


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", validateAudioUpload(), uploadAudio);

module.exports = router;


