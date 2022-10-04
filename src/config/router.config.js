// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.settings' },
    redirect: '/settings',
    children: [
      // settings
      {
        path: '/settings',
        name: 'Settings',
        hideChildrenInMenu: true, // no need to show submenus
        component: () => import('@/views/settings/Workplace'),
        meta: { title: 'menu.settings.workspace', keepAlive: true, permission: ['admin', 'graphviewr'] }
      },
      // package
      {
        path: '/package',
        name: 'Package',
        component: () => import('@/views/package/PackageView/BaseFrame'),
        redirect: '/package/tableview',
        meta: { title: 'menu.package', icon: 'profile', permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/package/tableview',
            name: 'Table View',
            component: () => import('@/views/package/PackageView/BaseFrame'),
            meta: { title: 'menu.package.tableview', permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/package/graphview',
            name: 'Graph View',
            component: () => import('@/views/package/PackageView/BaseFrame'),
            meta: { title: 'menu.package.graphview', permission: ['admin', 'graphviewr'] }
          }
        ]
      },
      {
        path: '/package/PackageInfo/:packageName',
        name: 'Package Help',
        component: () => import('@/views/package/PackageInfo/PackageBase'),
        hidden: true,
        meta: { title: 'menu.package.packageInfo', keepAlive: true, permission: ['admin', 'graphviewr'] }
      },
      // function
      {
        path: '/function/:packageName/:functionName',
        name: 'Function', // add redirect page
        hidden: true,
        component: () => import('@/views/function/FunctionInfo'),
        redirect: '/function/listview/:packageName/:functionName',
        meta: { title: 'menu.function', icon: 'profile', keepAlive: false, permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/function/listview/:packageName/:functionName',
            name: 'List View',
            component: () => import('../views/function/ListView'),
            meta: { title: 'menu.function.ListView', permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/function/examples/:packageName/:functionName',
            name: 'Examples',
            component: () => import('../views/function/Examples'),
            meta: { title: 'menu.function.Examples', permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/function/diagram/:packageName/:functionName',
            name: 'Diagram View',
            component: () => import('../views/function/DiagramView'),
            meta: { title: 'menu.function.DiagramView', permission: ['admin', 'graphviewr'] }
          }
        ]
      },
      // list
      {
        path: '/task',
        name: 'Task',
        component: RouteView,
        redirect: '/task/task-list',
        meta: { title: 'menu.task', icon: 'table', permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/task/task-list',
            name: 'TaskList',
            component: () => import('@/views/list/TaskList'),
            meta: { title: 'menu.task.task-list', keepAlive: true, permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/task/task-log/:pageNo([1-9]\\d*)?',
            name: 'TaskLog',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TaskLog'),
            meta: { title: 'menu.task.task-log', keepAlive: true, permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            hidden: true,
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['admin', 'graphviewr'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['admin', 'graphviewr'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['admin', 'graphviewr'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['admin', 'graphviewr'] }
              }
            ]
          }
        ]
      },
      // Editor
      {
        path: '/editor',
        name: 'Editor',
        component: RouteView,
        redirect: '/editor',
        meta: { title: 'menu.form', icon: 'form', permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/editor',
            name: 'EditorR',
            component: () => import('../views/editor/EditorR'),
            meta: { title: 'menu.form', icon: 'form', keepAlive: false, hiddenHeaderContent: true, permission: ['admin', 'graphviewr'] }
          }
        ]
      },
      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        hidden: true,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['admin', 'graphviewr'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        hidden: true,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['admin', 'graphviewr'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        hidden: true,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['admin', 'graphviewr'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['admin', 'graphviewr'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['admin', 'graphviewr'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['admin', 'graphviewr'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['admin', 'graphviewr']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['admin', 'graphviewr'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['admin', 'graphviewr'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['admin', 'graphviewr']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
