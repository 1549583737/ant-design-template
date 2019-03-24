import BasicLayout from '@/layouts/BasicLayout'

export default {
  path: '/tableList',
  name: 'tableList',
  hidden: false,
  redirect: '/tableList',
  meta: {
    name: 'tableList',
    icon: 'dashboard'
  },
  component: BasicLayout,
  children: [{
    path: '',
    name: 'tableList_list',
    meta: {
      name: 'list'
    },
    component: () => import('./list')
  },{
    path: '/test',
    name: 'tableList_test',
    meta: {
      name: 'test'
    },
    component: () => import('./test')
  }]
}
