require("dotenv").config();
const Server = require("./models/server");

const server = new Server();

server.listen();


// test
// const test = new require('./test/modules/DB-connection.test');
