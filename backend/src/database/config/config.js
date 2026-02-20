require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_ROOT_PASSWORD || "",
    "database": process.env.DB_DATABASE || "eccomerce_real",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    define:{
      underscored:true,
      paranoid:true
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: process.env.DB_DIALECT_PROD || 'mysql',
    port: 3306, // Si tu base de datos utiliza otro puerto, cámbialo aquí.
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}
