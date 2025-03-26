const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return QAAudioMessages.init(sequelize, DataTypes);
}

class QAAudioMessages extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
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
            }
        }, {
            sequelize,
            tableName: 'qa_audio_messages',
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
