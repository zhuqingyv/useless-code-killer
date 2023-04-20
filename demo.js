const path = require('path');
const { UselessCodeKiller } = require('./src/index.js');

const killer = new UselessCodeKiller({
  dir: path.resolve(__dirname, './example'),
  excludes: [],
  includes: ['.ts', '.tsx', '.js', '.jsx'],
  // type: import
  loader: [
    {
      type: 'import',
      handle: (item) => {
        debugger;
      }
    }
  ],
  outputDir: path.resolve(__dirname, './result.json')
});