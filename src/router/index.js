import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '初始化',
    component: resolve => require(['@/components/index.vue'], resolve),
  },
  {
    path: '/InitMap',
    name: '初始化',
    component: resolve => require(['@/components/modules/InitMap.vue'], resolve),
  },
  {
    path: '/CustomSymbols',
    name: '自定义标注',
    component: resolve => require(['@/components/modules/CustomSymbols.vue'], resolve),
  },
  {
    path: '/TrackPlayback',
    name: '轨迹回放',
    component: resolve => require(['@/components/modules/TrackPlayback.vue'], resolve),
  },
  {
    path: '/HighLight',
    name: '高亮',
    component: resolve => require(['@/components/modules/HighLight.vue'], resolve),
  },
  {
    path: '/MapServer',
    name: 'MapServer',
    component: resolve => require(['@/components/modules/MapServer.vue'], resolve),
  },
]

const router = new VueRouter({
  routes
})

export default router