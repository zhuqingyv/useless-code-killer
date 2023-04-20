const path = require('path');
const { UselessCodeKiller, halationLoader } = require('./src/index.js');

const killer = new UselessCodeKiller({
  dir: path.resolve(__dirname, './'),
  excludes: [],
  includes: ['.ts', '.tsx', '.js', '.jsx'],
  // type: import
  loader: [halationLoader],
  outputDir: path.resolve(__dirname, './result.json'),
  retry: false
});