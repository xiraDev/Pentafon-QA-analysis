const { DataTypes } = require("sequelize");
const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "qa_audio_messages",
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        analysisId: {
          type: DataTypes.STRING(100),
          allowNull: false,
          references: {
            model: 'qa_audio_transcriptions',
            key: 'id'
          },
          field: 'analysis_id'
        },
        transmitter: {
          type: DataTypes.STRING(30),
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
    await queryInterface.dropTable({ tableName: "qa_audio_messages", schema });
  },
};
