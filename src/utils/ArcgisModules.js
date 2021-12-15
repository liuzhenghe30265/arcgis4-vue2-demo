// Arcgis 模块

const ArcgisModules = [
  'esri/Graphic',
  'esri/symbols/TextSymbol',
  'esri/widgets/LayerList',
  'esri/widgets/Feature',
  'esri/layers/ElevationLayer', // 加载地形高程的图层，应用在三维模式下显示
  'esri/layers/SceneLayer', // 加载三维场景图层，应用在三维模式下显示
  'esri/layers/TileLayer', // 加载缓存地图服务的瓦片图层，缓存的服务访问缓存中的瓦片，而不是动态地绘制图像。由于缓存机制，所以渲染的速度比 MapImageLayers 快多了，适合叠加瓦片切图使用，而不是前端动态渲染的
  'esri/layers/MapImageLayer', // 允许显示和分析在一个地图服务定义层数据，输出图像代替特征。地图服务图像是根据请求动态生成的。
  'esri/layers/FeatureLayer',
  'esri/layers/GraphicsLayer',
  "esri/geometry/Point",
  'esri/geometry/SpatialReference',
  'esri/geometry/Extent',
  'esri/views/SceneView',
  'esri/views/MapView',
  'esri/Map',
]

export default ArcgisModules

