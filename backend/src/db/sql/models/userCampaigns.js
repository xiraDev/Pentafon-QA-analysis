const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    return UserCampaigns.init(sequelize, DataTypes, schema);
}

class UserCampaigns extends Sequelize.Model {
    static init(sequelize, DataTypes, schema) {
        return super.init({
            userId: {
                type: DataTypes.UUID,
                references: { model: "Users", key: "id" },
            },
            campaignId: {
                type: DataTypes.UUID,
                references: { model: "Campaigns", key: "id" },
            },
        }, {
            sequelize,
            tableName: 'user_campaigns',
            schema,
            timestamps: true,
            paranoid: true,
        });
    }
}
