const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "user_campaigns",
      {
        userId: {
          type: Sequelize.UUID,
          references: { model: "users", key: "id" },
        },
        campaignId: {
          type: Sequelize.UUID,
          references: { model: "campaigns", key: "id" },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      { schema }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: "user_campaigns", schema });
  },
};
