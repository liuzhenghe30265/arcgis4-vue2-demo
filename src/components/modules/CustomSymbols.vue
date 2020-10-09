<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-28 17:46:26
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-10-09 16:58:44
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
  name: 'CustomSymbols',
  data() {
    return {
      customSymbolsLayer: '',// 自定义标注图层
      symbolData: [
        {
          address: 'marker1',
          x: 116.40182752977934,
          y: 39.92476619935702,
          type: 1,
        },
        {
          address: 'marker2',
          x: 116.42764915596571,
          y: 39.949683921105375,
          type: 2,
        },
        {
          address: 'marker3',
          x: 116.48107607733336,
          y: 39.88376327014636,
          type: 2,
        },
        {
          address: 'marker4',
          x: 116.34883914958563,
          y: 39.96384062028598,
          type: 3,
        },
        {
          address: 'marker5',
          x: 116.3174412108573,
          y: 39.86192606545161,
          type: 3,
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
        basemap: 'osm'
      })
      this.MapView = new this.gisConstructor.MapView({
        container: 'map-container',
        map: this.map,
        center: [116.395645038, 39.9299857781],
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

