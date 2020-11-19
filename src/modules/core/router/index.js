import base from './base'
import systemManager from './system-manager'
import service from './service'

export default [
  ...base,
  ...systemManager,
  ...service,
  {
    path: 'setting/config',
    component: () => import('../views/setting/Config')
  },
  {
    path: 'setting/program',
    component: () => import('../views/setting/program')
  },
  {
    path: 'setting/form',
    component: () => import('../views/setting/form')
  },
  {
    path: 'calendar/setup',
    component: () => import('../views/calendar/setup')
  },
  {
    path: 'forum/list',
    component: () => import('../views/forum/list')
  },
  {
    path: 'forum/form',
    component: () => import('../views/forum/form')
  },
  {
    path: 'programa/list',
    component: () => import('../views/programa/list')
  },
  {
    path: 'programa/form',
    component: () => import('../views/programa/form')
  },
  {
    path: 'article/list',
    component: () => import('../views/article/list'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'article/form',
    component: () => import('../views/article/form')
  },
  {
    path: 'article/listform',
    component: () => import('../views/article/listform')
  },
  {
    path: 'article/commom',
    component: () => import('../views/article/common')
  },
  {
    path: 'article/punch',
    component: () => import('../views/article/punch')
  },
  {
    path: 'comment/list',
    component: () => import('../views/comment/list')
  },
  {
    path: 'comment/form',
    component: () => import('../views/comment/form')
  },
  {
    path: 'news/list',
    component: () => import('../views/news/list')
  },
  {
    path: 'news/detail',
    component: () => import('../views/news/detail')
  },
  {
    path: 'wishing/list',
    component: () => import('../views/wishing/list')
  },
  {
    path: 'wishing/redeem',
    component: () => import('../views/wishing/redeem')
  },
  // 问卷管理
  {
    path: 'force/list',
    component: () => import('../views/force/list')
  },
  {
    path: 'force/form',
    component: () => import('../views/force/form')
  },
  {
    path: 'force/result',
    component: () => import('../views/force/result')
  },
  // 训练营
  {
    path: 'training/list',
    component: () => import('../views/training/list')
  },
  {
    path: 'training/form',
    component: () => import('../views/training/form')
  },
  {
    path: 'training/member',
    component: () => import('../views/training/member')
  },
  {
    path: 'training/user',
    component: () => import('../views/training/user')
  },
  {
    path: 'training/result',
    component: () => import('../views/training/result')
  },
  {
    path: 'training/punch',
    component: () => import('../views/training/punch')
  },
  {
    path: 'training/punchl',
    component: () => import('../views/training/punchl')
  },
  {
    path: 'training/clocklist',
    component: () => import('../views/training/clocklist')
  },

  {
    path: 'user/list',
    component: () => import('../views/user/List')
  },
  {
    path: 'user/:id',
    component: () => import('../views/user/Detail')
  },
  {
    path: 'wishTree/list',
    component: () => import('../views/wishTree/List')
  },
  // 打卡建议
  {
    path: 'suggest/list',
    component: () => import('../views/suggest/list')
  },
  // 打卡管理
  {
    path: 'punch/list',
    component: () => import('../views/punch/list')
  },
  {
    path: 'punch/detail',
    component: () => import('../views/punch/detail')
  },
  {
    path: 'punch/form',
    component: () => import('../views/punch/form')
  },
  {
    path: 'selftest/list',
    component: () => import('../views/selftest/list')
  },
  {
    path: 'selftest/form',
    component: () => import('../views/selftest/form')
  },
  {
    path: 'selftest/form-edit',
    component: () => import('../views/selftest/form-edit')
  },
  {
    path: 'group/list',
    component: () => import('../views/group/list')
  },
  {
    path: 'group/form',
    component: () => import('../views/group/form')
  },
  {
    path: 'paper/list',
    component: () => import('../views/paper/list')
  },
  {
    path: 'paper/release',
    component: () => import('../views/paper/release')
  },
  {
    path: 'paper/result-edit',
    component: () => import('../views/paper/result-edit')
  },
  {
    path: 'paper/result',
    component: () => import('../views/paper/result')
  },
  {
    path: 'paper/detail',
    component: () => import('../views/paper/result-detail')
  },
  // 数据统计
  {
    path: 'statist/list',
    component: () => import('../views/statist/list')
  }
]
