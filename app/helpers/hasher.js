const bcrypt = require('bcrypt'),
  { hashError } = require('../errors'),
  saltRounds = 10;

exports.hashPassword = pass => bcrypt.hash(pass, saltRounds).catch(error => hashError(error.message));
