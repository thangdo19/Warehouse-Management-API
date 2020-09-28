const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const UserWarehouse = sequelize.define('UserWarehouse', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER()
  },
  warehouseId: {
    type: DataTypes.INTEGER()
  },
}, {
  tableName: 'user_warehouses'
})

module.exports = {
  UserWarehouse
}
