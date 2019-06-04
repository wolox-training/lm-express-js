const { validationError } = require('../errors');

exports.getUserPassword = user => {
  if (user) {
    return user.password;
  }
  throw validationError('Email does not exist');
};
