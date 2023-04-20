const path = require('path');
const { UselessCodeKiller, halationLoader, routesLoader } = require('./src/index.js');

const killer = new UselessCodeKiller({
  dir: path.resolve(__dirname, './'),
  excludes: ['node_modules'],
  includes: ['.ts', '.tsx', '.js', '.jsx'],
  // 重命名
  alias: {
    'alias': path.resolve(__dirname, './example/alias-test')
  },
  // type: import
  loader: [halationLoader, routesLoader],
  outputDir: path.resolve(__dirname, './result.json'),
  retry: false
});