const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "roles",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        role: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },
        slug: {
          allowNull: false,
          type: Sequelize.STRING(45),
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
    await queryInterface.dropTable({ tableName: "roles", schema });
  },
};
