const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const HistoryType = sequelize.define('HistoryType', {
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
  tableName: 'history_types'
})

module.exports = {
  HistoryType
}