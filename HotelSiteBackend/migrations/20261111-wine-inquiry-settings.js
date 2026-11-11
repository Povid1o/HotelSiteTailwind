'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    if ((await queryInterface.showAllTables()).includes('wine_inquiry_settings')) return;
    await queryInterface.createTable('wine_inquiry_settings', {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      recipient_email: { type: Sequelize.STRING(254), allowNull: false, defaultValue: '' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('wine_inquiry_settings'); }
};
