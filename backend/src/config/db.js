const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // We don't exit process here because we might want the server to run with just MySQL if needed, 
    // but for this specific requirement, we'll let the index.js handle the crash if it's critical.
    throw error;
  }
};

// MySQL Connection (using Sequelize)
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false, // set to console.log if you want to see SQL queries
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('🐬 MySQL Connected successfully.');
  } catch (error) {
    console.error(`❌ MySQL Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectMongoDB,
  connectMySQL,
  sequelize
};
