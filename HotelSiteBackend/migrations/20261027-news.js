'use strict';

/** Таблица новостей. Повторный запуск безопасен. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('news')) return;
    const now = Sequelize.fn('now');
    await queryInterface.createTable('news', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      slug: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      slug_locked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      category: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '' },
      excerpt: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
      cover_url: { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
      cover_alt: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
      tags: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'draft' },
      published_at: { type: Sequelize.DATE, allowNull: true },
      seo_title: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
      seo_description: { type: Sequelize.STRING(320), allowNull: false, defaultValue: '' },
      content_json: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
      content_html: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
      word_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      reading_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: now }
    });
    await queryInterface.addIndex('news', ['status', 'published_at'], { name: 'news_status_published_at_idx' });
    await queryInterface.addIndex('news', ['category'], { name: 'news_category_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('news');
  }
};
