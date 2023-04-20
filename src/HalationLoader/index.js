const fs = require('fs');

const allowImportName = {
  require: true,
  import: true
};

const _local = (pathList) => {
  const list = [];
  pathList.forEach((str) => {
    if (str === '..') {
      return list.pop();
    };
    list.push(str);
  });
  return list;
};

const loader = ({memo, parse, fileCode}) => {
  const { _url } = memo;
  const pathList = _url.split('/');
  const latest = pathList[pathList.length - 1];
  const [name] = latest.split('.');
  if (name === 'register') {
    const { body } = parse.program;
    body.forEach((item) => {
      const { type } = item;
      // 这里限制
      if (type === 'ExportDefaultDeclaration') {
        try {
          const { body } = item.declaration.body;
          const returnBody = body.find((_) => _.type === 'ReturnStatement');
          if (!returnBody) throw '';
          // body.body[0].argument.properties
          const { properties } = returnBody.argument;
          properties.forEach((_) => {
            try {
              const { body } = _.value;
              const { type, callee, arguments } = body;
              // 这里一定是一个函数
              if (type === 'CallExpression') {
                const [valueItem] = arguments;
                const {value} = valueItem;
                const {name} = callee;
                if (allowImportName[name]) {
                  // const { _url } = memo;
                  // const list = _url.split('/').filter((_) => !!_);
                  // list.pop();
                  // const importPath = value.split('/').filter((_) => !!_ && _ !== '.');
                  // const pathResult = _local(list.concat(importPath));
                  // 检查文件夹下同名文件
                  memo._import.push({
                    from: value
                  });
                };
              };
            } catch {}
          }, []);
        } catch {}
      };
    });
  };
  return memo;
};

module.exports = loader;