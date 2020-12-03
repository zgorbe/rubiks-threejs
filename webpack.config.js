const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'rubik.js',
    path: path.resolve(__dirname, 'dist'),
  },
  performance: {
    hints: false
  }
};
