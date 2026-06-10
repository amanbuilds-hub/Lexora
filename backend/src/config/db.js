const mongoose = require('mongoose');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    // Use 127.0.0.1 to avoid potential IPv6/IPv4 resolution issues on some systems
    const mongoUri = process.env.MONGODB_URI.replace('localhost', '127.0.0.1');
    const conn = await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectMongoDB
};
