const OpenAIApi = require("openai")
const { jsonrepair } = require("jsonrepair")

const apiKey = process.env.OPENAI_API_KEY

const {
    Create: CreateAnalysis
} = require("../repositories/sql/conversationsAnalysis.repository")

const {
    Create: CreateFile
} = require("../repositories/sql/qa_audio_file.repository")

// Definiciones de JS Doc-------
/**
 * @typedef {Object} PromptParts
 * @property {String} generalInstructions - Instrucciones sobre el formato de respuesta y evaluación.
 * @property {String} additionalInstructions - Consideraciones al momento de realizar la calificación.
 * @property {String} specialCases - Instrucciones adicionales para cada categoría de la cédula de evaluación.
 * @property {String} evaluationFormat - Cédula de evaluación.
 */
// -----------------------------

const openai = new OpenAIApi({
    apiKey,
});


/**
 * @description Analiza la transcripción de la conversación
 * @param {String} transcription - La transcripción completa
 * @param {PromptParts} promptParts - Un objeto que contiene todas las partes que conformarán al prompt 
 * @returns Un objeto con el resultado en su propiedad message
 */
async function sendTextToAnalyze(id, transcription, promptParts, fileName = "-", fileMetaData) {
    try {
        console.log("transcripción recibida", transcription)
        if (!transcription || typeof transcription !== "string") {
            throw new Error("La transcripción proporcionada no es válida.");
        }

        const {
            generalInstructions,
            additionalInstructions,
            criticalErrors,
            specialCases,
            evaluationFormat,
            promptName
        } = promptParts;

        const {
            duration,
            size,
            campaign
        } = fileMetaData;

        if (!generalInstructions || !evaluationFormat) {
            throw new Error("Las instrucciones del prompt están incompletas.");
        }

        const promptContent = `
            ${generalInstructions}
            ${additionalInstructions}
            ${criticalErrors}
            ${specialCases}
            ${evaluationFormat}
        `

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: promptContent,
                },
                {
                    role: 'user',
                    content: `
                        CallContent: ${transcription}
                    `,
                },
            ],
        });


        let response = completion.choices?.[0]?.message?.content;
        if (!response) throw new Error("Respuesta vacía.");
        response = response.replace("} } ,", "} } ],")
        response = jsonrepair(response)
        const analysisResult = JSON.stringify(response)
        const { summary, names } = JSON.parse(response)
        await CreateAnalysis({
            id,
            analysisResult,
            campaignForCreation: campaign,
            obtainedGrade: summary.totalGrade,
            evaluationPromptName: promptName,
            customerName: names.customerName,
            agentName: names.agentName,
            fileName
        })

        await CreateFile({
            fileName,
            duration,
            size,
            campaign,
        })
        return { message: "Análisis completado", results: response };

    } catch (error) {
        if (error.response) {
            console.error("Error de OpenAI:", error.response.data);
            return { message: `No se pudo procesar correctamente esta transcripción: ${error.response.data}` };
        }
        console.error('Error al momento de analizar la transcripción:', error);
        return { message: `No se pudo procesar correctamente esta transcripción: ${error.message}` };
    }
}


// function extractAndCalculateScores(text) {

//     return { totalScore, updatedText };
// }

module.exports = {
    sendTextToAnalyze
}
