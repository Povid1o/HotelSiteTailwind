'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    if ((await queryInterface.showAllTables()).includes('admin_sessions')) return;
    await queryInterface.createTable('admin_sessions', {
      id: { type: Sequelize.UUID, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      credential_hash: { type: Sequelize.STRING(64), allowNull: false },
      csrf_token: { type: Sequelize.STRING(64), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      last_seen_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('admin_sessions', ['user_id']);
    await queryInterface.addIndex('admin_sessions', ['expires_at']);
  },
  async down(queryInterface) { await queryInterface.dropTable('admin_sessions'); }
};
