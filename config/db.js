const mongoose = require('mongoose');
const dns = require('dns');

// Fix querySrv ECONNREFUSED on some networks/machines (especially on Windows)
if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    console.warn('Warning: Failed to set custom DNS servers for Atlas:', err.message);
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartcard_mobiles');
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
