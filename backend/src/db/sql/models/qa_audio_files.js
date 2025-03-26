const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return QAAudioFiles.init(sequelize, DataTypes);
}

class QAAudioFiles extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
            fileName: {
                type: DataTypes.TEXT,
                allowNull: false,
                primaryKey: true
            },
            duration: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            size: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            campaign: {
                type: DataTypes.STRING(100),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'qa_audio_files',
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
