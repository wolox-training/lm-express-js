const logger = require('../logger'),
  nodemailer = require('nodemailer'),
  { notificationError } = require('../errors'),
  config = require('../../config').common.email;

exports.notifySignUp = (toName, toEmail, transporter = null) => {
  logger.info(`Notifying ${toName} <${toEmail}> via email`);
  let emailTransporter = transporter;
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      service: config.emailService,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword
      }
    });
  }
  const mailData = {
    from: config.senderEmail,
    to: toEmail,
    subject: config.emailSubject,
    text: `You just created your account. username: ${toName}, email: <${toEmail}>`
  };

  return emailTransporter.sendMail(mailData).catch(error => {
    throw notificationError(error);
  });
};
