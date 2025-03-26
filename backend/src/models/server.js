const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
// middlewares
const {
  encryptResponseInterceptor,
  decryptResponseInterceptor,
} = require("../middlewares");
const errorHandler = require("../middlewares/error.js");
//
const { dbConnection } = require("../db/sql/connection.js");
const publicPath = path.join(__dirname, "../public");
const { time } = require("../utilities");

//Tasks

const { analyseRandomConversationsCronFullProcess } = require("../tasks/analyzeConversationsPercentage.js")
// ----------------------------------------------------------------------

const env = process.env.NODE_ENV || "development";

const PREFIX_API = `/api/v1`;

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      analysis: `${PREFIX_API}/analysis`,
      audio: `${PREFIX_API}/audios`,
      auth: `${PREFIX_API}/auth`,
      prompts: `${PREFIX_API}/prompts`,
      analyticsChat: `${PREFIX_API}/analytics-chat`,
      users: `${PREFIX_API}/users`,
      conversations: `${PREFIX_API}/conversations`,
      campaigns: `${PREFIX_API}/campaigns`,
    };

    /** Connect to database */
    this.connectDB();

    /** Middlewares */
    this.middlewares();

    /** Settings */
    this.settings();

    /** Routes */
    this.routes();

    /** Load ErrorHandler */
    this.errorsHandler();
  }

  errorsHandler() {
    this.app.use(errorHandler);
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    /** CORS */
    this.app.use(cors());
    this.app.use(express.json())

    this.app.use(express.urlencoded({ extended: true }));

    // Public directory
    this.app.use(express.static("public"));

    // Morgan
    this.app.use(morgan("dev"));

    // Encrypt responses
    this.app.use(encryptResponseInterceptor);

    // Decrypt requests
    this.app.use(decryptResponseInterceptor);

    // Fileupload - file upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true, // opcional: Crea las carpetas en automatico
      })
    );
  }

  async settings() {
    this.app.set("appName", process.env.APP_NAME || "Backend xira app");
    this.app.set("port", process.env.PORT || 4000);
    this.app.set("view engine", "ejs");

  }

  routes() {
    this.app.use(this.paths.analysis, require("../routes/analysis.routes"));
    this.app.use(this.paths.audio, require("../routes/qa_audio.routes"));
    this.app.use(this.paths.auth, require("../routes/auth.routes"));
    this.app.use(this.paths.prompts, require("../routes/prompts.routes"));
    this.app.use(this.paths.users, require("../routes/user.routes"));
    this.app.use(this.paths.conversations, require("../routes/conversations.routes"));
    this.app.use(this.paths.campaigns, require("../routes/campaigns.routes"));

    this.app.use(express.static(path.join(__dirname, "../public")));

    this.app.get("*", function (req, res) {
      res.sendFile(path.join(publicPath, "index.html")),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        };
    });
  }


  listen() {
    this.app.listen(this.app.get("port"), () => {
      console.log(this.app.get("appName"));
      console.log("⇒ Server on port:", this.app.get("port"));
    });
  }
}

//CronTasks
analyseRandomConversationsCronFullProcess.start()

module.exports = Server;
