const { v5: uuidv5 } = require("uuid");
// middlewares
const { successResponse, asyncHandler } = require("../middlewares");
// helpers
const {
  ErrorResponse,
  validationErrorsEnhancer,
  getHashSync,
} = require("../helpers");
// repositories
const {
  FetchAll,
  FetchOne,
  FindByPk,
  FindByEmail,
  Create,
  Update,
  EnableDisable,
} = require("../repositories/user.repository");

// ----------------------------------------------------------------------

const RESOURCE = "Usuario";
const RESOURCES = "Usuarios";
const DEFAULT_PICTURE = "default.png";

exports.getUsers = asyncHandler(async (req, res, next) => {
  try {
    const { role_id } = req.user.dataValues;

    const users = await FetchAll(role_id);

    // Respuesta exitosa
    successResponse(res, users, { es: `${RESOURCES} cargados`, en: 'Users found' }, 200);
  } catch (error) {
    const msg = { en: `Error to get users: ${error}`, es: `Error al obtener ${RESOURCES}: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.getUser = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const findUser = await FetchOne(id);

    if (findUser === null) {
      return next(new ErrorResponse({ es: `No existe ${RESOURCE}`, en: 'User not found' }, 404));
    }
    successResponse(res, findUser, { es: `${RESOURCE} cargado`, en: 'User found' }, 200);
  } catch (error) {
    const msg = { en: `Error to get user: ${error}`, es: `Error al obtener ${RESOURCE}: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.createUser = asyncHandler(async (req, res, next) => {
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
      campaignIds = [],
    } = req.body;

    const errors = validationErrorsEnhancer(req);
    // If there is errors It will be sent from here and the resource won't be created.
    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FindByEmail(email);
    if (!!findUser) {
      return next(new ErrorResponse({ es: `Ya existe ${RESOURCE}`, en: 'User email already exists' }, 409));
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
      token: null,
      lastLoginAt: 0,
      emailVerified,
      roleId,
      campaignIds,
    });
    successResponse(res, newUser, { es: `${RESOURCE} cargado`, en: 'User created' }, 201);
  } catch (error) {
    const msg = { en: `Error to create user: ${error}`, es: `Error al crear ${RESOURCE}: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, campaignIds = [] } = req.body;
    const id = req.params.id;

    const errors = validationErrorsEnhancer(req);

    if (errors !== undefined) {
      return next(new ErrorResponse(errors, 422));
    }

    const findUser = await FindByPk(id);
    if (!findUser) {
      return next(new ErrorResponse({ es: `${RESOURCE} no existe`, en: 'User not found' }, 404));
    }

    const updatedUser = await Update({ username, campaignIds }, id);

    const userFromRepo = await FetchOne(id);

    successResponse(res, userFromRepo, { es: `${RESOURCE} actualizado`, en: 'User updated' }, 201);
  } catch (error) {
    const msg = { en: `Error to update user: ${error}`, es: `Error al actualizar ${RESOURCE}: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});

exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;

    const findUser = await FindByPk(id);
    if (!findUser) {
      return next(new ErrorResponse({ es: `${RESOURCE} no existe`, en: 'User not found' }, 404));
    }

    const newStatus = findUser.isActive === 1 ? 0 : 1;

    const updatedUser = await EnableDisable(id, newStatus);

    const statusMessageEs = newStatus === 1 ? "habilitado" : "deshabilitado";
    const statusMessageEn = newStatus === 1 ? 'enabled' : 'disabled';

    successResponse(res, updatedUser, { es: `${RESOURCE} ${statusMessageEs}`, en: `User ${statusMessageEn}` }, 201);
  } catch (error) {
    const msg = { es: `Error al cambiar el estado del usuario: ${error}`, en: `Error to change user status: ${error}` };
    console.error(msg);
    return next(new ErrorResponse(msg, 500));
  }
});
