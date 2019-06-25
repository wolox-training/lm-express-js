const logger = require('../logger'),
  nodemailer = require('nodemailer'),
  { notificationError } = require('../errors'),
  service = 'gmail',
  senderPass = 'pass',
  subject = 'Sign up notification';

exports.notifySignUp = (toName, toEmail, fromEmail, transporter = null) => {
  logger.info(`Notifying ${toName} <${toEmail}> via email`);
  let emailTransporter = transporter;
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      service,
      auth: {
        user: fromEmail,
        pass: senderPass
      }
    });
  }

  const mailData = {
    from: fromEmail,
    to: toEmail,
    subject,
    text: `You just created your account. username: ${toName}, email: <${toEmail}>`
  };
  return emailTransporter.sendMail(mailData).then((error, response) => {
    if (error) {
      throw notificationError(error);
    }
    logger.info('Notificacion correctly sent.');
    return response;
  });
};
