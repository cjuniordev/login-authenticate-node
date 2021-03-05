const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    // logging: true,
  }
);

module.exports = sequelize;
