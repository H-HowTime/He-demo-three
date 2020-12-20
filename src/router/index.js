import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/teacher',
    name: '谷粒在线讲师系统',
    // 当前路由不在页面显示
    hidden: true
  },

  {
  //   path: '/teacher',
  //   component: Layout,
  //   redirect: '/teacher/list',
  //   name: 'Teacher',
  //   // title 路由显示的名称 icon 图标
  //   meta: { title: '谷粒在线后台管理系统' },
  //   children: [{
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    name: 'Teacher',
    // title 路由显示的名称 icon 图标
    meta: { title: '讲师管理', icon: 'tree' },
    children: [
      {
        path: 'list',
        name: 'TeacherList',
        component: () => import('@/views/teacher/list'), // @表示当前项目的src目录
        meta: { title: '讲师列表', icon: 'eye' }
      },
      {
        path: 'save',
        name: 'SaveTeacher',
        component: () => import('@/views/teacher/form'),
        meta: { title: '添加讲师', icon: 'link' }
      },
      {
        path: 'update/:id', // 访问update路由路径：、teacher/update/1 那么就会被当前配置匹配，然后使用id接收1参数
        name: 'UpdateTeacher',
        hidden: true, // 和新增使用同一个页面，不需要显示在页面中
        component: () => import('@/views/teacher/form'),
        meta: { title: '更新讲师', icon: 'link' }
      }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
