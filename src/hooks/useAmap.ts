// import { computed, watch, onMounted, onBeforeMount } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

export default () => {
  let map: any = null
  let AMap: any = null
  const initAMap = async (domId: string, config: any) => {
    AMap = await AMapLoader.load({
      // key: 'b9ead67a4044d978a72125506b8742db', // 申请好的Web端开发者Key，首次调用 load 时必填
      key: '312ea3a03da6d14c60ea71789d1848ae',
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [
        'AMap.Autocomplete',
        'AMap.PlaceSearch',
        'AMap.Scale',
        'AMap.MapType',
        'AMap.CircleEditor'
      ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [] // 需要加载的 AMapUI ui插件
      },
      Loca: {
        // 是否加载 Loca， 缺省不加载
        version: '1.3.2' // Loca 版本，缺省 1.3.2
      }
    })
    map = new AMap.Map(domId, {
      zoom: 11, // 级别
      mapStyle: config.mapStyle,
      center: config.center || [116.397428, 39.90923] // 中心点坐标
    })
    // 绑定事件
    if (config.events) {
      for (const key in config.events) {
        map.on(key, () => {
          config.events[key](map)
        })
      }
    }

    if (config.search) {
      // const auto = new AMap.Autocomplete({
      //   input: config.search.input
      // })
      // const placeSearch = new AMap.PlaceSearch({
      //   pageSize: 5, // 单页显示结果条数
      //   pageIndex: 1, // 页码
      //   citylimit: false, //是否强制限制在设置的城市内搜索
      //   map: map, // 展现结果的地图实例
      //   panel: 'panel', // 结果列表将在此容器中进行展示。
      //   autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      //   renderStyle: 'default'
      // }) //构造地点查询类
      // AMap.event.addListener(auto, 'select', e => {
      //   console.log(e)
      //   placeSearch.setCity(e.poi.adcode)
      //   placeSearch.search(e.poi.name) //关键字查询查询
      // })
    }
    return map
  }

  // 标点
  const setMarker = (center: (number | string)[], config?: any) => {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(...center),
      ...(config || {})
    })
    map.add(marker)
    return marker
  }

  // 标点群组
  const setMarkers = (data: (number | string)[][], config?: any) => {
    const markers: any[] = []
    data.forEach((point: (number | string)[], idx: number | string) => {
      if (config && config.contentHandle) {
        config.content = config.contentHandle(point, idx)
        console.log(config.content)

        delete config.contentHandle
      }
      markers.push(
        new AMap.Marker({
          position: new AMap.LngLat(...point),
          ...(config || {})
        })
      )
    })

    console.log(markers)

    const overlayGroup = new AMap.OverlayGroup(markers)
    map.add(overlayGroup)
    return overlayGroup
  }

  // 划线Polyline
  const setPolyline = (data: (number | string)[][], config?: any) => {
    const path = data.map(point => new AMap.LngLat(...point))
    const polyline = new AMap.Polyline({
      path,
      ...(config || {})
    })
    map.add(polyline)
    return polyline
  }

  // Polyline群组
  const setPolylines = (data: (number | string)[][][], config?: any) => {
    const polylines: any[] = []
    data.forEach(item => {
      const path = item.map(point => new AMap.LngLat(...point))
      polylines.push(
        new AMap.Polyline({
          path,
          ...(config || {})
        })
      )
    })

    const overlayGroup = new AMap.OverlayGroup(polylines)
    map.add(overlayGroup)
    return overlayGroup
  }

  // 弹窗
  const setInfoWindow = (point: (number | string)[], config?: any) => {
    const infoWindow = new AMap.InfoWindow({
      anchor: 'top',
      ...(config || {})
    })
    infoWindow.open(map, point)
    return infoWindow
  }

  const setInfoWindows = (data: (number | string)[][], config?: any) => {
    const infoWindows: any[] = []
    data.forEach((point: (number | string)[], idx: number | string) => {
      if (config && config.contentHandle) {
        config.content = config.contentHandle(point, idx)
        console.log(config.content)

        delete config.contentHandle
      }
      const infoWindow = new AMap.InfoWindow({
        isCustom: true,
        anchor: 'top',
        ...(config || {})
      })
      infoWindow.open(map, point)
      infoWindows.push(infoWindow)
    })

    const overlayGroup = new AMap.OverlayGroup(infoWindows)
    return overlayGroup
  }
  const setCenter = (center: number[]) => {
    if (center.length === 0) {
      map.setCenter(center)
    }
  }
  const getCenter = () => {
    return map.getCenter()
  }

  return {
    map,
    setMarker,
    setCenter,
    getCenter,
    initAMap,
    AMap,
    setMarkers,
    setPolyline,
    setPolylines,
    setInfoWindow,
    setInfoWindows
  }
}
