// Arcgis 模块
const ArcgisModules = [
  'esri/widgets/Sketch', // Sketch小部件提供了一个简单的UI，用于在MapView或SceneView上创建和更新图形
  'esri/widgets/Sketch/SketchViewModel',
  'esri/rest/support/ProjectParameters', // 投影参数（4.16 版本加载失败）
  'esri/tasks/GeometryService',
  'esri/Graphic',
  'esri/symbols/TextSymbol',
  'esri/widgets/LayerList',
  'esri/widgets/Feature',
  'esri/WebScene', // 网络场景
  'esri/layers/ElevationLayer', // 加载地形高程的图层，应用在三维模式下显示
  'esri/layers/SceneLayer', // 加载三维场景图层，应用在三维模式下显示
  'esri/layers/TileLayer', // 加载缓存地图服务的瓦片图层，缓存的服务访问缓存中的瓦片，而不是动态地绘制图像。由于缓存机制，所以渲染的速度比 MapImageLayers 快多了，适合叠加瓦片切图使用，而不是前端动态渲染的
  'esri/layers/MapImageLayer', // 允许显示和分析在一个地图服务定义层数据，输出图像代替特征。地图服务图像是根据请求动态生成的。
  'esri/layers/FeatureLayer',
  'esri/layers/GraphicsLayer',
  'esri/geometry/Point',
  'esri/geometry/SpatialReference',
  'esri/geometry/Extent',
  'esri/views/SceneView',
  'esri/views/MapView',
  'esri/Map'
]

// export default ArcgisModules

import store from '@/store/index'
// import ArcgisModules from '@/utils/ArcgisModules'
import esriLoader from 'esri-loader'
import { loadModules } from 'esri-loader'

class ArcgisFunction {
  constructor() {
    this.Map = null
    this.MapView = null
    this.gisConstructor = {}
  }

  // 初始化
  init (option) {
    esriLoader.loadCss('https://js.arcgis.com/4.22/esri/themes/light/main.css')
    esriLoader.loadScript({
      url: 'https://js.arcgis.com/4.22/init.js',
      dojoConfig: {
        async: false
      }
    })
    loadModules(ArcgisModules)
      .then((args) => {
        for (const k in args) {
          const name = ArcgisModules[k].split('/').pop()
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
            camera: option.camera
            // center: option.center,
            // zoom: option.zoom
          })
        } else {
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

          // 坐标转换
          this.coordinateTran(event)
        })

        // 初始化时添加图层服务
        this.addCustomLayers()

        // 添加模型模型
        const layer = this.Map.findLayerById('自定义标注图层')
        const point = {
          type: 'point', // autocasts as new Point()
          x: -73.98221631859681,
          y: 40.70871256176741,
          z: 0
        }
        const treeSymbol = {
          type: 'point-3d',
          symbolLayers: [{
            type: 'object',
            resource: {
              href: 'https://jsapi.maps.arcgis.com/sharing/rest/content/items/4418035fa87d44f490d5bf27a579e118/resources/styles/web/resource/tree.json'
            },
            height: 400,
            anchor: 'bottom'
          }]
        }
        const treeGraphic = new this.gisConstructor.Graphic({
          geometry: point,
          symbol: treeSymbol
        })
        layer.add(treeGraphic)

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

