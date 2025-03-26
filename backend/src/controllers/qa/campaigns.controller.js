const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const { ErrorResponse } = require("../../helpers");
// repositories
const {
    FetchAll,
    Create,
    FetchById,
    FindByName,
    Update,
    Delete,
} = require("../../repositories/sql/campaigns.repository");

const RESOURCE = "Campaña"
const RESOURCES = "Campañas"


exports.fetchAllCampaigns = asyncHandler(async (req, res, next) => {
    const campaigns = await FetchAll();
    successResponse(res, campaigns, `${RESOURCES} cargados`, 201);
});

exports.createCampaign = asyncHandler(async (req, res, next) => {
    const {
        id,
        campaignName,
        slug,
    } = req.body;

    const findExistingCampaign = await FindByName(campaignName)
    if (findExistingCampaign != null) {
        return next(new ErrorResponse(`Ya existe ${RESOURCE}`, 403));

    }

    const newCampaign = await Create({
        id,
        campaignName,
        slug,
    });
    successResponse(res, newCampaign, `${RESOURCE} cargado`, 201);
});

exports.updateCampaign = asyncHandler(async (req, res, next) => {
    try {

        const { id } = req.params

        const {
            campaignName,
            slug,
        } = req.body;

        const updatedCampaign = await Update({
            id,
            updateData: {
                campaignName,
                slug,
            }
        });

        successResponse(res, updatedCampaign, `${RESOURCE} actualizado`, 201);
    }
    catch (error) {
        console.error(error)
    }
});

exports.deleteCampaign = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const findCampaign = await FetchById(id)

    if (findCampaign === null) {
        return next(new ErrorResponse(`No existe esta ${RESOURCE}`, 403));
    }
    const campaign = await Delete(id)

    successResponse(res, campaign, `${RESOURCE} eliminada`, 201);
})
