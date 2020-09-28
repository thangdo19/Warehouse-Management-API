const { Category } = require("../models/Category")
const { City } = require("../models/City")
const { History } = require("../models/History")
const { HistoryType } = require("../models/HistoryType")
const { Permission } = require("../models/Permission")
const { PermissionDetail } = require("../models/PermissionDetail")
const { Product } = require("../models/Product")
const { ProductHistory } = require("../models/ProductHistory")
const { User } = require("../models/User")
const { UserHistory } = require("../models/UserHistory")
const { UserPermission } = require("../models/UserPermission")
const { UserWarehouse } = require("../models/UserWarehouse")
const { Warehouse } = require("../models/Warehouse")
const { WarehouseProduct } = require("../models/WarehouseProduct")

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
  // City - Warehouse (1:M)
  City.hasMany(Warehouse, {
    as: 'warehouses',
    foreignKey: 'cityId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Warehouse.belongsTo(City, {
    as: 'city',
    foreignKey: 'cityId'
  })
  // Category - Product (1:M)
  Category.hasMany(Product, {
    as: 'products',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Product.belongsTo(Category, {
    as: 'category',
    foreignKey: 'categoryId'
  })
  // HistoryType - History (1:M)
  HistoryType.hasMany(History, {
    as: 'histories',
    foreignKey: 'typeId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  History.belongsTo(HistoryType, {
    as: 'type',
    foreignKey: 'typeId'
  })
  // Warehouse - History (1:M)
  Warehouse.hasMany(History, {
    as: 'histories',
    foreignKey: 'warehouseId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  History.belongsTo(Warehouse, {
    as: 'warehouse',
    foreignKey: 'warehouseId'
  })
  // User - History (M:N)
  User.belongsToMany(History, {
    through: UserHistory,
    as: 'histories',
    foreignKey: 'userId',
    otherKey: 'historyId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  History.belongsToMany(User, {
    through: UserHistory,
    as: 'users',
    foreignKey: 'historyId',
    otherKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  // User - Warehouse (M:N)
  User.belongsToMany(Warehouse, {
    through: UserWarehouse,
    as: 'warehouses',
    foreignKey: 'userId',
    otherKey: 'warehouseId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Warehouse.belongsToMany(User, {
    through: UserWarehouse,
    as: 'users',
    foreignKey: 'warehouseId',
    otherKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  // Product - History (M:N)
  Product.belongsToMany(History, {
    through: ProductHistory,
    as: 'histories',
    foreignKey: 'productId',
    otherKey: 'historyId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  History.belongsToMany(Product, {
    through: ProductHistory,
    as: 'products',
    foreignKey: 'historyId',
    otherKey: 'productId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  // Warehouse - Product (M:N)
  Warehouse.belongsToMany(Product, {
    through: WarehouseProduct,
    as: 'products',
    foreignKey: 'warehouseId',
    otherKey: 'productId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Product.belongsToMany(Warehouse, {
    through: WarehouseProduct,
    as: 'warehouses',
    foreignKey: 'productId',
    otherKey: 'warehouseId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
}
