import { AppRouteRecordRaw } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
const menu: AppRouteRecordRaw = {
  name: 'bizdemo:manager',
  path: '/bizdemo/manager',
  component: LAYOUT,
  meta: {
    title: '演示',
    icon: 'icon-qietu-shezhi',
    perms: ['admin', 'bizdemo:manager'],
    orderNo: 100,
    component: 'LAYOUT',
  },
  children: [
    {
      name: 'biz:demo',
      path: '/biz/demo/index',
      component: () => import('/@/views/biz/demo/index.vue'),
      meta: {
        title: '演示',
        icon: 'ion:grid-outline',
        orderNo: 0,
        perms: ['admin', 'biz:demo'],
        component: '/biz/demo/index',
        btns: {
          'biz:demo:page': '分页查询演示',
          'biz:demo:detail': '查看演示详情',
          'biz:demo:save': '添加演示',
          'biz:demo:update': '修改演示',
          'biz:demo:remove': '删除演示',
        },
      },
    },
  ],
};

export default menu;
