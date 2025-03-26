const { successResponse, asyncHandler } = require("../../middlewares");
// helpers
const { ErrorResponse } = require("../../helpers");
// repositories
const { analyzeConversations, analyzeSingleConversations, FetchAllAnalysis } = require("../../repositories/sql/analysis.repository");

// ----------------------------------------------------------------------

const RESOURCE = "Análisis de conversación";
const RESOURCES = "Análisis de conversaciones";

exports.getAllAnalysis = asyncHandler(async (req, res, next) => {
    const results = await FetchAllAnalysis();
    successResponse(res, results, `${RESOURCES} completado`, 200);
})


exports.analyzeConversationsHandler = asyncHandler(async (req, res, next) => {
    const { conversations } = req.body;


    if (!conversations || !Array.isArray(conversations) || conversations.length === 0) {
        return next(new ErrorResponse("Se requieren conversaciones válidas para el análisis.", 400));
    }

    const results = await analyzeConversations(conversations);
    successResponse(res, results, `${RESOURCES} completado`, 201);
});


exports.analyzeSingleConversationsHandler = asyncHandler(async (conversations, fileName = "-") => {

    const results = await analyzeSingleConversations([conversations], fileName);
    return results
});