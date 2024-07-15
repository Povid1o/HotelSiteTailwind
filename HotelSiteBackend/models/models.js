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
  description:{type: DataTypes.STRING, unique:true, allowNull:false},
  weight:{type: DataTypes.STRING, unique:true, allowNull:false},
  nutrients:{type: DataTypes.STRING, unique:true, allowNull:false},
  price:{type: DataTypes.INTEGER, allowNull:false},
  img:{type: DataTypes.STRING, allowNull:false},
})

const Type = sequelize.define('type',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name:{type: DataTypes.STRING, unique:true, allowNull:false},
})

const Clase = sequelize.define('clase',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
  name:{type: DataTypes.STRING, unique:true, allowNull:false},
})


const TypeClase = sequelize.define('type_clase',{
  id:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})




User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

Type.hasMany(Product)
Product.belongsTo(Type)

Clase.hasMany(Product)
Product.belongsTo(Clase)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)


Type.belongsToMany(Clase, {through: TypeClase})
Clase.belongsToMany(Type, {through: TypeClase})



module.exports ={
  User,
  Basket,
  BasketProduct,
  Product,
  Clase,
  Type,
  TypeClase,
}