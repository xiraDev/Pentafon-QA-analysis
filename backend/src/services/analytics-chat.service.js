const OpenAI = require('openai')
const pc = require('picocolors')
const { attempt } = require('../helpers/attempt')
const { schemas } = require('../controllers/schemas')
const { queryExamples } = require('./examples')
const db = require('../db/sql/models/index')

/** @typedef {{ role: string, content: string }} HistoryEntry */
/** @typedef {{ query?: string, message?: string }} OpenAIChatResponse */

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL_NAME = 'gpt-4o-mini'
const MAX_RECORDS = 100
const DEFAULT_ERROR_MESSAGE = 'Ocurrió un error, por favor intenta de nuevo.'
const NUMBER_REGEX = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/

const logger = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.log(pc.red('[ERROR]'), ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    status: (...args) => console.log(pc.green('[STATUS]'), ...args),
}

/**
 * Executes SQL query with error handling
 * @param {string} rawQuery
 * @returns {Promise<[Error | null, Array<Object>]>}
 */
async function executeQuery(rawQuery) {
    try {
        const [results] = await db.sequelize.query(rawQuery)
        return [null, results]
    } catch (error) {
        return [error, null]
    }
}

/**
 * Generates OpenAI chat completion
 * @param {Array<Object>} messages 
 * @param {number} [temperature=0.3]
 * @returns {Promise<string>}
 */
async function createChatCompletion(messages, temperature = 0.3) {
    try {
        const response = await client.chat.completions.create({
            messages,
            model: MODEL_NAME,
            temperature,
        })
        return response.choices[0].message.content
    } catch (error) {
        console.error(error)
        throw new Error('Failed request to OpenAI, check the API')
    }
}

/**
 * Parses and validates OpenAI JSON response
 * @param {string} jsonString
 * @returns {OpenAIChatResponse}
 */
function parseAIResponse(jsonString) {
    try {
        const response = JSON.parse(jsonString)
        if (!response.query && !response.message) {
            throw new Error('Invalid JSON structure')
        }
        return response
    } catch (error) {
        console.error('Failed to parse AI response:', jsonString)
        throw new Error('Invalid JSON format geberated by the model')
    }
}

/**
 * Formats data for client response
 * @param {Array<Object>} data 
 * @returns {Array<Object>}
 */
function formatData(data) {
    const isMidnight = date => date.getUTCHours() === 0 && date.getUTCMinutes() === 0
    const formatDate = (date, includeTime) => {
        const pad = n => String(n).padStart(2, '0')
        const datePart = `${pad(date.getUTCDate())}-${pad(date.getUTCMonth() + 1)}-${date.getUTCFullYear()}`
        return includeTime ? `${datePart} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}` : datePart
    }

    return data.map(item => Object.entries(item).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' && NUMBER_REGEX.test(value) ? Number(value) :
            value instanceof Date ? formatDate(value, !isMidnight(value)) : value
        return acc
    }, {}))
}

async function generateRawQuery(history) {
    let error, TYPIFICATIONS
    if (generateRawQuery.TYPIFICATIONS) {
        TYPIFICATIONS = generateRawQuery.TYPIFICATIONS
    } else {
        [error, TYPIFICATIONS] = await attempt(async () => {
            const query = 'SELECT DISTINCT "typification" FROM qa.attempts'
            const [error, result] = await executeQuery(query)
            if (error) throw error
            return result
        }, 3)
        if (error) return [new Error('Error retrieving the values for "typification", the DB might be failing'), null]
        TYPIFICATIONS = TYPIFICATIONS.map(({ typification }) => typification)
        generateRawQuery.TYPIFICATIONS = TYPIFICATIONS
    }
    const messages = [{
        role: 'system',
        content: `
            Eres un asistente con la única función de generar consultas sql de acuerdo a la conversación que tienes con el usuario, genera una respuesta de manera inmediata solo sí es imposible generar una consulta, se te dará el esquema de la base de datos, el historial de mensajes entre tu y el usuario,
            todos los posibles valores para typifications (tipificaciones) además de la fecha y hora.
            
            El esquema de la base de datos :
            ${schemas}

            Historial de mensajes : 
            ${JSON.stringify(history)}

            Fecha y hora de los usuarios:
            ${new Date(new Date().getTime() - 6 * 60 * 60 * 1000)}

            Tipificaciones :
            ${JSON.stringify(TYPIFICATIONS)}

            La base de datos está siendo usada por una plataforma de analisis que son generados por un voicebot, esta base de datos es de solo lectura.
            Además es una instancia de postgresql.
            Las referencias a los campos de las tablas deben ser simpre de la forma tabla."campo", no olvides las comillas dobles dado que
            su omisión puede generar errores en la consulta sql. Tambien ten en cuenta que todos los campos de tipo datetime tienen por nombre createdAt, updatedAt
            y deletedAt si tienes que filtrar por fechas tendrías que extraerla de esos campos, nunca uses "date" o algo que no sea alguna de las opciones anteriores.
            Cuando el usuario haga referencia a usuarios únicos se refiere a los números de telefono únicos.
            Si el usuario quiere que hagas cierto reporte pero no te indica un rango de fechas entonces analiza los registros del día vencido (ayer)
            de la tabla correspondiente. Si el usuario te pide visualizar una conversación regresa unicamente los campos transmitter, message y createdAt
            de la tabla messages_voicebot.

            Tu respuesta debe seguir el siguiente formato donde solo un campo es requerido, el otro debe ser una cadena vacia forzosamente:

            {
                "query": "SELECT * FROM "qa"."tabla" WHERE "campo" = 'valor'", // 98% de las veces este campo es llenado
                "message": "" // Mensaje si es imposible generar una consulta
            }

            Ejemplos:
            ${JSON.stringify(queryExamples)}

            Todos los filtros por fechas y horas deben tomar en cuenta que los resultados son para usuarios
            en UTC-6 por favor ajusta los filtros de acuerdo a esa zona horaria. El esquema para las tablas siempre va a ser qa
        `
    }, {
        role: 'user',
        content: history[history.length - 1].content
    }]
    return attempt(async () => {
        logger.status('GENERATING QUERY OR RESPONSE...')
        const response = await createChatCompletion(messages)
        return parseAIResponse(response)
    }, 3)
}

