const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const { transcribeAudioFileWhisper, transcribeAudioFile } = require("../services/transcription.service");
const db = require("../db/sql/models");
const fs = require("node:fs")
const path = require("node:path")
const { randomUUID } = require("node:crypto");
const { analyzeSingleConversationsWhisper, analyzeSingleConversations, FetchAnalysisById } = require("../repositories/sql/analysis.repository");
const QAAudioTranscriptions = db.QAAudioTranscriptions
const QAAudioMessages = db.QAAudioMessages
const QAAudioFiles = db.QAAudioFiles
const ConversationsAnalysis = db.ConversationsAnalysis

const AWS_REGION = process.env.AWS_REGION

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: fromEnv(),
});

async function movefile(file) {
    return new Promise((resolve, reject) => {
        // Extract file extension
        const fileName = file.name
        const extension = file.name.split(".").pop();
        const validExtensions = ["mp3", "mp4", "ogg", "wav"]
        // Validate the extension
        if (!validExtensions.includes(extension)) {
            return reject(
                `La extensión ${extension} no es permitida, solo se permiten archivos con extensión: ${validExtensions.join(", ")}`
            );
        }

        // Construct the file name and upload path
        const tmpName = `${fileName}.${extension}`;
        const uploadPath = path.join(__dirname, "../uploads/", tmpName);

        // Move the file to the destination
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(`Error al subir el archivo: ${err}`);
            }
            console.log("El archivo se ha subido exitosamente");
            resolve(uploadPath);
        });
    });
}

exports.processAudio = async (audioFile, campaign) => {
    let id
    let audioName

    let responseObj = {
        id: "",
        audioName: "",
        result: "",
        errorMessage: ""
    }

    try {
        const { parseBuffer } = await import('music-metadata');
        audioName = audioFile.name;
        console.log("Entró a processAudio:", audioName);
        responseObj.audioName = audioName
        const audioPath = await movefile(audioFile);
        const fileBuffer = fs.readFileSync(audioPath);
        const stats = fs.statSync(audioPath);
        const size = stats.size;

        let duration = 0;
        try {
            const metadata = await parseBuffer(fileBuffer);
            duration = metadata.format.duration || 0;
        } catch (metaError) {
            console.error("Error obteniendo metadatos de audio:", metaError);
        }

        // const transcription = await transcribeAudioFile(fileBuffer); //deepgram

        id = audioName?.split("-")[0] ?? randomUUID();
        console.log("id a generar", id)
        responseObj.id = id
        const transcriptionAlreadyExists = await QAAudioTranscriptions.findOne({
            where: { id }
        })

        if (transcriptionAlreadyExists !== null) {
            responseObj.result = "Error"
            responseObj.errorMessage = "El archivo ya existe"
            console.log("El análisis de este archivo ya existe")
            return responseObj
        }

        const typification = "-";
        const transcription = await transcribeAudioFileWhisper(audioPath); //Whisper

        await QAAudioTranscriptions.create({
            id,
            fileName: audioName,
            campaign,
            typification,
        });

        const messages = transcription.fullTranscription.split("\n");
        let transmitter = "";

        for (let m of messages) {

            if (!m) continue;

            const newTransmitter = m.slice(0, m.indexOf(":"));
            transmitter = newTransmitter?.length < 30 ? newTransmitter : transmitter;

            await new Promise((resolve) => {
                setTimeout(() => {
                    QAAudioMessages.create({
                        message: m,
                        analysisId: id,
                        transmitter,
                    });
                    resolve();
                }, 100);
            });
        }

        const fileMetaData = {
            duration,
            size,
            campaign,
        };

        const conversationToAnalyze = { id, transcription: transcription.fullTranscription }; //Whisper
        await analyzeSingleConversationsWhisper([conversationToAnalyze], audioName, fileMetaData);

        responseObj.result = "Success"
        return responseObj;
    } catch (error) {
        responseObj.result = "Error"
        responseObj.errorMessage = error.message
        console.error("Error en processAudio:", error);

        if (id) {
            await QAAudioMessages.destroy({ where: { analysisId: id }, force: true });
            await QAAudioTranscriptions.destroy({ where: { id }, force: true });
        }

        if (audioName) {
            await QAAudioFiles.destroy({ where: { fileName: audioName }, force: true });
            await ConversationsAnalysis.destroy({ where: { fileName: audioName }, force: true })
        }
        return responseObj
    }
};
