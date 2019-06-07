const { validationError } = require('../../errors'),
  logger = require('../../logger'),
  emailDomain = '@wolox.com.ar',
  minPasswordLength = 8,
  alphanumericRegex = /^[0-9a-zA-Z]+$/;

const checkValidPassword = pass => pass.length >= minPasswordLength && pass.match(alphanumericRegex);

const checkValidEmail = email => email.endsWith(emailDomain);

exports.checkValidEmailAndPassword = (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return next(validationError('Missing parameters. Email and password are required'));
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

exports.checkValidName = (req, res, next) => {
  const { first_name: firstName, last_name: lastName } = req.body;
  if (!firstName || !lastName) {
    return next(validationError('Missing parameters. firstName and lastName are required'));
  }
  logger.info('Name correctly validated');
  return next();
};

exports.checkValidOffsetAndLimit = (req, res, next) => {
  const { page, limit } = req.body;
  if (!page || !limit || !(page > 0) || !(limit >= 0)) {
    return next(validationError('page and limit must be positive integers'));
  }
  logger.info('page and limit correctly validated');
  return next();
};

exports.checkNotNullToken = (req, res, next) => {
  if (!req.body.token) {
    return next(validationError('Null token'));
  }
  logger.info('Token not null');
  return next();
};
