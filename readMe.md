### useless-code-killer

``` shell
npm install useless-code-killer
```

### Start

``` javascript
const path = require('path');
const { UselessCodeKiller } = require('useless-code-killer');

const killer = new UselessCodeKiller({
  // your project path
  dir: path.resolve(__dirname, './'),
  // Ignore node_modules or others
  excludes: ['node_modules'],
  // includes file type
  includes: ['.ts', '.tsx', '.js', '.jsx'],
  alias: {
    'alias': path.resolve(__dirname, './example/alias-test')
  },
  // some special file loader
  loader: [],
  // Output a json
  outputDir: path.resolve(__dirname, './result.json'),
  // static
  retry: false
});
```

### Loader

Loader must be a function like this:

``` javascript
const yourLoader = ({ memo, parse, fileCode }) => {
  /**
   * @memo
   * @memo._import { from:string }:[]
   * @memo._export { type:string }:[]
   * @memo._url: string
  */

  /**
   * @parse
   * goto: https://www.npmjs.com/package/@babel/parser
  */

  /**
   * @fileCode { string }
  */

  const newMemo = {
    _import: [],
    _export: [],
  };

  return {
    ...memo,
    ...newMemo
  };
};
module.exports = yourLoader;
```
