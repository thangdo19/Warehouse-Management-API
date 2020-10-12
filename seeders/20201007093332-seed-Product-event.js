'use strict';
const faker = require('faker')
// const bcrypt = require('bcrypt')
const products = [...Array(200)].map((product)=>({
  categoryId:parseInt(Math.floor(Math.random() *5) + 1),
  name:faker.commerce.productName(),
  note:faker.lorem.sentence(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("products",products)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
