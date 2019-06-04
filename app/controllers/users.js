const { validationError } = require('../errors'),
  Users = require('../models').user,
  logger = require('../logger'),
  { hashPassword, comparePasswords } = require('../helpers/hasher');

exports.signUp = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName}`);

  return hashPassword(password)
    .then(hash => Users.createUser(firstName, lastName, email, hash))
    .then(([user, created]) => {
      if (created) {
        res.status(200).send(`User ${user.firstName} created`);
      } else {
        throw validationError('Email already used');
      }
    })
    .catch(next);
};

const getUserPassword = user => {
  if (user) {
    return user.password;
  }
  throw validationError('Email does not exist');
};

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  logger.info(`Signing in - email: ${email}`);

  return Users.findUser(email)
    .then(foundUser => getUserPassword(foundUser))
    .then(foundUserPassword => comparePasswords(password, foundUserPassword))
    .then(result => {
      if (result) {
        res.status(200).send('token');
      } else {
        throw validationError('Password does not match with the email');
      }
    })
    .catch(next);
};
