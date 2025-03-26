
const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return ConversationsAnalysis.init(sequelize, DataTypes);
}

class ConversationsAnalysis extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
            id: {
                type: DataTypes.STRING(100),
                allowNull: false,
                primaryKey: true
            },
            campaign: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            analysisResult: {
                type: DataTypes.TEXT('long'),
                allowNull: false
            },
            obtainedGrade: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            evaluationPromptName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            agentName: {
                type: DataTypes.STRING(80),
                allowNull: true
            },
            customerName: {
                type: DataTypes.STRING(80),
                allowNull: true
            },
            fileName: {
                type: DataTypes.STRING(200),
                allowNull: true
            }
        }, {
            sequelize,
            tableName: 'conversations_analysis',
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
