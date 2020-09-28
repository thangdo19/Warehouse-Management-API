const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const UserHistory = sequelize.define('UserHistory', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER()
  },
  historyId: {
    type: DataTypes.INTEGER()
  },
}, {
  tableName: 'user_histories'
})

module.exports = {
  UserHistory
}
