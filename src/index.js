const fs = require('fs');
let table = require("table");
var ProgressBar = require('progress');
const FileSystem = require('./FileSystem/index.js');
const Analysis = require('./Analysis/index.js');
const Record = require('./Record/index.js');
const Checker = require('./Check/index.js');
const Reporter = require('./Reporter/index.js');
const halationLoader = require('./HalationLoader/index.js');
const routesLoader = require('./RouterLoader/index.js');
const deepLoader = require('./DeepLoader/index');

const defaultConfig = (options = {}) => {
  const _default = {
    includes: ['.js', '.jsx', '.ts', '.tsx'],
    excludes: ['node_modules'],
    alias: {}
  };

  return {
    ..._default,
    ...options
  }
};

class UselessCodeKiller {
  record = new Record();
  reporter = new Reporter();

  loader = [];

  constructor(options) {
    this.options = defaultConfig(options);
    // 初始化插件
    this.initLoader();
    // 初始化系统
    this.init();
    // 开始遍历文件
    this.startEach();
    // 找出无用文件
    console.log('开始检查无用文件!');
    this.check();
  };

  initLoader = () => {
    const { loader } = this.options;
    if (!loader?.length) return;

    this.loader.push(...loader);
  };

  init = () => {
    // 初始化文件系统
    const { includes, excludes } = this.options;
    this.fileSystem = new FileSystem({
      includes,
      excludes
    });

    this.analysis = new Analysis({ loader: this.loader });
    this.checker = new Checker({ alias: this.options.alias, context: this })
  };

  startEach = () => {
    console.log('开始搜索文件');
    const { dir } = this.options;
    this.fileSystem.eachSync(dir, this.filter);
    console.log(`文件总数: ${this.record.currentList.length }`);
    this.progressBar = new ProgressBar('  checking [:bar] :rate/bps :percent :etas', {
      total: this.record.currentList.length,
      width: 40,
      complete: '=',
      incomplete: ' ',
    });
    this.record.save();
  };

  filter = ({url}) => {
    try {
      this.analysis.analysis({ url, callback: this.record.push});
    } catch (error) {
      // debugger;
    };
  };

  // 揪出无用文件
  check = (retry = false) => {
    const latestList = this.record.historyList[this.record.historyList.length - 1];
    const newList = this.checker.check(latestList, this.reporter.push, retry);
    // 说明有删减
    if (newList.length !== latestList.length && this.retry) {
      // 保存
      this.record._save(newList.concat());
      this.check(true);
    };

    this.end();
  };

  end = () => {
    const value = this.reporter.output();
    const uselessCount = this.reporter.data.useless?.length || 0;
    const entryCount = this.reporter.data.entry?.length || 0;
    console.info(`[entry]: ${entryCount}`);
    console.info(`[useless]: ${uselessCount}`);
    const { outputDir } = this.options;
    fs.writeFileSync(outputDir, value);
  };
};

module.exports = {
  UselessCodeKiller,
  halationLoader,
  routesLoader,
  deepLoader,

  defaultConfig
};