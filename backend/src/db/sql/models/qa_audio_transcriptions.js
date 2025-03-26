const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return QAAudioTranscriptions.init(sequelize, DataTypes);
}

class QAAudioTranscriptions extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
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
            }
        }, {
            sequelize,
            tableName: 'qa_audio_transcriptions',
            schema,
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
    }
}
