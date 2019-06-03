const bcrypt = require('bcrypt'),
  { databaseError, hashError, validationError } = require('../errors'),
  Users = require('../models').user,
  logger = require('../logger'),
  saltRounds = 10;

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
