import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import router from '@/router'

const driverObj = driver({
  showProgress: true,
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  doneBtnText: '完成',
  steps: [
    {
      element: '.baseInfoBox',
      popover: {
        title: '数据量概览',
        description: '下方图表数据皆是基于以上数据量基础进行绘制',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#cdc',
      popover: {
        title: '课程发布趋势',
        description: '以课程发布趋势为例',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#interval',
      popover: {
        title: '间隔一天查看',
        description:
          '当指定日期范围为一月内，可选择每两天为一次数据；当指定日期范围大于一个月，则以月为单位呈现',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#cdcBtn',
      popover: {
        title: '更多',
        description: '点击此处可以详细查看各院/各专业/各班的课程发布数据',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({ path: 'commentTags/index' })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.mainArea',
      popover: {
        title: '建议维度配置',
        description: '用于提供学生评价时可以选择的建议维度',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({ path: '/dimension/index' })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.mainArea',
      popover: {
        title: '能力维度配置',
        description: '用于设置不同二课类型下默认能力维度占比',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#info',
      popover: {
        title: '详情',
        description: '用于查看该活动类型能力维度下的评价主题',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({ path: '/dimension/index/dimensionDetail' })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '#theme',
      popover: {
        title: '评价主题配置',
        description: '能力维度下设有评价主题，每个评价主题下又可以设有多个评价词汇（用于学生评价）',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({ path: '/semester/semesterObjectives' })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.container',
      popover: {
        title: '修读规划',
        description: '新建并查看各年级学期（校级管理员可操作),点击详情可设置该学期最低二课分数',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({
            path: '/nested/lessonsManage',
          })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '#mainArea',
      popover: {
        title: '课程管理',
        description: '发布劳动二课',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '.detailTag',
      popover: {
        title: '',
        description: '用于查看二课详细信息，如：签到二维码发布，参与情况',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({
            path: '/nested/examine',
          })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '#bg',
      popover: {
        title: '课程审核',
        description: '用于审核二课参加人员',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({
            path: '/word/template',
          })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.container',
      popover: {
        title: '考评模板',
        description: '添加评价模板，用于教师快速评价',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({
            path: '/report/batch',
          })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.container',
      popover: {
        title: '年度报告',
        description: '生成学生的年度报告',
        side: 'left',
        align: 'start',
        onNextClick: () => {
          router.push({
            path: '/studentPersonalPlan/index',
          })
          setTimeout(() => {
            driverObj.moveNext()
          }, 1 * 1000)
        },
      },
    },
    {
      element: '.container',
      popover: {
        title: '学生个人计划',
        description: '用于查看学生个人制定的二课计划',
        side: 'left',
        align: 'start',
      },
    },
  ],
})

export function guidePage() {
  const now = new Date().toLocaleDateString()
  //  const time = Date.parse(new Date(now));
  const time = Date.parse(now)
  localStorage.setItem('firstLogin', JSON.stringify(time))
  driverObj.drive()
}
