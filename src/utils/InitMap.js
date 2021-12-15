import store from '@/store/index'
import ArcgisModules from '@/utils/ArcgisModules'
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
import {
  dependentFile,
  // extent
} from '@/config/MapOptions'

class ArcGIS {
  constructor() {
    this.Map = null
    this.MapView = null
    this.gisConstructor = {}
  }

  // 初始化
  init ($el, type) {
    esriLoader.loadCss(dependentFile.css)
    esriLoader.loadScript({
      url: dependentFile.script,
      dojoConfig: {
        async: false,
      }
    })
    loadModules(ArcgisModules)
      .then((args) => {
        for (let k in args) {
          let name = ArcgisModules[k].split('/').pop()
          this.gisConstructor[name] = args[k]
        }
        this.Map = new this.gisConstructor.Map({
          basemap: 'osm'
        })
        if (type && type === '3D') {
          this.MapView = new this.gisConstructor.SceneView({
            container: $el, // Reference to the DOM node that will contain the view
            map: this.Map, // References the map object created in step 3
          })
        }
        else {
          this.MapView = new this.gisConstructor.MapView({
            container: $el,
            map: this.Map
          })
        }
        // 设置视角区域
        // this.MapView.extent = new this.gisConstructor.Extent(extent, this.MapView.spatialReference)

        // 点击事件
        this.MapView.on('click', event => {
          console.log(event)

          // 使用 vuex 向组件传递数据
          store.dispatch('map/getMapClickData', event)

          // 点击标注
          this.MapView.hitTest(event).then(response => {
            console.log('自定义标注', response)
            store.dispatch('map/getMapMarkerClickData', response)
          })
        })

        // 添加一个图层，存放自定义标注
        let layer = new this.gisConstructor.GraphicsLayer({
          id: '自定义标注图层',
          title: '自定义标注图层',
          spatialReference: this.MapView.spatialReference
        })
        this.Map.layers.add(layer)

        // 添加 3D 图层
        const sceneLayer = new this.gisConstructor.SceneLayer({
          // portalItem: {
          //   id: "2e0761b9a4274b8db52c4bf34356911e"
          // },
          url: "https://scene.arcgis.com/arcgis/rest/services/Hosted/Building_Hamburg/SceneServer/layers/0",
          // url: 'http://server1041.esrichina.com/arcgisserver/rest/services/Hosted/Scene_JS_WSL1/SceneServer',
          popupEnabled: false
        })
        console.log(sceneLayer)
        this.Map.add(sceneLayer)
      })
  }

  // 根据 layer ID 清除标注
  clearSymbolsByLayerID (ID) {
    this.Map.findLayerById(ID) ? (() => {
      let layer = this.Map.findLayerById(ID)
      layer.removeAll()
    })() : void (0)
  }

  // 清除 MapView 上所有标注
  clearAllSymbols () {
    this.MapView.graphics.removeAll()
  }

  // 添加点标注
  addPointSymbols (data) {
    const layer = this.Map.findLayerById('自定义标注图层')
    let icon = ''
    data.forEach(item => {
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
  }

  // 添加线标注
  addPolylineSymbols (data) {
    const layer = this.Map.findLayerById('自定义标注图层')
    let polyline = {
      type: "polyline",
      paths: data
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
  }

  // 添加面
  addPolygonSymbols (data) {
    const layer = this.Map.findLayerById('自定义标注图层')
    let polygon = {
      type: "polygon",
      rings: data
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
  }



}

export default ArcGIS