const path = require('path');
// const fs = require('fs');
const { UselessCodeKiller, halationLoader, routesLoader, deepLoader } = require('./src/index.js');

const killer = new UselessCodeKiller({
  dir: path.resolve(__dirname, './lancer-order'),
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

// const { useless = [] } = require('./result.json');
// const checked = {
//   'lancer-order': [],
//   'lancer-slim': [],
//   'lancer': [],
// };
// useless.forEach((item) => {
//   const { _url } = item;
//   if (_url.includes('ts') || _url.includes('tsx')) {
//     if (_url.includes('useless-code-killer/lancer-order')) {
//       return checked['lancer-order'].push(item);
//     };

//     if (_url.includes('packages/lancer-slim')) {
//       return checked['lancer-slim'].push(item);
//     };

//     if (_url.includes('packages/lancer')) {
//       return checked['lancer'].push(item);
//     };
//   };
// });

// fs.writeFileSync(path.resolve(__dirname, './check.json'), JSON.stringify(checked));