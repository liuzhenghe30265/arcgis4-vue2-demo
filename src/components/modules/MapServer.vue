<template>
  <div id="map-container" style="width:100%;height:100%;">
    <div style="position:absolute;right:50px;top:50px;z-index:999;width:200px;">
      <el-tree :data="treeData2" show-checkbox node-key="id" @check-change="handleCheckChange2" ref="tree2"
        highlight-current>
      </el-tree>
      <hr>
      <el-tree :data="treeData" :props="defaultProps" show-checkbox node-key="id" @check-change="handleCheckChange"
        ref="tree" highlight-current>
      </el-tree>
    </div>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
export default {
  name: 'MapServer',
  data() {
    return {
      SF311Layer: null,
      DamageAssessmentLayer: null,
      haveSublayers: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData2: [
        {
          label: 'SF311',
          id: 'SF311',
        },
        {
          label: 'DamageAssessment',
          id: 'DamageAssessment',
        },
      ],
      treeData: [
        {
          label: 'Cities',
          id: 0,
        },
        {
          label: 'Highways',
          id: 1,
        },
        {
          label: 'States',
          id: 2,
        },
        {
          label: 'Counties',
          id: 3,
        },
      ],
      map: '',
      MapView: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/Graphic',
        'esri/symbols/TextSymbol',
        'esri/layers/GraphicsLayer',
        "esri/geometry/Point",
        'esri/geometry/SpatialReference',
        'esri/layers/MapImageLayer',
        'esri/layers/FeatureLayer',
        'esri/widgets/Feature',
        'esri/layers/TileLayer',
        'esri/Basemap',
        'esri/WebMap',
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 单个图层切换
     */
    handleCheckChange2() {
      let checked = this.$refs.tree2.getCheckedKeys()
      this.SF311Layer.visible = false
      this.DamageAssessmentLayer.visible = false
      if (checked.indexOf('SF311') > -1) {
        this.SF311Layer.visible = true
      }
      if (checked.indexOf('DamageAssessment') > -1) {
        this.DamageAssessmentLayer.visible = true
      }
    },

    /**
     * @name: 图层切换（子图层）
     */
    handleCheckChange() {
      let checked = this.$refs.tree.getCheckedKeys()
      // 当复选框被点击时，先把所有子图层都设置隐藏
      let allSublayers = this.haveSublayers.allSublayers.items
      allSublayers.forEach(item => {
        item.visible = false
      })
      // 显示选中的子图层
      checked.forEach(item => {
        allSublayers[item].visible = true
      })
    },

    /**
     * @name: 地图点击
     */
    mapClickFun() {
      this.MapView.on('click', e => {
        console.log(e)
      })
    },

    /**
     * @name: 加载图层
     */
    loadLayersFun() {
      // 单个图层
      this.SF311Layer = new this.gisConstructor.MapImageLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer',
        layerId: 'SF311',
        visible: false,
      })
      // add() 方法第二个参数是层级
      this.map.add(this.SF311Layer, 2)
      this.DamageAssessmentLayer = new this.gisConstructor.MapImageLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
        layerId: 'DamageAssessment',
        visible: false,
      })
      this.map.add(this.DamageAssessmentLayer, -1)

      // 有子图层
      this.haveSublayers = new this.gisConstructor.MapImageLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        layerId: 2,
        sublayers: [
          {
            id: 0,
            visible: false
          },
          {
            id: 1,
            visible: false
          },
          {
            id: 2,
            visible: false
          },
          {
            id: 3,
            visible: false
          },
        ],
      })
      this.map.add(this.haveSublayers)
    },

    /**
     * @name: 初始化地图
     */
    init() {
      // 加载 css
      esriLoader.loadCss(
        'https://js.arcgis.com/4.16/esri/themes/light/main.css'
      )
      // 加载模块
      esriLoader.loadScript({
        url: 'https://js.arcgis.com/4.16/init.js',
        dojoConfig: {
          async: false
        }
      })
      loadModules(this.gisModules)
        .then(this.initMap)
        .then(this.loadLayersFun)
        .then(this.mapClickFun)
    },
    initMap(args) {
      // 将 ArcGIS 的每个功能模块都存放到 gisConstructor 中
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
      this.map = new this.gisConstructor.Map({
        basemap: 'hybrid'
      })

      this.MapView = new this.gisConstructor.MapView({
        container: 'map-container',
        map: this.map,
        center: [-99, 39],
        zoom: 3
      })

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

