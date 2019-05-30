const emailDomain = '@wolox.com.ar',
  bcrypt = require('bcrypt'),
  { databaseError, hashError, dataError } = require('../errors'),
  saltRounds = 10,
  Users = require('../models').user;

// completar estas funciones
const checkValidPassword = pass => pass.length >= 8 && pass.match(/^[0-9a-zA-Z]+$/);

const checkValidEmail = email => email.endsWith(emailDomain);

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
  const { firstName, lastName, email, password } = req.body;

  if (!checkValidEmail(email)) {
    return next(dataError('Invalid email'));
  }
  if (!checkValidPassword(password)) {
    return next(dataError('Invalid password. Must have 8 aplhanumeric characters'));
  }

  return hashPassword(password)
    .then(hash => createUser(firstName, lastName, email, hash))
    .then(([user, created]) => {
      if (created) {
        res.status(200).send(`User ${user.firstName} created`);
      } else {
        throw dataError('Email already used');
      }
    })
    .catch(next);
};
