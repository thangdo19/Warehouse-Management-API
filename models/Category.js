const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
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
  tableName: 'categories'
})

module.exports = {
  Category
}