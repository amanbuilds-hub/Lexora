const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true, // Optional for Prisoners, required for others
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true // Required for Family
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Optional for Prisoners (they use PIN)
  },
  pin: {
    type: DataTypes.STRING, // 4-6 digit PIN for Prisoners
    allowNull: true
  },
  prisonerId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true // Required for Prisoners
  },
  role: {
    type: DataTypes.ENUM('prisoner', 'family', 'lawyer', 'admin'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended'),
    defaultValue: 'active' // Lawyers start as 'pending'
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.pin) {
        user.pin = await bcrypt.hash(user.pin, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.changed('pin')) {
        user.pin = await bcrypt.hash(user.pin, 10);
      }
    }
  }
});

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.comparePin = async function (pin) {
  return await bcrypt.compare(pin, this.pin);
};

module.exports = User;
