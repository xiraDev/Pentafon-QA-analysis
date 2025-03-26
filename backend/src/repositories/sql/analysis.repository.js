const { sendTextToAnalyze } = require("../../services/qaEvaluation.service")
const { initialPrompt } = require("../../prompts/initialPrompts")
const { FetchActive } = require("../../repositories/sql/prompts.repository")
const { sequelize } = require("../../db/sql/models");

const db = require("../../db/sql/models");
const QAAudioTranscriptions = db.QAAudioTranscriptions;
const QAAudioMessages = db.QAAudioMessages;

const config = require("../../config/config");

const env = process.env.NODE_ENV || "development";
const schema = config[env].schema;

async function FetchAnalysisById(id) {
    try {
        const results = await sequelize.query(
            `
                SELECT 
                t.id, t.campaign, t.typification,
                f."fileName", f.duration, f.size, f.campaign,
                COALESCE(json_agg(m ORDER BY m.id) FILTER (WHERE m.id IS NOT NULL), '[]') AS messages
                FROM "${schema}".qa_audio_transcriptions t
                LEFT JOIN "${schema}".qa_audio_messages m ON m.analysis_id = t.id
                LEFT JOIN "${schema}".qa_audio_files f ON f."fileName" = t."fileName"
                WHERE t.id = '${id}'
                GROUP BY t.id, t.campaign, t.typification, f."fileName"
            `
            , {
                type: sequelize.QueryTypes.SELECT,
            })
        return results;
    } catch (error) {
        console.error(error)
    }
}

async function FetchAllAnalysis() {
    try {
        const results = await sequelize.query(
            `
               SELECT 
                a.id, a."analysisResult", a."obtainedGrade", a."evaluationPromptName", a."agentName", a."customerName", a."createdAt", 
                t.campaign, t.typification,
                f."fileName", f.duration, f.size, f.campaign,
                COALESCE(json_agg(m) FILTER (WHERE m.id IS NOT NULL), '[]') AS messages
                FROM "${schema}".conversations_analysis a
                LEFT JOIN "${schema}".qa_audio_transcriptions t ON t."fileName" = a."fileName"
                LEFT JOIN "${schema}".qa_audio_messages m ON m.analysis_id = t.id
                LEFT JOIN "${schema}".qa_audio_files f ON f."fileName" = t."fileName"
                GROUP BY a.id, t.campaign, t.typification, f."fileName"
            `
            , {
                type: sequelize.QueryTypes.SELECT,
            })
        return results;
    } catch (error) {
        console.error(error)
    }
}

async function analyzeConversations(conversations) {
    try {
        if (!Array.isArray(conversations) || conversations.length === 0) {
            throw new Error("No se proporcionaron conversaciones válidas.");
        }

        let isBinary = false

        let activePrompt = await FetchActive()
        if (activePrompt?.dataValues?.specialCasesPrompt && activePrompt?.dataValues?.evaluationFormatPrompt) {
            activePrompt = {
                specialCases: activePrompt.dataValues.specialCasesPrompt,
                evaluationFormat: activePrompt.dataValues.evaluationFormatPrompt,
                promptName: activePrompt.dataValues.promptName,
                criticalErrors: activePrompt.dataValues.criticalErrors,
            }
            isBinary = activePrompt.dataValues.isBinary
        } else {
            throw new Error("El prompt activo está incompleto")
        }


        const promptParts = {
            generalInstructions: isBinary ? initialPrompt.generalInstructionsBinary : initialPrompt.generalInstructionsNonBinary,
            additionalInstructions: initialPrompt.additionalInstructions,
            ...activePrompt
        }
        console.log("ANTES DEL ERROR", conversations)
        const formattedConversations = conversations.map(conv => {
            const id = conv.id
            const transcription = conv.messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ordenar por fecha
                .map(msg => `${msg.transmitter}: ${msg.message}`) // Formato "Emisor: Mensaje"
                .join("\n");

            return sendTextToAnalyze(id, transcription, promptParts);
        });

        const results = await Promise.all(formattedConversations);
        return results;
    } catch (error) {
        console.error("Error al analizar conversaciones:", error);
        return { message: "Error al procesar conversaciones", error: error.message };
    }
}

