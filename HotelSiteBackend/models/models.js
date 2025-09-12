const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }, // хранится хэш
  role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'USER' }
}, { underscored: true, timestamps: true, tableName: 'users' });

// /Clase/Product/ProductInfo/Basket
const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
}, { underscored: true, timestamps: true, tableName: 'types' });

const Clase = sequelize.define('clase', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
}, { underscored: true, timestamps: true, tableName: 'clases' });

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  typeId: { type: DataTypes.INTEGER, allowNull: true },   // сохранится как type_id
  claseId: { type: DataTypes.INTEGER, allowNull: true },  // сохранится как clase_id
  description: { type: DataTypes.TEXT },
  weight: { type: DataTypes.STRING(50) },
  nutrients: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING(255) },
}, { underscored: true, timestamps: true, tableName: 'products' });

const ProductInfo = sequelize.define('product_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  productId: { type: DataTypes.INTEGER, allowNull: false }, // product_id
}, { underscored: true, timestamps: true, tableName: 'product_infos' });

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // user_id
}, { underscored: true, timestamps: true, tableName: 'baskets' });

// relations legacy
Type.hasMany(Product);
Product.belongsTo(Type);

Clase.hasMany(Product);
Product.belongsTo(Clase);

Product.hasMany(ProductInfo, { as: 'info', foreignKey: 'product_id' });
ProductInfo.belongsTo(Product, { foreignKey: 'product_id' });

User.hasOne(Basket, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Basket.belongsTo(User, { foreignKey: 'user_id' });

//  Dishes
const DishCategory = sequelize.define('dishCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'dish_categories' });

const Dish = sequelize.define('dish', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  header: { type: DataTypes.STRING(255) },
  description_short: { type: DataTypes.TEXT },
  description_full: { type: DataTypes.TEXT },
  weight: { type: DataTypes.STRING(50) },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  nutrients: { type: DataTypes.JSONB },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { underscored: true, timestamps: true, tableName: 'dishes' });

const DishImage = sequelize.define('dishImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dish_id: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(255), allowNull: false },
  alt_text: { type: DataTypes.STRING(255) },
  order: { type: DataTypes.INTEGER },
}, { underscored: true, timestamps: true, tableName: 'dish_images' });

// relations dishes
DishCategory.hasMany(Dish, { foreignKey: 'category_id', as: 'products' });
Dish.belongsTo(DishCategory, { foreignKey: 'category_id', as: 'category' });

Dish.hasMany(DishImage, { foreignKey: 'dish_id', as: 'images', onDelete: 'CASCADE' });
DishImage.belongsTo(Dish, { foreignKey: 'dish_id' });

// Rooms
const Room = sequelize.define('room', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  check_in_time: { type: DataTypes.STRING(10) },
  check_out_time: { type: DataTypes.STRING(10) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { underscored: true, timestamps: true, tableName: 'rooms' });

const RoomImage = sequelize.define('roomImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(255), allowNull: false },
  alt_text: { type: DataTypes.STRING(255) },
  order: { type: DataTypes.INTEGER },
}, { underscored: true, timestamps: true, tableName: 'room_images' });

const RoomProperty = sequelize.define('roomProperty', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  property_text: { type: DataTypes.STRING(255), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'room_properties' });

const RoomConvenience = sequelize.define('roomConvenience', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  convenience_text: { type: DataTypes.STRING(255), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'room_conveniences' });

const RoomPrice = sequelize.define('roomPrice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'room_prices' });

const RoomNote = sequelize.define('roomNote', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  note_text: { type: DataTypes.TEXT, allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'room_notes' });

// rooms
Room.hasMany(RoomImage, { foreignKey: 'room_id', as: 'images', onDelete: 'CASCADE' });
Room.hasMany(RoomProperty, { foreignKey: 'room_id', as: 'properties', onDelete: 'CASCADE' });
Room.hasMany(RoomConvenience, { foreignKey: 'room_id', as: 'conveniences', onDelete: 'CASCADE' });
Room.hasMany(RoomPrice, { foreignKey: 'room_id', as: 'prices', onDelete: 'CASCADE' });
Room.hasMany(RoomNote, { foreignKey: 'room_id', as: 'notes', onDelete: 'CASCADE' });

RoomImage.belongsTo(Room, { foreignKey: 'room_id' });
RoomProperty.belongsTo(Room, { foreignKey: 'room_id' });
RoomConvenience.belongsTo(Room, { foreignKey: 'room_id' });
RoomPrice.belongsTo(Room, { foreignKey: 'room_id' });
RoomNote.belongsTo(Room, { foreignKey: 'room_id' });

// Wines
const WineType = sequelize.define('wineType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'wine_types' });

const WineSweetness = sequelize.define('wineSweetness', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
}, { underscored: true, timestamps: true, tableName: 'wine_sweetness' });

const Wine = sequelize.define('wine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type_id: { type: DataTypes.INTEGER, allowNull: false },
  sweetness_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  year: { type: DataTypes.INTEGER },
  alcohol: { type: DataTypes.STRING(50) },
  sugar: { type: DataTypes.STRING(50) },
  temperature: { type: DataTypes.STRING(50) },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { underscored: true, timestamps: true, tableName: 'wines' });

const WineDescription = sequelize.define('wineDescription', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  wine_id: { type: DataTypes.INTEGER, allowNull: false },
  description_text: { type: DataTypes.TEXT, allowNull: false },
  order: { type: DataTypes.INTEGER },
}, { underscored: true, timestamps: true, tableName: 'wine_descriptions' });

const WineImage = sequelize.define('wineImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  wine_id: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(255), allowNull: false },
  alt_text: { type: DataTypes.STRING(255) },
  order: { type: DataTypes.INTEGER },
}, { underscored: true, timestamps: true, tableName: 'wine_images' });

// relations wines
WineType.hasMany(Wine, { foreignKey: 'type_id', as: 'assortment' });
WineSweetness.hasMany(Wine, { foreignKey: 'sweetness_id', as: 'winesBySweetness' });
Wine.belongsTo(WineType, { foreignKey: 'type_id', as: 'type' });
Wine.belongsTo(WineSweetness, { foreignKey: 'sweetness_id', as: 'sweetness' });
Wine.hasMany(WineDescription, { foreignKey: 'wine_id', as: 'description', onDelete: 'CASCADE' });
Wine.hasMany(WineImage, { foreignKey: 'wine_id', as: 'images', onDelete: 'CASCADE' });
WineDescription.belongsTo(Wine, { foreignKey: 'wine_id' });
WineImage.belongsTo(Wine, { foreignKey: 'wine_id' });

// Pages (JSONB)
const Page = sequelize.define('page', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  path: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  content_json: { type: DataTypes.JSONB },
}, { underscored: true, timestamps: true, tableName: 'pages' });

module.exports = {
  DishCategory, Dish, DishImage,
  Room, RoomImage, RoomProperty, RoomConvenience, RoomPrice, RoomNote,
  WineType, WineSweetness, Wine, WineDescription, WineImage,
  Page, User, Type, Clase, Product, ProductInfo, Basket
};
