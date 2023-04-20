class Record {
  currentList = [];
  historyList = [];

  constructor() {};

  push = (memo) => {
    this.currentList.push(memo);
  };

  save = () => {
    if (this.currentList?.length) {
      this._save(this.currentList.concat());
      this.currentList = [];
    }
  };

  _save = (list = []) => {
    if (list?.length) this.historyList.push(list);
  };
};

module.exports = Record;