export default () => {
  return {
    name: 'OrderDetailCard',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),
  };
}
