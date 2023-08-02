<template>
  <div id="map-container"
    style="width:100%;height:100%;">
    <div
      style="position:absolute;right:50px;top:50px;z-index:999;">
      <button
        @click="showTrackPlayback(trackPlayback)">轨迹回放</button>
      <div v-if="trackPlayback.show"
        class="track-playback-control">
        <button
          @click="startTrackPlaybackFun(trackPlayback)">开始</button>
        <button
          @click="stopTrackPlaybackFun()">停止</button>
      </div>
    </div>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
import pathData from '@/mock/path.json'
export default {
  name: 'InitMap',
  data() {
    return {
      trackPlayback: {
        path: [[117.40101868999427, 39.13125244009548], [117.4090009440226, 39.130520066614935], [117.41131837261146, 39.136179118276075], [117.40342194927162, 39.13677828535539]], // 路径
        moveLayer: null,// 运动图层
        pathLayer: null, // 轨迹图层
        movingInterval: null, // 运动定时任务
        show: false
      },
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
    let result = pathData.data
    let path = []
    for (let i = 0; i < result.length; i++) {
      path[i] = [result[i].x, result[i].y]
    }
    this.trackPlayback.path = path
  },
  methods: {
    /**
     * @name: 清除轨迹运动
     */
    clearTrackPlaybackFun() {
      this.trackPlayback.moveLayer.graphics.removeAll()
      this.trackPlayback.pathLayer.graphics.removeAll()
      clearInterval(this.trackPlayback.movingInterval)
    },

    /**
     * @name: 停止运动
     */
    stopTrackPlaybackFun() {
      this.trackPlayback.movingInterval = clearInterval(this.trackPlayback.movingInterval)
    },

    /**
     * @name: 开始播放轨迹
     */
    startTrackPlaybackFun() {
      this.drawMoving(0, 1, this.trackPlayback.path, this.trackPlayback.moveLayer)
    },

    /**
     * @name: 动态绘制轨迹
     * @param {startIndex} 开始位置
     * @param {stopIndex} 停止位置
     * @param {path} 路径
     * @param {moveLayer} 运动图层
     * @param {graphic}
     */
    drawMoving(startIndex, stopIndex, path, moveLayer, graphic) {
      let endIndex = path.length
      if (stopIndex < endIndex) {
        if (!graphic) {
          let people = {
            type: 'point',
            longitude: path[startIndex][0],
            latitude: path[startIndex][1]
          }
          let peopleSimpleMark = {
            type: 'picture-marker',
            url: require(`@/assets/images/ico02.png`),
            width: 24,
            height: 24
          }
          graphic = new this.gisConstructor.Graphic({
            geometry: people,
            symbol: peopleSimpleMark
          })
        }
        // 定时器
        let index = 0
        this.trackPlayback.movingInterval = setInterval(() => {
          if (index === path.length) {
            clearInterval(this.trackPlayback.movingInterval)
          } else {
            index += 1
            let people = {
              type: 'point',
              longitude: path[index - 1][0],
              latitude: path[index - 1][1]
            }
            let peopleSimpleMark = {
              type: 'picture-marker',
              url: require(`@/assets/images/ico03.png`),
              width: 32,
              height: 32
            }
            graphic = new this.gisConstructor.Graphic({
              geometry: people,
              symbol: peopleSimpleMark
            })
            moveLayer.graphics = [graphic]
          }
        }, 50)
      }

    },

    /**
     * @name: 绘制轨迹线路
     * @param {type} 
     */
    drawTrackPlaybackFun(data) {
      let pathData = data.path
      // 路径图层
      this.trackPlayback.pathLayer = new this.gisConstructor.GraphicsLayer()

      // 起点
      let startPoint = pathData[0]
      let point1 = {
        type: "point",
        longitude: startPoint[0],
        latitude: startPoint[1]
      }
      let startMarkerSymbol = {
        type: "simple-marker"
      }
      let startPointGraphic = new this.gisConstructor.Graphic({
        geometry: point1,
        symbol: startMarkerSymbol
      })
      this.trackPlayback.pathLayer.add(startPointGraphic)

      // 定位到起点位置
      this.updataCenterPoint(startPoint, 16)

      // 终点
      let endPoint = pathData[pathData.length - 1]
      let point2 = {
        type: "point",
        longitude: endPoint[0],
        latitude: endPoint[1]
      }
      let endMarkerSymbol = {
        type: "simple-marker"
      }
      let endPointGraphic = new this.gisConstructor.Graphic({
        geometry: point2,
        symbol: endMarkerSymbol
      })
      this.trackPlayback.pathLayer.add(endPointGraphic)

      // 路线
      let polyline = {
        type: 'polyline',
        paths: this.trackPlayback.path
      }
      let polylineSymbol = {
        type: 'simple-line',
        color: [226, 119, 40],
        width: 2
      }
      let polylineGraphic = new this.gisConstructor.Graphic({
        geometry: polyline,
        symbol: polylineSymbol
      })
      this.trackPlayback.pathLayer.add(polylineGraphic)
      this.map.add(this.trackPlayback.pathLayer)

      // 轨迹图层
      this.trackPlayback.moveLayer = new this.gisConstructor.GraphicsLayer()
      this.map.add(this.trackPlayback.moveLayer)
    },

    /**
     * @name: 轨迹回放控制
     */
    showTrackPlayback(data) {
      this.trackPlayback.show = !this.trackPlayback.show
      if (this.trackPlayback.show) {
        this.drawTrackPlaybackFun(data)
      } else {
        this.clearTrackPlaybackFun()
      }
    },

    /**
     * @name: 切换地图中心点并缩放
     * @param {point} 目标位置
     * @return {zoom} 缩放等级
     */
    updataCenterPoint(point, zoom) {
      let opts = {
        duration: 500
      }
      let centerPoint = new this.gisConstructor.Point({
        longitude: point[0],
        latitude: point[1],
        // spatialReference: {
        //   wkid: 4490
        // }
      })
      this.MapView.goTo(
        {
          target: centerPoint,
          zoom: zoom || 14
        },
        opts
      )
    },

    mapClickFun() {
      this.MapView.on('click', e => {
        console.log(e)
      })
    },

    // 初始化地图
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
        center: [-117.15693484806934, 32.70501274849578],
        zoom: 15
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

