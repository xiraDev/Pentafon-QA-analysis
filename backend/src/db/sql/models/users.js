const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes, schema) => {
  return Users.init(sequelize, DataTypes, schema);
};

class Users extends Sequelize.Model {
  static init (sequelize, DataTypes, schema) {
    return super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        picture: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        google: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "is_active",
        },
        token: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        lastLoginAt: {
          type: DataTypes.BIGINT,
          allowNull: false,
          field: "last_login_at",
        },
        emailVerified: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "email_verified",
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "roles",
            key: "id",
          },
          field: "role_id",
        },
      },
      {
        sequelize,
        tableName: "users",
        schema,
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "users_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
