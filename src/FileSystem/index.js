const fs = require('fs');
const { eachSync } = require('rd');

class FileSystem {
  constructor({ excludes = [], includes = [] }) {
    this.excludes = excludes;
    this.includes = includes;
  };

  filter = (path) => {
    const { excludes } = this;
    if (!excludes?.length) return true;

    const pathList = path.split('/');
    const hit = pathList.some((item) => excludes.includes(item));
    if (hit) return false;
    return true;
  };

  eachSync = (dirPath, callback) => {
    const { includes } = this;
    const hit = (f) => {
      if (!includes?.length) return true;
      const { type } = this._fileInfo(f.split('/'));
      const fileMini = `.${type}`;
      return !!includes.find((mini) => {
        return mini === fileMini;
      })
    };
    eachSync(dirPath, (url, status) => {
      if (!status.isDirectory() && this.filter(url) && hit(url)) {
        callback({
          url,
          status
        });
      };
    });
  };

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
  }
};

module.exports = FileSystem;