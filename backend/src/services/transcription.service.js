// ---------------- Dependencias --------------- 
const { createClient } = require("@deepgram/sdk");
const fs = require("node:fs");
const { deepgram } = require("@deepgram/sdk")
const FormData = require('form-data');
const path = require("node:path")

// const { parseFile } = require('music-metadata');
// ---------------- Datos para uso de la herramienta ---------------
// const { deepgramKey } = require("../config/config.js")
const deepgramKey = "1e83cf83072a24955b51b459b7735eb0bdace5ac" //no prod límite de 5
const { exec } = require("node:child_process");
const { inspect } = require("node:util");

// -------------- Ignorar esta parte, son definiciones de js doc -----------------
/**
 * @typedef {Object} Metadata
 * @property {string} transaction_key - Clave de la transacción (puede ser 'deprecated').
 * @property {string} request_id - Identificador único de la solicitud.
 * @property {string} sha256 - Hash SHA-256 de la transcripción.
 * @property {string} created - Fecha y hora de creación en formato ISO 8601.
 * @property {number} duration - Duración del proceso en milisegundos.
 * @property {number} channels - Número de canales de audio procesados.
 * @property {string[]} models - Identificadores de modelos utilizados.
 * @property {Object.<string, ModelInfo>} model_info - Información sobre los modelos utilizados.
 */

/**
 * @typedef {Object} ModelInfo
 * @property {string} name - Nombre del modelo.
 * @property {string} version - Versión del modelo.
 * @property {string} arch - Arquitectura del modelo.
 */

/**
 * @typedef {Object} Word
 * @property {string} word - Palabra reconocida.
 * @property {number} start - Tiempo de inicio en segundos.
 * @property {number} end - Tiempo de finalización en segundos.
 * @property {number} confidence - Nivel de confianza en la palabra reconocida.
 * @property {string} punctuated_word - Palabra con puntuación corregida.
 */

/**
 * @typedef {Object} Sentence
 * @property {string} text - Texto de la oración.
 * @property {number} start - Tiempo de inicio en segundos.
 * @property {number} end - Tiempo de finalización en segundos.
 */

/**
 * @typedef {Object} Paragraph
 * @property {Sentence[]} sentences - Lista de oraciones dentro del párrafo.
 * @property {number} num_words - Número total de palabras en el párrafo.
 * @property {number} start - Tiempo de inicio en segundos.
 * @property {number} end - Tiempo de finalización en segundos.
 */

/**
 * @typedef {Object} Alternative
 * @property {string} transcript - Texto transcrito del audio.
 * @property {number} confidence - Nivel de confianza en la transcripción.
 * @property {Word[]} words - Lista de palabras reconocidas.
 * @property {Object} paragraphs - Información de párrafos y su transcripción.
 * @property {string} paragraphs.transcript - Texto transcrito con párrafos.
 * @property {Paragraph[]} paragraphs.paragraphs - Lista de párrafos.
 */

/**
 * @typedef {Object} Channel
 * @property {Alternative[]} alternatives - Alternativas de transcripción para el canal.
 */

/**
 * @typedef {Object} Utterance
 * @property {number} start - Tiempo de inicio en segundos.
 * @property {number} end - Tiempo de finalización en segundos.
 * @property {number} confidence - Nivel de confianza en la transcripción.
 * @property {number} channel - Índice del canal de audio.
 * @property {string} transcript - Texto transcrito del audio.
 * @property {Word[]} words - Lista de palabras reconocidas.
 * @property {string} id - Identificador único de la transcripción.
 */

/**
 * @typedef {Object} Results
 * @property {Channel[]} channels - Lista de canales con sus alternativas de transcripción.
 * @property {Utterance[]} utterances - Lista de frases completas con información detallada.
 */

/**
 * @typedef {Object} TranscriptionResult
 * @property {Metadata} metadata - Información sobre la transcripción.
 * @property {Results} results - Resultados de la transcripción.
 */
// -------------------------------------------------------------------------------


/**
 * @description Función encargada de generar transcripciones de audios usando deepgram
 * @param {String} audioFilePath - Ruta al archivo a transcribir 
 * @returns {Promise.<TranscriptionResult>}
 * @throws {Error}
 */
async function transcribeLocalAudioFile(audioFilePath) {
    const deepgram = createClient(deepgramKey);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        // path to the audio file
        fs.readFileSync(audioFilePath),
        {
            diarize: true,
            filler_words: true,
            language: "es-MX",
            model: "nova-2-general",
            punctuate: true,
            smart_format: true,
            utt_split: 4,
            utterances: true,
        }
    );

    if (error) throw error;

    if (!error) console.dir(result, { depth: null });
    return result
};

