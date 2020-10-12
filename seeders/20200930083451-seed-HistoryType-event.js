'use strict';
let history_types =[];
history_types[0] = {
  name:"Nhap hang hoa",
description:"Nhap hang vao trong kho",
createdAt:new Date,
updatedAt:new Date
}
history_types[1] = {
  name:"Xua hang hoa",
description:"Xuat hang tu kho",
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
