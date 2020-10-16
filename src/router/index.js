import Vue from 'vue'
import VueRouter from 'vue-router'
import InitMap from '@/components/InitMap'
import CustomSymbols from '@/components/modules/CustomSymbols'
import TrackPlayback from '@/components/modules/TrackPlayback'
import HighLight from '@/components/modules/HighLight'
import MapServer from '@/components/modules/MapServer'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: '初始化',
    component: InitMap,
  },
  {
    path: '/CustomSymbols',
    name: '自定义标注',
    component: CustomSymbols,
  },
  {
    path: '/TrackPlayback',
    name: '轨迹回放',
    component: TrackPlayback,
  },
  {
    path: '/HighLight',
    name: '高亮',
    component: HighLight,
  },
  {
    path: '/MapServer',
    name: 'MapServer',
    component: MapServer,
  },
]

const router = new VueRouter({
  routes
})

export default router