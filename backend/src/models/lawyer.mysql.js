const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lawyer = sequelize.define('Lawyer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  specialization: {
    type: DataTypes.ENUM('petty crime', 'theft', 'assault', 'fraud', 'general'),
    defaultValue: 'general'
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  proBonoCasesCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Lawyer;
