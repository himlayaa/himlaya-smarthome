import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '设备', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'measure',
        name: 'Measure',
        component: () => import('@/views/measure/index'),
        meta: { title: '检测', icon: 'table' }
      },
      {
        path: 'control',
        name: 'Control',
        component: () => import('@/views/control/index'),
        meta: { title: '控制', icon: 'tree' }
      }
    ]
  },

  {
    path: '/modify',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Modify',
        component: () => import('@/views/modify/index'),
        meta: { title: '更改用户信息', icon: 'form' }
      }
    ]
  },

  

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/himlayaa/himlaya-smarthome/',
        meta: { title: '项目地址', icon: 'link' }
      }
    ]
  },

  {
    path: '/score',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'score',
        component: () => import('@/views/score/index'),
        meta: { title: '反馈评价', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
