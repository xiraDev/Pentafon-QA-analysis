const db = require("../../db/sql/models");
const Campaigns = db.Campaigns;

// ----------------------------------------------------------------------

exports.FetchAll = async () => {
    const campaigns = await Campaigns.findAll({
        attributes: { exclude: ["deletedAt"] },
    });
    return campaigns;
};

exports.FetchById = async (id) => {
    const campaign = await Campaigns.findOne({
        where: { id },
        attributes: { exclude: ["deletedAt"] },
    });
    return campaign;
};

exports.FindByName = async (campaignName) => {
    const campaign = await Campaigns.findOne({
        where: { campaignName },
        attributes: { exclude: ["deletedAt"] },
    });
    return campaign;
};

exports.Create = async ({
    id,
    campaignName,
    slug,
}) => {
    const newCampaigns = await Campaigns.create({
        id,
        campaignName,
        slug,
    });
    return newCampaigns;
};

exports.Update = async (
    { id, updateData }
) => {
    const updatedcampaign = await Campaigns.update(
        updateData,
        { where: { id } }
    );
    return updatedcampaign;
};

exports.Delete = async (id) => {
    const campaign = await Campaigns.destroy({
        where: {
            id,
        },
    });
    return campaign;
};
