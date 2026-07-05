const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const { protectCustomer } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smartcart_secret_key', {
    expiresIn: '30d'
  });
};

const isSmtpConfigured = !!(
  process.env.SMTP_HOST &&
  !process.env.SMTP_HOST.includes('yourmailprovider') &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

// @route   POST /api/auth/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, country, city, contact, address } = req.body;

    const customerExists = await Customer.findOne({ customers_email: email });
    if (customerExists) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      customers_name: name,
      customers_email: email,
      customers_pass: hashedPassword,
      customers_country: country || '',
      customers_city: city || '',
      customers_contact: contact || '',
      customers_address: address || '',
      customers_ip: req.ip || ''
    });

    if (customer) {
      res.status(201).json({
        _id: customer._id,
        name: customer.customers_name,
        email: customer.customers_email,
        token: generateToken(customer._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid customer data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate customer & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ customers_email: email });

    if (customer) {
      // Check bcrypt or plain text fallback (for seeded data)
      let isMatch = false;
      if (customer.customers_pass.startsWith('$2a$') || customer.customers_pass.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, customer.customers_pass);
      } else {
        isMatch = (password === customer.customers_pass);
      }

      if (isMatch) {
        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        customer.loginOtpToken = otpCode;
        customer.loginOtpExpires = Date.now() + 300000; // 5 minutes
        
        await customer.save();
        
        console.log(`[SANDBOX LOGIN OTP] Login OTP for ${email} is: ${otpCode}`);
        
        let previewUrl = '';
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #6366f1; text-align: center; margin-bottom: 24px;">SmartCart Mobiles Secure Login Verification</h2>
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hello ${customer.customers_name || 'Valued Customer'},</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">To complete your sign in, please verify your identity using the following 6-digit OTP code. This code will expire in 5 minutes.</p>
              <div style="text-align: center; margin: 32px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 12px 30px; border-radius: 8px; border: 1px dashed #d1d5db;">${otpCode}</span>
              </div>
              <p style="color: #ef4444; font-size: 14px;">If you did not initiate this login request, please contact support or change your password immediately.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 0;">&copy; ${new Date().getFullYear()} SmartCart Mobiles. All rights reserved.</p>
            </div>
          `;
          
          const emailResult = await sendEmail({
            to: email,
            subject: 'Your SmartCart Mobiles Login Verification Code',
            text: `Your login verification code is: ${otpCode}. It will expire in 5 minutes.`,
            html: emailHtml
          });
          
          if (emailResult.previewUrl) {
            previewUrl = emailResult.previewUrl;
          }
        } catch (emailErr) {
          console.error('Error sending login OTP:', emailErr);
        }
        
        return res.json({
          requireOtp: true,
          email: customer.customers_email,
          otp: isSmtpConfigured ? undefined : otpCode, // Send only if not SMTP configured (sandbox fallback)
          previewUrl: isSmtpConfigured ? undefined : previewUrl // Send only if not SMTP configured
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/verify-login
// @desc    Verify login OTP & issue token
router.post('/verify-login', async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }

    const customer = await Customer.findOne({
      customers_email: email,
      loginOtpToken: token,
      loginOtpExpires: { $gt: Date.now() }
    });

    if (!customer) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Clear OTP fields
    customer.loginOtpToken = null;
    customer.loginOtpExpires = null;
    await customer.save();

    res.json({
      _id: customer._id,
      name: customer.customers_name,
      email: customer.customers_email,
      token: generateToken(customer._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/admin-login
// @desc    Authenticate admin & get token
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ admin_email: email });

    if (admin) {
      let isMatch = false;
      if (admin.admin_pass.startsWith('$2a$') || admin.admin_pass.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, admin.admin_pass);
      } else {
        isMatch = (password === admin.admin_pass);
      }

      if (isMatch) {
        return res.json({
          _id: admin._id,
          name: admin.admin_name,
          email: admin.admin_email,
          token: generateToken(admin._id),
          isAdmin: true
        });
      }
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get customer profile
router.get('/profile', protectCustomer, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).select('-customers_pass');
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update customer profile
router.put('/profile', protectCustomer, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    if (customer) {
      customer.customers_name = req.body.name || customer.customers_name;
      customer.customers_country = req.body.country || customer.customers_country;
      customer.customers_city = req.body.city || customer.customers_city;
      customer.customers_contact = req.body.contact || customer.customers_contact;
      customer.customers_address = req.body.address || customer.customers_address;

      const updatedCustomer = await customer.save();
      res.json({
        _id: updatedCustomer._id,
        name: updatedCustomer.customers_name,
        email: updatedCustomer.customers_email,
        country: updatedCustomer.customers_country,
        city: updatedCustomer.customers_city,
        contact: updatedCustomer.customers_contact,
        address: updatedCustomer.customers_address
      });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
router.put('/change-password', protectCustomer, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const customer = await Customer.findById(req.customer._id);

    if (customer) {
      let isMatch = false;
      if (customer.customers_pass.startsWith('$2a$') || customer.customers_pass.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(oldPassword, customer.customers_pass);
      } else {
        isMatch = (oldPassword === customer.customers_pass);
      }

      if (isMatch) {
        customer.customers_pass = await bcrypt.hash(newPassword, 10);
        await customer.save();
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(400).json({ message: 'Incorrect old password' });
      }
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/auth/delete-account
// @desc    Delete customer account
router.delete('/delete-account', protectCustomer, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.customer._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @route   POST /api/auth/forgot-password
// @desc    Generate password reset OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const customer = await Customer.findOne({ customers_email: email });
    if (!customer) {
      return res.status(404).json({ message: 'No customer registered with this email address' });
    }

    // Generate 6 digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    customer.resetPasswordToken = otpCode;
    customer.resetPasswordExpires = Date.now() + 600000; // 10 minutes from now

    await customer.save();

    console.log(`[SANDBOX MOCK EMAIL] Password reset OTP for ${email} is: ${otpCode}`);

    // Send actual email using the utility
    let previewUrl = '';
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #6366f1; text-align: center; margin-bottom: 24px;">SmartCart Mobiles Password Reset</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hello ${customer.customers_name || 'Valued Customer'},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Please use the following 6-digit verification code to complete the process. This code will expire in 10 minutes.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 12px 30px; border-radius: 8px; border: 1px dashed #d1d5db;">${otpCode}</span>
          </div>
          <p style="color: #ef4444; font-size: 14px;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 0;">&copy; ${new Date().getFullYear()} SmartCart Mobiles. All rights reserved.</p>
        </div>
      `;

      const emailResult = await sendEmail({
        to: email,
        subject: 'Reset your SmartCart Mobiles password',
        text: `Your password reset code is: ${otpCode}. It will expire in 10 minutes.`,
        html: emailHtml
      });

      if (emailResult.previewUrl) {
        previewUrl = emailResult.previewUrl;
      }
    } catch (emailErr) {
      console.error('Error sending password reset email:', emailErr);
    }

    res.json({
      message: 'A 6-digit verification code has been generated.',
      otp: isSmtpConfigured ? undefined : otpCode, // Send only if not SMTP configured (sandbox fallback)
      previewUrl: isSmtpConfigured ? undefined : previewUrl // Send only if not SMTP configured
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'All fields (email, token, newPassword) are required' });
    }

    const customer = await Customer.findOne({
      customers_email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!customer) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Hash the new password
    customer.customers_pass = await bcrypt.hash(newPassword, 10);
    
    // Clear reset token fields
    customer.resetPasswordToken = null;
    customer.resetPasswordExpires = null;

    await customer.save();

    res.json({ message: 'Your password has been successfully reset.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Continue with Google (OAuth or Mock Sandbox mode)
router.post('/google', async (req, res) => {
  try {
    const { credential, email: mockEmail, name: mockName, isMock } = req.body;
    let email, name, picture = '';

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (googleClientId && credential && !isMock) {
      // Real Google OAuth verification
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture || '';
    } else {
      // Mock Sandbox Login fallback
      console.log('[SANDBOX GOOGLE SIGN-IN] Running mock Google verification flow...');
      if (!mockEmail) {
        return res.status(400).json({ message: 'Mock email is required in sandbox mode' });
      }
      email = mockEmail;
      name = mockName || email.split('@')[0];
    }

    // Find or create customer
    let customer = await Customer.findOne({ customers_email: email });
    if (!customer) {
      // Create new customer with random password
      const randomPass = Math.random().toString(36).substring(2, 10);
      const hashedPassword = await bcrypt.hash(randomPass, 10);
      
      customer = await Customer.create({
        customers_name: name,
        customers_email: email,
        customers_pass: hashedPassword,
        customers_image: picture || '',
        customers_country: '',
        customers_city: '',
        customers_contact: '',
        customers_address: '',
        customers_ip: req.ip || ''
      });
      console.log(`[SANDBOX GOOGLE SIGN-IN] Registered new Google customer: ${email}`);
    } else {
      console.log(`[SANDBOX GOOGLE SIGN-IN] Authenticated existing Google customer: ${email}`);
    }

    res.json({
      _id: customer._id,
      name: customer.customers_name,
      email: customer.customers_email,
      image: customer.customers_image,
      token: generateToken(customer._id)
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google authentication failed: ' + error.message });
  }
});

// @route   GET /api/auth/google/config
// @desc    Get Google Client ID config
router.get('/google/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null
  });
});

module.exports = router;

