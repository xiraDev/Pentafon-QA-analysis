const db = require("../../db/sql/models");
const ConversationsAnalysis = db.ConversationsAnalysis;

const env = process.env.NODE_ENV || "development"
const config = require("../../config/config")[env]
// ----------------------------------------------------------------------

const campaign = config?.replication?.write?.database || "Default_Campaign"

exports.FetchAll = async () => {
    const conversationsAnalysis = await ConversationsAnalysis.findAll({
        attributes: { exclude: ["deletedAt"] },
    });
    return conversationsAnalysis;
};

exports.FetchOne = async (id) => {
    const conversationsAnalysis = await ConversationsAnalysis.findOne({
        where: { id: id },
        attributes: { exclude: ["deletedAt"] },
    });
    return conversationsAnalysis;
};

exports.FetchAllByCampaign = async (campaignToSearch = campaign) => {
    const conversationsAnalysis = await ConversationsAnalysis.findAll({
        where: { campaign: campaignToSearch },
        attributes: { exclude: ["deletedAt"] },
    });
    return conversationsAnalysis;
};

exports.Create = async ({
    id,
    campaignForCreation = campaign,
    analysisResult,
    obtainedGrade,
    evaluationPromptName,
    customerName,
    agentName,
    fileName = "-"
}) => {
    const newConversationsAnalysis = await ConversationsAnalysis.create({
        id,
        campaign: campaignForCreation,
        analysisResult,
        obtainedGrade,
        evaluationPromptName,
        customerName,
        agentName,
        fileName
    });
    return newConversationsAnalysis;
};

exports.Update = async (
    id, updateData
) => {
    const updatedConversationsAnalysis = await ConversationsAnalysis.update(
        updateData,
        { where: { id: id } }
    );
    return updatedConversationsAnalysis;
};

exports.Destroy = async (id) => {
    const conversationsAnalysis = await ConversationsAnalysis.destroy({
        where: {
            id: id,
        },
    });
    return conversationsAnalysis;
};
