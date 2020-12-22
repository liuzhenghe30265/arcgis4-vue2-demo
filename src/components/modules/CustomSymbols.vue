<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-28 17:46:26
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-12-22 18:20:19
 * @Descripttion: 自定义标注
--> 

<template>
  <div id="map-container"
       style="width:100%;height:100%;">
    <div
         style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
              @click="addCustomSymbols()">自定义标注</button>
      <button
              @click="clearCustomSymbols()">清除标注</button>
    </div>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
export default {
  name: 'CustomSymbols',
  data() {
    return {
      customSymbolsLayer: '',// 自定义标注图层
      map: '',
      MapView: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: [
        'esri/Graphic',
        'esri/symbols/TextSymbol',
        'esri/layers/GraphicsLayer',
        "esri/geometry/Point",
        'esri/geometry/SpatialReference',
        'esri/geometry/Extent',
        'esri/views/MapView',
        'esri/Map',
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 清除标注
     */
    clearCustomSymbols() {
      this.MapView.graphics.removeAll()
    },

    /**
     * @name: 添加自定义标注
     */
    addCustomSymbols() {
      this.clearCustomSymbols()
      let data = [
        {
          text: 'marker1',
          x: -13043465.062410325,
          y: 3857375.365345625,
          type: 1,
        },
        {
          text: 'marker2',
          x: -13041492.031617718,
          y: 3857031.398718342,
          type: 2,
        },
        {
          text: 'marker3',
          x: -13041042.964076541,
          y: 3855808.4062657813,
          type: 2,
        },
        {
          text: 'marker4',
          x: -13044606.840520333,
          y: 3854317.8842142224,
          type: 3,
        },
        {
          text: 'marker5',
          x: -13043035.104126222,
          y: 3855120.4730112157,
          type: 3,
        },
      ]
      let icon = ''
      let graphics = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].x && data[i].y) {
          if (data[i].type === 1) {
            icon = require('@/assets/images/ico01.png')
          } else if (data[i].type === 2) {
            icon = require('@/assets/images/ico02.png')
          } else {
            icon = require('@/assets/images/ico03.png')
          }
          let point = {
            type: "point", // autocasts as new Point()
            longitude: data[i].x,
            latitude: data[i].y
          }
          // 样式标注
          // let markerSymbol = {
          //   type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          //   color: [226, 119, 40],
          //   outline: {
          //     // autocasts as new SimpleLineSymbol()
          //     color: [255, 255, 255],
          //     width: 2
          //   }
          // }

          // 图片标注
          let pictureMarkerSymbol = {
            type: "picture-marker",
            url: icon,
            width: '40px',
            height: '40px'
          }
          let pointGraphic = new this.gisConstructor.Graphic({
            geometry: point,
            symbol: pictureMarkerSymbol,
            attributes: data[i]
          })
          graphics.push(pointGraphic)

          // 文字标注
          let textsymbol = new this.gisConstructor.TextSymbol({
            text: data[i].text,
            color: '#333',
            yoffset: '20px'
          })
          let textGraphic = new this.gisConstructor.Graphic({
            geometry: point,
            symbol: textsymbol,
            attributes: data[i]
          })
          graphics.push(textGraphic)
        }
      }
      console.log(graphics)
      this.MapView.graphics.addMany(graphics)
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
        let name = this.gisModules[k].split("/").pop()
        this.gisConstructor[name] = args[k]
      }

      this.map = new this.gisConstructor.Map({
        basemap: "osm",
      })
      this.MapView = new this.gisConstructor.MapView({
        container: "map-container",
        map: this.map,
        // center: [116.395645038, 39.9299857781],
        // zoom: 12
      })

      // 设置初始化范围
      let extent = {
        xmin: -117.1839455,
        ymin: 32.68087830000002,
        xmax: -117.15035189999998,
        ymax: 32.732100979999984,
      }
      this.MapView.extent = new this.gisConstructor.Extent(extent, this.MapView.spatialReference)
    },
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

