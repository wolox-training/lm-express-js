const logger = require('../logger'),
  nodemailer = require('nodemailer'),
  { notificationError } = require('../errors'),
  config = require('../../config').common.email,
  service = 'Gmail',
  subject = 'Sign up notification';

exports.notifySignUp = (toName, toEmail, transporter = null) => {
  logger.info(`Notifying ${toName} <${toEmail}> via email`);
  let emailTransporter = transporter;
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      service,
      auth: {
        user: config.senderEmail,
        pass: config.senderPassword
      }
    });
  }

  const mailData = {
    from: config.senderEmail,
    to: toEmail,
    subject,
    text: `You just created your account. username: ${toName}, email: <${toEmail}>`
  };
  return emailTransporter
    .sendMail(mailData)
    .then((error, response) => {
      logger.info('Notifying email correctly sent.');
      return response;
    })
    .catch(error => {
      throw notificationError(error);
    });
};
