class Reporter {
  data = {};

  testType = (type) => {
    const list = this.data[type];

    if (!list) {
      this.data[type] = [];
      return this.data[type];
    };

    return list;
  };

  push = (type, data) => {
    const list = this.testType(type);

    list.push(data);
  };

  output = () => {
    return JSON.stringify(this.data);
  };
};

module.exports = Reporter;