const { validationError } = require('../errors'),
  logger = require('../logger'),
  emailDomain = '@wolox.com.ar',
  minPasswordLength = 8,
  alphanumericRegex = /^[0-9a-zA-Z]+$/;

const checkValidPassword = pass => pass && pass.length >= minPasswordLength && pass.match(alphanumericRegex);

const checkValidEmail = email => email && email.endsWith(emailDomain);

exports.checkValidInputs = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    return next(validationError('Missing parameters. firstName and lastName are required'));
  }

  if (!checkValidEmail(email)) {
    return next(validationError('Invalid email'));
  }
  if (!checkValidPassword(password)) {
    return next(validationError(`Invalid password. Must have ${minPasswordLength} aplhanumeric characters`));
  }
  logger.info('Email and password correctly validated');
  return next();
};
