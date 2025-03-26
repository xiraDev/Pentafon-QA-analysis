// helpers
const { isEmpty } = require("../helpers");
// utilities
const { onSendgridEmail } = require("../utilities/sendgrid-service.utility");
const {
  sendEmail,
  sendEmailToCustomer,
} = require("../utilities/email-service.utility");
const {
  sendEmail: sendNodemailerEmail,
} = require("../utilities/nodemailer-service.utility");

// ----------------------------------------------------------------------

exports.sendEmailToActivateAccount = async (email, user, link) => {
  await sendEmail({
    subject: "Xira Intelligence - Activa tu cuenta",
    title: "Xira Intelligence - Activa tu cuenta",
    message: `Hola ${user} \n Para que puedas comenzar a utilizar la plataforma, debes verificar tu cuenta de correo electrónico.
    \n\n Si no puedes ver el botón de activación haz click en el enlace siguiente: ${link}`,
    btnLabel: "Activa tu cuenta aquí",
    link,
    email,
  });
};

exports.sendEmailToResetPassword = async (email, user, link) => {
  await sendEmail({
    subject: "Xira Intelligence - Restablecer contraseña",
    title: "Xira Intelligence - Restablecer contraseña",
    message: `Hola ${user} \n, has solicitado restablcer tu contraseña, para continuar con esta acción .
    \n\n Si no puedes ver el botón para restablecer contraseña haz click en el enlace siguiente: ${link}`,
    btnLabel: "Restablecer contraseña",
    link,
    email,
  });
};

exports.sendgridEmailByScheduledAction = async ({
  emailFile,
  personalizations,
}) => {
  try {
    const file = isEmpty(emailFile) ? undefined : `${emailFile}.html`;

    const newEmail = await onSendgridEmail({
      fileName: file,
      subject: undefined,
      text: undefined,
      personalizations,
    });

    return newEmail;
  } catch (error) {
    console.error("error", error);
  }
};

exports.sendAttemptsReport = async (email, csvFilePath = null) => {
  await sendNodemailerEmail({
    subject: "Xira Intelligence - Reporte de set de intentos",
    title: "Reporte de set de intentos",
    message: `Hola
    \n Se adjunta el informe de set de intentos. Este informe, generado con nuestros algoritmos avanzados, proporciona un análisis detallado de las operaciones recientes.
    \n Por favor, revise el archivo CSV adjunto para más detalles.
    \n Agradecemos su compromiso y confianza en nuestros servicios.
    \n Este es un mensaje automatizado, no es necesario responder.
    \n\n Saludos, De parte del equipo Xira Intelligence.`,
    email,
    csvFilePath,
  });
};
