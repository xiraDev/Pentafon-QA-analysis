const mode = process.env.NODE_ENV ?? 'development';
const { schema } = require('../../../config/config')[mode];

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'prompts',
      {
        id: {
          type: Sequelize.CHAR(36),
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        campaign: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        promptName: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        specialCasesPrompt: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        evaluationFormatPrompt: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        criticalErrors: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        isBinary: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      },
      { schema }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'prompts', schema });
  }
};
