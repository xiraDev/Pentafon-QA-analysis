const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");
const { v4: uuidv4 } = require("uuid");
// helpers
const { getHashSync } = require("../../../helpers");

// ----------------------------------------------------------------------

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "users", schema },
      [
        {
          id: uuidv4(),
          username: "root",
          // isBetaMember: false
          email: "root@xira.ai",
          password: await getHashSync("eD1^wP3~qC2$gD6*"),
          picture: "default.png",
          google: 0,
          is_active: 1,
          token: null,
          last_login_at: 1723655520,
          email_verified: 1,
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          username: "Admin",
          // isBetaMember: false
          email: "admin@admin.ai",
          password: await getHashSync("hE1#bB2]dN2&mF1&"),
          picture: "default.png",
          google: 0,
          is_active: 1,
          token: null,
          last_login_at: 1723655520,
          email_verified: 1,
          role_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete({ tableName: "users", schema }, null, {});
  },
};
