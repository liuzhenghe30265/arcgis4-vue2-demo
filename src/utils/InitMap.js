import store from '@/store/index'
import ArcgisModules from '@/utils/ArcgisModules'
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'
import {
  dependentFile
} from '@/config/MapOptions'

class ArcGIS {
  constructor() {
    this.Map = null
    this.MapView = null
    this.gisConstructor = {}
  }

  // 初始化
  init (option) {
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

        // 添加一个场景地图作为底图
        // const sceneMap = new this.gisConstructor.WebScene({
        //   portalItem: { // autocasts as new PortalItem()
        //     id: "affa021c51944b5694132b2d61fe1057"  // ID of the WebScene on arcgis.com
        //   },
        // })

        if (option.type && option.type === '3D') {
          this.MapView = new this.gisConstructor.SceneView({
            container: option.el, // Reference to the DOM node that will contain the view
            map: this.Map, // References the map object created in step 3
            // map: sceneMap,
            camera: option.camera,
            // center: option.center,
            // zoom: option.zoom
          })
        }
        else {
          this.MapView = new this.gisConstructor.MapView({
            container: option.el,
            map: this.Map
          })
        }
        // 设置视角区域
        if (option.extent) {
          this.MapView.extent = new this.gisConstructor.Extent(option.extent, this.MapView.spatialReference)
        }

        // 点击事件
        this.MapView.on('click', event => {
          console.log(event)

          // 使用 vuex 向组件传递数据
          store.dispatch('map/getMapClickData', event)

          // 点击标注
          this.MapView.hitTest(event).then(response => {
            if (response.results && response.results.length > 0) {
              console.log('自定义标注', response)
              store.dispatch('map/getMapMarkerClickData', response)
            }
          })
        })

        // 如果有需要加载的地图服务
        if (option.initLayers) {
          this.addMapServer(option.initLayers)
        }

        // LayerList 小部件提供了一种显示图层列表以及打开/关闭它们的可见性的方法。ListItem API提供对每个层属性的访问，允许开发人员配置与该层相关的操作，并允许开发人员向与该层相关的项添加内容。
        const layerList = new this.gisConstructor.LayerList({
          view: this.MapView
        })
        // Adds widget below other elements in the top left corner of the view
        this.MapView.ui.add(layerList, {
          position: 'top-left'
        })

        // 移入事件（高亮效果）
        // this.pointMoveFun(this.Map.findLayerById('HighLightLayer'))

      })
  }

  goTo () {
    this.MapView.goTo(
      {
        position: {
          x: 117.717534,
          y: 39.011454,
          z: 700000,
          spatialReference: {
            wkid: 4326
          }
        },
        heading: 0,
        tilt: 0
      },
      {
        // speedFactor: 0.3, // 速度因子，默认1
        // easing: this.customEasing // 缓动动画
      }
    )
      .catch(this.catchAbortError)
  }

  catchAbortError (error) {
    if (error.name != "AbortError") {
      console.error(error)
    }
  }

  // Define your own function for the easing option
  customEasing (t) {
    return (
      1 -
      Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10)
    );
  }

  // 移入事件（高亮效果）
  pointMoveFun (layer) {
    const _this = this
    this.MapView.when(() => {
      const graphic = {
        popupTemplate: {
          content: 'Mouse over features to show details...'
        }
      }
      const feature = new this.gisConstructor.Feature({
        container: 'feature-node',
        graphic: graphic,
        map: this.Map,
        spatialReference: this.MapView.spatialReference
      })

      _this.MapView.whenLayerView(layer).then(function (layerView) {
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
              layer.popupTemplate = popupTemplate
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

  // 设置图层显隐
  changeLayerVisible (layers) {
    // 测试
    // [
    //   'SF311',
    //   'DamageAssessment'
    // ]
    layers.map(name => {
      this.Map.findLayerById(name).visible = true
    })
  }

  // 添加地图服务 
  addMapServer (layers) {
    layers.map(item => {
      if (item.layerType === 'GraphicsLayer') {
        // 存放自定义标注
        this.Map.layers.add(new this.gisConstructor.GraphicsLayer({
          id: item.id,
          title: item.title,
          visible: item.visible
        }))
      } else if (item.layerType === 'MapImageLayer') {
        if (item.sublayers) {
          // 有子图层
          this.Map.add(new this.gisConstructor.MapImageLayer({
            id: item.id,
            url: item.url,
            layerId: item.id,
            sublayers: item.sublayers,
            visible: item.visible,
          }), item.zIndex || 1)
        } else {
          this.Map.add(new this.gisConstructor.MapImageLayer({
            id: item.id,
            url: item.url,
            layerId: item.id,
            visible: item.visible,
          }), item.zIndex || 1)
        }
      } else if (item.layerType === 'FeatureLayer') {
        this.Map.add(new this.gisConstructor.FeatureLayer({
          portalItem: item.portalItem,
          layerId: item.id,
          id: item.id,
          title: item.title,
          outFields: ['*'],
          visible: item.visible
        }))
      } else if (item.layerType === 'SceneServiceLayer') {
        if (item.portalItem) {
          const layer = new this.gisConstructor.SceneLayer({
            portalItem: item.portalItem,
            popupEnabled: item.popupEnabled,
            visible: item.visible
          })
          this.Map.add(layer)
          // Create MeshSymbol3D for symbolizing SceneLayer
          const symbol = {
            type: "mesh-3d", // autocasts as new MeshSymbol3D()
            symbolLayers: [
              {
                type: "fill", // autocasts as new FillSymbol3DLayer()
                // If the value of material is not assigned, the default color will be grey
                material: {
                  color: [244, 247, 134]
                }
              }
            ]
          }
          // Add the renderer to sceneLayer
          layer.renderer = {
            type: "simple", // autocasts as new SimpleRenderer()
            symbol: symbol
          }
        } else if (item.url) {
          const layer = new this.gisConstructor.SceneLayer({
            url: item.url,
            popupEnabled: item.popupEnabled,
            visible: item.visible
          })
          this.Map.add(layer)
        }
      }
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