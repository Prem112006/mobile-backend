const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const check = async () => {
  await connectDB();
  const products = await Product.find({});
  console.log(`Total Products in DB: ${products.length}`);
  products.forEach(p => console.log(`- ${p.product_title} (${p.product_url})`));
  process.exit(0);
};

check();
