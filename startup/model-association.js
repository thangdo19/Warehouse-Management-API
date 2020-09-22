const { Permission } = require("../models/Permission")
const { PermissionDetail } = require("../models/PermissionDetail")
const { User } = require("../models/User")
const { UserPermission } = require("../models/UserPermission")

module.exports = function() {
  // create relationship
  // Permission - PermissionDetail (1:N)
  Permission.hasMany(PermissionDetail, {
    as: 'permissionDetails',
    foreignKey: 'permissionId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  PermissionDetail.belongsTo(Permission, {
    as: 'permission',
    foreignKey: 'permissionId'
  })
  // User - Permission (M:N)
  User.belongsToMany(Permission, {
    through: UserPermission,
    as: 'permissions',
    foreignKey: 'userId',
    otherKey: 'permissionId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Permission.belongsToMany(User, {
    through: UserPermission,
    as: 'users',
    foreignKey: 'permissionId',
    otherKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
}
