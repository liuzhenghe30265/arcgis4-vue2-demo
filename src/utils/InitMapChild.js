// 继承 InitMap 中 ArcGIS 类，可扩展自己的方法
import ArcGIS from '@/utils/InitMap'

class InitMapChild extends ArcGIS {
  constructor() {
    super()
  }

  // 扩展方法...
  extendFun () {
    console.log(this)
    console.log(this.Map)
    console.log(this.MapView)
    console.log(this.gisConstructor)
    let extent = {
      xmin: -118.1839455,
      ymin: 32.68087830000002,
      xmax: -117.15035189999998,
      ymax: 32.732100979999984,
    }
    this.MapView.extent = new this.gisConstructor.Extent(extent)

  }
}

export default InitMapChild