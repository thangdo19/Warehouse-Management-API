'use strict';
let history_types =[];
history_types[0] = {
  name:"IMPORT",
description:"Importing products to warehouse",
createdAt:new Date,
updatedAt:new Date
}
history_types[1] = {
  name:"EXPORT",
description:"Xuat products from warehouse",
createdAt:new Date,
updatedAt:new Date
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("history_types",history_types)

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

  }
};
