'use strict';
const faker = require('faker')

const warehouses = [...Array(10)].map((warehouse)=>({
  cityId:parseInt(Math.floor(Math.random() *10) + 1),
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
