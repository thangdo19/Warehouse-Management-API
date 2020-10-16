'use strict';
const faker = require('faker')
const products_history = [...Array(25)].map((product_history)=>({
  productId:Math.floor(Math.random() * 50 + 1),
  historyId:Math.floor(Math.random() * 25 + 1),
  amount:Math.floor(Math.random() * 50 + 1),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("product_histories",products_history)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};