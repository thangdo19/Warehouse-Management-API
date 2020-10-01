'use strict';

const faker = require('faker')
const user_warehouses = [...Array(100)].map((user_history)=>({
  userId:Math.floor(Math.random() * 199 + 1),
  warehouseId:Math.floor(Math.random() * 150 + 1),
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
