const fs = require("node:fs")
const CronJob = require("cron").CronJob;

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const { analyzeConversations } = require("../repositories/sql/analysis.repository.js")

// const analyseRandomConversationsCronExpression = "54 15 * * *"
const analyseRandomConversationsCronExpression = "0 0 * * *"
const percentageToObtain = 5


function chooseRandomFiles(arrayOfConversations, percentageToObtain) {
    const sampleSize = Math.max(1, Math.floor(arrayOfConversations.length * (percentageToObtain / 100))) + 1;

    // Fisher-Yates Shuffle para aleatorizar de manera eficiente
    for (let i = arrayOfConversations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayOfConversations[i], arrayOfConversations[j]] = [arrayOfConversations[j], arrayOfConversations[i]];
    }

    return arrayOfConversations.slice(0, sampleSize);
}


async function executeFullProcess() {
    // let yesterdayConversations = await internalOnly_getYesterdayConversationsExtended()
    // const initialNumber = yesterdayConversations.length
    // yesterdayConversations = chooseRandomFiles(yesterdayConversations, percentageToObtain)
    // console.log("Número inicial de elementos:", initialNumber)
    // console.log("Número final de elementos", yesterdayConversations.length)
    // await analyzeConversations(yesterdayConversations)
}

const analyseRandomConversationsCronFullProcess = new CronJob(analyseRandomConversationsCronExpression, executeFullProcess, null, true, 'America/Mexico_City')
console.log("El cron ha sido programado", analyseRandomConversationsCronExpression)

module.exports = { analyseRandomConversationsCronFullProcess }

