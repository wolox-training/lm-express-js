const request = require('supertest'),
  app = require('../app.js'),
  Users = require('../app/models').user,
  { factory } = require('factory-girl'),
  validationErrorStatus = 401,
  createdCorrectlyStatus = 200,
  firstName = 'fn',
  lastName = 'ln',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar';

describe('Test invalid password', () => {
  test('Create user with short password', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        email: correctEmail,
        password: 'pass'
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user with password with invalid characters', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        email: correctEmail,
        password: 'passwo..rd'
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });
});

describe('Test invalid email', () => {
  test('Create user with email with domain different from wolox', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        email: 'email@email.com.ar',
        password: correctPassword
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user with used email', () => {
    factory.define('user', Users, buildOptions => ({
      first_name: buildOptions.firstName,
      last_name: buildOptions.lastName,
      email: buildOptions.email,
      password: buildOptions.password
    }));
    expect.assertions(1);
    return factory
      .create('user', { firstName, lastName, email: correctEmail, password: correctPassword })
      .then(() =>
        request(app)
          .post('/users')
          .send({
            first_name: firstName,
            last_name: lastName,
            email: correctEmail,
            password: correctPassword
          })
      )
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });
});

describe('Test missing parameters', () => {
  test('Create user without password', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        email: correctEmail
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user without email', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        password: correctPassword
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user without first name', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        last_name: lastName,
        email: correctEmail,
        password: correctPassword
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user without last name', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        email: correctEmail,
        password: correctPassword
      })
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });

  test('Create user without any parameter', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .then(response => {
        expect(response.status).toBe(validationErrorStatus);
      });
  });
});

describe('Creat user correctly', () => {
  test('Create user with all paramaters set up correctly', () => {
    expect.assertions(1);
    return request(app)
      .post('/users')
      .send({
        first_name: firstName,
        last_name: lastName,
        email: correctEmail,
        password: correctPassword
      })
      .then(response => {
        expect(response.status).toBe(createdCorrectlyStatus);
      });
  });
});
