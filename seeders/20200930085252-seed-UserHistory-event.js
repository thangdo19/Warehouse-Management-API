'use strict';

const faker = require('faker')
const user_histories = [...Array(15)].map((user_history)=>({
  userId:Math.floor(Math.random() * 50 + 1),
  historyId:Math.floor(Math.random() * 25 + 1),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("user_histories",user_histories)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};