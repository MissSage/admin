import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'

export default (props: any, ctx: any, { dom, center, markerClick } = {
  dom: 'cesiumContainer',
  center: [107.22274218697211, 30.013263452056083],
  markerClick: (id: any, geometry: any) => {
    console.log(id, geometry)
  }
}) => {
  const viewer = ref<any>(null)
  let tileset: any = null

  onMounted(() => {
    initTile()
  })

  const initTile = () => {
    // Cesium.buildModuleUrl.setBaseUrl('/cesium/')
    // CesiumWidget
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjODRmMzQyNi0xN2MwLTRhZDgtYjNlNS02ODYwNDYxNjkyZDciLCJpZCI6NjA4MDUsImlhdCI6MTYyNTQ3MDY3NH0.v1dT5mZ0cz_CldyFK5qJ20lBfjk5hpLtqtZNnO4P1iw'
    // viewer = new Cesium.Viewer('cesiumContainer', {
    //   terrainProvider: Cesium.createWorldTerrain()
    // })
    // 初始化 cesium
    viewer.value = new Cesium.Viewer(dom, {
      animation: true, // 动画插件
      baseLayerPicker: false,
      geocoder: false,
      navigationHelpButton: false,
      timeline: false,
      fullscreenButton: false,
      homeButton: false,
      infoBox: true,
      scene3DOnly: true, // 仅仅显示3d,可隐藏右上角2d和3d按钮
      // selectionoIndicatr: false,
      // navigationInstructionsInitiallyVisibl: false,
      useDefaultRenderLoop: true,
      showRenderLoopErrors: true,
      projectionPicker: false, // 投影选择器
      vrButton: false,
      terrainProvider: Cesium.createWorldTerrain()
    })

    // 亮度设置
    const stages = (viewer.value.scene as any).postProcessStages;
    (viewer.value.scene as any).brightness =
      ((viewer.value.scene as any).brightness ||
        (stages as any).add(Cesium.PostProcessStageLibrary.createBrightnessStage()));
    (viewer.value.scene as any).brightness.enabled = true;
    (viewer.value.scene as any).brightness.uniforms.brightness = Number(0.8)

    // 集成天地图
    initMap();
    // this.initTdtGoogleMapsCompatible()

    // 消除水印
    (viewer.value.cesiumWidget.creditContainer as HTMLElement).style.display = 'none'
    // viewer.value.scene.mode = Cesium.SceneMode.SCENE2D
    // viewer.value.scene.globe.depthTestAgainstTerrain = true // 开启地形深度监测/

    // 设置最远观测距离
    // viewer.value.scene.screenSpaceCameraController.maximumZoomDistance = 10000
  }

  // 集成谷歌地图标注
  // const initTdtGoogleMapsCompatible = () => {
  //   // 引入天地图标注,
  //   const token = '3ab6d0ca5891deb7b7a618f2d0698c86'
  //   viewer.value.imageryLayers.addImageryProvider(
  //     new Cesium.WebMapTileServiceImageryProvider({
  //       url:
  //         'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
  //         token,
  //       layer: 'tdtImgBasicLayer',
  //       style: 'default',
  //       format: 'image/jpeg',
  //       tileMatrixSetID: 'GoogleMapsCompatible',
  //       // show: false
  //     })
  //   ) // 卫星影像

  //   viewer.value.imageryLayers.addImageryProvider(
  //     new Cesium.WebMapTileServiceImageryProvider({
  //       url:
  //         'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
  //         token,
  //       layer: 'tdtImgAnnoLayer',
  //       style: 'default',
  //       format: 'image/jpeg',
  //       tileMatrixSetID: 'GoogleMapsCompatible',
  //       // show: false
  //     })
  //   ) // 注记图层
  // }

  // 集成天地图
  const initMap = () => {
    const token = '3ab6d0ca5891deb7b7a618f2d0698c86'
    // 服务域名
    const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
    // 服务负载子域
    const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
    // 叠加影像服务
    const imgMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
      subdomains: subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 18
    })
    viewer.value.imageryLayers.addImageryProvider(imgMap)
    // 叠加国界服务
    const iboMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
      subdomains: subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 10
    })
    viewer.value.imageryLayers.addImageryProvider(iboMap)
    // 叠加地形服务
    // const terrainUrls = new Array()
    // for (let i = 0; i < subdomains.length; i++) {
    //   const url =
    //     tdtUrl.replace('{s}', subdomains[i]) +
    //     'DataServer?T=elv_c&tk=' +
    //     token
    //   terrainUrls.push(url)
    // }
    // const provider = new Cesium.GeoTerrainProvider({
    //   urls: terrainUrls,
    // })
    // viewer.value.terrainProvider = provider

    // 叠加三维地名服务
    // const wtfs = new Cesium.GeoWTFS({
    //   viewer,
    //   subdomains: subdomains,
    //   metadata: {
    //     boundBox: {
    //       minX: -180,
    //       minY: -90,
    //       maxX: 180,
    //       maxY: 90
    //     },
    //     minLevel: 1,
    //     maxLevel: 20
    //   },
    //   aotuCollide: true, // 是否开启避让
    //   collisionPadding: [5, 10, 8, 5], // 开启避让时，标注碰撞增加内边距，上、右、下、左
    //   serverFirstStyle: true, // 服务端样式优先
    //   labelGraphics: {
    //     font: '28px sans-serif',
    //     fontSize: 28,
    //     fillColor: Cesium.Color.WHITE,
    //     scale: 0.5,
    //     outlineColor: Cesium.Color.BLACK,
    //     outlineWidth: 5,
    //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    //     showBackground: false,
    //     backgroundColor: Cesium.Color.RED,
    //     backgroundPadding: new Cesium.Cartesian2(10, 10),
    //     horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
    //     verticalOrigin: Cesium.VerticalOrigin.TOP,
    //     eyeOffset: Cesium.Cartesian3.ZERO,
    //     pixelOffset: new Cesium.Cartesian2(0, 8)
    //   },
    //   billboardGraphics: {
    //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //     verticalOrigin: Cesium.VerticalOrigin.CENTER,
    //     eyeOffset: Cesium.Cartesian3.ZERO,
    //     pixelOffset: Cesium.Cartesian2.ZERO,
    //     alignedAxis: Cesium.Cartesian3.ZERO,
    //     color: Cesium.Color.WHITE,
    //     rotation: 0,
    //     scale: 1,
    //     width: 18,
    //     height: 18
    //   }
    // })
    // // 三维地名服务，使用wtfs服务
    // wtfs.getTileUrl = function() {
    //   return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk=' + token
    // }
    // wtfs.getIcoUrl = function() {
    //   return tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + token
    // }
    // wtfs.initTDT([
    //   {
    //     x: 6,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: 90, minY: 0, maxX: 135, maxY: 45 }
    //   },
    //   {
    //     x: 7,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: 135, minY: 0, maxX: 180, maxY: 45 }
    //   },
    //   {
    //     x: 6,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: 90, minY: 45, maxX: 135, maxY: 90 }
    //   },
    //   {
    //     x: 7,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: 135, minY: 45, maxX: 180, maxY: 90 }
    //   },
    //   {
    //     x: 5,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: 45, minY: 0, maxX: 90, maxY: 45 }
    //   },
    //   {
    //     x: 4,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: 0, minY: 0, maxX: 45, maxY: 45 }
    //   },
    //   {
    //     x: 5,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: 45, minY: 45, maxX: 90, maxY: 90 }
    //   },
    //   {
    //     x: 4,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: 0, minY: 45, maxX: 45, maxY: 90 }
    //   },
    //   {
    //     x: 6,
    //     y: 2,
    //     level: 2,
    //     boundBox: { minX: 90, minY: -45, maxX: 135, maxY: 0 }
    //   },
    //   {
    //     x: 6,
    //     y: 3,
    //     level: 2,
    //     boundBox: { minX: 90, minY: -90, maxX: 135, maxY: -45 }
    //   },
    //   {
    //     x: 7,
    //     y: 2,
    //     level: 2,
    //     boundBox: { minX: 135, minY: -45, maxX: 180, maxY: 0 }
    //   },
    //   {
    //     x: 5,
    //     y: 2,
    //     level: 2,
    //     boundBox: { minX: 45, minY: -45, maxX: 90, maxY: 0 }
    //   },
    //   {
    //     x: 4,
    //     y: 2,
    //     level: 2,
    //     boundBox: { minX: 0, minY: -45, maxX: 45, maxY: 0 }
    //   },
    //   {
    //     x: 3,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: -45, minY: 0, maxX: 0, maxY: 45 }
    //   },
    //   {
    //     x: 3,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: -45, minY: 45, maxX: 0, maxY: 90 }
    //   },
    //   {
    //     x: 2,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: -90, minY: 45, maxX: -45, maxY: 90 }
    //   },
    //   {
    //     x: 0,
    //     y: 1,
    //     level: 2,
    //     boundBox: { minX: -180, minY: 0, maxX: -135, maxY: 45 }
    //   },
    //   {
    //     x: 1,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: -135, minY: 45, maxX: -90, maxY: 90 }
    //   },
    //   {
    //     x: 0,
    //     y: 0,
    //     level: 2,
    //     boundBox: { minX: -180, minY: 45, maxX: -135, maxY: 90 }
    //   }
    // ])
    // add3dtiles()
  }

  // 加载3dtile
  const add3dtiles = (tileUrls: string[] = ['https://www.cqdxzhny.com/cqny/one/tileset.json'], center: [number, number] = [107.22274218697211, 30.013263452056083], postRenderFunction?: any) => {
    for (const idx in tileUrls) {
      const _tileset = new Cesium.Cesium3DTileset({
        url: tileUrls[idx]
      })
      _tileset.readyPromise.then(() => {
        viewer.value.scene.primitives.add(_tileset)

        // 贴地显示
        const height = 358.87282314740565
        const cartographic = Cesium.Cartographic.fromCartesian(_tileset.boundingSphere.center)
        // 设置变形，修复偏移量
        const surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
          // 0.0
        )
        const offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          height
        )
        const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
        _tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
        if (~~idx === tileUrls.length - 1) {
          tileset = _tileset
          // viewer.value.zoomTo(
          //   tileset,
          //   new Cesium.HeadingPitchRange(
          //     0.0,
          //     -0.5,
          //     tileset.boundingSphere.radius * 2.0
          //   )
          // )
          // viewer.value.zoomTo(tileset)
          addTileEventListener(center, postRenderFunction)
        }
      })
    }

    // tileset.readyPromise.then(argument => {
    //   viewer.value.scene.primitives.add(tileset)
    //   viewer.value.zoomTo(
    //     tileset,
    //     new Cesium.HeadingPitchRange(
    //       0.0,
    //       -0.5,
    //       tileset.boundingSphere.radius * 2.0
    //     )
    //   )
    //   this.addTileEventListener()
    //   // 贴地显示
    //   const height = 0
    //   const cartographic = Cesium.Cartographic.fromCartesian(
    //     tileset.boundingSphere.center
    //   )
    //   const surface = Cesium.Cartesian3.fromRadians(
    //     cartographic.longitude,
    //     cartographic.latitude,
    //     0.0
    //   )
    //   const offset = Cesium.Cartesian3.fromRadians(
    //     cartographic.longitude,
    //     cartographic.latitude,
    //     height
    //   )
    //   const translation = Cesium.Cartesian3.subtract(
    //     offset,
    //     surface,
    //     new Cesium.Cartesian3()
    //   )
    //   tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
    // })
  }

  // 相机位置
  let cameraPosition: any = null
  // 相机斜率
  let cameraPitch: any = null
  // 相机角度
  let initialHeading: any = null

  // 添加自定义鼠标事件
  const addTileEventListener = (centerParams: [number, number], postRenderFunction = () => {
    // do nothing
  }) => {
    let _center = centerParams || center
    if (!_center || !_center.length) {
      const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere._center)
      _center = [
        Cesium.Math.toDegrees(cartographic.longitude),
        Cesium.Math.toDegrees(cartographic.latitude)
      ]
    }
    cameraPosition = Cesium.Cartesian3.fromDegrees(_center[0], _center[1], 0)

    // 定义旋转中心点
    // this.rotateCenterPoint = viewer.value.entities.add({
    //   position: Cesium.Cartesian3.fromDegrees(_center[0], _center[1]),
    //   point: {
    //     color: Cesium.Color(0,0,0,0),
    //     pixelSize: 10,
    //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    //   }
    // })

    // var offset = new Cesium.HeadingPitchRange(
    //   Cesium.Math.toRadians(0),
    //   -Cesium.Math.toRadians(50),
    //   1700
    // )

    // viewer.value.zoomTo(this.rotateCenterPoint, offset)

    // 转经纬度
    // let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
    // let lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
    // let height = (cartographic.height / 1000).toFixed(2)
    // console.log(lat, lng, height)
    // console.log(cartographic)

    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
    cameraPitch = Cesium.Math.toRadians(-45)
    // 给定相机距离点多少距离飞行，这里取值为2500m
    const startTime = Cesium.JulianDate.fromDate(new Date())
    viewer.value.clock.startTime = startTime.clone() // 开始时间
    viewer.value.clock.currentTime = startTime.clone() // 当前时间
    viewer.value.clock.clockRange = Cesium.ClockRange.CLAMPED // 行为方式
    viewer.value.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    initialHeading = viewer.value.camera.heading
    // 00017392278
    // 107.22278584439623, 30.015782140446223
    // [107.22137177370278, 30.013419127647463]   [107.22227790879403, 30.01515835544826]
    // 初始视角
    const viewCenter = [_center[0] - 0 + 0.00141407069, _center[1] - 0 + 0.002363012789]
    const startViewPoint = Cesium.Cartesian3.fromDegrees(viewCenter[0], viewCenter[1], 0)
    viewer.value.scene.camera.setView({
      destination: startViewPoint, // 点的坐标
      orientation: {
        heading: Cesium.Math.toRadians(30) + initialHeading,
        pitch: cameraPitch
      }
    })
    viewer.value.scene.camera.moveBackward(1900)
    // viewer.value.clock.onTick.addEventListener(this.Exection)

    // 计时器 恢复锁定旋转
    // this.resetInterval = setInterval(() => {
    //   if (this.resetTime <= 60) this.resetTime++
    //   if (this.resetTime >= 60 && !this.screenLock) {
    //     this.screenLock = true
    //     viewer.value.clock.canAnimate = true // 时间轴暂停
    //     viewer.value.clock.shouldAnimate = true
    //     viewer.value.clock.onTick.addEventListener(this.Exection)
    //   }
    // }, 1000)

    // viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    //   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    // )
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
    viewer.value.cesiumWidget.screenSpaceEventHandler.setInputAction(
      viewerClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    )

    // viewer.value.cesiumWidget.screenSpaceEventHandler.setInputAction(e => {
    //   this.resetTime = 0
    //   if (this.screenLock) {
    //     // 解除锁定自动旋转
    //     this.screenLock = false
    //     viewer.value.clock.canAnimate = false // 时间轴暂停
    //     viewer.value.clock.shouldAnimate = false
    //     this.resetTime = 0
    //     viewer.value.clock.onTick.removeEventListener(this.Exection)
    //   }
    //   // 获取到的是鼠标经过cesium的屏幕坐标
    // }, _this.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    // viewer.value.cesiumWidget.screenSpaceEventHandler.setInputAction(e => {
    //   const position = viewer.value.camera.pickEllipsoid(e.position)
    //   console.log(e)
    //   const cartographic = viewer.value.scene.globe.ellipsoid.cartesianToCartographic(
    //     position
    //   )
    //   const lng = Cesium.Math.toDegrees(cartographic.longitude) // 经纬度
    //   const lat = Cesium.Math.toDegrees(cartographic.latitude)
    //   console.log(lng, lat)
    //   viewer.value.camera.flyTo({
    //     destination: Cesium.Cartesian3.fromDegrees(lng, lat, 5000.0), // 设置位置
    //     orientation: {
    //       heading: Cesium.Math.toRadians(20.0), // 方向
    //       pitch: Cesium.Math.toRadians(-45.0), // 倾斜角度
    //       roll: 0
    //     },
    //     duration: 2, // 设置飞行持续时间，默认会根据距离来计算
    //     complete: function() {
    //       // 到达位置后执行的回调函数
    //       console.log('到达目的地')
    //     },
    //     cancle: function() {
    //       // 如果取消飞行则会调用此函数
    //       console.log('飞行取消')
    //     },
    //     pitchAdjustHeight: -90, // 如果摄像机飞越高于该值，则调整俯仰俯仰的俯仰角度，并将地球保持在视口中。
    //     maximumHeight: 5000, // 相机最大飞行高度
    //     flyOverLongitude: 100 // 如果到达目的地有2种方式，设置具体值后会强制选择方向飞过这个经度
    //   })
    // }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // 每帧监听弹窗 ，设置定位
    viewer.value.scene.postRender.addEventListener(postRenderFunction)
  }

  // cesium点击事件
  const viewerClick = (e: any) => {
    viewer.value.entities.remove({ id: 'clickBillboard' })

    const cartesian = viewer.value.camera.pickEllipsoid(e.position, viewer.value.scene.globe.ellipsoid)
    const pick = new Cesium.Cartesian2(e.position.x, e.position.y)
    const geometry = viewer.value.scene.globe.pick(viewer.value.camera.getPickRay(pick), viewer.value.scene)
    console.log(e, geometry)
    if (cartesian) {
      const pickdObject = viewer.value.scene.pick(e.position)
      // const position = viewer.value.camera.pickEllipsoid(e.position)
      console.log(pickdObject)
      if (Cesium.defined(pickdObject) && pickdObject.id) {
        // 根据点击对象的id删除该对象
        // viewer.value.entities.getById(pickdObject.id._id).show = false // 隐藏标记
        markerClick(pickdObject.id, geometry)
        // openDialog(pickdObject.id, geometry)
      } else {
        const cartographic = viewer.value.scene.globe.ellipsoid.cartesianToCartographic(geometry)
        const lng = Cesium.Math.toDegrees(cartographic.longitude) // 经纬度
        const lat = Cesium.Math.toDegrees(cartographic.latitude)
        console.log([lng, lat], '点击地图获取坐标')
        // viewer.value.entities.add({
        //   id: 'clickBillboard',
        //   position: Cesium.Cartesian3.fromDegrees(lng, lat),
        //   billboard: {
        //     image: markerImg,
        //     // pixelOffset: new Cesium.Cartesian2(0, 0),
        //     // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
        //     width: 60, // default: undefined
        //     height: 60, // default: undefined
        //     horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        //   }
        // })
      }
    }
  }

  const screenLock = ref<boolean>(false)
  // 锁定/解锁屏幕旋转
  const setScreenLock = () => {
    screenLock.value = !screenLock.value
    viewer.value.clock.canAnimate = screenLock.value // 时间轴暂停
    viewer.value.clock.shouldAnimate = screenLock.value
    viewer.value.clock.onTick.removeEventListener(Exection)
    if (screenLock.value) {
      viewer.value.clock.onTick.addEventListener(Exection)
    }
  }

  // 旋转计时器函数
  const Exection = () => {
    // if (this.rotateCenterPoint) viewer.value.zoomTo(this.rotateCenterPoint)

    // 当前已经过去的时间，单位s
    const delTime = Cesium.JulianDate.secondsDifference(
      viewer.value.clock.currentTime,
      viewer.value.clock.startTime
    )
    // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
    // 转动速度360 / 120
    const cameraHeading = Cesium.Math.toRadians(delTime * (360 / 120)) + initialHeading
    viewer.value.scene.camera.setView({
      destination: cameraPosition, // 点的坐标
      orientation: {
        heading: cameraHeading,
        pitch: cameraPitch
      }
    })
    // viewer.value.scene.camera.moveUp(800)
    viewer.value.scene.camera.moveBackward(1500)
    if (Cesium.JulianDate.compare(viewer.value.clock.currentTime, viewer.value.clock.stopTime) >= 0) {
      viewer.value.clock.onTick.removeEventListener(Exection)
    }
  }

  // 设置标记
  const setMarkers = (data: any[]) => {
    data.forEach(item => {
      viewer.value.entities.add({
        id: item.id,
        name: item.name,
        type: item.type,
        position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
        // // 点样式
        // 立广告牌
        billboard: {
          image: item.icon,
          show: true, // default
          width: 40, // default: undefined
          height: 40, // default: undefined
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
        // // 字体标签样式
        // label: {
        //   text: item.name,
        //   font: '14pt',
        //   color: Cesium.Color.RED,
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   outlineWidth: 1,
        //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

        //   // 垂直位置
        //   // verticalOrigin : Cesium.VerticalOrigin.BUTTON,
        //   // 中心位置
        //   pixelOffset: new Cesium.Cartesian2(0, 20)
        // }
      })
    })
  }

  return {
    setMarkers, setScreenLock, add3dtiles, Cesium, viewer, screenLock
  }
}
