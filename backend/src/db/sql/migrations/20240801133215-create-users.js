const mode = process.env.NODE_ENV ?? "development";
const { schema } = require("../../../config/config")[mode];

("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        username: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        picture: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        google: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        isActive: {
          type: Sequelize.INTEGER,
          allowNull: false,
          field: "is_active",
        },
        token: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        lastLoginAt: {
          type: Sequelize.BIGINT,
          allowNull: false,
          field: "last_login_at",
        },
        emailVerified: {
          type: Sequelize.INTEGER,
          allowNull: false,
          field: "email_verified",
        },
        roleId: {
          type: Sequelize.DataTypes.INTEGER,
          name: "fkidx_role_user",
          references: {
            model: "roles",
            key: "id",
          },
          allowNull: false,
          field: "role_id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
    await queryInterface.dropTable({ tableName: "users", schema });
  },
};
