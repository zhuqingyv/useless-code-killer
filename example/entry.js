// 没有文件类型
import noMiniType from './noMiniType';
// 没有文件类型并且非 index 文件名
import noMiniTypeWithoutIndex from './noMiniType/noMiniTypeWithoutIndex';
// export * from
import all from './exportAll';
// routerLoader
const routes = [
  {
    getComponent: () => require('./routerLoader').default,
  }
];
// halation && router loader
const routes2 = [
  {
    getComponent: () => require('./HalationLoader/halationState').default,
  },
  {
    getComponent: () => require('./routerLoader')
  }
];
