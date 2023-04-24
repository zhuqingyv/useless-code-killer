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
    const memo = {
      _url: url,
      _import: [],
      _export: [],
      _isEmpty: false
    };
    const fileCode = fs.readFileSync(url, { encoding: 'utf-8' });
    const parse = babelParser.parse(fileCode, {
      sourceType: 'module',
      plugins: ['jsx', 'tsx', 'typescript'],
    });
    const { program: {body} } = parse;
    
    if (!body.length) {
      memo._isEmpty = true;
      this.callback(memo);
      return;
    };

    body.forEach((item) => {
      try {
        const { type } = item;
        const isImport = this._import.includes(type);
        if (isImport) memo._import.push(this.importReportData(item));

        const isExport = this._export.includes(type);
        if (isExport) memo._export.push(this.exportReporterData(item));

        // export * from 'xx';
        if (type === 'ExportAllDeclaration') {
          const { source } = item;
          memo._import.push({ from: source.value });
          memo._export.push({ type: 'default' });
        };
      } catch {}
    });

    const { loader } = this;

    if (!loader?.length) return callback(memo);
    try {
      const newMemo = loader.reduce((pre, cur) => {
        return cur({ memo: pre, parse, fileCode });
      }, memo);
      callback(newMemo);
    } catch {
      return callback(newMemo);
    };
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