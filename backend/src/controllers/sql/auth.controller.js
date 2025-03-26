const { v5: uuidv5 } = require("uuid");
// middlewares
const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const {
  ErrorResponse,
  validationErrorsEnhancer,
  generateJWT,
  getCompareSync,
  getHashSync,
} = require("../../helpers");
// repositories
const {
  FindByEmail,
  FetchOne,
  FetchByToken,
  Update,
  FindByPk,
  Create,
} = require("../../repositories/user.repository");
const {
  sendEmailToActivateAccount,
  sendEmailToResetPassword,
} = require("../../repositories/email.repository");

// ----------------------------------------------------------------------

const DEFAULT_PICTURE = "default.png";

exports.renewToken = asyncHandler(async (req, res, next) => {
  try {
    const { id, name } = req;

    const token = await generateJWT(id, name);
    successResponse(res, { id, name, token }, { es: `Token renovado`, en: 'token renewed' }, 201);
  } catch (error) {
    const msg = { es: `Error al renovar token: ${error}`, en: `Error to renew token: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  try {
    // console.log({ ...req.body });
    const { email, password } = req.body;
    console.log(req.body)
    //Using the ValidatorErrorsEnhancer, the param uses the req from the middleware used on the route file.
    const errors = validationErrorsEnhancer(req);

    //If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FindByEmail(email);
    if (!findUser) {
      return next(new ErrorResponse({ en: 'Email not found', es: 'Correo no encontrado' }, 404));
    }

    const validPassword = await getCompareSync(password, findUser.password);
    if (!validPassword) {
      return next(new ErrorResponse({ en: 'Incorrect password', es: 'Contraseña Incorrecta' }, 403));
    }

    if (!findUser.emailVerified) {
      return next(new ErrorResponse({ en: 'You have not verify your account yet', es: 'Aún no has verificado tu cuenta' }, 400));
    }

    if (!findUser.isActive) {
      return next(
        new ErrorResponse(
          { en: 'You have not verify your account yet', es: 'Aún no has verificado tu cuenta' },
          400
        )
      );
    }

    if (findUser.token !== null) {
      return next(
        new ErrorResponse({ en: 'Your account has been disabled, if you think this is an error contact the administrator or support', es: 'Tu cuenta ha sido deshabilitada, si crees que se trata de un error contacta al administrador o soporte' }, 400)
      );
    }

    const id = findUser.id;
    const username = findUser.username;
    const lastLoginAt = Math.floor(new Date().getTime() / 1000);

    const updatedUser = await Update({ lastLoginAt }, id);

    const accessToken = await generateJWT(id, username);
    const user = {
      id,
      displayName: username,
      role: findUser.role,
      email: findUser.email,
    };

    successResponse(res, { user, accessToken }, `Authenticated user`, 200);
  } catch (error) {
    const msg = `Error en login: ${error}`;
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.myAccount = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req;
    const findUser = await FetchOne(id);
    const user = {
      id,
      displayName: findUser.username,
      role: findUser.role,
      email: findUser.email,
      campaigns: findUser.Campaigns
    };

    successResponse(res, { user }, { en: 'Found Account', es: 'Cuenta encontrada' }, 201);
  } catch (error) {
    const msg = { es: `Error al encontrar usuario: ${error}`, en: `Error to find user: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.validateAccount = asyncHandler(async (req, res, next) => {
  try {
    const { token_confirmation, id } = req.body;

    //Using the ValidatorErrorsEnhancer, the param uses the req from the middleware used on the route file.
    const errors = validationErrorsEnhancer(req);

    //If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FetchByToken(id, token_confirmation);
    if (!findUser) {
      return next(
        new ErrorResponse({ es: `La llave expiró o hubo un error en tu petición`, en: 'token expired' }, 200)
      );
    }

    const updatedUser = await Update({ token: null, emailVerified: 1 }, id);
    const userFromRepo = await FetchOne(id);
    successResponse(res, userFromRepo, { es: `La cuenta ha sido activada`, en: 'Account has been activated' }, 201);
  } catch (error) {
    const msg = { es: `Error al validar cuenta: ${error}`, en: `Error to validate account: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.resendEmailValidation = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const findUser = await FindByPk(id);
  if (findUser === null || findUser.token === null) {
    return next(
      new ErrorResponse(
        { es: `No existe la cuenta solicitada o hubo un error con tu solicitud`, en: `The account does not exist or there was an error with your request` },
        403
      )
    );
  }
  try {
    const link = `${process.env.HOST_NAME_FRONT}/auth/verify-email/${findUser.token}/${findUser.id}`;
    const { username, email } = findUser;
    await sendEmailToActivateAccount(email, username, link);

    successResponse(
      res,
      { sendedEmail: true, link },
      { es: `El correo fue enviado`, en: 'The email was sent' },
      200
    );
  } catch (error) {
    const msg = { en: `Error to resend email: ${error}`, es: `Error al reenviar correo: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.registerUser = asyncHandler(async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      picture = DEFAULT_PICTURE,
      google = 0,
      isActive = 1,
      emailVerified = 0,
      roleId,
    } = req.body;

    const errors = validationErrorsEnhancer(req);
    // If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FindByEmail(email);
    if (findUser != null) {
      return next(
        new ErrorResponse({ es: `Ya existe una cuenta asociada a este correo`, en: 'There is already and account with such email' }, 403)
      );
    }
    const hashedPassword = await getHashSync(password);
    let keyTokenConfirmation = uuidv5(email, uuidv5.URL);

    const newUser = await Create({
      username,
      email,
      password: hashedPassword,
      picture,
      google,
      isActive,
      token: keyTokenConfirmation,
      lastLoginAt: 0,
      emailVerified,
      roleId,
    });
    successResponse(res, newUser, { es: `Cuenta creada`, en: "Account created" }, 201);
  } catch (error) {
    const msg = { es: `Error al registrar usuario: ${error}`, en: `Error to register user: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.sendEmailResetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const errors = validationErrorsEnhancer(req);
  // If there is errors It will be sent from here and the resource won't be created.
  if (errors !== undefined) {
    return next(new ErrorResponse(errors, 422));
  }

  const findUser = await FindByEmail(email);
  if (findUser === null) {
    return next(
      new ErrorResponse(
        { es: `No existe la cuenta solicitada o hubo un error con tu solicitud`, en: `The account does not exist or there was an error with your request` },
        403
      )
    );
  }
  try {
    let link = ``;
    if (findUser.token === null) {
      let keyTokenConfirmation = uuidv5(findUser.email, uuidv5.URL);
      const updatedUser = await Update(
        { token: keyTokenConfirmation },
        findUser.id
      );
      link = `${process.env.HOST_NAME_FRONT}/auth/verify-reset/${keyTokenConfirmation}/${findUser.id}`;
    } else {
      link = `${process.env.HOST_NAME_FRONT}/auth/verify-reset/${findUser.token}/${findUser.id}`;
    }

    const { username, email } = findUser;
    await sendEmailToResetPassword(email, username, link);

    successResponse(
      res,
      { sendedEmail: true, link },
      { es: `El correo fue enviado`, en: 'The email was sent' },
      200
    );
  } catch (error) {
    const msg = { en: `Error to reset password email: ${error}`, es: `Error al enviar correo para restablecer contraseña: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  try {
    const { token_confirmation, id, password } = req.body;

    //Using the ValidatorErrorsEnhancer, the param uses the req from the middleware used on the route file.
    const errors = validationErrorsEnhancer(req);

    //If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FetchByToken(id, token_confirmation);
    if (!findUser) {
      return next(
        new ErrorResponse({ es: `La llave expiró o hubo un error en tu petición`, en: `Token expired` }, 400)
      );
    }

    const hashedNewPassword = await getHashSync(password);

    const updatedUser = await Update(
      { token: null, password: hashedNewPassword },
      id
    );
    const userFromRepo = await FetchOne(id);
    successResponse(
      res,
      userFromRepo,
      { es: `Tu contraseña ha sido restablecida con éxito`, en: `Your password has been reset successfully` },
      201
    );
  } catch (error) {
    const msg = { es: `Error al restablecer contraseña: ${error}`, en: `Error to reset password: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.renewPassword = asyncHandler(async (req, res, next) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    //Using the ValidatorErrorsEnhancer, the param uses the req from the middleware used on the route file.
    const errors = validationErrorsEnhancer(req);

    //If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FindByPk(id);
    if (!findUser) {
      return next(new ErrorResponse({ es: "Usuario no encontrado", en: "User not found" }, 404));
    }

    const validPassword = await getCompareSync(oldPassword, findUser.password);
    if (!validPassword) {
      return next(new ErrorResponse({ es: `Password incorrecto`, en: `Incorrect password` }, 403));
      // return next(new ErrorResponse(`Password incorrecto`, 403));
    }

    const hashedNewPassword = await getHashSync(newPassword);

    const updatedUser = await Update({ password: hashedNewPassword }, id);
    const userFromRepo = await FetchOne(id);

    successResponse(res, {}, { es: `Tu contraseña ha sido renovada con éxito`, en: `Your password has been renewed successfully` }, 201);
  } catch (error) {
    const msg = { es: `Error al renovar contraseña: ${error}`, en: `Error to renew password: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});
