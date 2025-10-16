'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert two rooms: Стандарт and Стандарт+
    const rooms = await queryInterface.bulkInsert('rooms', [
      {
        id: 1,
        name: 'Стандарт',
        description: 'Удобный стандартный номер со всеми необходимыми удобствами',
        check_in_time: '14:00',
        check_out_time: '12:00',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Стандарт+',
        description: 'Улучшенный стандартный номер с дополнительными удобствами',
        check_in_time: '14:00',
        check_out_time: '12:00',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], { returning: true });

    // Insert properties for both rooms
    await queryInterface.bulkInsert('room_properties', [
      // Properties for Room 1 (Стандарт)
      { room_id: 1, property_text: 'бассейн', created_at: new Date(), updated_at: new Date() },
      { room_id: 1, property_text: 'душ', created_at: new Date(), updated_at: new Date() },
      { room_id: 1, property_text: 'батарея', created_at: new Date(), updated_at: new Date() },
      { room_id: 1, property_text: 'не знаю', created_at: new Date(), updated_at: new Date() },
      // Properties for Room 2 (Стандарт+)
      { room_id: 2, property_text: 'бассейн', created_at: new Date(), updated_at: new Date() },
      { room_id: 2, property_text: 'душ', created_at: new Date(), updated_at: new Date() },
      { room_id: 2, property_text: 'батарея', created_at: new Date(), updated_at: new Date() },
      { room_id: 2, property_text: 'не знаю', created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert conveniences for both rooms
    await queryInterface.bulkInsert('room_conveniences', [
      // Conveniences for Room 1 (Стандарт)
      { room_id: 1, convenience_text: 'никто не бьёт', created_at: new Date(), updated_at: new Date() },
      { room_id: 1, convenience_text: 'не знаю', created_at: new Date(), updated_at: new Date() },
      // Conveniences for Room 2 (Стандарт+)
      { room_id: 2, convenience_text: 'никто не бьёт', created_at: new Date(), updated_at: new Date() },
      { room_id: 2, convenience_text: 'не знаю', created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert prices for both rooms
    await queryInterface.bulkInsert('room_prices', [
      // Prices for Room 1 (Стандарт)
      { room_id: 1, title: 'ночь', price: 10000.00, created_at: new Date(), updated_at: new Date() },
      { room_id: 1, title: 'неделя', price: 50000.00, created_at: new Date(), updated_at: new Date() },
      // Prices for Room 2 (Стандарт+)
      { room_id: 2, title: 'ночь', price: 20000.00, created_at: new Date(), updated_at: new Date() },
      { room_id: 2, title: 'неделя', price: 100000.00, created_at: new Date(), updated_at: new Date() },
    ]);

    // Insert notes for both rooms
    await queryInterface.bulkInsert('room_notes', [
      // Notes for Room 1 (Стандарт)
      { room_id: 1, note_text: 'Курение запрещено', created_at: new Date(), updated_at: new Date() },
      { room_id: 1, note_text: 'Животные не допускаются', created_at: new Date(), updated_at: new Date() },
      // Notes for Room 2 (Стандарт+)
      { room_id: 2, note_text: 'Завтрак включен', created_at: new Date(), updated_at: new Date() },
      { room_id: 2, note_text: 'Поздний выезд возможен', created_at: new Date(), updated_at: new Date() },
    ]);

    console.log('✅ Seed data for rooms created successfully');
  },

  async down(queryInterface, Sequelize) {
    // Remove in reverse order
    await queryInterface.bulkDelete('room_notes', { room_id: [1, 2] }, {});
    await queryInterface.bulkDelete('room_prices', { room_id: [1, 2] }, {});
    await queryInterface.bulkDelete('room_conveniences', { room_id: [1, 2] }, {});
    await queryInterface.bulkDelete('room_properties', { room_id: [1, 2] }, {});
    await queryInterface.bulkDelete('room_images', { room_id: [1, 2] }, {});
    await queryInterface.bulkDelete('rooms', { id: [1, 2] }, {});
  }
};

