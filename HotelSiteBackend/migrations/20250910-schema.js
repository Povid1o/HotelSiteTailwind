'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ===== COMMON HELPERS =====
    const now = Sequelize.fn('now');
    const idPk = { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true };

    // ==========================
    // USERS & AUTH (legacy)
    // ==========================
    await queryInterface.createTable('users', {
      id: idPk,
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'USER' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('baskets', {
      id: idPk,
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('baskets', ['user_id'], { name: 'baskets_user_id_idx' });

    // ==========================
    // LEGACY CATALOG: TYPE / CLASE / PRODUCT / PRODUCT_INFO
    // ==========================
    await queryInterface.createTable('types', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('clases', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('products', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      type_id: {
        // из модели: typeId (underscored -> type_id)
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'types', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      clase_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'clases', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      description: { type: Sequelize.TEXT },
      weight: { type: Sequelize.STRING(50) },
      nutrients: { type: Sequelize.TEXT },
      img: { type: Sequelize.STRING(255) },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('products', ['type_id'], { name: 'products_type_id_idx' });
    await queryInterface.addIndex('products', ['clase_id'], { name: 'products_clase_id_idx' });

    await queryInterface.createTable('product_infos', {
      id: idPk,
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('product_infos', ['product_id'], { name: 'product_infos_product_id_idx' });

    // ==========================
    // DISHES
    // ==========================
    await queryInterface.createTable('dish_categories', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('dishes', {
      id: idPk,
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'dish_categories', key: 'id' },
        onDelete: 'CASCADE', // как в вашем исходнике
        onUpdate: 'CASCADE',
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      header: { type: Sequelize.STRING(255) },
      description_short: { type: Sequelize.TEXT },
      description_full: { type: Sequelize.TEXT },
      weight: { type: Sequelize.STRING(50) },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      nutrients: { type: Sequelize.JSONB },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('dishes', ['category_id'], { name: 'dishes_category_id_idx' });

    await queryInterface.createTable('dish_images', {
      id: idPk,
      dish_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'dishes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      url: { type: Sequelize.STRING(255), allowNull: false },
      alt_text: { type: Sequelize.STRING(255) },
      order: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('dish_images', ['dish_id'], { name: 'dish_images_dish_id_idx' });
    await queryInterface.addIndex('dish_images', ['dish_id', 'order'], { name: 'dish_images_dish_id_order_idx' });

    // ==========================
    // ROOMS
    // ==========================
    await queryInterface.createTable('rooms', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      check_in_time: { type: Sequelize.STRING(10) },
      check_out_time: { type: Sequelize.STRING(10) },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('room_images', {
      id: idPk,
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      url: { type: Sequelize.STRING(255), allowNull: false },
      alt_text: { type: Sequelize.STRING(255) },
      order: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('room_images', ['room_id'], { name: 'room_images_room_id_idx' });
    await queryInterface.addIndex('room_images', ['room_id', 'order'], { name: 'room_images_room_id_order_idx' });

    await queryInterface.createTable('room_properties', {
      id: idPk,
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      property_text: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('room_properties', ['room_id'], { name: 'room_properties_room_id_idx' });

    await queryInterface.createTable('room_conveniences', {
      id: idPk,
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      convenience_text: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('room_conveniences', ['room_id'], { name: 'room_conveniences_room_id_idx' });

    await queryInterface.createTable('room_prices', {
      id: idPk,
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('room_prices', ['room_id'], { name: 'room_prices_room_id_idx' });

    await queryInterface.createTable('room_notes', {
      id: idPk,
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      note_text: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('room_notes', ['room_id'], { name: 'room_notes_room_id_idx' });

    // ==========================
    // WINES
    // ==========================
    await queryInterface.createTable('wine_types', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('wine_sweetness', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.createTable('wines', {
      id: idPk,
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wine_types', key: 'id' },
        onDelete: 'RESTRICT', // не удаляем тип, если есть вина
        onUpdate: 'CASCADE',
      },
      sweetness_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wine_sweetness', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      year: { type: Sequelize.INTEGER },
      alcohol: { type: Sequelize.STRING(50) },
      sugar: { type: Sequelize.STRING(50) },
      temperature: { type: Sequelize.STRING(50) },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('wines', ['type_id'], { name: 'wines_type_id_idx' });
    await queryInterface.addIndex('wines', ['sweetness_id'], { name: 'wines_sweetness_id_idx' });

    await queryInterface.createTable('wine_descriptions', {
      id: idPk,
      wine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wines', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      description_text: { type: Sequelize.TEXT, allowNull: false },
      order: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('wine_descriptions', ['wine_id'], { name: 'wine_descriptions_wine_id_idx' });
    await queryInterface.addIndex('wine_descriptions', ['wine_id', 'order'], { name: 'wine_descriptions_wine_id_order_idx' });

    await queryInterface.createTable('wine_images', {
      id: idPk,
      wine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'wines', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      url: { type: Sequelize.STRING(255), allowNull: false },
      alt_text: { type: Sequelize.STRING(255) },
      order: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });

    await queryInterface.addIndex('wine_images', ['wine_id'], { name: 'wine_images_wine_id_idx' });
    await queryInterface.addIndex('wine_images', ['wine_id', 'order'], { name: 'wine_images_wine_id_order_idx' });

    // ==========================
    // PAGES
    // ==========================
    await queryInterface.createTable('pages', {
      id: idPk,
      name: { type: Sequelize.STRING(255), allowNull: false },
      path: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      content_json: { type: Sequelize.JSONB },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
    });
  },

  async down(queryInterface) {
    // порядок удаления — от «листьев» к «корню»
    await queryInterface.dropTable('pages');

    await queryInterface.dropTable('wine_images');
    await queryInterface.dropTable('wine_descriptions');
    await queryInterface.dropTable('wines');
    await queryInterface.dropTable('wine_sweetness');
    await queryInterface.dropTable('wine_types');

    await queryInterface.dropTable('room_notes');
    await queryInterface.dropTable('room_prices');
    await queryInterface.dropTable('room_conveniences');
    await queryInterface.dropTable('room_properties');
    await queryInterface.dropTable('room_images');
    await queryInterface.dropTable('rooms');

    await queryInterface.dropTable('dish_images');
    await queryInterface.dropTable('dishes');
    await queryInterface.dropTable('dish_categories');

    await queryInterface.dropTable('product_infos');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('clases');
    await queryInterface.dropTable('types');

    await queryInterface.dropTable('baskets');
    await queryInterface.dropTable('users');
  }
};
