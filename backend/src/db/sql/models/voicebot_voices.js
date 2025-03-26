const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes, schema) => {
  return VoicebotVoices.init(sequelize, DataTypes, schema);
};

class VoicebotVoices extends Sequelize.Model {
  static init (sequelize, DataTypes, schema) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        voice: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "voicebot_voices",
        schema,
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "voicebot_voices_pkey",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
