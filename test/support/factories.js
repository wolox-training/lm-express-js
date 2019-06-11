const { factory } = require('factory-girl'),
  User = require('../../app/models').user;

factory.define('userNotAdmin', User, {
  firstName: factory.chance('string')(),
  lastName: factory.chance('string')(),
  email: 'email@wolox.com.ar',
  password: 'password',
  isAdmin: false
});

factory.define('userAdmin', User, {
  firstName: factory.chance('string')(),
  lastName: factory.chance('string')(),
  email: 'emailAdmin@wolox.com.ar',
  password: 'password',
  isAdmin: true
});
