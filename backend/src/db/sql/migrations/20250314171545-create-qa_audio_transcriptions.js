const { DataTypes } = require("sequelize");
const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "qa_audio_transcriptions",
      {
        id: {
          type: DataTypes.STRING(100),
          allowNull: false,
          primaryKey: true,
        },
        fileName: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        campaign: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        typification: {
          type: DataTypes.STRING,
          allowNull: true,
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
    await queryInterface.dropTable({ tableName: "qa_audio_transcriptions", schema });
  },
};
