const { notifySignUp } = require('../app/helpers/mailer'),
  request = require('supertest'),
  app = require('../app.js');

describe('Test for email-notifying users on sign up', () => {
  beforeEach(() => notifySignUp.mockClear());
  notifySignUp.mockResolvedValueOnce(true);
  test('Send email', () =>
    notifySignUp('fn', 'email@wolox.com.ar', 'from@wolox.com.ar').then(() => {
      expect(notifySignUp.mock.calls.length).toBe(1);
    }));
  notifySignUp.mockResolvedValueOnce(true);
  test('Create user and sign up', () =>
    request(app)
      .post('/users')
      .send({
        first_name: 'fn',
        last_name: 'ln',
        email: 'email@wolox.com.ar',
        password: 'password'
      })
      .then(() => {
        expect(notifySignUp.mock.calls.length).toBe(1);
      }));
});
