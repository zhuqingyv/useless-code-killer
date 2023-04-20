const fs = require('fs');
const { eachSync } = require('rd');

class FileSystem {
  constructor({ excludes = [], includes = [] }) {
    this.excludes = excludes;
    this.includes = includes;
  };

  filter = (...arg) => {
    const [,path,] = arg;
    const { excludes } = this;

    // Only has excludes option!
    if (excludes?.length) {
      const hasExcludes = excludes.find((exName) => {
        return exName === path;
      });

      if (hasExcludes) return false;
    };

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
      if (!status.isDirectory() && hit(url)) {
        callback({
          url,
          status
        });
      };
    });
  };
};

module.exports = FileSystem;