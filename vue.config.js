const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@tests': path.resolve(__dirname, 'tests'),
      },
    },
  },
};