async function transcribeAudioFile(audioBuffer) {
    try {
        const deepgram = createClient(deepgramKey);
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                diarize: true,
                filler_words: true,
                language: "es-MX",
                model: "nova-2-general",
                punctuate: true,
                smart_format: true,
                utt_split: 4,
                utterances: true,
            }
        );

        if (error) throw error;
        return sftpAdaptTranscription(result?.results?.channels[0].alternatives) || "No se pudo obtener la transcripción.";
    } catch (err) {
        console.error("Error en transcripción:", err);
        return "Error al transcribir el audio.";
    }
}

// transcribeAudioFile("C:\\Users\\PCGP22\\Desktop\\2025_01_29_08_14_5540274536_7451436c_8afe_4a49_abe1_7c2d5d665764.mp3");

async function transcribeMultipleLocalAudioFiles(audioFilePaths) {
    try {
        const transcriptions = await Promise.all(
            audioFilePaths.map(filePath => transcribeAudioFile(filePath))
        );
        return transcriptions;
    } catch (error) {
        console.error("Error en la transcripción:", error);
        return [];
    }
}

//deepgram
function sftpAdaptTranscription(deepgramArray) {
    const responseObject = {
        fullTranscription: "",
        conversationDividedBySpeakers: {
            agent: [],
            customer: []
        },
        conversationHasFourSecondsPauses: false,
        result: "No se pudo obtener el resultado de la transcripción"
    };

    // Verificar que se reciba un arreglo con al menos un elemento
    if (!Array.isArray(deepgramArray) || deepgramArray.length === 0) {
        return responseObject;
    }

    // Utilizar el primer objeto del arreglo
    const deepgramResult = deepgramArray[0];

    // Se obtiene la transcripción completa de "paragraphs.transcript" o de "transcript"
    responseObject.fullTranscription =
        deepgramResult.paragraphs?.transcript ||
        deepgramResult.transcript ||
        "";

    responseObject.fullTranscription = responseObject.fullTranscription.replaceAll(/(Speaker 0)/g, "Agente")
    responseObject.fullTranscription = responseObject.fullTranscription.replaceAll(/(Speaker 1)/g, "Cliente")

    if (!responseObject.fullTranscription.length) {
        responseObject.result = "No se pudo obtener la transcripción completa";
        return responseObject;
    }

    // Se limpia la transcripción eliminando saltos de línea
    const cleanedConversation = responseObject.fullTranscription.replaceAll(/\n/g, "");

    responseObject.result = "No se pudo obtener la conversación dividida";

    // Se determina si hay pausas de más de 4 segundos, en caso de que Deepgram incluya "utterances"
    if (deepgramResult.utterances && Array.isArray(deepgramResult.utterances)) {
        if (responseObject.result === "No se pudo obtener la conversación dividida") {
            responseObject.conversationHasFourSecondsPauses = deepgramResult.utterances.length > 1;
        } else {
            responseObject.conversationHasFourSecondsPauses =
                deepgramResult.utterances.filter(u =>
                    !responseObject.conversationDividedBySpeakers.customer.some(customerPhrase =>
                        u.transcript.startsWith(customerPhrase)
                    )
                ).length > 1;
        }
    } else {
        responseObject.conversationHasFourSecondsPauses = false;
    }

    return responseObject;
}

//Whisper
function sftpAdaptTranscriptionV2(messagesArray1, messagesArray2 = []) {
    const responseObject = {
        fullTranscription: "",
        conversationDividedBySpeakers: [],
        result: "No se pudo obtener el resultado de la transcripción"
    };

    // Función para agrupar mensajes que terminan justo cuando el siguiente inicia
    function mergeMessages(messages) {
        let mergedMessages = [];
        let tempMessage = { ...messages[0] };

        for (let i = 1; i < messages.length; i++) {
            let currentMessage = messages[i];

            if (tempMessage.end === currentMessage.start) {
                // Concatenar textos si hay continuidad en el tiempo
                tempMessage.text += " " + currentMessage.text;
                tempMessage.end = currentMessage.end; // Actualizar el tiempo final
            } else {
                mergedMessages.push(tempMessage);
                tempMessage = { ...currentMessage };
            }
        }
        mergedMessages.push(tempMessage); // Agregar el último mensaje procesado
        return mergedMessages;
    }

    // Ordenar ambos arrays por tiempo de inicio antes de combinarlos
    messagesArray1.sort((a, b) => a.start - b.start);
    if (messagesArray2.length) {
        messagesArray2.sort((a, b) => a.start - b.start);
        // Añadir 2 segundos al primer mensaje de messagesArray2
        if (messagesArray2[0]) {
            messagesArray2[0].start += 2;
        }
    }

    // Agrupar los mensajes de ambos arrays por separado
    let mergedMessages1 = mergeMessages(messagesArray1);
    let mergedMessages2 = mergeMessages(messagesArray2);

    // Unir los dos arrays ya agrupados en uno solo
    let combinedMessages = [...mergedMessages1, ...mergedMessages2];

    // Ordenar los mensajes por tiempo de inicio
    combinedMessages.sort((a, b) => a.start - b.start);

    // Construir la transcripción completa y la conversación separada
    responseObject.fullTranscription = combinedMessages.map(m => m.text).join("\n");
    responseObject.conversationDividedBySpeakers = {
        agent: messagesArray1,
        client: messagesArray2
    };

    responseObject.result = "Éxito al procesar la transcripción";
    return responseObject;
}


