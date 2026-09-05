const mongoose = require('mongoose');

async function connectDB(uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital_complex_management') {
  await mongoose.connect(uri);
  console.log('MongoDB connected:', uri);
  return mongoose.connection;
}

module.exports = connectDB;
