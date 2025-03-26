const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
  return Roles.init(sequelize, DataTypes, schema);
}

class Roles extends Sequelize.Model {
  static init (sequelize, DataTypes, schema) {
    return super.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      role: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(45),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'roles',
      schema,
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: "roles_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
      ]
    });
  }
}