        // 绘制工具
        this.DrawingGraphics()
      })
  }

  // 添加自定义图层
  addCustomLayers () {
    // layer.visible 设置显隐

    // 存放自定义标注
    this.Map.layers.add(new this.gisConstructor.GraphicsLayer({
      id: '自定义标注图层',
      title: '自定义标注图层',
      visible: true
    }))

    // 单个图层（第二个参数是层级）
    this.Map.add(new this.gisConstructor.MapImageLayer({
      id: 'SF311',
      layerId: 'SF311',
      title: 'SF311',
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SF311/MapServer',
      visible: false
    }), 1)
    this.Map.add(new this.gisConstructor.MapImageLayer({
      id: 'DamageAssessment',
      layerId: 'DamageAssessment',
      title: 'DamageAssessment',
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
      visible: false
    }))

    // 有子图层
    // 设置图层显隐时通过 layer.items 获取到所有子图层，循环，单独设置 layer.visible
    this.Map.add(new this.gisConstructor.MapImageLayer({
      id: 'USA',
      layerId: 'USA',
      title: 'USA',
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
      sublayers: [
        {
          id: 0,
          title: 'Cities',
          visible: false
        },
        {
          id: 1,
          title: 'Highways',
          visible: false
        },
        {
          id: 2,
          title: 'States',
          visible: false
        },
        {
          id: 3,
          title: 'Counties',
          visible: false
        }
      ]
    }))

    // 功能图层，加载服务
    this.Map.add(new this.gisConstructor.FeatureLayer({
      portalItem: {
        id: 'f430d25bf03744edbb1579e18c4bf6b8'
      },
      layerId: 'FeatureLayer',
      id: 'FeatureLayer',
      title: 'FeatureLayer（带高亮效果）',
      outFields: ['*'],
      visible: false
    }))

    // 三维场景服务（portalItem）
    const layer = new this.gisConstructor.SceneLayer({
      id: '纽约楼栋',
      title: '纽约楼栋',
      portalItem: {
        id: '2e0761b9a4274b8db52c4bf34356911e'
      },
      popupEnabled: false,
      visible: false
    })
    // Create MeshSymbol3D for symbolizing SceneLayer
    const symbol = {
      type: 'mesh-3d', // autocasts as new MeshSymbol3D()
      symbolLayers: [
        {
          type: 'fill', // autocasts as new FillSymbol3DLayer()
          // If the value of material is not assigned, the default color will be grey
          material: {
            color: [244, 247, 134]
          }
        }
      ]
    }
    // Add the renderer to sceneLayer
    layer.renderer = {
      type: 'simple', // autocasts as new SimpleRenderer()
      symbol: symbol
    }
    this.Map.add(layer)

    // 三维场景服务（url）
    // this.Map.add(new this.gisConstructor.SceneLayer({
    //   url: '',
    //   popupEnabled: true,
    //   visible: false
    // }))
  }

  // 坐标转换
  coordinateTran (e) {
    // 使用 GeometryService 转换坐标
    const params = new this.gisConstructor.ProjectParameters()
    params.geometries = [
      e.mapPoint
      // new this.gisConstructor.Point(691599.4485598434, 3088605.79325086, new this.gisConstructor.SpatialReference({ wkid: 32649 }))
    ] // 输入
    params.outSpatialReference = new this.gisConstructor.SpatialReference({
      wkid: 4326
    }) // 输出
    const geometryService = new this.gisConstructor.GeometryService('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer')
    geometryService.project(params).then(function (result) {
      console.log('经纬度：' + result[0].x + ',' + result[0].y)
    })
  }

  goTo (position) {
    this.MapView.goTo(
      {
        position: position,
        // position: {
        //   x: 117.717534,
        //   y: 39.011454,
        //   z: 700000,
        //   spatialReference: {
        //     wkid: 4326
        //   }
        // },
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
    if (error.name !== 'AbortError') {
      console.error(error)
    }
  }

  // Define your own function for the easing option
  customEasing (t) {
    return (
      1 -
      Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10)
    )
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

  // 绘制功能
  DrawingGraphics () {
    const sketchLayer = new this.gisConstructor.GraphicsLayer({
      title: '绘制图层'
    })
    this.Map.add(sketchLayer)
    this.MapView.when(() => {
      const sketch = new this.gisConstructor.Sketch({
        layer: sketchLayer,
        view: this.MapView,
        // graphic will be selected as soon as it is created
        creationMode: 'update'
      })
      this.MapView.ui.add(sketch, 'top-left')
      let sketchGeometry = null
      sketch.on('create', (event) => {
        if (event.state === 'complete') {
          sketchGeometry = event.graphic.geometry
          console.log(sketchGeometry)
          // const sceneLayerView = this.Map.findLayerById('纽约楼栋')
          // const query = sceneLayerView.createQuery();
          // query.geometry = sketchGeometry;
          // query.distance = 500;
          // query.units = "meters";
          // query.spatialRelationship = "intersects";
          // query.returnGeometry = true;
          // console.log('queryyyyyyyyyyyyy', query)
        }
      })

      sketch.on('update', (event) => {
        if (event.state === 'complete') {
          sketchGeometry = event.graphics[0].geometry
          console.log(sketchGeometry)
        }
      })
    })
  }

  // 根据 layer ID 清除标注
  clearSymbolsByLayerID (ID) {
    this.Map.findLayerById(ID) ? (() => {
      const layer = this.Map.findLayerById(ID)
      layer.removeAll()
    })() : void (0)
  }

  // 清除 MapView 上所有标注
  clearAllSymbols () {
    this.MapView.graphics.removeAll()
  }

  // 添加点标注
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
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
      const point = {
        type: 'point',
        longitude: item.x,
        latitude: item.y
        // spatialReference: this.MapView.spatialReference
      }
      const simpleMarker = {
        type: 'simple-marker',
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
        // spatialReference: this.MapView.spatialReference
      }
      const simpleMarkerGraphic = new this.gisConstructor.Graphic({
        geometry: point,
        attributes: item,
        symbol: simpleMarker
        // spatialReference: this.MapView.spatialReference
      })
      layer.add(simpleMarkerGraphic)

      const pictureMarker = {
        type: 'picture-marker',
        url: icon,
        width: '32px',
        height: '32px',
        xoffset: '0',
        yoffset: '25px'
      }
      const pictureGraphic = new this.gisConstructor.Graphic({
        geometry: point,
        attributes: item,
        symbol: pictureMarker
        // spatialReference: this.MapView.spatialReference
      })
      layer.add(pictureGraphic)

      const textSymbol = {
        type: 'text',
        color: 'white',
        haloColor: 'black',
        haloSize: '1px',
        text: item.text,
        xoffset: 0,
        yoffset: -25,
        font: {
          size: 12,
          family: 'Josefin Slab',
          weight: 'bold'
        }
      }
      const textGraphic = new this.gisConstructor.Graphic({
        geometry: point,
        attributes: item,
        symbol: textSymbol
        // spatialReference: this.MapView.spatialReference
      })
      layer.add(textGraphic)

      // layer.addMany([]) // 多个点，Array 类型
    })
  }

  // 添加三维点
  add3DPointSymbols () {
    const layer = this.Map.findLayerById('自定义标注图层')
    const graphic = new this.gisConstructor.Graphic(
      {
        geometry: {
          type: 'point',
          x: 7.029608745378372,
          y: 8.411554571297769,
          z: 1000
        },
        attributes: {
          name: '3D点'
        },
        symbol: {
          type: 'picture-marker',
          url: require('@/assets/images/ico03.png'),
          width: '32px',
          height: '32px',
          xoffset: '0',
          yoffset: '25px'
        }
      }
    )
    layer.add(graphic)
  }

  // 添加线标注
  addPolylineSymbols (data) {
    const layer = this.Map.findLayerById('自定义标注图层')
    const polyline = {
      type: 'polyline',
      paths: data
    }
    const polylineSymbol = {
      type: 'simple-line',
      color: [255, 0, 0],
      width: 4
    }
    const polylineAtt = {
      Name: 'Keystone Pipeline',
      Owner: 'TransCanada',
      Length: '3,456 km'
    }
    const polylineGraphic = new this.gisConstructor.Graphic({
      geometry: polyline,
      symbol: polylineSymbol,
      attributes: polylineAtt,
      // 高亮提示效果
      popupTemplate: {
        title: '{Name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'Name'
              },
              {
                fieldName: 'Owner'
              },
              {
                fieldName: 'Length'
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
    const polygon = {
      type: 'polygon',
      rings: data
    }
    const polygonSymbol = {
      type: 'simple-fill',
      color: [227, 139, 79, 0.8],
      outline: {
        color: [255, 255, 255],
        width: 4
      }
    }
    const polygonAtt = {
      Name: 'Keystone Polygon',
      Owner: 'TransCanada',
      Area: '50²km'
    }
    const polygonGraphic = new this.gisConstructor.Graphic({
      geometry: polygon,
      symbol: polygonSymbol,
      attributes: polygonAtt,
      // 高亮提示效果
      popupTemplate: {
        title: '{Name}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'Name'
              },
              {
                fieldName: 'Owner'
              },
              {
                fieldName: 'Area'
              }
            ]
          }
        ]
      }
    })
    layer.add(polygonGraphic)
  }
}

export default ArcgisFunction