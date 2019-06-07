const { validationError } = require('../errors'),
  User = require('../models').user,
  logger = require('../logger'),
  { hashPassword, comparePasswords } = require('../helpers/hasher'),
  { createToken, validateToken } = require('../helpers/token');

/* const signUpWithAdminCondition = userData => {
  const { firstName, lastName, email, password, isAdmin } = userData;
  if (isAdmin) {
    //
  } else {
    logger.info(`Creating user ${firstName}`);

    return hashPassword(password)
      .then(hash => User.createUser(firstName, lastName, email, hash))
      .then(([user, created]) => {
        if (created) {
          res.status(200).send(`User ${user.firstName} created`);
        } else {
          throw validationError('Email already used');
        }
      });
  }
};

exports.signUpAdmin = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  logger.info(`Creating user ${firstName}`);
  return signUpWithAdminCondition({ firstName, lastName, email, password, isAdmin: true }).catch(error =>
    next(error)
  );
};
*/

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
    .catch(error => next(error));
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
  const { token, offset, limit } = req.query;
  return validateToken(token)
    .then(validated => {
      if (validated) {
        logger.info('User validated.\nGetting all users for listing them');
        User.getUsers(offset, limit)
          .then(foundUsers => {
            res.status(200).send(foundUsers);
          })
          .catch(next);
      } else {
        throw validationError("User doesn't have permissions to request users list");
      }
    })
    .catch(next);
};