async function generateAnswer(history, query, data) {
    const messages = [{
        role: 'system',
        content: `
            Eres un asistente con la finalidad de responder a los mensajes de los usuarios con información de la base de datos,
            esta información es dada por un servicio que se conecta hacia la base de datos y es obtenida de acuerdo a la solicitud del usuario,
            genera una respuesta en base a la información que se te pasa como contexto:
            
            ${JSON.stringify(data)}

            No olvides que esta información no fue proporcionada por el usuario.
            En caso de que tu respuesta incluya mostrar información en formato de tabla de la base de datos, reemplaza esa parte de tu respuesta por <TABLA/>,
            Si tu respuesta o si el usuario pidio ver una grafica entonces reemplaza esa parte de tu respuesta por <GRAFICA/>, las gráficas solo pueden
            mostrarse para consultas que regresen pares de valores y que a su vez no sea una cantidad muy grande de registros, toma un máximo de 20 pares.
            Trata de dar un poco de contexto al usuario acerca de los datos incluso si muestras una tabla o una gráfica,
            si tu respuesta es unicamente un valor único entonces puedes omitir este paso y mostrarlo solo como texto en tu respuesta.
            No uses markdown o anotaciones en tu respuesta.
            Recuerda que hay una distintición entre las llamadas que se tipifican y los usuarios a los que se le llamo, siempre que regreses un resultado
            que incluya alguna de esas dos metricas debes especificar y dar contexto de cual es cual.

            Por ultimo te comparto la consulta sql que se generó para obtener esta información, puedes usarla para darle más contexto al usuario,
            como para señalar en que rango de fechas se hizo la consulta, pero nunca hagas referencia a que existe una consulta SQL de por medio:
            ${query}


            Si el usuario te dice : Muestrame la ultima conversación que se registró

            La respuesta sería:
            Aquí tienes la última conversación registrada. Esta información incluye los mensajes y la fecha en que fueron enviados:

            <TABLA/>

            Si necesitas más detalles o análisis sobre esta conversación, házmelo saber.


            Si el usuario te dice : Muestrame el total de audios analizados por día

            La respuesta sería:
            Aquí tienes la gráfica que muestra el total de audios analizados por día. Los datos reflejan la cantidad de audios analizados en la base de datos de QA a lo largo del tiempo:

            <GRAFICA/>

            Si necesitas más detalles o análisis házmelo saber.


            Si el usuario te dice : Que llamada obtuvo la mejor calificacion?
            La respuesta sería:
            La llamada que obtuvo la mejor calificación fue de 88/100 la cual tiene el ID X3BXAZUZG1OJVX9FIPRX47NXDCIF70VX. Te gustaría ver la conversación?.
            `
    }, ...history]
    return createChatCompletion(messages)
}

async function generateApology(history) {
    const messages = [{
        role: 'system',
        content: `
            En esta conversación con el usuario no se pudo generar una consulta sql para poder obtener la información solicitada,
            comunicale al usuario que intente de nuevo con otra pregunta o responde de la manera más profesional de forma apropiada,
            también puedes proponerle al usuario una manera de reformular su pregunta si pidio más de un dato que se
            pudiera obtener con solo una consulta basado en lo que se respondio en el historial,
            el usuario no debe saber que existe una consulta sql de por medio, aquí tienes el historial de mensajes:
            ${JSON.stringify(history)}
        `
    }, history[history.length - 1]]
    return createChatCompletion(messages)
}

/**
 * Main processing function
 * @param {HistoryEntry[]} history 
 * @returns {Promise<{answer: string, data: Array<Object>}>}
 */
async function processRequest(history) {
    try {
        logger.status('PROCESSING REQUEST...')

        const MAX_ATTEMPTS = 3
        let attempts = 0

        do {
            const [error, { query, message }] = await generateRawQuery(history)

            if (error) {
                console.error(error)
                attempts++; continue
            }

            if (message) {
                logger.status('INSTANT RESPONSE GENERATED')
                return { answer: message, data: [] }
            }

            logger.status(`EXECUTING QUERY...`)
            console.log(pc.blue(query))
            let [error2, data] = await executeQuery(query)

            if (error2) {
                logger.error('INVALID QUERY')
                attempts++
                if(attempts === MAX_ATTEMPTS){
                    const apology = await generateApology(history)
                    return { answer: apology, data: [] }
                }
                continue
            }

            if (data.length > MAX_RECORDS) {
                logger.warn('Excessive records detected, trying to regenerate query...')
                if(attempts++ === MAX_ATTEMPTS){
                    
                }
                continue
            }

            data = formatData(data)
            const answer = await generateAnswer(history, query, data)
            console.log(pc.blue(answer))

            return { answer, data }
        } while (attempts < MAX_ATTEMPTS)

        return { answer: DEFAULT_ERROR_MESSAGE, data: [] }
    } catch (error) {
        logger.error(error.message)
        return { answer: DEFAULT_ERROR_MESSAGE, data: [] }
    }
}

function closeConnection() {
    db.sequelize.close()
}

module.exports = { processRequest, executeQuery, closeConnection }