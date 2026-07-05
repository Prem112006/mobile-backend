const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  let transporter;

  // Check if SMTP environment variables are defined and not placeholders
  const isSmtpConfigured = process.env.SMTP_HOST && 
                          !process.env.SMTP_HOST.includes('yourmailprovider') &&
                          process.env.SMTP_PORT && 
                          process.env.SMTP_USER && 
                          process.env.SMTP_PASS;

  if (isSmtpConfigured) {
    console.log('Using configured SMTP settings from env.');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    console.log('No SMTP config found. Creating an Ethereal Mail sandbox account...');
    // Create a test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass  // generated ethereal password
      }
    });
  }

  const mailOptions = {
    from: process.env.SMTP_USER || '"SmartCart Mobiles" <no-reply@smartcartmobiles.com>',
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`Email sent: ${info.messageId}`);
  
  // If using Ethereal sandbox, output the URL to preview the email
  if (!isSmtpConfigured) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[Ethereal Preview URL]: ${previewUrl}`);
    return {
      messageId: info.messageId,
      previewUrl
    };
  }

  return {
    messageId: info.messageId
  };
};

module.exports = sendEmail;
