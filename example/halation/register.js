export default function PluginComponent() {
  return {
    name: 'OrderDetailCard',
    getModel: () => require('./model'),
    getComponent: () => require('./index'),
  };
}
