<!--
 * @Author: liuzhenghe
 * @Email: 15901450207@163.com
 * @Date: 2020-07-28 17:46:26
 * @LastEditors: liuzhenghe
 * @LastEditTime: 2020-12-25 17:53:06
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
        'esri/layers/FeatureLayer',
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
      // this.MapView.graphics.removeAll()
      this.map.findLayerById('自定义标注图层') ? (() => {
        let layer = this.map.findLayerById('自定义标注图层')
        layer.removeAll()
      })() : void (0)
    },

    /**
     * @name: 添加自定义标注
     */
    addCustomSymbols() {
      this.clearCustomSymbols()
      let layer = this.map.findLayerById('自定义标注图层')
      // 添加点
      let pointList = [
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
      let icon = ''
      pointList.forEach(item => {
        if (item.type === 1) {
          icon = require('@/assets/images/ico01.png')
        } else if (item.type === 2) {
          icon = require('@/assets/images/ico02.png')
        } else {
          icon = require('@/assets/images/ico03.png')
        }
        let point = {
          type: "point",
          longitude: item.x,
          latitude: item.y,
          // spatialReference: this.MapView.spatialReference
        }
        let simpleMarker = {
          type: "simple-marker",
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          },
          // spatialReference: this.MapView.spatialReference
        }
        let simpleMarkerGraphic = new this.gisConstructor.Graphic({
          geometry: point,
          attributes: item,
          symbol: simpleMarker,
          // spatialReference: this.MapView.spatialReference
        })
        layer.add(simpleMarkerGraphic)

        let pictureMarker = {
          type: "picture-marker",
          url: icon,
          width: "32px",
          height: "32px",
          xoffset: "0",
          yoffset: "25px"
        }
        let pictureGraphic = new this.gisConstructor.Graphic({
          geometry: point,
          attributes: item,
          symbol: pictureMarker,
          // spatialReference: this.MapView.spatialReference
        })
        layer.add(pictureGraphic)

        let textSymbol = {
          type: "text",
          color: "white",
          haloColor: "black",
          haloSize: "1px",
          text: item.text,
          xoffset: 0,
          yoffset: -25,
          font: {
            size: 12,
            family: "Josefin Slab",
            weight: "bold"
          }
        }
        let textGraphic = new this.gisConstructor.Graphic({
          geometry: point,
          attributes: item,
          symbol: textSymbol,
          // spatialReference: this.MapView.spatialReference
        })
        layer.add(textGraphic)

        // layer.addMany([]) // 多个点，Array 类型
      })

      // 添加线
      let polyline = {
        type: "polyline",
        paths: [
          [-117.1977902557841, 32.71447351131593],
          [-117.21907626652629, 32.708479404000755],
          [-117.22714435124307, 32.69425081410677],
          [-117.22208034062295, 32.683632063618255],
          [-117.17178355717574, 32.678358337302186],
          [-117.16543208622849, 32.6827651710909],
        ]
      }
      let polylineSymbol = {
        type: "simple-line",
        color: [255, 0, 0],
        width: 4
      }
      let polylineAtt = {
        Name: "Keystone Pipeline",
        Owner: "TransCanada",
        Length: "3,456 km"
      }
      let polylineGraphic = new this.gisConstructor.Graphic({
        geometry: polyline,
        symbol: polylineSymbol,
        attributes: polylineAtt,
        // 高亮提示效果
        popupTemplate: {
          title: "{Name}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "Name"
                },
                {
                  fieldName: "Owner"
                },
                {
                  fieldName: "Length"
                }
              ]
            }
          ]
        }
      })
      layer.add(polylineGraphic)

      // 添加面
      let polygon = {
        type: "polygon",
        rings: [
          [-117.1880055572978, 32.72339170858406],
          [-117.17538844609174, 32.719997843890354],
          [-117.18723308110151, 32.71299307648107],
          [-117.1880055572978, 32.72339170858406]
        ]
      }
      let polygonSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8],
        outline: {
          color: [255, 255, 255],
          width: 4
        }
      }
      let polygonAtt = {
        Name: "Keystone Polygon",
        Owner: "TransCanada",
        Area: "50²km"
      }
      let polygonGraphic = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: polygonSymbol,
        attributes: polygonAtt,
        // 高亮提示效果
        popupTemplate: {
          title: "{Name}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "Name"
                },
                {
                  fieldName: "Owner"
                },
                {
                  fieldName: "Area"
                }
              ]
            }
          ]
        }
      })
      layer.add(polygonGraphic)
    },

    /**
     * @name: 操作地图
     */
    operatingMapFun() {
      this.MapView.on('click', event => {
        console.log(event)
        this.MapView.hitTest(event).then(response => {
          console.log(response)
        })
      })
      this.MapView.on('pointer-move', event => {
        this.MapView.hitTest(event).then(response => {
          if (response.results && response.results.length > 0) {
            console.log(response.results[0])
          }
        })
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
        .then(this.operatingMapFun)
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

      let layer = new this.gisConstructor.GraphicsLayer({
        id: '自定义标注图层',
        title: '自定义标注图层',
        spatialReference: this.MapView.spatialReference
      })
      this.map.layers.add(layer)

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

