const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const WarehouseProduct = sequelize.define('WarehouseProduct', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  warehouseId: {
    type: DataTypes.INTEGER()
  },
  productId: {
    type: DataTypes.INTEGER()
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
}, {
  tableName: 'warehouse_products'
})

module.exports = {
  WarehouseProduct
}
