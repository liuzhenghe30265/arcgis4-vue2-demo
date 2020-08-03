<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-29 16:36:28
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-08-03 18:41:29
 * @Descripttion: 轨迹回放
--> 

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
// eslint-disable-next-line no-unused-vars
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
        stopPoint: [], // 暂停的位置
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
     * @name: 停止运动
     */
    stopTrackPlaybackFun() {
      this.trackPlayback.movingInterval = clearInterval(this.trackPlayback.movingInterval)
      console.log(this.trackPlayback.stopPoint)
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
      let stopPoint = this.trackPlayback.stopPoint
      let _this = this
      let endIndex = path.length
      if (stopIndex < endIndex) {
        let startX
        let startY
        let stopX = path[stopIndex][0]
        let stopY = path[stopIndex][1]
        if (stopPoint.length > 0) {
          startX = stopPoint[0]
          startY = stopPoint[1]
        } else {
          startX = path[startIndex][0]
          startY = path[startIndex][1]
        }
        // 斜率
        let p = (stopY - startY) / (stopX - startX)
        // 偏移量
        let v = 0.00005
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
        this.trackPlayback.movingInterval = setInterval(() => {
          // 终点下标
          let stopNum = stopIndex
          let newX
          let newY
          // 分别计算x，y轴上的偏移后的坐标
          if (Math.abs(p) === Number.POSITIVE_INFINITY) {
            // 斜率的绝对值为无穷大，斜率不存在，即x轴方向上的偏移量为0
            stopY > startY ? newY = graphic.geometry + v : newY = graphic.geometry - v
            newX = graphic.geometry.x
          } else {
            if (stopX < startX) {
              newX = graphic.geometry.x - (1 / Math.sqrt(1 + p * p)) * v
              newY = graphic.geometry.y - (p / Math.sqrt(1 + p * p)) * v
            } else {
              newX = graphic.geometry.x + (1 / Math.sqrt(1 + p * p)) * v
              newY = graphic.geometry.y + (p / Math.sqrt(1 + p * p)) * v
            }
          }
          // 判断是否开始进行下一段轨迹移动
          if ((graphic.geometry.x - stopX) * (newX - stopX) < 0 || (graphic.geometry.y - stopY) * (newY - stopY) < 0) {
            // 可以开始下一段轨迹移动
            graphic.geometry.x = stopX
            graphic.geometry.y = stopY
            clearInterval(this.trackPlayback.movingInterval)
            startIndex++
            stopIndex++
            if (stopNum < endIndex) {
              _this.drawMoving(startIndex, stopIndex, path, moveLayer, graphic)
            }
          } else {
            let people = {
              type: 'point',
              longitude: newX,
              latitude: newY
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
          this.trackPlayback.stopPoint = [newX, newY]
        }, 50)

      }

    },

    /**
     * @name: 绘制轨迹线路
     * @param {type} 
     */
    drawTrackPlaybackFun(data) {
      let pathData = data.path
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
      console.log('polylineGraphic', polylineGraphic)
      this.trackPlayback.pathLayer.add(polylineGraphic)

      this.trackPlayback.moveLayer = new this.gisConstructor.GraphicsLayer({
        // id: 'moveLayer_' + i
      })
      this.map.add(this.trackPlayback.moveLayer)

      this.map.add(this.trackPlayback.pathLayer)
    },

    /**
     * @name: 轨迹回放控制
     */
    showTrackPlayback(data) {
      this.trackPlayback.show = !this.trackPlayback.show
      this.drawTrackPlaybackFun(data)
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
        zoom: 13
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

