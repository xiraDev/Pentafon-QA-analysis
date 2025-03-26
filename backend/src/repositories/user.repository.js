const { Op } = require('sequelize');
const db = require("../db/sql/models");
//
const Users = db.Users;
const Roles = db.Roles;
const Campaigns = db.Campaigns;

// associations
Users.belongsTo(Roles, { as: "role", foreignKey: "roleId" });
Roles.hasMany(Users, { as: "users", foreignKey: "roleId" });
Campaigns.belongsToMany(Users, {
  through: "user_campaigns",
  foreignKey: "campaignId", // Nombre de la columna en la tabla intermedia para campañas
  otherKey: "userId" // Nombre de la columna en la tabla intermedia para usuarios
})
Users.belongsToMany(Campaigns, {
  through: "user_campaigns",
  foreignKey: "userId", // Nombre de la columna en la tabla intermedia para usuarios
  otherKey: "campaignId" // Nombre de la columna en la tabla intermedia para campañas
});
// ----------------------------------------------------------------------

exports.FetchAll = async (currentUserRoleId) => {
  const whereClause = {};

  if (currentUserRoleId !== 1) {
    whereClause.role_id = { [Op.gte]: 2 };
  }

  const users = await Users.findAll({
    where: whereClause,
    include: [
      { model: Roles, as: "role", attributes: ["id", "role", "slug"] },
      {
        model: Campaigns,
        attributes: [
          "campaignName",
          ["slug", "campaignSlug"] // Renombrar "slug" a "campaignSlug"
        ],
        through: { attributes: [] } // No queremos incluir datos de la tabla intermedia
      }
    ],
    attributes: { exclude: ["password", "token", "deletedAt"] },
  });

  return users;
};

exports.FetchOne = async (id) => {
  const user = await Users.findOne({
    include: [{ model: Roles, as: "role", attributes: ["role", "slug"] },
    {
      model: Campaigns,
      attributes: [
        "campaignName",
        ["slug", "campaignSlug"] // Renombrar "slug" a "campaignSlug"
      ],
      through: { attributes: [] } // No queremos incluir datos de la tabla intermedia
    }],
    where: { id: id },
    attributes: { exclude: ["password", "deletedAt"] },
  });
  return user;
};

exports.FindByPk = async (id) => {
  const user = await Users.findByPk(id);
  return user;
};

exports.FindByEmail = async (email) => {
  const user = await Users.findOne({
    where: { email },
    include: [{ model: Roles, as: "role", attributes: ["id", "role", "slug"] }],
  });
  return user;
};

exports.FetchByToken = async (id, token) => {
  const user = await Users.findOne({
    where: { id, token },
    attributes: { exclude: ["password"] },
  });
  return user;
};

exports.Create = async ({
  username,
  email,
  password,
  picture,
  google,
  isActive,
  token,
  lastLoginAt,
  emailVerified,
  roleId,
  campaignIds = []
}) => {
  const newUser = await Users.create({
    username,
    email,
    password,
    picture,
    google,
    isActive,
    token,
    lastLoginAt,
    emailVerified,
    roleId,
  });

  if (campaignIds.length > 0) {
    await newUser.addCampaigns(campaignIds);
  }

  return newUser;
};

exports.Update = async (
  { username, token, emailVerified, lastLoginAt, password, campaignIds = [] },
  id
) => {
  const [updatedCount, updatedUser] = await Users.update(
    {
      username,
      token,
      emailVerified,
      lastLoginAt,
      password
    },
    { where: { id: id }, returning: true }  // Asegúrate de usar "returning: true" para obtener el usuario actualizado
  );

  if (updatedCount > 0) {
    if (updatedUser && updatedUser.length > 0) {
      const user = updatedUser[0];  // Ahora aseguramos que updatedUser tiene al menos un elemento
      if (campaignIds.length > 0) {
        await user.setCampaigns(campaignIds); // Reemplazamos todas las campañas
      }
      return updatedUser;  // Devolvemos el usuario actualizado
    } else {
      throw new Error('No user found to update');
    }
  }

  throw new Error('User update failed');
};

exports.EnableDisable = async (id, isActive) => {
  const user = await Users.update(
    { isActive },
    { where: { id: id } }
  );

  const updatedUser = await Users.findByPk(id);

  return updatedUser;
};

exports.setCampaignsForUser = async (userId, campaignIds = []) => {
  try {
    const user = await Users.findByPk(userId);
    if (user) {
      const relations = await user.setCampaigns(campaignIds);
      return relations;
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al asignar campañas:", error);
    throw error;
  }
};


