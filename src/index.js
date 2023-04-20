const fs = require('fs');
const path = require('path');
const FileSystem = require('./FileSystem/index.js');
const Analysis = require('./Analysis/index.js');
const Record = require('./Record/index.js');
const Checker = require('./Check/index.js');
const Reporter = require('./Reporter/index.js');

const defaultConfig = (options = {}) => {
  const rootPath = process.cwd();
  const _default = {
    includes: ['.js', '.jsx', '.ts', '.tsx'],
    excludes: [`${rootPath}/node_modules`]
  };

  return {
    ..._default,
    ...options
  }
};

class UselessCodeKiller {
  record = new Record();
  checker = new Checker();
  reporter = new Reporter();

  loader = {
    import: [],
    export: []
  };

  constructor(options) {
    this.options = defaultConfig(options);
    // 初始化插件
    this.initLoader();
    // 初始化系统
    this.init();
    // 开始遍历文件
    this.startEach();
    // 找出无用文件
    this.check();
  };

  initLoader = () => {
    const { loader } = this.options;
    if (!loader?.length) return;

    loader.forEach((_loader) => {
      const { type, handle } = _loader;

      switch(type) {
        case 'import': {
          this.loader.import.push(handle);
          break;
        }
        case 'export': {
          this.loader.export.push(handle);
          break;
        }
      }
    });
  };

  init = () => {
    // 初始化文件系统
    const { includes, excludes } = this.options;
    this.fileSystem = new FileSystem({
      includes,
      excludes
    });

    this.analysis = new Analysis({ loader: this.loader });
  };

  startEach = () => {
    const { dir } = this.options;
    this.fileSystem.eachSync(dir, this.filter);
    this.record.save();
  };

  filter = ({url}) => {
    this.analysis.analysis({ url, callback: this.record.push });
  };

  // 揪出无用文件
  check = (retry = false) => {
    const latestList = this.record.historyList[this.record.historyList.length - 1];
    const newList = this.checker.check(latestList, this.reporter.push, retry);

    // 说明有删减
    if (newList.length !== latestList.length) {
      // 保存
      this.record._save(newList.concat());
      this.check(true);
    };

    this.end();
  };

  end = () => {
    const value = this.reporter.output();
    fs.writeFileSync(path.resolve(__dirname, './.result.json'), value);
  };
};

module.exports = {
  UselessCodeKiller,
  defaultConfig
};