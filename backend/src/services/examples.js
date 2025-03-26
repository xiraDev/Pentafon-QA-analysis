const queryExamples = [
    {
        message: "quiero el total de registros unicos que se tipificaron como \"Buzón de voz o IVR\" y relacionados",
        query: `
            SELECT "typification" AS "clasificacion", COUNT(DISTINCT "attempts"."customer_id") as total
            FROM "qa"."attempts" AS "attempts"
            WHERE "attempts"."typification" IN ('Buzón de voz o IVR', 'Buzón de voz')
            AND ("attempts"."createdAt"  - INTERVAL '6 hours')
            BETWEEN '2025-02-12 00:00:00 -0600' AND '2025-02-12 23:59:59 -0600'
            GROUP BY "attempts"."typification"`
    },
    {
        message: "quiero el total por tipificacion de las llamadas que se hicieron el 1 de enero de 2025",
        query: `
            SELECT "typification" AS "clasificacion", COUNT(*) as "total"
            FROM "qa"."attempts" AS "attempts"
            WHERE ("attempts"."createdAt" - INTERVAL '6 hours')
            BETWEEN '2025-01-01 00:00:00 -0600' AND '2025-01-01 23:59:59 -0600'
            GROUP BY "attempts"."typification"`
    },
    {
        message: "total por tipificacion de las llamadas que se hicieron desde el 10 de enero de 2025 hasta el primero de febrero de 2025",
        query: `
            SELECT "typification", COUNT(*) as "total"
            FROM "qa"."attempts" AS "attempts"
            WHERE ("attempts"."createdAt" - INTERVAL '6 hours')
            BETWEEN '2025-01-10 00:00:00 -0600' AND '2025-02-01 23:59:59 -0600'
            GROUP BY "attempts"."typification"`
    },
    {
        message: "dame el porcentaje de llamadas que se respondieron por día en febrero",
        query: `
            SELECT "typification" AS "clasificacion", COUNT(DISTINCT "attempts"."customer_id") as "total"
            FROM "qa"."attempts" AS "attempts"
            WHERE "attempts"."typification" IN ('Buzón de voz o IVR', 'Buzón de voz')
            AND ("attempts"."createdAt" - INTERVAL '6 hours')
            BETWEEN '2025-02-12 00:00:00 -0600' AND '2025-02-12 23:59:59 -0600'
            GROUP BY "attempts"."typification"`
    },
    {
        message: "quiero el analisis de la conversación XZWEA906HPTVG60255HUEI0L6JHK00YJ",
        query: `
            SELECT analysisResult, obtainedGrade
            FROM "qa"."conversations_analysis"
            WHERE "id" = 'XZWEA906HPTVG60255HUEI0L6JHK00YJ'`
    },
    {
        message: "muestrame la conversación con id XBP8SKBSNUGDZ5NU1T3WS18BL7Y7CD0E",
        query: `
            SELECT
                transmitter,
                message,
                ("createdAt" - INTERVAL '6 hours') as "date"
            FROM "qa"."messages_voicebot"
            WHERE conversation_id = 'XBP8SKBSNUGDZ5NU1T3WS18BL7Y7CD0E'
            ORDER BY ("createdAt" - INTERVAL '6 hours') ASC`
    },
    {
        message: "Muestrame la ultima conversación que se registró",
        zquery: `
            SELECT
                transmitter,
                message,
                ("createdAt" - INTERVAL '6 hours') as "date"
            FROM "qa"."messages_voicebot"
            WHERE conversation_id = (
                SELECT conversation_id
                FROM "qa"."messages_voicebot"
                ORDER BY "createdAt" DESC
                LIMIT 1
            )
            ORDER BY ("createdAt" - INTERVAL '6 hours') ASC`
    },
    {
        message: "Quiero ver esta conversacion XLPOTHDSDGNP3WIB3FP9QEQFXCVI50DU",
        query: `
            SELECT
                transmitter,
                message,
                ("createdAt" - INTERVAL '6 hours') as "date"
            FROM "qa"."messages_voicebot"
            WHERE conversation_id = 'XLPOTHDSDGNP3WIB3FP9QEQFXCVI50DU'
            ORDER BY ("createdAt" - INTERVAL '6 hours') ASC`
    },
    {
        message: "Cual fue la calificacion promedio hoy ? (haciendo referencia a qa)",
        query: `
            SELECT
                DATE("createdAt" - INTERVAL '6 hours') AS "day",
                ROUND(AVG(LEAST(CAST(SPLIT_PART("obtainedGrade", '/', 1) AS NUMERIC), 100)), 2) AS "average_grade"
            FROM "qa"."conversations_analysis"
            WHERE DATE("createdAt" - INTERVAL '6 hours') = DATE(NOW() - INTERVAL '6 hours')
            GROUP BY DATE("createdAt" - INTERVAL '6 hours')`
    },
    {
        message: "Cual fue la calificacion promedio ayer?",
        query: `
            SELECT
                DATE("createdAt" - INTERVAL '6 hours') AS "day",
                ROUND(AVG(LEAST(CAST(SPLIT_PART("obtainedGrade", '/', 1) AS NUMERIC), 100)), 2) AS "average_grade"
            FROM "qa"."conversations_analysis"
            WHERE DATE("createdAt" - INTERVAL '6 hours') = DATE(NOW() - INTERVAL '1 day' - INTERVAL '6 hours')
            GROUP BY DATE("createdAt" - INTERVAL '6 hours')`
    },
    {
        message: "Muestrame el total de audios analizados por día",
        query: `
            SELECT
                DATE("createdAt" - INTERVAL '6 hours') AS "day",
                COUNT(*) AS "total"
            FROM "qa"."conversations_analysis"
            GROUP BY DATE("createdAt" - INTERVAL '6 hours')
            ORDER BY DATE("createdAt" - INTERVAL '6 hours')`
    },
    {
        message: "Que llamada obtuvo la mejor calificacion?",
        query: `
            SELECT "id", "obtainedGrade"
                FROM "qa"."conversations_analysis"
            WHERE "obtainedGrade" != 'NaN' 
            ORDER BY SPLIT_PART("obtainedGrade", '/', 1) AS NUMERIC
            DESC LIMIT 1`
    }
];

module.exports = {
    queryExamples
}