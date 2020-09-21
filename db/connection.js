const { Sequelize } = require('sequelize')

/**
 * @Usage return connection of db
 */
module.exports = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  logging: false,
  dialect: 'mysql'
})
