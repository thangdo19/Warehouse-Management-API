'use strict';
const faker = require('faker')
// const bcrypt = require('bcrypt')
const users = [...Array(200)].map((user)=>({
  name: faker.name.findName(),  
  phone: faker.phone.phoneNumber('0##########'),
  email: faker.internet.email(),
  password: faker.internet.password(8),
  address:faker.address.country(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users",users)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
