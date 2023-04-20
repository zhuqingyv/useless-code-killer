const rootPath = process.cwd() + '/';

class Checker {
  check = (list, callback, retry) => {
    this.callback = callback;
    this.retry = retry;
    const useFullList = list.filter((item) => {
      const isUseless = this.ifUseless({item, list});
      if (isUseless && this.callback && this.callback instanceof Function) this.callback('useless', item);
      return !isUseless;
    });
    return useFullList;
  };

  ifUseless = ({ item, list }) => {
    // 未输出文件直接过滤掉
    const { _export } = item;
    if (!_export?.length) {
      if (!this.retry && this.callback && this.callback instanceof Function) this.callback('entry', item);
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
    // filter self
    if (target._url === other._url) return false;

    const targetLocalPath = this._localPath('', target._url);
    const otherLocalPath = this._localPath('', other._url);

    const hasImported = other._import.find((_importItem) => {
      const root = otherLocalPath.concat();
      root.pop();
      const otherFromLocalPath = root.concat(this._localPath('', _importItem.from));
      // 路径是否相等
      const isEqual = this._ifLocalPathEqual(targetLocalPath, otherFromLocalPath);
      return isEqual;
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
    if (target.length !== other.length) return false;
    // TODO: 补全文件类型
    // TODO: 补全alias
    const isFalsy = target.find((item, i) => {
      return item !== other[i];
    });

    if (isFalsy) return false;
    return true;
  };
};

module.exports = Checker;