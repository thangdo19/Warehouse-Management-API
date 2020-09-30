'use strict';
const faker = require('faker')

const cities = [...Array(50)].map((city)=>({
  name:faker.address.city(),
  description:faker.lorem.sentence(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("cities",cities)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
