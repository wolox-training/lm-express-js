const emailDomain = '@wolox.com.ar',
  bcrypt = require('bcrypt'),
  { databaseError, hashError, validationError } = require('../errors'),
  Users = require('../models').user,
  logger = require('../logger'),
  saltRounds = 10,
  minPasswordLength = 8,
  alphanumericRegex = /^[0-9a-zA-Z]+$/;

const checkValidPassword = pass => pass && pass.length >= minPasswordLength && pass.match(alphanumericRegex);

const checkValidEmail = email => email && email.endsWith(emailDomain);

const hashPassword = pass => bcrypt.hash(pass, saltRounds).catch(error => hashError(error.message));

const createUser = (firstName, lastName, email, password) =>
  Users.findOrCreate({
    where: { email },
    defaults: {
      firstName,
      lastName,
      password
    }
  }).catch(error => databaseError(error.message));

exports.signUp = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName}`);

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
  return hashPassword(password)
    .then(hash => createUser(firstName, lastName, email, hash))
    .then(([user, created]) => {
      if (created) {
        res.status(200).send(`User ${user.firstName} created`);
      } else {
        throw validationError('Email already used');
      }
    })
    .catch(next);
};
