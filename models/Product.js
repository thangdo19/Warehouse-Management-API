const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: DataTypes.INTEGER
  },
  warehouseId: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING(255),
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  tableName: 'products'
})

module.exports = {
  Product
}
