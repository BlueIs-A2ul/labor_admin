import { createRouter, createWebHistory } from 'vue-router'

/* Layout */
export const Layout = () => import('@/layout/index.vue')
import type { Awaitable } from 'element-plus/es/utils/typescript.mjs'

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
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },

  {
    //path: '/:pathMatch(.*)*',
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/permission',
    component: Layout,
    alwaysShow: true,
    name: 'Permission',
    meta: {
      title: '权限控制',
      icon: 'lock',
      breadNum: 1,
      roles: ['userRoleCtrl', 'permissionsTree', 'permissionRoleCtrl'],
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/permission/userRole/index.vue'),
        name: 'RolePermission',
        meta: {
          title: '用户权限',
          roles: ['userRoleCtrl'],
          breadNum: 2,
          icon: 'user',
        },
      },
      {
        path: 'permissionTree',
        name: 'permissionTree',
        component: () => import('@/views/permission/tree/permissionTree.vue'),
        meta: {
          title: '系统权限树',
          breadNum: 2,
          roles: ['permissionsTree'],
          icon: 'password',
        },
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/permission/role/role.vue'),
        meta: {
          title: '权限角色',
          breadNum: 2,
          roles: ['permissionRoleCtrl'],
          icon: 'peoples',
        },
      },
    ],
  },
  {
    path: '/userControl',
    name: 'userControl',
    component: Layout,
    meta: {
      roles: ['userManage'],
    },
    children: [
      {
        path: 'index',
        name: 'userControlIndex',
        component: () => import('@/views/teaAndStu/teacherManage/index.vue'),
        meta: {
          title: '教师管理',
          roles: ['userManage'],
          icon: 'peoples',
        },
      },
    ],
  },
  {
    path: '/dimension',
    name: 'dimension',
    component: Layout,
    meta: {
      title: '能力维度配置',
      roles: ['dimensionManage'],
      icon: 'el-icon-help',
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/dimension/index.vue'),
        hidden: true,
        meta: {
          title: '能力维度配置',
          roles: ['dimensionManage'],
          icon: 'el-icon-help',
          showFather: true,
          keepAlive: true,
          breadNum: 2,
          activeMenu: '/dimension',
        },
        children: [
          {
            path: 'dimensionDetail',
            component: () => import('@/views/dimension/children/detail-page.vue'),
            name: 'dimensionDetail',
            hidden: true,
            meta: {
              showFather: false,
              keepAlive: false,
              activeMenu: '/dimension',
              roles: ['dimensionManage'],
              breadNum: 3,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/commentTags',
    name: 'commentTags',
    component: Layout,
    meta: {
      roles: ['complainManage'],
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/commenTags/index.vue'),
        meta: {
          title: '建议维度配置',
          roles: ['complainManage'],
          icon: 'el-icon-chat-line-square',
        },
      },
    ],
  },
  {
    path: '/department',
    name: 'departmentPage',
    component: Layout,
    meta: {
      title: '院系管理',
      roles: ['department'],
      icon: 'el-icon-office-building',
    },
    children: [
      {
        path: 'index',
        name: 'department',
        component: () => import('@/views/department/index.vue'),
        meta: {
          title: '学院管理',
          roles: ['department'],
          icon: 'el-icon-office-building',
        },
      },
      {
        path: 'major',
        name: 'Major',
        component: () => import('@/views/department/major/index.vue'),
        meta: {
          title: '专业管理',
          roles: ['majorManage'],
          icon: 'el-icon-reading',
        },
      },
    ],
  },
  {
    path: '/example',
    component: Layout,
    meta: {
      roles: ['stuManage'],
      title: '学生管理',
    },
    children: [
      {
        path: 'stuManage',
        name: 'stuManage',
        component: () => import('@/views/teaAndStu/studentsManage/index.vue'),
        meta: {
          title: '学生管理',
          roles: ['stuManage'],
          breadNum: 2,
          icon: 'tree',
        },
      },
    ],
  },
  {
    path: '/semester',
    component: Layout,
    redirect: '/semester/semesterObjectives',
    meta: {
      title: '修读规划',
      breadNum: 2,
      roles: ['semestersAndObjectives'],
      icon: 'el-icon-school',
    },
    children: [
      {
        path: 'semesterObjectives',
        component: () => import('@/views/studentPlan/index.vue'),
        name: 'semesters',
        meta: {
          title: '规划信息',
          activeMenu: '/semester',
          roles: ['semestersAndObjectives'],
          showFather: true,
          breadNum: 1,
        },
        hidden: true,
        children: [
          {
            path: 'categoryObjectives',
            component: () => import('@/views/studentPlan/children/categoryObjectives.vue'),
            name: 'categoryObjectives',
            meta: {
              title: '课程类别规划',
              activeMenu: '/semester',
              roles: ['semestersAndObjectives'],
              hidden: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/chartInfo',
    component: Layout,
    alwaysShow: false,
    hidden: true,
    name: 'chartInfo',
    meta: {
      breadNum: 1,
    },
    children: [
      {
        path: 'courseCount',
        component: () => import('@/views/dashboard/component/courseCount.vue'),
        name: 'courseCount',
        meta: {
          title: '课程发布趋势详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/courseCount',
        },
      },
      {
        path: 'categoryChart',
        component: () => import('@/views/dashboard/component/categoryChart.vue'),
        name: 'categoryChart',
        meta: {
          title: '课程分类详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/categoryChart',
        },
      },
      {
        path: 'sixStandardChart',
        component: () => import('@/views/dashboard/component/sixStandardChart.vue'),
        name: 'sixStandardChart',
        meta: {
          title: '六种活动类型达标详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/sixStandardChart',
        },
      },
      {
        path: 'threeStandardChart',
        component: () => import('@/views/dashboard/component/threeStandardChart.vue'),
        name: 'threeStandardChart',
        meta: {
          title: '三种维度达标详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/threeStandardChart',
        },
      },
      {
        path: 'userCountChart',
        component: () => import('@/views/dashboard/component/userCountChart.vue'),
        name: 'userCountChart',
        meta: {
          title: '参与人次详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/userCountChart',
        },
      },
      {
        path: 'wordCloud',
        component: () => import('@/views/dashboard/component/wordCloud.vue'),
        name: 'wordCloud',
        meta: {
          title: '词云详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/wordCloud',
        },
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/lessonsManage',
    alwaysShow: true,
    name: 'lessonsService',
    meta: {
      title: '课程服务',
      breadNum: 1,
      icon: 'nested',
      roles: ['coursesManage', 'examine'],
    },
    children: [
      {
        path: 'lessonsManage',
        component: () => import('@/views/course/index.vue'), // Parent router-view
        name: 'lessonsManage',
        meta: {
          title: '课程管理',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          icon: 'el-icon-school',
          activeMenu: '/nested/lessonsManage',
          roles: ['coursesManage', 'evaluatePage'],
        },
        children: [
          {
            path: 'lessonDetail',
            component: () => import('@/views/course/components/lessonDetail.vue'),
            name: 'lessonDetail',
            meta: {
              title: '二课详情',
              showFather: false,
              showEvaluate: false,
              keepAlive: false,
              activeMenu: '/nested/lessonsManage',
              roles: ['coursesManage', 'examine', 'evaluatePage'],
              breadNum: 2,
            },
            hidden: true,
            children: [
              {
                path: 'introduction',
                component: () => import('@/views/course/evaluate/index.vue'),
                name: 'introduction',
                meta: {
                  title: '课程考评',
                  showFather: false,
                  showEvaluate: true,
                  activeMenu: '/nested/lessonsManage',
                  roles: ['evaluatePage'],
                  breadNum: 3,
                },
              },
            ],
          },
        ],
      },
      {
        path: 'examine',
        component: () => import('@/views/nested/menu1/index.vue'),
        redirect: '/nested/examine/examinePage',
        name: 'examineIndex',
        meta: {
          title: '报名审核',
          breadNum: 1,
          icon: 'el-icon-s-check',
          roles: ['examine'],
        },
        children: [
          {
            path: 'examinePage',
            component: () => import('@/views/course/examine/index.vue'),
            name: 'examine',
            meta: {
              title: '报名审核',
              roles: ['examine'],
              breadNum: 2,
              activeMenu: '/nested/examine',
            },
            hidden: true,
          },
        ],
      },
      {
        path: 'examineRecord',
        name: 'examineRecord',
        component: () => import('@/views/course/examine/examineRecord.vue'),
        meta: {
          title: '审核记录',
          breadNum: 2,
          icon: 'el-icon-receiving',
          roles: ['examine'],
        },
      },
    ],
  },
  {
    path: '/word',
    name: 'Word',
    redirect: 'index',
    component: Layout,
    meta: {
      title: '词汇与模板',
      roles: [
        'templateAndWordManage',
        'templateAndWordManage.wordManage',
        'templateAndWordManage.wordTypeManage',
        'templateAndWordManage.templateManage',
      ],
      icon: 'el-icon-collection',
    },
    children: [
      {
        path: 'index',
        name: 'WordIndex',
        component: () => import('@/views/word/index.vue'),
        meta: {
          title: '词汇管理',
          roles: ['templateAndWordManage.wordManage'],
          icon: 'el-icon-collection',
        },
      },
      {
        path: 'type',
        name: 'WordType',
        component: () => import('@/views/word/wordType/index.vue'),
        meta: {
          title: '词汇类型',
          roles: ['templateAndWordManage.wordTypeManage'],
          icon: 'el-icon-files',
        },
      },
      {
        path: 'template',
        component: () => import('@/views/word/template/index.vue'),
        name: 'template',
        meta: {
          title: '考评模板',
          roles: ['templateAndWordManage.templateManage'],
          breadNum: 2,
          icon: 'el-icon-receiving',
        },
      },
    ],
  },
  {
    path: '/report',
    name: 'Report',
    redirect: 'batch',
    component: Layout,
    meta: {
      title: '年度报告',
      roles: ['annulReportManage'],
      icon: 'el-icon-cloudy',
    },
    children: [
      {
        path: 'batch',
        name: 'ReportBatch',
        component: () => import('@/views/report/batch/index.vue'),
        meta: {
          title: '报告列表',
          roles: ['annulReportManage'],
          icon: 'el-icon-cloudy',
        },
      },
      {
        path: 'batchReportDetails',
        name: 'BatchReportDetails',
        hidden: true,
        component: () => import('@/views/report/batch/batchReportDetails.vue'),
        meta: {
          title: '年度报告详情',
          roles: ['annulReportManage'],
          icon: 'el-icon-cloudy',
        },
      },
    ],
  },
  {
    path: '/score',
    component: Layout,
    redirect: 'index',
    name: 'scoreService',
    meta: {
      title: '积分服务',
      icon: 'el-icon-star-on',
      roles: [
        'scoreService',
        'scoreService.scoreRecord',
        'scoreService.rankList',
        'scoreService.scoreManage',
      ],
    },
    children: [
      {
        path: 'index',
        name: 'rankList',
        component: () => import('@/views/scoreRankingList/index.vue'),
        meta: {
          title: '积分排行榜',
          icon: 'el-icon-s-data',
          roles: ['scoreService.rankList'],
        },
      },
      {
        path: 'scoreManage',
        name: 'scoreManage',
        component: () => import('@/views/scoreManage/index.vue'),
        meta: {
          title: '积分管理',
          icon: 'el-icon-s-order',
          roles: ['scoreService.scoreManage'],
        },
      },
      {
        path: 'scoreRecord',
        component: () => import('@/views/scoreRecord/index.vue'),
        name: 'scoreRecord',
        meta: {
          title: '积分记录',
          icon: 'el-icon-tickets',
          roles: ['scoreService.scoreRecord'],
        },
      },
    ],
  },
  {
    path: '/studentPersonalPlan',
    name: 'studentPersonalPlan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'studentPersonalPlanIndex',
        component: () => import('@/views/studentPersonalPlan/index.vue'),
        meta: {
          title: '学生个人计划',
          icon: 'el-icon-document-copy',
          roles: ['studentPersonalPlan'],
        },
      },
    ],
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'questionnaireIndex',
        component: () => import('@/views/questionnaire/index.vue'),
        meta: {
          title: '问卷调查',
          icon: 'el-icon-s-order',
          roles: ['questionManage'],
        },
      },
    ],
  },
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
// 路由权限词配置在roles中
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    alwaysShow: true,
    name: 'Permission',
    meta: {
      title: '权限控制',
      icon: 'lock',
      breadNum: 1,
      roles: ['userRoleCtrl', 'permissionsTree', 'permissionRoleCtrl'],
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/permission/userRole/index.vue'),
        name: 'RolePermission',
        meta: {
          title: '用户权限',
          roles: ['userRoleCtrl'],
          breadNum: 2,
          icon: 'user',
        },
      },
      {
        path: 'permissionTree',
        name: 'permissionTree',
        component: () => import('@/views/permission/tree/permissionTree.vue'),
        meta: {
          title: '系统权限树',
          breadNum: 2,
          roles: ['permissionsTree'],
          icon: 'password',
        },
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/permission/role/role.vue'),
        meta: {
          title: '权限角色',
          breadNum: 2,
          roles: ['permissionRoleCtrl'],
          icon: 'peoples',
        },
      },
    ],
  },
  {
    path: '/userControl',
    name: 'userControl',
    component: Layout,
    meta: {
      roles: ['userManage'],
    },
    children: [
      {
        path: 'index',
        name: 'userControlIndex',
        component: () => import('@/views/teaAndStu/teacherManage/index.vue'),
        meta: {
          title: '教师管理',
          roles: ['userManage'],
          icon: 'peoples',
        },
      },
    ],
  },
  {
    path: '/dimension',
    name: 'dimension',
    component: Layout,
    meta: {
      title: '能力维度配置',
      roles: ['dimensionManage'],
      icon: 'el-icon-help',
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/dimension/index.vue'),
        hidden: true,
        meta: {
          title: '能力维度配置',
          roles: ['dimensionManage'],
          icon: 'el-icon-help',
          showFather: true,
          keepAlive: true,
          breadNum: 2,
          activeMenu: '/dimension',
        },
        children: [
          {
            path: 'dimensionDetail',
            component: () => import('@/views/dimension/children/detail-page.vue'),
            name: 'dimensionDetail',
            hidden: true,
            meta: {
              showFather: false,
              keepAlive: false,
              activeMenu: '/dimension',
              roles: ['dimensionManage'],
              breadNum: 3,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/commentTags',
    name: 'commentTags',
    component: Layout,
    meta: {
      roles: ['complainManage'],
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/commenTags/index.vue'),
        meta: {
          title: '建议维度配置',
          roles: ['complainManage'],
          icon: 'el-icon-chat-line-square',
        },
      },
    ],
  },
  {
    path: '/department',
    name: 'departmentPage',
    component: Layout,
    meta: {
      title: '院系管理',
      roles: ['department'],
      icon: 'el-icon-office-building',
    },
    children: [
      {
        path: 'index',
        name: 'department',
        component: () => import('@/views/department/index.vue'),
        meta: {
          title: '学院管理',
          roles: ['department'],
          icon: 'el-icon-office-building',
        },
      },
      {
        path: 'major',
        name: 'Major',
        component: () => import('@/views/department/major/index.vue'),
        meta: {
          title: '专业管理',
          roles: ['majorManage'],
          icon: 'el-icon-reading',
        },
      },
    ],
  },
  {
    path: '/example',
    component: Layout,
    meta: {
      roles: ['stuManage'],
      title: '学生管理',
    },
    children: [
      {
        path: 'stuManage',
        name: 'stuManage',
        component: () => import('@/views/teaAndStu/studentsManage/index.vue'),
        meta: {
          title: '学生管理',
          roles: ['stuManage'],
          breadNum: 2,
          icon: 'tree',
        },
      },
    ],
  },
  {
    path: '/semester',
    component: Layout,
    redirect: '/semester/semesterObjectives',
    meta: {
      title: '修读规划',
      breadNum: 2,
      roles: ['semestersAndObjectives'],
      icon: 'el-icon-school',
    },
    children: [
      {
        path: 'semesterObjectives',
        component: () => import('@/views/studentPlan/index.vue'),
        name: 'semesters',
        meta: {
          title: '规划信息',
          activeMenu: '/semester',
          roles: ['semestersAndObjectives'],
          showFather: true,
          breadNum: 1,
        },
        hidden: true,
        children: [
          {
            path: 'categoryObjectives',
            component: () => import('@/views/studentPlan/children/categoryObjectives.vue'),
            name: 'categoryObjectives',
            meta: {
              title: '课程类别规划',
              activeMenu: '/semester',
              roles: ['semestersAndObjectives'],
              hidden: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/chartInfo',
    component: Layout,
    alwaysShow: false,
    hidden: true,
    name: 'chartInfo',
    meta: {
      breadNum: 1,
    },
    children: [
      {
        path: 'courseCount',
        component: () => import('@/views/dashboard/component/courseCount.vue'),
        name: 'courseCount',
        meta: {
          title: '课程发布趋势详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/courseCount',
        },
      },
      {
        path: 'categoryChart',
        component: () => import('@/views/dashboard/component/categoryChart.vue'),
        name: 'categoryChart',
        meta: {
          title: '课程分类详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/categoryChart',
        },
      },
      {
        path: 'sixStandardChart',
        component: () => import('@/views/dashboard/component/sixStandardChart.vue'),
        name: 'sixStandardChart',
        meta: {
          title: '六种活动类型达标详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/sixStandardChart',
        },
      },
      {
        path: 'threeStandardChart',
        component: () => import('@/views/dashboard/component/threeStandardChart.vue'),
        name: 'threeStandardChart',
        meta: {
          title: '三种维度达标详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/threeStandardChart',
        },
      },
      {
        path: 'userCountChart',
        component: () => import('@/views/dashboard/component/userCountChart.vue'),
        name: 'userCountChart',
        meta: {
          title: '参与人次详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/userCountChart',
        },
      },
      {
        path: 'wordCloud',
        component: () => import('@/views/dashboard/component/wordCloud.vue'),
        name: 'wordCloud',
        meta: {
          title: '词云详情',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          activeMenu: '/chartInfo/wordCloud',
        },
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/lessonsManage',
    alwaysShow: true,
    name: 'lessonsService',
    meta: {
      title: '课程服务',
      breadNum: 1,
      icon: 'nested',
      roles: ['coursesManage', 'examine'],
    },
    children: [
      {
        path: 'lessonsManage',
        component: () => import('@/views/course/index.vue'), // Parent router-view
        name: 'lessonsManage',
        meta: {
          title: '课程管理',
          breadNum: 2,
          keepAlive: true,
          showFather: true,
          icon: 'el-icon-school',
          activeMenu: '/nested/lessonsManage',
          roles: ['coursesManage', 'evaluatePage'],
        },
        children: [
          {
            path: 'lessonDetail',
            component: () => import('@/views/course/components/lessonDetail.vue'),
            name: 'lessonDetail',
            meta: {
              title: '二课详情',
              showFather: false,
              showEvaluate: false,
              keepAlive: false,
              activeMenu: '/nested/lessonsManage',
              roles: ['coursesManage', 'examine', 'evaluatePage'],
              breadNum: 2,
            },
            hidden: true,
            children: [
              {
                path: 'introduction',
                component: () => import('@/views/course/evaluate/index.vue'),
                name: 'introduction',
                meta: {
                  title: '课程考评',
                  showFather: false,
                  showEvaluate: true,
                  activeMenu: '/nested/lessonsManage',
                  roles: ['evaluatePage'],
                  breadNum: 3,
                },
              },
            ],
          },
        ],
      },
      {
        path: 'examine',
        component: () => import('@/views/nested/menu1/index.vue'),
        redirect: '/nested/examine/examinePage',
        name: 'examineIndex',
        meta: {
          title: '报名审核',
          breadNum: 1,
          icon: 'el-icon-s-check',
          roles: ['examine'],
        },
        children: [
          {
            path: 'examinePage',
            component: () => import('@/views/course/examine/index.vue'),
            name: 'examine',
            meta: {
              title: '报名审核',
              roles: ['examine'],
              breadNum: 2,
              activeMenu: '/nested/examine',
            },
            hidden: true,
          },
        ],
      },
      {
        path: 'examineRecord',
        name: 'examineRecord',
        component: () => import('@/views/course/examine/examineRecord.vue'),
        meta: {
          title: '审核记录',
          breadNum: 2,
          icon: 'el-icon-receiving',
          roles: ['examine'],
        },
      },
    ],
  },
  {
    path: '/word',
    name: 'Word',
    redirect: 'index',
    component: Layout,
    meta: {
      title: '词汇与模板',
      roles: [
        'templateAndWordManage',
        'templateAndWordManage.wordManage',
        'templateAndWordManage.wordTypeManage',
        'templateAndWordManage.templateManage',
      ],
      icon: 'el-icon-collection',
    },
    children: [
      {
        path: 'index',
        name: 'WordIndex',
        component: () => import('@/views/word/index.vue'),
        meta: {
          title: '词汇管理',
          roles: ['templateAndWordManage.wordManage'],
          icon: 'el-icon-collection',
        },
      },
      {
        path: 'type',
        name: 'WordType',
        component: () => import('@/views/word/wordType/index.vue'),
        meta: {
          title: '词汇类型',
          roles: ['templateAndWordManage.wordTypeManage'],
          icon: 'el-icon-files',
        },
      },
      {
        path: 'template',
        component: () => import('@/views/word/template/index.vue'),
        name: 'template',
        meta: {
          title: '考评模板',
          roles: ['templateAndWordManage.templateManage'],
          breadNum: 2,
          icon: 'el-icon-receiving',
        },
      },
    ],
  },
  {
    path: '/report',
    name: 'Report',
    redirect: 'batch',
    component: Layout,
    meta: {
      title: '年度报告',
      roles: ['annulReportManage'],
      icon: 'el-icon-cloudy',
    },
    children: [
      {
        path: 'batch',
        name: 'ReportBatch',
        component: () => import('@/views/report/batch/index.vue'),
        meta: {
          title: '报告列表',
          roles: ['annulReportManage'],
          icon: 'el-icon-cloudy',
        },
      },
      {
        path: 'batchReportDetails',
        name: 'BatchReportDetails',
        hidden: true,
        component: () => import('@/views/report/batch/batchReportDetails.vue'),
        meta: {
          title: '年度报告详情',
          roles: ['annulReportManage'],
          icon: 'el-icon-cloudy',
        },
      },
    ],
  },
  {
    path: '/score',
    component: Layout,
    redirect: 'index',
    name: 'scoreService',
    meta: {
      title: '积分服务',
      icon: 'el-icon-star-on',
      roles: [
        'scoreService',
        'scoreService.scoreRecord',
        'scoreService.rankList',
        'scoreService.scoreManage',
      ],
    },
    children: [
      {
        path: 'index',
        name: 'rankList',
        component: () => import('@/views/scoreRankingList/index.vue'),
        meta: {
          title: '积分排行榜',
          icon: 'el-icon-s-data',
          roles: ['scoreService.rankList'],
        },
      },
      {
        path: 'scoreManage',
        name: 'scoreManage',
        component: () => import('@/views/scoreManage/index.vue'),
        meta: {
          title: '积分管理',
          icon: 'el-icon-s-order',
          roles: ['scoreService.scoreManage'],
        },
      },
      {
        path: 'scoreRecord',
        component: () => import('@/views/scoreRecord/index.vue'),
        name: 'scoreRecord',
        meta: {
          title: '积分记录',
          icon: 'el-icon-tickets',
          roles: ['scoreService.scoreRecord'],
        },
      },
    ],
  },
  {
    path: '/studentPersonalPlan',
    name: 'studentPersonalPlan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'studentPersonalPlanIndex',
        component: () => import('@/views/studentPersonalPlan/index.vue'),
        meta: {
          title: '学生个人计划',
          icon: 'el-icon-document-copy',
          roles: ['studentPersonalPlan'],
        },
      },
    ],
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'questionnaireIndex',
        component: () => import('@/views/questionnaire/index.vue'),
        meta: {
          title: '问卷调查',
          icon: 'el-icon-s-order',
          roles: ['questionManage'],
        },
      },
    ],
  },
  // 如果需要配置重定向404页面的话，需要配置在asyncRoutes的最后
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  scrollBehavior: () => ({ x: 0, y: 0 }) as Awaitable<ScrollOptions>,
  routes: constantRouterMap,
})

// 重置路由的方法
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ x: 0, y: 0 }) as Awaitable<ScrollOptions>,
    routes: constantRouterMap,
  })

  router.getRoutes().forEach((route) => {
    if (route.name) {
      router.removeRoute(route.name)
    }
  })
  newRouter.getRoutes().forEach((route) => {
    router.addRoute(route)
  })
}

export default router
