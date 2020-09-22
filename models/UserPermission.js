const sequelize = require('../db/connection')
const { DataTypes } = require('sequelize')

const UserPermission = sequelize.define('UserPermission', {
  id: {
    type: DataTypes.INTEGER(),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER()
  },
  permissionId: {
    type: DataTypes.INTEGER()
  },
}, {
  tableName: 'user_permissions'
})

module.exports = {
  UserPermission
}
