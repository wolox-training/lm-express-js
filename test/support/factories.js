const { factory } = require('factory-girl'),
  User = require('../../app/models').user;

factory.define('userNotAdmin', User, buildOptions => ({
  first_name: buildOptions.firstName,
  last_name: buildOptions.lastName,
  email: buildOptions.email,
  password: buildOptions.password,
  isAdmin: false
}));

factory.define('userAdmin', User, buildOptions => ({
  first_name: buildOptions.firstName,
  last_name: buildOptions.lastName,
  email: buildOptions.email,
  password: buildOptions.password,
  isAdmin: true
}));
