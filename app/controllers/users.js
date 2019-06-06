const { validationError } = require('../errors'),
  User = require('../models').user,
  logger = require('../logger'),
  { hashPassword, comparePasswords } = require('../helpers/hasher'),
  { createToken } = require('../helpers/token');

exports.signUp = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName}`);

  return hashPassword(password)
    .then(hash => User.createUser(firstName, lastName, email, hash))
    .then(([user, created]) => {
      if (created) {
        res.status(200).send(`User ${user.firstName} created`);
      } else {
        throw validationError('Email already used');
      }
    })
    .catch(next);
};

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  logger.info(`Signing in - email: ${email}`);

  return User.findUserByEmail(email)
    .then(foundUser => {
      if (foundUser) {
        return User.getUserPassword(foundUser);
      }
      throw validationError('User not found');
    })
    .then(foundUserPassword => comparePasswords(password, foundUserPassword))
    .then(result => {
      if (result) {
        res.status(200).send({ token: createToken(email) });
      } else {
        throw validationError('Password does not match with the email');
      }
    })
    .catch(next);
};
