const emailService = require("./email.service");
const whatsappService = require("./whatsapp.service");
const smsService = require("./sms.service");
const voicebotService = require("./voicebot.service");

module.exports = {
  ...emailService,
  ...whatsappService,
  ...smsService,
  ...voicebotService,
};
