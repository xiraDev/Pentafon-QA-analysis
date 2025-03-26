// const ErrorResponse = require('../helpers/errorResponse');

// helpers
const { sendEmail } = require('../helpers');

const errorHandler = async (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  error.meta = err.meta;

  // Log to console for dev
  // console.log('err :>> ', err.stack.red);

  await sendEmail({
    subject: 'Voicebot Business Error' + process.env.APP_NAME,
    text: `Ocurrio el siguiente error en el backend: ${err}`
  });

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Server Error",
    meta: error.meta || [],
  });
};

module.exports = errorHandler;
