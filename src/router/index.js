import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/competition',
    component: Layout,
    redirect: '/competition/list',
    name: '赛事管理',
    meta: { title: '赛事管理', icon: 'el-icon-s-operation' },
    children: [
      {
        path: '/competition/list',
        component: () => import('@/views/competition/index'),
        meta: { title: '赛事管理', icon: 'table' }
      },
      {
        path: '/competition/addCompetition',
        component: () => import('@/views/competition/addCompetition'),
        meta: { title: '新增赛事', noCache: true, activeMenu: '/competition/list' },
        hidden: true
      },
      {
        path: '/competition/editCompetition',
        component: () => import('@/views/competition/addCompetition'),
        meta: { title: '编辑赛事', noCache: true, activeMenu: '/competition/list' },
        hidden: true
      },
      {
        path: '/competition/projectManagement',
        component: () => import('@/views/competition/projectManagement'),
        meta: { title: '项目管理', noCache: true, activeMenu: '/competition/list' },
        hidden: true
      }
    ]
  },
  {
    path: '/competition/competitors',
    component: () => import('@/views/competition/competitors'),
    name: '参赛选手',
    meta: { title: '参赛选手', icon: 'el-icon-user' }
  },
  {
    path: '/competition/battleTree',
    component: () => import('@/views/competition/battleTree'),
    name: '对战图',
    meta: { title: 'battle', icon: 'tree-table' }
  },
  {
    path: '/competition/1v1battle',
    component: () => import('@/views/competition/1v1battle'),
    name: '1v1battle',
    meta: { title: '1v1battle', icon: '' }
  },
  {
    path: '/competition/champion',
    component: () => import('@/views/competition/champion'),
    name: 'champion',
    meta: { title: 'champion', icon: '' }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
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
