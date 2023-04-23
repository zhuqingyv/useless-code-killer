const path = require('path');
const { UselessCodeKiller, halationLoader, routesLoader, deepLoader } = require('./src/index.js');

const killer = new UselessCodeKiller({
  dir: path.resolve(__dirname, './example'),
  excludes: ['node_modules'],
  includes: ['.ts', '.tsx', '.js', '.jsx'],
  // 重命名
  alias: {
    'alias': path.resolve(__dirname, './example/alias-test')
  },
  // type: import
  loader: [deepLoader],
  outputDir: path.resolve(__dirname, './result.json'),
  retry: false
});