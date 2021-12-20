<template>
  <div>
    <div
      id="map-container"
      style="width:100%;height:100%;position: fixed;">
    </div>
    <div
      style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
        @click="addCustomSymbols()">自定义标注</button>
      <button
        @click="clearCustomSymbols()">清除标注</button>
      <button
        @click="goTo()">goto</button>
    </div>
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
      $ChildMap: null,
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

    const option = {
      el: 'map-container',
      type: '3D',
      // 如果设置了 extent，center 和 zoom 失效
      // extent: {
      //   xmin: -117.1839455,
      //   ymin: 32.68087830000002,
      //   xmax: -117.15035189999998,
      //   ymax: 32.732100979999984,
      // },
      // extent: {
      //   xmin: -178.217598382,
      //   ymin: 18.921786345999976,
      //   xmax: -66.96927110500002,
      //   ymax: 71.40623554799998,
      // },
      camera: {
        position: [-74.0338, 40.6913, 707], // New York
        tilt: 81,
        heading: 50
      },
      // center: [-74, 41.5],
      // zoom: 10,
      // 初始化地图时要加载的所有图层服务服务
      initLayers: [
        {
          portalItem: {
            id: "2e0761b9a4274b8db52c4bf34356911e"
          },
          // url: "https://scene.arcgis.com/arcgis/rest/services/Hosted/Building_Hamburg/SceneServer/layers/0",
          // url: 'http://server1041.esrichina.com/arcgisserver/rest/services/Hosted/Scene_JS_WSL1/SceneServer',
          popupEnabled: false,
          layerType: 'SceneServiceLayer',
          visible: true
        },
        {
          id: '自定义标注图层',
          title: '自定义标注图层',
          visible: true,
          layerType: 'GraphicsLayer'
        },
        {
          portalItem: {
            id: 'f430d25bf03744edbb1579e18c4bf6b8'
          },
          layerId: 'HighLightLayer',
          id: 'HighLightLayer',
          title: '高亮',
          outFields: ['*'],
          visible: false,
          layerType: 'FeatureLayer',
        },
        {
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer',
          id: 'SF311',
          visible: false,
          layerType: 'MapImageLayer',
        },
        {
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
          id: 'DamageAssessment',
          visible: false,
          layerType: 'MapImageLayer',
          zIndex: 2
        },
        {
          url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
          id: 'USA',
          layerType: 'MapImageLayer',
          // 有子图层
          sublayers: [
            {
              id: 0,
              title: 'Cities',
              visible: false
            },
            {
              id: 1,
              title: 'Highways',
              visible: false
            },
            {
              id: 2,
              title: 'States',
              visible: false
            },
            {
              id: 3,
              title: 'Counties',
              visible: false
            },
          ],
        }
      ]
    }
    this.$Map.init(option)
  },
  methods: {
    goTo () {
      this.$Map.goTo(
        {
          x: 117.717534,
          y: 39.011454,
          z: 700000,
          spatialReference: {
            wkid: 4326
          }
        }
      )
    },
    clearCustomSymbols () {
      this.$Map.clearSymbolsByLayerID('自定义标注图层')
    },
    addCustomSymbols () {
      this.$Map.goTo(
        {
          x: -117.17144023442182,
          y: 32.713787459203424,
          z: 700000,
          spatialReference: {
            wkid: 4326
          }
        }
      )

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
.esri-view {
  .esri-view-surface::after {
    display: none;
  }
}
</style>
