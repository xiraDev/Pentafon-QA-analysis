const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const { ErrorResponse } = require("../../helpers");
// repositories
const {
    ActivateOne,
    Create,
    DeactivateAll,
    FetchAllByCampaign,
    FetchOne,
    FindByName,
    Update,
} = require("../../repositories/sql/prompts.repository");

const RESOURCE = "Prompt"
const RESOURCES = "Prompts"


exports.fetchPromptsByCampaign = asyncHandler(async (req, res, next) => {
    const prompts = await FetchAllByCampaign();
    successResponse(res, prompts, `${RESOURCES} cargados`, 201);
});

exports.createPrompt = asyncHandler(async (req, res, next) => {
    const {
        promptName,
        specialCasesPrompt,
        evaluationFormatPrompt,
        isBinary,
        criticalErrors
    } = req.body;

    const findExistingPrompt = await FindByName(promptName)
    if (findExistingPrompt != null) {
        return next(new ErrorResponse(`Ya existe ${RESOURCE}`, 403));

    }

    const newPrompt = await Create({
        promptName,
        specialCasesPrompt,
        evaluationFormatPrompt,
        isBinary,
        criticalErrors
    });
    successResponse(res, newPrompt, `${RESOURCE} cargado`, 201);
});

exports.updatePrompt = asyncHandler(async (req, res, next) => {
    try {
        const {
            id,
            promptName,
            specialCasesPrompt,
            evaluationFormatPrompt,
            isBinary,
            criticalErrors
        } = req.body;

        const updatedPrompt = await Update({
            id,
            updateData: {
                promptName,
                specialCasesPrompt,
                evaluationFormatPrompt,
                isBinary,
                criticalErrors
            }
        });

        successResponse(res, updatedPrompt, `${RESOURCE} actualizado`, 201);
    }
    catch (error) {
        console.error(error)
    }
});

exports.activatePrompt = asyncHandler(async (req, res, next) => {
    const { id } = req.body

    const findPrompt = await FetchOne(id)

    if (findPrompt === null) {
        return next(new ErrorResponse(`No existe este ${RESOURCE}`, 403));
    }

    await DeactivateAll()

    const prompt = await ActivateOne(id)

    successResponse(res, prompt, `${RESOURCE} activado`, 201);
})
