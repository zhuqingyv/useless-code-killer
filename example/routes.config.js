import trackerTemplate from '@xhs/protobuf-armor-tracker/tracker_template';

const routes = [
  {
    path: 'address/create',
    name: 'AddressCreate',
    getComponent: () =>
      require('./routes-test').default,
    navigationOptions: () => ({
      header: null,
    }),

    meta: {
      check: ['isLogin'],
      pageInstance: 'address_create_view',
      getPageEnd() {
        return trackerTemplate[24343]();
      },
    },
  },
];

export default routes;
