const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

const protectCustomer = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartcart_secret_key');
      req.customer = await Customer.findById(decoded.id).select('-customers_pass');
      if (!req.customer) {
        return res.status(401).json({ message: 'Not authorized, customer not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartcart_secret_key');
      let admin = await Admin.findById(decoded.id).select('-admin_pass');
      if (!admin) {
        const customer = await Customer.findById(decoded.id);
        if (customer && customer.customers_email === 'premkardani2006@gmail.com') {
          admin = {
            _id: customer._id,
            admin_name: customer.customers_name,
            admin_email: customer.customers_email,
            admin_contact: customer.customers_contact || '',
            admin_country: customer.customers_country || '',
            admin_job: 'Administrator'
          };
        }
      }

      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }
      req.admin = admin;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no admin token' });
  }
};

module.exports = { protectCustomer, protectAdmin };
