const { notifySignUp } = require('../app/helpers/mailer'),
  request = require('supertest'),
  app = require('../app.js'),
  toEmail = 'email@wolox.com.ar';

jest.mock('../app/helpers/mailer');
describe('Test for email-notifying users on sign up', () => {
  notifySignUp.mockResolvedValueOnce(true);

  test('Send email', () => {
    notifySignUp.mockClear();
    return notifySignUp('fn', toEmail).then(() => {
      expect(notifySignUp.mock.calls.length).toBe(1);
    });
  });

  notifySignUp.mockResolvedValueOnce(true);
  test('Create user and sign up', () => {
    notifySignUp.mockClear();
    return request(app)
      .post('/users')
      .send({
        first_name: 'fn',
        last_name: 'ln',
        email: toEmail,
        password: 'password'
      })
      .then(() => {
        expect(notifySignUp.mock.calls.length).toBe(1);
      });
  });
});
