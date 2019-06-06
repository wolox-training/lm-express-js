exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },

    session: {
      secret: 'some-super-secret'
    },

    token: {
      algorithm: 'HS256',
      tokenType: 'JWT',
      pass: 'c2VjcmV0'
    }
  }
};
