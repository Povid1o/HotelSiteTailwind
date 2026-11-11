const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('adminSession', {
  id: { type: DataTypes.UUID, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
  credential_hash: { type: DataTypes.STRING(64), allowNull: false },
  csrf_token: { type: DataTypes.STRING(64), allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  last_seen_at: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'admin_sessions', underscored: true, timestamps: true, indexes: [{ fields: ['user_id'] }, { fields: ['expires_at'] }] });
