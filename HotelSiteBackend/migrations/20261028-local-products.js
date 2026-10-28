'use strict';

const { PAGE_NAME, PAGE_PATH, buildLocalProducts } = require('../seed/localProducts');

/**
 * Страница «Местные продукты» (/LocalProducts): строка в таблице pages + демонстрационное содержимое
 * (паштеты, газировка, «из кладовой», блоки «О производстве», «Где купить» и т. д.).
 *
 * Повторный запуск безопасен: если страница уже есть, разделы, которые вы успели заполнить, не затрагиваются —
 * добавляются только отсутствующие.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const demo = buildLocalProducts();
    const rows = await queryInterface.sequelize.query(
      'SELECT id, content_json FROM pages WHERE path = ?',
      { replacements: [PAGE_PATH], type: Sequelize.QueryTypes.SELECT }
    );

    if (rows.length === 0) {
      await queryInterface.bulkInsert('pages', [{
        name: PAGE_NAME,
        path: PAGE_PATH,
        is_active: true,
        content_json: JSON.stringify(demo),
        created_at: now,
        updated_at: now
      }]);
      return;
    }

    const current = rows[0].content_json && typeof rows[0].content_json === 'object' ? rows[0].content_json : {};
    const missing = Object.fromEntries(Object.entries(demo).filter(([key]) => !(key in current)));
    if (!Object.keys(missing).length) return;
    await queryInterface.sequelize.query(
      'UPDATE pages SET content_json = ?, updated_at = ? WHERE id = ?',
      { replacements: [JSON.stringify({ ...current, ...missing }), now, rows[0].id] }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pages', { path: PAGE_PATH });
  }
};
