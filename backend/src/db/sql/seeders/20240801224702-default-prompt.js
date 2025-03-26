const mode = process.env.NODE_ENV ?? "development";
const { schema, replication } = require("../../../config/config")[mode];

("use strict");
const { v4: uuidv4 } = require("uuid");
// helpers
const { getHashSync } = require("../../../helpers");

// ----------------------------------------------------------------------

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      { tableName: "prompts", schema },
      [
        {
          id: uuidv4(),
          campaign: replication.write.database,
          // isBetaMember: false
          promptName: "prompt de prueba 1",
          specialCasesPrompt: `
            El asesor deberá mencionar su nombre y apellido además del nombre de la empresa a la que representa : debes validar que el agente use uno de los siguientes scripts o una estructura similar para saludar:  ""Muchas gracias por haber tomado mi llamada, le reitero mi nombre es: (Nombre y apellido), de <Nombre de la empresa>."", ""Buenos días, mi nombre es XXX, le llamamos de <Nombre de la empresa>."", ""Buena tarde, bienvenido a <Nombre de la empresa>, mi nombre es XXX. ¿En qué puedo ayudarlo(a)?
          `,
          evaluationFormatPrompt: `
          > Script inicial y final (5 puntos)
            - El asesor deberá brindar bienvenida y despedida institucional de manera cordial y empatica.
            - El asesor deberá mencionar su nombre y apellido además del nombre de la empresa a la que representa.
            > Autenticación (2 puntos)
            - El asesor deberá preguntar por el tarjetahabiente mencionando nombre completo (nombres y los apellidos)
            > Motivo de la llamada (5 puntos)
            - El asesor deberá mencionar el motivo principal por el cual se comunica. Procura utlizar palabras amables y empaticas.
            > Sondeo motivo de no pago (10 puntos)
            - El asesor deberá ser claro y coherente al momento de realizar la pregunta de sondeo. Por ejemplo: ¿Ha tenido algun inconveniente para poder realizar su pago?, ¿Cuál ha sido el motivo principal por el que no ha podido realizar su pago?, etc.
            > Negociación de cascada de pagos (15 puntos)
            - El asesor debe mencionar el Saldo total antes de mencionar los demás saldos (Suburbia).
            - El asesor debe negociar el pago para no generar intereses antes de mencionar los demás saldos.
            - El asesor debe negociar el pago mínimo si es que no se puede concretar el pago para no generar intereses. Debe debatir las objeciones de acuerdo a lo que el tarjetahabiente mencione.
            - El asesor como ultima opción puede negociar el saldo vencido, después de haber manejado objeciones sobre los saldos anteriores.
            > Negociación de cascada de pagos 2 (10 puntos)
            - El asesor como ultima opción puede negociar el saldo vencido, después de haber manejado objeciones sobre los saldos anteriores.
            - El asesor como ultima opción puede negociar el saldo vencido, después de haber manejado objeciones sobre los saldos anteriores.
          `,
          criticalErrors: "",
          isBinary: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete({ tableName: "prompts", schema }, null, {});
  },
};
