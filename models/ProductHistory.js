const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const ProductHistory = sequelize.define('ProductHistory', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER()
  },
  historyId: {
    type: DataTypes.INTEGER()
  },
  amount: {
    type: DataTypes.INTEGER()
  }
}, {
  tableName: 'product_histories'
})

module.exports = {
  ProductHistory
}
