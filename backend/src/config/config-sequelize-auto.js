const SequelizeAuto = require("sequelize-auto");
const Sequelize = require("sequelize");
//
const env = "development"; // "development" | "test" | "production"
const config = require("./config")[env];
const {
  replication: { write },
  dialect,
} = config;

// ----------------------------------------------------------------------

console.clear();

const sequelize = new Sequelize(
  write.database,
  write.username,
  write.password,
  {
    host: write.host,
    dialect: dialect,
  }
);
// options configuration: https://github.com/sequelize/sequelize-auto#usage
const options = {
  directory: "./src/db/sql/models",
  caseFile: "l",
  caseModel: "p",
  caseProp: "c",
  lang: "es6",
  additional: {
    timestamps: true,
    // ...options added to each model
  },
};

const auto = new SequelizeAuto(sequelize, null, null, options);
auto.run();
