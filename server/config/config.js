const path = require('path');
const rootPath = path.normalize( __dirname + '/../../');

console.log('rootPath: ' + rootPath);

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/test',
    port: process.env.PORT || 1337,
    secret: process.env.SECRET || 'secret',
    rootPath: rootPath,
    morgan: {
      options: 'dev',
      format: 'combined'
    },
    env: 'development'
  },
  production: {
    db: 'mongodb://localhost:27017',
    port: process.env.PORT || 1337,
    secret: process.env.SECRET || 'secret',
    rootPath: rootPath,
    morgan: {
      options: 'dev',
      format: 'combined'
    },
    env: 'production'
  }
};
