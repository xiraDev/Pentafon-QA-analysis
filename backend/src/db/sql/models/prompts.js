const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return Prompts.init(sequelize, DataTypes);
}

class Prompts extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            campaign: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            promptName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            specialCasesPrompt: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            evaluationFormatPrompt: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            criticalErrors: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            isBinary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize,
            tableName: 'prompts',
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
