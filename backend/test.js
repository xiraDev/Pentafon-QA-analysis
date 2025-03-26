const express = require("express");
const app = express();
const port = 3000;

// Endpoint para retornar el TwiML
app.post("/twiml", (req, res) => {
  // Configura el TwiML para manejar la llamada
  const twiml = `
    <Response>
        <Dial callerId="+525597096019">
            <Number>+525510057272</Number>
        </Dial>
    </Response>
        `;
  // <Dial>
  //     <Sip>sip:+525510057272@18.119.35.95:5060;transport=udp</Sip>
  // </Dial>

  // Configura el tipo de respuesta como XML
  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

// Endpoint para manejar el StatusCallback de Twilio
app.post("/callback", (req, res) => {
  // Extraer la información enviada por Twilio
  const {
    CallSid,
    CallStatus,
    To,
    From,
    Direction,
    Duration,
    ErrorCode,
    ErrorMessage,
  } = req.body;

  // Imprimir la información en consola
  console.log("Callback recibido:");
  console.log(`Call SID: ${CallSid}`);
  console.log(`Estado: ${CallStatus}`);
  console.log(`De: ${From}`);
  console.log(`A: ${To}`);
  console.log(`Dirección: ${Direction}`);
  console.log(`Duración: ${Duration || "N/A"}`);
  console.log(`Error Code: ${ErrorCode || "N/A"}`);
  console.log(`Error Message: ${ErrorMessage || "N/A"}`);

  // Responder a Twilio
  res.status(200).send("Callback recibido");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor TwiML ejecutándose en http://localhost:${port}/twiml`);
});
