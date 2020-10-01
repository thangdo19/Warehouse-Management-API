'use strict';
const faker = require('faker')

const categories = [...Array(10)].map((category)=>({
  name:faker.lorem.word(),
  description:faker.vehicle.type(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("categories",categories)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
