<template>
  <div
    id="app">
    <div
      id="map-container"
      style="width:100%;height:100%;">
    </div>
    <!-- <div
      class="nav">
      <router-link
        v-for="item of routes"
        :key="item.name"
        :to="item.path">
        {{item.name}}
      </router-link>
    </div> -->
    <div
      style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
        @click="addCustomSymbols()">自定义标注</button>
      <button
        @click="clearCustomSymbols()">清除标注</button>
    </div>

    <!-- <div
      class="map-main">
      <router-view />
    </div> -->
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import ArcGIS from '@/utils/InitMap'
export default {
  name: 'App',
  components: {},
  data () {
    return {
      $Map: null,
      routes: []
    }
  },
  watch: {
    // mapMarkerClickData: function (newVal, oldVal) {
    //   console.log('mapMarkerClickData', newVal, oldVal)
    // },
    // mapClickEventData: function (newVal, oldVal) {
    //   console.log('mapClickEventData', newVal, oldVal)
    // },
  },
  computed: {
    ...mapGetters([
      'mapMarkerClickData',
      'mapClickEventData'
    ])
  },
  mounted () {
    this.routes = this.$router.options.routes
    this.$Map = new ArcGIS()
    this.$Map.init('map-container')
  },
  methods: {
    clearCustomSymbols () {
      this.$Map.clearSymbolsByLayerID('自定义标注图层')
    },
    addCustomSymbols () {
      // 添加点
      this.$Map.addPointSymbols(
        [
          {
            text: 'marker1',
            x: -117.17144023442182,
            y: 32.713787459203424,
            type: 1,
          },
          {
            text: 'marker2',
            x: -117.15371619725147,
            y: 32.711187634893705,
            type: 2,
          },
          {
            text: 'marker3',
            x: -117.14968215489304,
            y: 32.70194320151179,
            type: 2,
          },
          {
            text: 'marker4',
            x: -117.18169700169476,
            y: 32.690675253443224,
            type: 3,
          },
          {
            text: 'marker5',
            x: -117.1675778534404,
            y: 32.69674278684837,
            type: 3,
          },
        ]
      )

      // 添加线
      this.$Map.addPolylineSymbols(
        [
          [-117.1977902557841, 32.71447351131593],
          [-117.21907626652629, 32.708479404000755],
          [-117.22714435124307, 32.69425081410677],
          [-117.22208034062295, 32.683632063618255],
          [-117.17178355717574, 32.678358337302186],
          [-117.16543208622849, 32.6827651710909],
        ]
      )

      // 添加面
      this.$Map.addPolygonSymbols(
        [
          [-117.1880055572978, 32.72339170858406],
          [-117.17538844609174, 32.719997843890354],
          [-117.18723308110151, 32.71299307648107],
          [-117.1880055572978, 32.72339170858406]
        ]
      )
    }
  }
}
</script>

<style lang="scss">
.nav {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 999;
  a {
    color: #333;
    &.router-link-exact-active {
      color: red;
    }
  }
}
#map-container {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
}
</style>
