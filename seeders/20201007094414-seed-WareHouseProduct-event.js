'use strict';

const faker = require('faker')
const warehouse_products = [...Array(25)].map((warehouse_product)=>({
  productId:Math.floor(Math.random() * 50 + 1),
  warehouseId:Math.floor(Math.random() * 10 + 1),
  stock:Math.floor(Math.random() * 200 ),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("warehouse_products",warehouse_products)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};