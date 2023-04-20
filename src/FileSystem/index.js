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
      const fileMini = f.slice(-3, f.length);
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
};

module.exports = FileSystem;