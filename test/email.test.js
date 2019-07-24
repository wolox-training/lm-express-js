const { notifySignUp } = require('../app/helpers/mailer'),
  request = require('supertest'),
  app = require('../app.js'),
  toEmail = 'email@wolox.com.ar';

describe('Test for email-notifying users on sign up', () => {
  beforeEach(() => {
    notifySignUp.mockResolvedValueOnce(true);
    notifySignUp.mockClear();
  });

  test('Send email', () =>
    notifySignUp('fn', toEmail).then(() => {
      expect(notifySignUp.mock.calls.length).toBe(1);
    }));

  test('Create user and sign up', () =>
    request(app)
      .post('/users')
      .send({
        first_name: 'fn',
        last_name: 'ln',
        email: toEmail,
        password: 'password'
      })
      .then(() => {
        expect(notifySignUp.mock.calls.length).toBe(1);
      }));
});
