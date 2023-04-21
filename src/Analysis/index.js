const babelParser = require('@babel/parser');
const fs = require('fs');


// ExportNamedDeclaration => 自定义名称导出
// ExportDefaultDeclaration => default输出
// ImportDeclaration => import 字段
class Analysis {
  _import = ['ImportDeclaration'];
  _export = ['ExportNamedDeclaration', 'ExportDefaultDeclaration'];

  constructor({ loader }) {
    this.loader = loader;
  };

  urlSetter = () => {};

  analysis = ({ url, callback }) => {
    // 1.记录export语法
    // 2.记录import语法
    // 3.没有export语法记录进waiting列表
    const memo = {
      _url: url,
      _import: [],
      _export: [],
      _isEmpty: false
    };
    const fileCode = fs.readFileSync(url, { encoding: 'utf-8' });
    const parse = babelParser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    const { program: {body} } = parse;
    
    if (!body.length) {
      memo._isEmpty = true;
      this.callback(memo);
      return;
    };

    body.forEach((item) => {
      const { type } = item;
      const isImport = this._import.includes(type);
      if (isImport) return memo._import.push(this.importReportData(item));

      const isExport = this._export.includes(type);
      if (isExport) return memo._export.push(this.exportReporterData(item));
    });

    const { loader } = this;

    if (!loader?.length) return callback(memo);

    const newMemo = loader.reduce((cur) => {
      return cur({ memo: pre, parse, fileCode });
    }, memo);

    callback(newMemo);
  };

  importReportData = (item) => {
    // 来源
    const { source } = item;
    const { value: from } = source;
    return { from };
  };

  exportReporterData = (item) => {
    const type = item.type === 'ExportDefaultDeclaration' ? 'default' : 'const';
    return { type };
  };
};

module.exports = Analysis;