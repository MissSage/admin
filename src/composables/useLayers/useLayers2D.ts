import AppX from '@/api/Map/configure'
import TileLayer from '@arcgis/core/layers/TileLayer'
// import BaseDynamicLayer from '@arcgis/core/layers/BaseDynamicLayer'
// import Extent from '@arcgis/core/geometry/Extent'
// import axios from 'axios';
import { ComponentInternalInstance } from 'vue'
import useGlobal from '../useGlobal'
const config = {
  widgetUrl: 'widgets/BaseMap',
  tmplateUrl: 'widgets/BaseMap/Widget.html',
  styleUrl: 'widgets/BaseMap/css/style.css',
  mapDiv: 'myMap',
  mapService: [
    'pipe', 'poi', 'privateterrain'
  ],
  baselayers: ['privateterrain']
}
const useLayers2D = (ins:ComponentInternalInstance|null) => {
  // const extents:any = []
  /**
     * (方法说明)管线图层加载完后，设置图层的初始范围
     * @method (方法名)
     * @for (所属类名)
     * @param {(参数类型)} (参数名) (参数说明)
     * @return {(返回值类型)} (返回值说明)
     */
  // const _onPipeLayerLoad = (event:any) => {
  //   const { $map } = useGlobal(ins)
  //   extents.push(event.layer.fullExtent)
  //   if (event.layer.units) {
  //     AppX.runtimeConfig.unit = event.layer.units
  //   }

  //   // if (this.extents.length == this.AppX.appConfig.gisResource.pipe.config.length) {
  //   // 设置地图范围
  //   if (extents.length > 0) {
  //     const fullExtent = extents[0]
  //     // for (var i = 1; i < this.extents.length; i++) {
  //     //     fullExtent = fullExtent.union(this.extents[i]);
  //     // }
  //     if (AppX.appConfig.initextent.xmax !== undefined) {
  //       $map.setExtent(new Extent({
  //         xmax: AppX.appConfig.initextent.xmax,
  //         xmin: AppX.appConfig.initextent.xmin,
  //         ymax: AppX.appConfig.initextent.ymax,
  //         ymin: AppX.appConfig.initextent.ymin,
  //         spatialReference: $map.spatialReference
  //       }))
  //     } else { $map.setExtent(fullExtent) }
  //   }
  //   // }
  // }

  // const _setLayerFilter = (dlayer: BaseDynamicLayer, layerAlias: string) => {
  //   const managerDepartment = Cookies.get('range')
  //   const ranges: Array<any> = managerDepartment.split(';')
  //   let filter:any = null
  //   if (ranges.length > 0) {
  //     filter = ranges.map(function (range) {
  //       return "'" + range + "'"
  //     }).join(',')
  //     filter = 'MANAGEDEPT_CODE in (' + filter + ')'
  //   }
  //   /// 设置过滤条件
  //   if (AppX.appConfig.gisResource.pipedata.config.length > 0) {
  //     axios({
  //       method:'post',
  //       url:d
  //     })
  //     $.ajax(
  //       {
  //         type: 'post',
  //         traditional: true,
  //         // url: esri.config.defaults.io.alwaysUseProxy ? esri.config.defaults.io.proxyUrl + '?' + dlayer.url : dlayer.url,
  //         url: dlayer.url,
  //         data: { f: 'json' },
  //         async: true,
  //         dataType: 'json',
  //         success: function (data) {
  //           const layerDefinitions = []
  //           data.layers.forEach((item, index) => {
  //             if (!item.subLayerIds) {
  //               layerDefinitions[item.id] = filter
  //             }
  //           })
  //           dlayer.setLayerDefinitions(layerDefinitions)
  //         },
  //         error: function (data) {
  //           AppX.runtimeConfig.toast.Show('加载图层:' + layerAlias + '失败，请联系管理员')
  //           this.btnViewDetails.removeClass('disabled')
  //           console.error(data)
  //         }.bind(this)
  //       }
  //     )
  //   }
  // }
  const addToMap = () => {
    const { $map } = useGlobal(ins)
    for (let i = 0; i < config.mapService.length; i++) {
      const layername: string = config.mapService[i]
      if (AppX.appConfig.gisResource[layername].config.length > 0) {
        for (let index = 0; index < AppX.appConfig.gisResource[layername].config.length; index++) {
          const url = AppX.appConfig.gisResource[layername].config[index].url
          // const layerAlias = AppX.appConfig.gisResource[layername].config[index].name
          if (AppX.appConfig.gisResource[layername].type === 'tiled') {
            const tileLayer = new TileLayer({
              url
            })
            tileLayer.id = layername + '_' + index
            if (config.baselayers.indexOf(layername) !== -1) { // 基础底图放置在最下层
              // add private terrain layer
              // if (this.AppX.appConfig.gisResource.privateterrain.config.length) {
              //     var privatelayer = new ArcGISTiledMapServiceLayer(this.AppX.appConfig.gisResource.privateterrain.config[0].url, { className: "tileLayer" });
              //     privatelayer.id = "privateterrain_0";
              //     privatelayer.setVisibility(false);
              //     map.addLayer(privatelayer, 0);
              // }
              // add private terrain layer
              $map.addLayer(tileLayer, 0)// 管线图层最先添加，但地形图要插入到最底层，以保证地图的缩放比例尺与切片管线一致
            } else { $map.addLayer(tileLayer) }
            // if (layername === 'pipe') { tileLayer.load().then((res)=>{
            //   // _onPipeLayerLoad(e:any)
            // }) }
          } else if (AppX.appConfig.gisResource[layername].type === 'dynamic') {
            // const dynamicLayer = new BaseDynamicLayer({
            //   title:layername,
            //   id:layername + '_' + index
            // })
            // //const dynamicLayer = new BaseDynamicLayer(url)
            // //dynamicLayer.id = layername + '_' + index
            // if (AppX.appConfig.gisResource[layername].filter) {
            //   // _setLayerFilter(dynamicLayer, layerAlias)
            // }
            // $map.addLayer(dynamicLayer)
            // if (layername === 'pipe') { dynamicLayer.load('layerview-create', _onPipeLayerLoad(e:any)) }
          }
        }
      }
    }
  }
  return {
    addToMap
  }
}

export default useLayers2D
