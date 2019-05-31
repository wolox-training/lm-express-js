const request = require('supertest'),
  app = require('../app.js'),
  { validationError } = require('../app/errors'),
  correctPassword = 'password',
  shortPassword = 'pass',
  passwordWithDots = 'password..',
  correctEmail = 'correct@wolox.com.ar',
  invalidEmail = 'invalid@prueba.com.ar',
  firstName = 'fn',
  lastName = 'ln';

describe('Test invalid password', () => {
  test('Create user with short password', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        email: correctEmail,
        password: shortPassword
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test invalid password', () => {
  test('Create user with password with invalid characters', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        email: correctEmail,
        password: passwordWithDots
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test invalid email', () => {
  test('Create user with email with another domain (different from wolox)', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        email: invalidEmail,
        password: correctPassword
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test used mail', () => {
  request(app).post('/user', {
    firstName,
    lastName,
    email: correctEmail,
    password: correctPassword
  });
  test('Create user with an existing email', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        email: correctEmail,
        password: correctPassword
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test missing parameters', () => {
  test('Create user without password', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        email: correctEmail
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test missing parameters', () => {
  test('Create user without email', () =>
    request(app)
      .post('/user', {
        firstName,
        lastName,
        password: correctPassword
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});

describe('Test missing parameters', () => {
  test('Create user without name', () =>
    request(app)
      .post('/user', {
        email: correctEmail,
        password: correctPassword
      })
      .catch(error => {
        expect(error.status).toBe(validationError.status);
      }));
});
