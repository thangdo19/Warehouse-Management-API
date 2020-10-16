'use strict';

const faker = require('faker')
const user_warehouses = [...Array(25)].map((user_history)=>({
  userId:Math.floor(Math.random() * 50 + 1),
  warehouseId:Math.floor(Math.random() * 10 + 1),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("user_warehouses",user_warehouses)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};