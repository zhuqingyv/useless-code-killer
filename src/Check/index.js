const rootPath = process.cwd() + '/';

class Checker {
  constructor({ alias, context }) {
    this.alias = alias;
    this.context = context;
  };

  check = (list, callback, retry) => {
    this.callback = callback;
    this.retry = retry;
    const useFullList = list.filter((item, i) => {
      this.context.progressBar.tick();
      const isUseless = this.ifUseless({item, list}, i);
      if (isUseless && this.callback && this.callback instanceof Function) this.callback('useless', item, i);
      return !isUseless;
    });
    return useFullList;
  };

  ifUseless = ({ item, list }, i) => {
    // 未输出文件直接过滤掉
    const { _export } = item;
    if (!_export?.length) {
      if (!this.retry && this.callback && this.callback instanceof Function) this.callback('entry', item, i);
      return false;
    };
    const useful = list.find((other) => {
      const isImported = this._ifImported(item, other);
      return isImported;
    });

    const isUseless = !useful;

    return isUseless;
  };

  _ifImported = (target, other) => {
    // if (target._url === '/Users/my/my-project/useless-code-killer/example/a-all/a-all.js' && other._url === '/Users/my/my-project/useless-code-killer/example/all.js') {
    //   debugger;
    // }
    // if (target._url === '/Users/my/my-project/useless-code-killer/example/x.x.x.x.config/x.x.x.x.config.js' && other._url === '/Users/my/my-project/useless-code-killer/example/index.js') {
    //   debugger;
    // }
    // if (target._url === '/Users/my/my-project/useless-code-killer/example/halation/register.js'&& other._url === '/Users/my/my-project/useless-code-killer/example/index.js') {
    //   debugger;
    // }
    // if (target._url === '/Users/my/my-project/useless-code-killer/example/halation/halationState.ts' && other._url === '/Users/my/my-project/useless-code-killer/example/halation/index.js') {
    //   debugger;
    // }
    if (target._url === '/Users/my/my-project/useless-code-killer/example/routes-test/index.js' && other._url === '/Users/my/my-project/useless-code-killer/example/all.js')
    // filter self
    if (target._url === other._url) return false;

    const targetLocalPath = this._localPath('', target._url);
    const otherLocalPath = this._localPath('', other._url);

    const hasImported = other._import.find((_importItem) => {
      const [firstPath, ...rest] = this._localPath('', _importItem.from);
      const hitAlias = this.alias[firstPath]
      // 命中alias
      if (hitAlias) {
        const fullPath = `${hitAlias}/${rest.join('/')}`;
        const fullPathList = fullPath.replace(rootPath, '').split('/').filter((_) => !!_);
        const isEqual = this._ifLocalPathEqual(targetLocalPath, fullPathList);
        return isEqual;
      } else {
        const root = otherLocalPath.concat();
        root.pop();
        const otherFromLocalPath = root.concat(this._localPath('', _importItem.from));
        // 路径是否相等
        const isEqual = this._ifLocalPathEqual(targetLocalPath, this._local(otherFromLocalPath));
        return isEqual;
      };
    });

    return !!hasImported;
  };

  _localPath = (basePath = '', url) => {
    return `${basePath}${url}`.replace(rootPath, '').split('/').filter((string) => {
      if (string === '.' || string === '') return false;
      return true;
    })
  };

  _ifLocalPathEqual = (target, other) => {
    // 如果层级就不一样，不相等
    // if (target.length !== other.length) return false;
    const otherHasMinitype = this._hasMiniType(other);
    // TODO: 补全alias
    // 全名称情况
    if (otherHasMinitype) {
      const isFalsy = target.find((item, i) => {
        return item !== other[i];
      });
  
      if (isFalsy) return false;
      return true;
    };

    // 不含名称引入
    const { name, type } = this._fileInfo(target);
    const otherFileName = other[other.length - 1];

    // 省略index 的情况
    // import x from 'x';
    if (name === 'index' && otherFileName !== 'index') {
      const newOther = other.concat();
      newOther.push(`index.${type}`);

      const isFalsy = target.find((item, i) => {
        return item !== newOther[i];
      });
      if (isFalsy) return false;
      return true;
    };

    // 单纯省略index后缀
    // import x from './index';
    // if (name === 'index' && otherFileName === 'index') {
      
    // };
    const newOther = other.concat();
    newOther[newOther.length - 1] = `${otherFileName}.${type}`;
    const isFalsy = target.find((item, i) => {
      return item !== newOther[i];
    });
    if (isFalsy) return false;
    return true;
  };

  // 是否存在文件
  _hasMiniType = (pathList) => {
    const latest = pathList[pathList.length - 1];
    const nameList = latest.split('.');
    const type = nameList.slice(-1);
    return ['js', 'ts', 'tsx', 'jsx'].includes(type)
  };

  // 文件信息
  _fileInfo = (pathList) => {
    const latest = pathList[pathList.length - 1];
    const nameList = latest.split('.');
    if (nameList?.length >= 3) {
      const type = nameList.slice(-1);
      const name = nameList.slice(0, nameList.length - 1).join('.');
      return { name, type };
    } else {
      const [name, type] = latest.split('.');
      return {name, type};
    };
  };

  _local = (pathList) => {
    const list = [];
    pathList.forEach((str) => {
      if (str === '..') {
        return list.pop();
      };
      list.push(str);
    });
    return list;
  };

  _alias = () => {
    const { alias } = this;
  };
};

module.exports = Checker;