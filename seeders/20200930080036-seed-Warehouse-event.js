'use strict';
const faker = require('faker')

const warehouses = [...Array(200)].map((warehouse)=>({
  cityId:parseInt(Math.floor(Math.random() *z) + 1),
  name:faker.address.city(),
  address:faker.address.streetAddress(),
  description:faker.lorem.sentence(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("warehouses",warehouses)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
