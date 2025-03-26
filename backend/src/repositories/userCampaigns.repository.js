const db = require("../db/sql/models");
//
const Users = db.Users;
// ----------------------------------------------------------------------


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
