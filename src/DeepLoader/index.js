const allowImportName = {
  require: true,
  import: true,
  getComponent: true,
  getModel: true
};

const loader = ({memo, parse, fileCode}) => {
  try {
    const { body } = parse.program;
    body.forEach((item) => {
      const { type } = item;
      // 在声明语法中 引入
      if (type === 'VariableDeclaration') {
        try {
          const {declarations:body} = item;
          body.forEach((_) => {
            try {
              const hitVariableDeclarator = _.type === 'VariableDeclarator'
              if (hitVariableDeclarator) {
                const {init} = _;
                const {elements} = init;
                elements.forEach((object) => {
                  const { properties } = object;
                  properties.forEach((_) => {
                    const {key, value} = _;
                    try {
                      if (allowImportName[key.name]) {
                        if (allowImportName[value.body?.object?.callee?.name || value.body?.callee?.name]) {
                          if (value.body?.arguments?.length) {
                            value.body.arguments.forEach((_) => {
                              try {
                                const { value: _value } =_;
                                memo._import.push({
                                  from: _value
                                });
                              } catch {}
                            })
                          };
                          if (value.body?.object?.arguments?.length) {
                            value.body?.object?.arguments.forEach((__) => {
                              try {
                                const { value } = __;
                                memo._import.push({
                                  from: value
                                });
                              } catch {};
                            })
                          }
                        }
                      }
                    } catch {}
                  });
                });
              }
            } catch {}
            
          });
        } catch {}
      };
      // 直接在export 语法中引入
      if (type === 'ExportDefaultDeclaration') {
        const { declaration } = item;
        const { body } = declaration;
        const { properties } = body;
        properties.forEach((_) => {
          try {
            const {key, value} = _;
            if (allowImportName[key.name]) {
              const { body } = value;
              const { arguments = [] } = body;
              arguments.forEach((__) => {
                const { value } = __;
                memo._import.push({
                  from: value
                });
              });
            }
          } catch {}
        })
      };
    });
  } catch {};
  return memo;
};

module.exports = loader;