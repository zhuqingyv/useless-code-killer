// 没有后缀
import useful from "./useful";
// 匹配路径
import alias from "alias"
// 多.情况
import './config/sentry.config';
// routerLoader
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
// halation
import register from './halation/register';
// export * from
export * from './a-all/a-all';