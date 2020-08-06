<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-28 17:46:26
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-07-29 16:32:42
 * @Descripttion: 自定义标注
--> 

<template>
  <div id="map-container"
    style="width:100%;height:100%;">
    <div
      style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
        @click="addCustomSymbols(symbolData)">自定义标注</button>
      <button
        @click="clearCustomSymbols()">清除标注</button>
    </div>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
export default {
  name: 'InitMap',
  data() {
    return {
      customSymbolsLayer: '',//自定义标注图层
      symbolData: [
        {
          address: '昆俞北路明旭社区明盛园4号楼',
          x: 117.29548,
          y: 39.16232
        },
        {
          address: '津北公路',
          x: 117.432727,
          y: 39.080622
        },
        {
          address: '华明街弘顺道金泰丽湾嘉园7号楼',
          x: 117.365064,
          y: 39.163788
        }],
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
        'esri/geometry/SpatialReference'
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    /**
     * @name: 清除标注
     * @param {type} 
     */
    clearCustomSymbols() {
      this.MapView.graphics.removeAll()
    },
    /**
     * @name: 添加自定义标注
     * @param {type} 
     */
    addCustomSymbols(data) {
      this.clearCustomSymbols()
      let img = require(`@/assets/images/ico.png`)
      let graphics = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].x && data[i].y) {
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
            url: img,
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
            text: data[i].address,
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
      this.MapView.graphics.addMany(graphics)
    },

    mapClickFun() {
      this.map.on('click', e => {
        console.log(e)
      })
    },

    // 初始化地图
    init() {
      // 加载 css
      esriLoader.loadCss(
        'https://js.arcgis.com/4.8/esri/themes/light/main.css'
      )
      // 加载模块
      esriLoader.loadScript({
        url: 'https://js.arcgis.com/4.8/init.js',
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
        basemap: 'osm'
      })
      this.MapView = new this.gisConstructor.MapView({
        container: 'map-container',
        map: this.map,
        center: [117.36599976909781, 39.1470299097626],
        zoom: 12
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

