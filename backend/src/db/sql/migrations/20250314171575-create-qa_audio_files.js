const { DataTypes } = require("sequelize");
const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "qa_audio_files",
      {
        fileName: {
          type: DataTypes.TEXT,
          allowNull: false,
          primaryKey: true
        },
        duration: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        size: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        campaign: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { schema }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: "qa_audio_files", schema });
  },
};
