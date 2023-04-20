const allowImportName = {
  require: true,
  import: true,
  getComponent: true
};

const loader = ({memo, parse, fileCode}) => {
  const { _url } = memo;
  const pathList = _url.split('/');
  const latest = pathList[pathList.length - 1];

  if (latest.includes('route') && latest.includes('config')) {
    const { body } = parse.program;
    body.forEach((item) => {
      const { type } = item;
      // 这里限制
      if (type === 'VariableDeclaration') {
        try {
          const {declarations:body} = item;
          const hitVariableDeclarator = body.find((_) => _.type === 'VariableDeclarator');
          if (hitVariableDeclarator) {
            const {init} = hitVariableDeclarator;
            const {elements} = init;
            const [object] = elements;
            const { properties } = object;
            properties.forEach((_) => {
              const {key, value} = _;
              if (allowImportName[key.name]) {
                if (allowImportName[value.body.object.callee.name]) {
                  const { value: _value } = value.body.object.arguments[0];
                  memo._import.push({
                    from: _value
                  });
                }
              }
            });
          }
        } catch {}
      };

      if (type === 'ExportDefaultDeclaration') {}
    });
  };
  return memo;
};

module.exports = loader;