async function transcribeAudioFileWhisper(audioFilePath) {
    const outputPath = path.join(__dirname, "../tmp")
    console.log("Original Path", audioFilePath)
    const { routes } = await splitAudioChannels(audioFilePath, outputPath)
    console.log("Rutas obtenidas", routes)
    const transcriptions = []
    for (let route of routes) {
        const transcription = await sendToFastWhisper(route)
        transcriptions.push(transcription)
    }
    console.log(transcriptions)
    const results = sftpAdaptTranscriptionV2(...transcriptions)
    return results
    // console.log(results)
}

// transcribeAudioFileWhisper("C:\\Users\\PCGP22\\Desktop\\Ya procesados\\0b63e2b7e6fa4146b5de033b33338d2f-REfcb000b96712937d48ed9908ba7792dc.mp3").then(r => console.log(JSON.stringify(r, null, 2)))
/**
 * @description Processes an audio file obtaining a route for each number of channels and return the route(s) of said channels
 * @param {String} inputFilePath 
 * @param {String} outputPath 
 * @returns 
 */
async function splitAudioChannels(inputFilePath, outputPath) {
    let { numberOfChannels } = await getAudioChannels(inputFilePath)
    let fileName = path.basename(inputFilePath)
    fileName = fileName.slice(0, fileName.lastIndexOf("."))
    const ffmpegModule = await import('fluent-ffmpeg');
    const ffmpeg = ffmpegModule.default;
    if (numberOfChannels && numberOfChannels > 1) {
        const leftAudioPath = `${outputPath}/${fileName}_left.wav`
        const rightAudioPath = `${outputPath}/${fileName}_right.wav`
        await new Promise((resolve, reject) => {
            ffmpeg(inputFilePath)
                .output(leftAudioPath)
                .audioFilters('pan=mono|c0=c0') // Extrae canal izquierdo
                .output(rightAudioPath)
                .audioFilters('pan=mono|c0=c1') // Extrae canal derecho
                .on('end', () => resolve('Separation complete'))
                .on('error', err => reject(err))
                .run();
        });
        const firstSpeaker = await detectFirstSpeaker({
            leftAudio: leftAudioPath,
            rightAudio: rightAudioPath
        })
        if (firstSpeaker === leftAudioPath) {
            return {
                routes: [
                    leftAudioPath,
                    rightAudioPath
                ]
            }
        } else {
            return {
                routes: [
                    rightAudioPath,
                    leftAudioPath
                ]
            }
        }
    } else return { routes: [inputFilePath] }

    /**
     * @description Gets the number of channels in an audio
     * @param {String} filePath 
     * @returns 
     */
    async function getAudioChannels(filePath) {
        const { parseFile } = await import('music-metadata');
        const metadata = await parseFile(filePath);
        return {
            metadata,
            numberOfChannels: metadata.format.numberOfChannels,
        };
    }
}


async function detectFirstSpeaker({ leftAudio, rightAudio }) {
    try {
        const leftStart = await getFirstSoundMoment(leftAudio);
        const rightStart = await getFirstSoundMoment(rightAudio);
        return Math.min(leftStart, rightStart) === leftStart ? leftAudio : rightAudio
    } catch (error) {
        console.error("Error al procesar los audios:", error);
    }

    function getFirstSoundMoment(file) {
        return new Promise((resolve, reject) => {
            // const cmd = `ffmpeg -i "${file}" -af "silencedetect=noise=-30dB:d=0.1" -f null NUL 2>&1 | findstr "silence_end"`; // Windows
            const cmd = `ffmpeg -i "${file}" -af "silencedetect=noise=-30dB:d=0.1" -f null NUL 2>&1 | grep "silence_end"`; //Linux

            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                const match = stdout.match(/silence_end: (\d+\.\d+)/);
                resolve(match ? parseFloat(match[1]) : Infinity);
            });
        });
    }
}

async function sendToFastWhisper(audiofile) {
    try {
        const axiosModule = await import("axios");
        const axios = axiosModule.default;
        const formData = new FormData();
        formData.append("file", fs.createReadStream(audiofile)); // Cargar archivo desde ruta
        // const response = await axios.post("http://localhost:5000/transcribe", formData, {
        const response = await axios.post("http://3.142.215.148:5000/transcribe", formData, {
            maxBodyLength: Infinity, // Permitir archivos grandes
            headers: {
                ...formData.getHeaders()
            }
        });

        return response.data.transcription; // Devuelve la respuesta de la API
    } catch (error) {
        console.error("Error en la transcripción:", error);
        throw error; // Relanzar error para manejarlo externamente
    }
}


module.exports = { transcribeAudioFile, transcribeAudioFileWhisper }
