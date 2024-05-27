const { describe } = require('node:test')
const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  email:{type: DataTypes.STRING, unique:true,},
  password:{type: DataTypes.STRING,},
  role:{type: DataTypes.STRING, defaultValue:"USER"},
})

const Basket = sequelize.define('basket',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})

const BasketProduct = sequelize.define('basketProduct',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})

const Product = sequelize.define('product',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name:{type: DataTypes.STRING, unique:true, allowNull:false},
  price:{type: DataTypes.INTEGER, allowNull:false},
  img:{type: DataTypes.STRING, allowNull:false},
})

const Type = sequelize.define('type',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name:{type: DataTypes.STRING, unique:true, allowNull:false},
})

const RoomClass = sequelize.define('roomclass',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name:{type: DataTypes.STRING, unique:true, allowNull:false},
})

const ProductInfo = sequelize.define('product_info',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  title:{type: DataTypes.STRING, allowNull:false},
  description:{type: DataTypes.STRING, allowNull:false},
})

const TypeRoomClass = sequelize.define('type_roomclass',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

Type.hasMany(Product)
Product.belongsTo(Type)

RoomClass.hasMany(Product)
Product.belongsTo(RoomClass)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(ProductInfo, {as: "info"});
ProductInfo.belongsTo(Product)

Type.belongsToMany(RoomClass, {through: TypeRoomClass})
RoomClass.belongsToMany(Type, {through: TypeRoomClass})

module.exports ={
  User,
  Basket,
  BasketProduct,
  Product,
  Type,
  RoomClass,
  ProductInfo,
  TypeRoomClass
}