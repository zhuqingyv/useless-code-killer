export default [
  {
    name: 'app',
    key: 'app',
    type: 'block',
  },
  {
    name: 'headerBar',
    key: 'headerBar',
    type: 'block',
    parent: 'app.slot.top',
  },
  {
    name: 'headerTip',
    key: 'headerTip',
    type: 'block',
    parent: 'app.slot.tip',
  },
  {
    name: 'addressList',
    key: 'addressList',
    type: 'block',
    parent: 'app.slot.addressList',
    props: {
      stayAfterSelect: true,
    },
  },
  {
    name: 'bottomBar',
    key: 'bottomBar',
    type: 'block',
    parent: 'app.slot.bottom',
  },
  {
    name: 'deleteAddress',
    key: 'deleteAddress',
    type: 'block',
    parent: null,
  },
  {
    name: 'afterModifyPopup',
    key: 'afterModifyPopup',
    type: 'block',
    parent: null,
  },
];
