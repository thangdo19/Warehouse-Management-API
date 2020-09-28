const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  typeId: {
    type: DataTypes.INTEGER
  },
  warehouseId: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATEONLY(),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'histories'
})

module.exports = {
  History
}
