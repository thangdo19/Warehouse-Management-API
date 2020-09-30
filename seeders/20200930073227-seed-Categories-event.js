'use strict';
const faker = require('faker')

const categories = [...Array(50)].map((category)=>({
  name:faker.commerce.productMaterial(),
  description:faker.commerce.productDescription(),
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
