const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./user.mysql');

const Case = sequelize.define('Case', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  caseNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  offenseType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrestDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  currentStatus: {
    type: DataTypes.ENUM(
      'Registered',
      'Hearing Scheduled',
      'In Progress',
      'Bail Granted',
      'Acquitted',
      'Convicted',
      'Closed'
    ),
    defaultValue: 'Registered'
  },
  nextHearingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isPendingFlagged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiAlertMessage: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Relationships
Case.belongsTo(User, { as: 'prisoner', foreignKey: 'prisonerId' });
Case.belongsTo(User, { as: 'assignedLawyer', foreignKey: 'lawyerId' });

module.exports = Case;
