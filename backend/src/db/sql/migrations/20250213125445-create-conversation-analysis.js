const mode = process.env.NODE_ENV ?? 'development';
const { schema } = require('../../../config/config')[mode];

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'conversations_analysis',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING(100)
        },
        campaign: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        analysisResult: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        obtainedGrade: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        evaluationPromptName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        agentName: {
          type: Sequelize.STRING(80),
          allowNull: true
        },
        customerName: {
          type: Sequelize.STRING(80),
          allowNull: true
        },
        fileName: {
          type: Sequelize.STRING(200),
          allowNull: true
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
    await queryInterface.dropTable({ tableName: 'conversations_analysis', schema });
  }
};
