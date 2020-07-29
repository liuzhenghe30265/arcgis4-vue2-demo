<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-28 17:44:30
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-07-28 18:29:37
 * @Descripttion: 初始化地图
--> 

<template>
  <div id="map-container"
    style="width:100%;height:100%;">
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
export default {
  name: 'InitMap',
  data() {
    return {
      map: '',
      MapView: '',
      gisConstructor: {}, // gis 构造函数
      gisModules: ['esri/views/MapView', 'esri/Map']
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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

