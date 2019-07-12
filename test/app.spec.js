const { notifySignUp } = require('../app/helpers/mailer');
jest.mock('../app/helpers/mailer');
notifySignUp.mockResolvedValue(true);

const fs = require('fs'),
  models = require('../app/models'),
  path = require('path'),
  nock = require('nock');

const tables = Object.values(models.sequelize.models);
const truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

const truncateDatabase = () => Promise.all(tables.map(truncateTable));

beforeEach(done => {
  truncateDatabase().then(() => done());
  nock.cleanAll();
});

// including all test files
const normalizedPath = path.join(__dirname, '.');

const requireAllTestFiles = pathToSearch => {
  fs.readdirSync(pathToSearch).forEach(file => {
    if (fs.lstatSync(`${pathToSearch}/${file}`).isDirectory()) {
      requireAllTestFiles(`${pathToSearch}/${file}`);
    } else {
      require(`${pathToSearch}/${file}`);
    }
  });
};

nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

requireAllTestFiles(normalizedPath);
