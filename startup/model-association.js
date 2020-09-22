const { Permission } = require("../models/Permission")
const { PermissionDetail } = require("../models/PermissionDetail")

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
}
