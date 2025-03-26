require("dotenv").config();

module.exports = {
  development: {
    port: process.env.DEV_DB_PORT,
    dialect: process.env.DEV_DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
      charset: "utf8mb4",
    },
    replication: {
      read: [
        {
          host: process.env.DEV_DB_HOST,
          username: process.env.DEV_DB_USERNAME,
          password: process.env.DEV_DB_PASSWORD,
          database: process.env.DEV_DB_NAME,
        },
      ],
      write: {
        host: process.env.DEV_DB_HOST,
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
      },
    },
    schema: process.env.DEV_DB_SCHEMA_NAME,
    logging: true,
    pool: {
      max: 8,
      min: 1,
      idle: 60000, // Tiempo en milisegundos antes de que una conexión inactiva sea cerrada
      acquire: 60000, // Tiempo en milisegundos para adquirir una conexión antes de lanzar un error
    },
  },
  production: {
    port: process.env.PROD_DB_PORT,
    dialect: process.env.PROD_DB_DIALECT,
    schema: process.env.PROD_DB_SCHEMA_NAME,
    dialectOptions: {
      bigNumberStrings: true,
      charset: "utf8mb4",
      ssl: {
        require: true,
        rejectUnauthorized: false, // Esto evita errores de certificados autofirmados
      },
    },
    replication: {
      read: [
        {
          host: process.env.PROD_DB_HOSTNAME,
          username: process.env.PROD_DB_USERNAME,
          password: process.env.PROD_DB_PASSWORD,
          database: process.env.PROD_DB_NAME,
        },
      ],
      write: {
        host: process.env.PROD_DB_HOSTNAME,
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
      },
    },
    pool: {
      max: 4,
      min: 1,
      idle: 60000, // Tiempo en milisegundos antes de que una conexión inactiva sea cerrada
      acquire: 60000, // Tiempo en milisegundos para adquirir una conexión antes de lanzar un error
    },
  },
};