async function analyzeSingleConversations(conversations, fileName = "-", fileMetadata = {}) {
    try {
        if (!Array.isArray(conversations) || conversations.length === 0) {
            throw new Error("No se proporcionaron conversaciones válidas.");
        }

        let activePrompt = await FetchActive()
        if (activePrompt?.dataValues?.specialCasesPrompt && activePrompt?.dataValues?.evaluationFormatPrompt) {
            activePrompt = {
                specialCases: activePrompt.dataValues.specialCasesPrompt,
                evaluationFormat: activePrompt.dataValues.evaluationFormatPrompt,
                promptName: activePrompt.dataValues.promptName,
                criticalErrors: activePrompt.dataValues.criticalErrors
            }
        } else {
            throw new Error("El prompt activo está incompleto")
        }

        const isBinary = false

        const promptParts = {
            generalInstructions: isBinary ? initialPrompt.generalInstructionsBinary : initialPrompt.generalInstructionsNonBinary,
            additionalInstructions: initialPrompt.additionalInstructions,
            ...activePrompt
        }

        const finalFileMetaData = {
            duration: fileMetadata.duration ?? "",
            size: fileMetadata.size ?? 0.0,
            campaign: fileMetadata.campaign ?? "",
        }
        console.log("ANTES DEL ERROR", conversations)
        const formattedConversations = conversations.map(conv => {
            const id = conv.id
            const transcription = conv.messages
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Ordenar por fecha
                .map(msg => `${msg.transmitter}: ${msg.message}`) // Formato "Emisor: Mensaje"
                .join("\n");

            return sendTextToAnalyze(id, transcription, promptParts, fileName, finalFileMetaData);
        });

        const results = await Promise.all(formattedConversations);
        return results;
    } catch (error) {
        console.error("Error al analizar conversaciones:", error);
        return { message: "Error al procesar conversaciones", error: error.message };
    }
}

async function analyzeSingleConversationsWhisper(conversations, fileName = "-", fileMetadata = {}) {
    try {
        if (!Array.isArray(conversations) || conversations.length === 0) {
            throw new Error("No se proporcionaron conversaciones válidas.");
        }

        const finalFileMetaData = {
            duration: fileMetadata.duration ?? "",
            size: fileMetadata.size ?? 0.0,
            campaign: fileMetadata.campaign ?? "",
        }

        let activePrompt = await FetchActive()
        if (activePrompt?.dataValues?.specialCasesPrompt && activePrompt?.dataValues?.evaluationFormatPrompt) {
            activePrompt = {
                specialCases: activePrompt.dataValues.specialCasesPrompt,
                evaluationFormat: activePrompt.dataValues.evaluationFormatPrompt,
                promptName: activePrompt.dataValues.promptName,
                criticalErrors: activePrompt.dataValues.criticalErrors
            }
        } else {
            throw new Error("El prompt activo está incompleto")
        }

        const isBinary = false

        const promptParts = {
            generalInstructions: isBinary ? initialPrompt.generalInstructionsBinary : initialPrompt.generalInstructionsNonBinary,
            additionalInstructions: initialPrompt.additionalInstructions,
            ...activePrompt
        }

        const formattedConversations = conversations.map(conv => {
            const id = conv.id
            const transcription = conv.transcription

            return sendTextToAnalyze(id, transcription, promptParts, fileName, finalFileMetaData);
        });

        const results = await Promise.all(formattedConversations);
        return results;
    } catch (error) {
        console.error("Error al analizar conversaciones:", error);
        return { message: "Error al procesar conversaciones", error: error.message };
    }
}

module.exports = {
    analyzeConversations,
    analyzeSingleConversations,
    analyzeSingleConversationsWhisper,
    FetchAllAnalysis,
    FetchAnalysisById,
}
