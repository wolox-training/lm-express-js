const { notifySignUp } = require('../app/helpers/mailer'),
  nodemailer = require('nodemailer'),
  stubTransport = require('nodemailer-stub-transport'),
  toEmail = 'email@wolox.com.ar';
jest.unmock('../app/helpers/mailer');
describe('Test email data', () => {
  test('Send email and check email data', () => {
    const transport = nodemailer.createTransport(stubTransport());
    return notifySignUp('fn', toEmail, transport).then(info => {
      expect(info.envelope.to.length).toBe(1);
      expect(info.envelope.to[0]).toBe(toEmail);
    });
  });
});
