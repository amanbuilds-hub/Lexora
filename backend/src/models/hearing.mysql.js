const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Case = require('./case.mysql');

const Hearing = sequelize.define('Hearing', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  hearingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  participants: {
    type: DataTypes.JSON, // Array of participant roles/names
    allowNull: true
  },
  outcome: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nextHearingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  presidingJudge: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Relationship
Case.hasMany(Hearing, { as: 'hearings', foreignKey: 'caseId' });
Hearing.belongsTo(Case, { foreignKey: 'caseId' });

module.exports = Hearing;
