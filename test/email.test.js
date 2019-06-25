const { notifySignUp } = require('../app/helpers/mailer'),
  request = require('supertest'),
  app = require('../app.js'),
  nodemailer = require('nodemailer'),
  stubTransport = require('nodemailer-stub-transport');

jest.mock('../app/helpers/mailer');
notifySignUp.mockResolvedValue(true);
describe('Test for email-notifying users on sign up', () => {
  beforeEach(() => notifySignUp.mockClear());
  test('Send email', () =>
    notifySignUp('fn', 'email@wolox.com.ar', 'from@wolox.com.ar').then(() => {
      expect(notifySignUp.mock.calls.length).toBe(1);
    }));

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

  test('Sen email and check email data', () => {
    notifySignUp.mockRestore();
    const transport = nodemailer.createTransport(stubTransport());
    return notifySignUp('fn', 'email@wolox.com.ar', 'from@wolox.com.ar', transport).then(response => {
      console.log(response);
    });
  });
});
