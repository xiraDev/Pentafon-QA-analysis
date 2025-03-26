const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "campaigns",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        campaignName: {
          type: Sequelize.STRING(45),
          allowNull: false
        },
        slug: {
          type: Sequelize.STRING(45),
          allowNull: false
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
    await queryInterface.dropTable({ tableName: "campaigns", schema });
  },
};
