<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div style="position:fixed;width:400px;left:50px;top:50px;z-index:999;"
         id="feature-node"
         class="esri-widget"></div>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
export default {
  name: 'HighLight',
  data() {
    return {
      map: '',
      MapView: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/widgets/Feature',
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 地图点击
     */
    mapClickFun() {
      this.MapView.on('click', e => {
        console.log(e)
      })
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
        center: [-74, 41.5],
        zoom: 10,
      })

      // 添加一个要素图层（官网）
      // https://developers.arcgis.com/javascript/latest/sample-code/widgets-feature-sidepanel/index.html
      // 高亮效果需要用 FeatureLayer 才能实现，如果有子图层，怎么解决？
      const fLayer = new this.gisConstructor.FeatureLayer({
        portalItem: {
          id: "f430d25bf03744edbb1579e18c4bf6b8"
        },
        layerId: 2,
        outFields: ['*'],
      })
      this.map.add(fLayer)


      let _this = this
      this.MapView.when(() => {
        const graphic = {
          popupTemplate: {
            content: 'Mouse over features to show details...'
          }
        }
        const feature = new _this.gisConstructor.Feature({
          container: 'feature-node',
          graphic: graphic,
          map: _this.map,
          spatialReference: _this.MapView.spatialReference
        })

        _this.MapView.whenLayerView(fLayer).then(function (layerView) {
          let highlight
          _this.MapView.on('pointer-move', function (event) {
            _this.MapView.hitTest(event).then(function (event) {
              const results = event.results.filter(function (result) {
                return result
              })
              if (results.length > 0) {
                const result = results[0]
                // 固定弹窗内容
                const popupTemplate = {
                  title: '{NAME}',
                  content: '<h1>{County}</h1><h1>{GEOID}</h1><h1>{State}</h1>'
                }
                const data = result.graphic.attributes
                if (result.graphic.attributes) {
                  // 弹窗随鼠标移动
                  const data = result.graphic.attributes
                  _this.MapView.popup.open({
                    title: data.NAME,
                    content: '<h1>' + data.County + '</h1><h1>' + data.GEOID + '</h1><h1> ' + data.State + '</h1>',
                    location: event.results[0].mapPoint
                  })
                }
                console.log(data)
                fLayer.popupTemplate = popupTemplate
                highlight && highlight.remove()
                if (result) {
                  feature.graphic = result.graphic
                  highlight = layerView.highlight(result.graphic)
                } else {
                  feature.graphic = graphic
                }
              }
            })
          })
        })

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

