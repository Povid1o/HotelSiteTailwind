const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Kept outside public page content: only administrators can read the recipient.
module.exports = sequelize.define('wineInquirySettings', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  recipient_email: { type: DataTypes.STRING(254), allowNull: false, defaultValue: '' }
}, { underscored: true, timestamps: true, tableName: 'wine_inquiry_settings' });
