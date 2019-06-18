const { factory } = require('factory-girl'),
  User = require('../../app/models').user,
  Purchase = require('../../app/models').purchase;

factory.define('userNotAdmin', User, {
  firstName: factory.chance('string')(),
  lastName: factory.chance('string')(),
  email: 'email@wolox.com.ar',
  password: 'password',
  isAdmin: false,
  invalidateTime: 0
});

factory.define('userAdmin', User, {
  firstName: factory.chance('string')(),
  lastName: factory.chance('string')(),
  email: 'emailAdmin@wolox.com.ar',
  password: 'password',
  isAdmin: true,
  invalidateTime: 0
});

factory.define('purchase', Purchase, {
  userId: 1,
  albumId: 1
});

factory.define('user', User, {
  firstName: factory.chance('string')(),
  lastName: factory.chance('string')(),
  email: 'email@wolox.com.ar',
  password: 'password',
  isAdmin: true,
  invalidateTime: 0
});
