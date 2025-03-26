const db = require("../../db/sql/models");
const QAAudioFiles = db.QAAudioFiles;

const env = process.env.NODE_ENV || "development"
const config = require("../../config/config")[env]
// ----------------------------------------------------------------------

const campaign = config?.replication?.write?.database || "Default_Campaign"

exports.FetchAll = async () => {
    const QAAudioFiles = await QAAudioFiles.findAll({
        attributes: { exclude: ["deletedAt"] },
    });
    return QAAudioFiles;
};

exports.FetchOne = async (fileName) => {
    const QAAudioFiles = await QAAudioFiles.findOne({
        where: { fileName },
        attributes: { exclude: ["deletedAt"] },
    });
    return QAAudioFiles;
};

exports.FetchAllByCampaign = async (campaignToSearch = campaign) => {
    const QAAudioFiles = await QAAudioFiles.findAll({
        where: { campaign: campaignToSearch },
        attributes: { exclude: ["deletedAt"] },
    });
    return QAAudioFiles;
};

exports.Create = async ({
    fileName,
    duration,
    size,
    campaign,
}) => {
    const newQAAudioFiles = await QAAudioFiles.create({
        fileName,
        duration,
        size,
        campaign,
    });
    return newQAAudioFiles;
};

exports.Update = async (
    fileName, updateData
) => {
    const updatedQAAudioFiles = await QAAudioFiles.update(
        updateData,
        { where: { fileName: fileName } }
    );
    return updatedQAAudioFiles;
};

exports.Destroy = async (fileName) => {
    const QAAudioFiles = await QAAudioFiles.destroy({
        where: {
            fileName: fileName,
        },
    });
    return QAAudioFiles;
};
