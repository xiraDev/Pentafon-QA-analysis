const db = require("./models");

const dbConnection = async () => {
  try {
    // db.sequelize.sync();
    await db.sequelize.authenticate();
    console.log("📦 Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message || error);
    throw new Error("Error connecting to the database");
  }
};

module.exports = { dbConnection };
