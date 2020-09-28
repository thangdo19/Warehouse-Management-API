const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'cities'
})

module.exports = {
  City
}