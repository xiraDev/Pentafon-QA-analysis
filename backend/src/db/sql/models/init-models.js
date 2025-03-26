const DataTypes = require("sequelize").DataTypes;
const _Roles = require("./roles");
const _Campaigns = require("./campaigns")
const _Users = require("./users");

const env = process.env.NODE_ENV || "development";
const config = require("../../../config/config")[env];

function initModels(sequelize) {

  const Roles = _Roles(sequelize, DataTypes, config.schema);
  const Users = _Users(sequelize, DataTypes, config.schema);
  const Campaigns = _Campaigns(sequelize, DataTypes, config.schema);

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

  return {
    Roles,
    Users,
    Campaigns,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
