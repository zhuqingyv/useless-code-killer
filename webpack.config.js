const path = require('path');

// rope 主程序
module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'index.js'
  },
  target: 'node'
  
};