const db = require("../../db/sql/models");
const Prompts = db.Prompts;

const env = process.env.NODE_ENV || "development"
const config = require("../../config/config")[env]
// ----------------------------------------------------------------------

const campaign = config?.replication?.write?.database || "Default_Campaign"

exports.FetchAll = async () => {
    const prompt = await Prompts.findAll({
        attributes: { exclude: ["deletedAt"] },
    });
    return prompt;
};

exports.FetchOne = async (id) => {
    const prompt = await Prompts.findOne({
        where: { id: id },
        attributes: { exclude: ["deletedAt"] },
    });
    return prompt;
};

exports.FetchActive = async () => {
    const prompt = await Prompts.findOne({
        where: { isActive: true }
    })
    return prompt
}

exports.FetchAllByCampaign = async (campaignToSearch = campaign) => {
    const prompt = await Prompts.findAll({
        where: { campaign: campaignToSearch },
        attributes: { exclude: ["deletedAt"] },
    });
    return prompt;
};

exports.FindByName = async (promptName) => {
    const prompt = await Prompts.findOne({
        where: { promptName },
        attributes: { exclude: ["deletedAt"] },
    });
    return prompt;
};

exports.Create = async ({
    campaignForCreation = campaign,
    promptName,
    specialCasesPrompt,
    evaluationFormatPrompt,
    isBinary = false,
    criticalErrors = ""
}) => {
    const newPrompts = await Prompts.create({
        campaign: campaignForCreation,
        promptName,
        specialCasesPrompt,
        evaluationFormatPrompt,
        isBinary,
        criticalErrors
    });
    return newPrompts;
};

exports.Update = async (
    { id, updateData }
) => {
    const updatedPrompt = await Prompts.update(
        updateData,
        { where: { id: id } }
    );
    return updatedPrompt;
};

exports.ActivateOne = async (id) => {
    const prompt = await Prompts.update(
        { isActive: true },
        { where: { id } }
    )
    return prompt
}

exports.DeactivateAll = async () => {
    const prompts = await Prompts.update(
        { isActive: false },
        { where: {} }
    );
    return prompts
}

exports.Destroy = async (id) => {
    const prompt = await Prompts.destroy({
        where: {
            id: id,
        },
    });
    return prompt;
};
