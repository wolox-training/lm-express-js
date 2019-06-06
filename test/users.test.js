const request = require('supertest'),
  app = require('../app.js'),
  Users = require('../app/models').user,
  { factory } = require('factory-girl'),
  { comparePasswords } = require('../app/helpers/hasher'),
  validationErrorStatus = 401,
  createdCorrectlyStatus = 200,
  firstName = 'fn',
  lastName = 'ln',
  correctPassword = 'password',
  correctEmail = 'email@wolox.com.ar',
  correctEmail1 = 'email2@wolox.com.ar';

describe('POST /users', () => {
  describe('Test invalid password', () => {
    test('Create user with short password', () =>
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: 'pass'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Create user with password with invalid characters', () =>
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: 'passwo..rd'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));
  });

  describe('Test invalid email', () => {
    test('Create user with email with domain different from wolox', () =>
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: 'email@email.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Create user with used email', () => {
      factory.define('user', Users, buildOptions => ({
        first_name: buildOptions.firstName,
        last_name: buildOptions.lastName,
        email: buildOptions.email,
        password: buildOptions.password
      }));
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
    test.each([
      {
        first_name: firstName,
        last_name: lastName,
        email: correctEmail
      },
      {
        first_name: firstName,
        last_name: lastName,
        password: correctPassword
      },
      {
        last_name: lastName,
        email: correctEmail,
        password: correctPassword
      },
      {
        first_name: firstName,
        email: correctEmail,
        password: correctPassword
      },
      {}
    ])('Test missing parameter with body = %p', body =>
      request(app)
        .post('/users')
        .send(body)
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        })
    );
  });

  describe('Create user correctly', () => {
    test('Create user with all paramaters set up correctly', () =>
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(createdCorrectlyStatus);
        }));

    test('Create user with all paramaters set up correctly and check database', () =>
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail,
          password: correctPassword
        })
        .then(() =>
          Users.findOne({ where: { email: correctEmail } }).then(result => {
            expect(result.firstName).toBe(firstName);
            expect(result.lastName).toBe(lastName);
            expect(result.email).toBe(correctEmail);
            return comparePasswords(correctPassword, result.password).then(res => {
              expect(res).toBe(true);
            });
          })
        ));
  });
});

describe('POST /susers/sessions', () => {
  describe('Test missing parameters', () => {
    test.each([
      {
        email: correctEmail
      },
      {
        password: correctPassword
      },
      {}
    ])('Test missing parameter with body = %p', body =>
      request(app)
        .post('/users/sessions')
        .send(body)
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        })
    );
  });

  describe('Test invalid password', () => {
    test('Sign in with short password', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: 'pass'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Sign in with password with invalid characters', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: correctEmail,
          password: 'passwo..rd'
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Valid user but not matching password', () => {
      request(app)
        .post('/users')
        .send({
          email: correctEmail,
          password: correctPassword
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail,
              password: 'notMatchingPassword'
            })
            .then(response => {
              expect(response.status).toBe(validationErrorStatus);
            })
        );
    });
  });

  describe('Test invalid email', () => {
    test('Sign in with email with domain different from wolox', () =>
      request(app)
        .post('/users/sessions')
        .send({
          email: 'email@email.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        }));

    test('Sign in with unregistered email', () => {
      request(app)
        .post('/users/sessions')
        .send({
          email: 'unregisteredemail@wolox.com.ar',
          password: correctPassword
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
  });

  describe('Test correct sign in', () => {
    test('Sign in correctly and check that token is generated', () => {
      request(app)
        .post('/users')
        .send({
          first_name: firstName,
          last_name: lastName,
          email: correctEmail1,
          password: correctPassword
        })
        .then(() =>
          request(app)
            .post('/users/sessions')
            .send({
              email: correctEmail1,
              password: correctPassword
            })
            .then(response => {
              expect(response.status).toBe(200);
              expect(response.body.token.length).toBeGreaterThan(0);
            })
        );
    });
  });
});

describe('GET /users', () => {
  describe('Test invalid inputs', () => {
    test('Test invalid offset', () => {
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: -5,
          limit: 10
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });

    test('Test invalid limit', () => {
      request(app)
        .get('/users')
        .send({
          token: 'token',
          offset: 10,
          limit: -5
        })
        .then(response => {
          expect(response.status).toBe(validationErrorStatus);
        });
    });
  });
});
