const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "roles", schema },
      [
        {
          role: "root",
          slug: "root",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: "administrator",
          slug: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: "architect",
          slug: "arch",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: "reader",
          slug: "read",
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
    await queryInterface.bulkDelete({ tableName: "roles", schema }, null, {});
  },
};
