import Vue from 'vue'
import VueRouter from 'vue-router'
import state from '@/store/index'
import App from '../App'
import { Toast } from 'vant'

const home = () => import('../views/home/home.vue')
const city = () => import('../views/city/city.vue')
const msite = () => import('../views/msite/msite.vue')
const search = () => import('../views/search/search.vue')
const order = () => import('../views/order/order.vue')
const profile = () => import('../views/profile/profile.vue')
const info = () => import('../views/profile/children/info.vue')
const food = () => import('../views/food/food.vue')
const shop = () => import('../views/shop/shop.vue')
const login = () => import('../views/login/login.vue')
const confirmOrder = () => import('../views/confirmOrder/confirmOrder.vue')
const chooseAddress = () => import('../views/confirmOrder/children/chooseAddress')
const addAddress = () => import('../views/confirmOrder/children/children/addAddress')
const searchAddress = () => import('../views/confirmOrder/children/children/children/searchAddress')
const payment = () => import('@/views/confirmOrder/children/payment.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App, // 顶级路由，对应index.html
    children: [ // 二级路由。对应App.vue
      // 地址为空时跳转home页面
      {
        path: '',
        redirect: '/home'
      },
      // 首页城市列表页
      {
        path: '/home',
        name: 'home',
        component: home
      },
      // 当前选择城市页
      {
        path: '/city/:cityid',
        name: 'city',
        component: city
      },
      // 当前选择城市页
      {
        path: '/msite',
        name: 'msite',
        component: msite,
        meta: {
          footer: true
        }
      },
      // 当前选择搜索页
      {
        path: '/search/:geohash',
        name: 'search',
        component: search,
        meta: {
          footer: true
        }
      },
      // 当前选择订单页
      {
        path: '/order',
        name: 'order',
        component: order,
        meta: {
          footer: true
        }
      },
      // 当前选择个人资料页
      {
        path: '/profile',
        name: 'profile',
        component: profile,
        meta: {
          footer: true
        },
        children: [
          {
            path: 'info',
            component: info
          }
        ]
      },
      // 商铺详情页
      {
        path: '/food',
        component: food
      },
      // 商铺详情页
      {
        path: '/shop',
        component: shop
      },
      // 商铺详情页
      {
        path: '/login',
        component: login
      },
      // 确认订单页
      {
        path: 'confirmOrder',
        component: confirmOrder,
        children: [{
          path: 'chooseAddress', // 选择地址
          component: chooseAddress,
          children: [{
            path: 'addAddress', // 添加地址
            component: addAddress,
            children: [{
              path: 'searchAddress', // 搜索地址
              component: searchAddress
            }]
          }]
        },
        {
          path: 'payment',
          component: payment
        }]
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const userInfo = state.state.userInfo
  if (to.path === '/profile/info' && !userInfo) {
    Toast('未登录')
    next('/login')
  } else {
    next()
  }
})

export default router
