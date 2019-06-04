const { validationError } = require('../errors'),
  Users = require('../models').user,
  logger = require('../logger'),
  { hashPassword } = require('../helpers/hasher');

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
