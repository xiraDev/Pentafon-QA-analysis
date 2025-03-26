const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return Campaigns.init(sequelize, DataTypes, schema);
}

class Campaigns extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            campaignName: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            slug: {
                type: DataTypes.STRING(45),
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'campaigns',
            schema,
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "campaigns_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
    }
}
