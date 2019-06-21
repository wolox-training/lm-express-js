const { validationError, permissionError } = require('../errors'),
  User = require('../models').user,
  logger = require('../logger'),
  { hashPassword, comparePasswords } = require('../helpers/hasher'),
  { createToken } = require('../helpers/token'),
  { getEmailFromToken } = require('../helpers/token');

exports.signUpAdmin = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName} as admin`);

  return getEmailFromToken(req.body.token)
    .then(adminEmail => User.findUserByEmail(adminEmail))
    .then(foundAdminUser => {
      if (foundAdminUser.isAdmin) {
        return hashPassword(password);
      }
      throw permissionError('Admin permissions are required');
    })
    .then(hash => User.createUser({ firstName, lastName, email, password: hash, isAdmin: true }))
    .then(([user, created]) => {
      if (created) {
        res.status(200).send(`User ${user.firstName} created as admin`);
      } else {
        User.makeAdmin(email).then(() => {
          logger.info(`User ${firstName} has admin permissions`);
          res.status(200).send(`User ${firstName} has admin permissions`);
        });
      }
    })
    .catch(next);
};

exports.signUp = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName}`);
  return hashPassword(password)
    .then(hash => User.createUser({ firstName, lastName, email, password: hash, isAdmin: false }))
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
        return foundUser.password;
      }
      throw validationError('User not found');
    })
    .then(foundUserPassword => comparePasswords(password, foundUserPassword))
    .then(result => {
      if (result) {
        res.status(200).send(createToken(email));
      } else {
        throw validationError('Password does not match with the email');
      }
    })
    .catch(next);
};

exports.listUsers = (req, res, next) => {
  const { page, limit } = req.body,
    offset = limit * (page - 1);

  logger.info('Listing users');
  return User.getUsers(offset, limit)
    .then(({ users: foundUsers }) => {
      res.status(200).send(foundUsers);
    })
    .catch(next);
};

exports.invalidateAllSessions = (req, res, next) => {
  logger.info("Closing all user's sessions");
  return getEmailFromToken(req.body.token)
    .then(email => User.findUserByEmail(email))
    .then(foundUser => {
      if (foundUser) {
        return User.invalidateAllSessionsByEmail(foundUser.email).then(() => {
          res.status(200).send(`Al sessions of user with id ${foundUser.id} have been closed`);
        });
      }
      throw validationError('Token does not match with any user');
    })
    .catch(next);
};
