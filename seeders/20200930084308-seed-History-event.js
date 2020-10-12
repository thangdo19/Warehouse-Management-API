'use strict';
const faker = require('faker')
const histories = [...Array(300)].map((history)=>({
  typeId:Math.floor(Math.random() * 2 + 1),
  warehouseId:Math.floor(Math.random() * 99 + 1),
  date:new Date(),
  note:faker.lorem.sentence(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("histories",histories)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
