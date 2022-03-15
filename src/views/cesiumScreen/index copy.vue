<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" class="mapContainer"></div>
    <VideoPopup ref="videoPop" :style="{ width: videoPop ? '380px' : '0px' }" :config="videoPop" />
    <InfoPopup ref="infoPop" :style="{ width: infoPop ? '380px' : '0px' }" :config="infoPop" />
    <!-- <div @click="setScreenLock" class="screenLock"><i class="iconfont" :class="{'icon-mima':screenLock,'icon-yulan1':!screenLock}"></i></div> -->
    <div class="screenLock" @click="setScreenLock">
      <img :src="screenLock ? stopIcon : startIcon" />
    </div>
  </div>
</template>

<script>
// import * as Cesium from 'cesium'

import VideoPopup from './components/videoPopup.vue'
import InfoPopup from './components/infoPopup.vue'

import deviceMarkerImg from './img/deviceMarker.png'
// import markerImg from './img/marker.png'
import videoMarkerImg from './img/videoMarker.png'
import startIcon from '@/assets/icons/start.png'
import stopIcon from '@/assets/icons/stop.png'
import { defineComponent } from 'vue'
// import * as Cesium from 'cesium/Cesium'

let viewer = null
let tileset = null

export default defineComponent({
  components: {
    VideoPopup,
    InfoPopup
  },
  data() {
    return {
      startIcon,
      stopIcon,

      screenLock: false,
      cameraPosition: '',
      cameraPitch: '',
      initialHeading: '',
      cameraHeading: '',

      infoPop: null,
      videoPop: null
    }
  },

  mounted() {
    this.initTile()
    // this.setMarkers()
    this.getMarkers()
  },
  methods: {
    // 初始化地图
    initTile() {
      // Cesium.buildModuleUrl.setBaseUrl('/cesium/')
      // CesiumWidget
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjODRmMzQyNi0xN2MwLTRhZDgtYjNlNS02ODYwNDYxNjkyZDciLCJpZCI6NjA4MDUsImlhdCI6MTYyNTQ3MDY3NH0.v1dT5mZ0cz_CldyFK5qJ20lBfjk5hpLtqtZNnO4P1iw'
      // viewer = new Cesium.Viewer('cesiumContainer', {
      //   terrainProvider: Cesium.createWorldTerrain()
      // })
      // 初始化 cesium
      viewer = new Cesium.Viewer('cesiumContainer', {
        animation: true, // 动画插件
        baseLayerPicker: false,
        geocoder: false,
        navigationHelpButton: false,
        timeline: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: true,
        scene3DOnly: true, // 仅仅显示3d,可隐藏右上角2d和3d按钮
        selectionoIndicatr: false,
        navigationInstructionsInitiallyVisibl: false,
        useDefaultRenderLoop: true,
        showRenderLoopErrors: true,
        projectionPicker: false, // 投影选择器
        vrButton: false,
        terrainProvider: Cesium.createWorldTerrain()
      })

      // 亮度设置
      const stages = viewer.scene.postProcessStages
      viewer.scene.brightness =
        viewer.scene.brightness ||
        stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage())
      viewer.scene.brightness.enabled = true
      viewer.scene.brightness.uniforms.brightness = Number(0.8)

      // 集成天地图
      this.initMap()
      // this.initTdtGoogleMapsCompatible()

      // 消除水印
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      // viewer.scene.mode = Cesium.SceneMode.SCENE2D
      // viewer.scene.globe.depthTestAgainstTerrain = true // 开启地形深度监测/

      // 设置最远观测距离
      // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000
    },

    // 集成谷歌地图标注
    initTdtGoogleMapsCompatible() {
      // 引入天地图标注,
      const token = '3ab6d0ca5891deb7b7a618f2d0698c86'
      viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
            token,
          layer: 'tdtImgBasicLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false
        })
      ) // 卫星影像

      viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url:
            'http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
            token,
          layer: 'tdtImgAnnoLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible',
          show: false
        })
      ) // 注记图层
    },

    // 集成天地图
    initMap() {
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
      viewer.imageryLayers.addImageryProvider(imgMap)
      // 叠加国界服务
      const iboMap = new Cesium.UrlTemplateImageryProvider({
        url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
        subdomains: subdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10
      })
      viewer.imageryLayers.addImageryProvider(iboMap)
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
      // viewer.terrainProvider = provider

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
      this.add3dtiles()
    },

    // 添加3dTile
    add3dtiles() {
      let tileUrls = ['https://www.cqdxzhny.com/cqny/one/tileset.json']

      for (const idx in tileUrls) {
        const tileset1 = new Cesium.Cesium3DTileset({
          url: tileUrls[idx]
        })
        tileset1.readyPromise.then(() => {
          viewer.scene.primitives.add(tileset1)
          // 贴地显示
          const height = 358.87282314740565
          const cartographic = Cesium.Cartographic.fromCartesian(tileset1.boundingSphere.center)
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
          tileset1.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
          if (~~idx === tileUrls.length - 1) {
            tileset = tileset1
            // viewer.zoomTo(
            //   tileset,
            //   new Cesium.HeadingPitchRange(
            //     0.0,
            //     -0.5,
            //     tileset.boundingSphere.radius * 2.0
            //   )
            // )
            // viewer.zoomTo(tileset)
            this.addTileEventListener()
          }
        })
      }

      // tileset.readyPromise.then(argument => {
      //   viewer.scene.primitives.add(tileset)
      //   viewer.zoomTo(
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
    },

    // 添加自定义鼠标事件
    addTileEventListener() {
      this.center = [107.22274218697211, 30.013263452056083]
      if (!this.center || !this.center.length) {
        const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
        this.center = [
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude)
        ]
      }
      this.cameraPosition = Cesium.Cartesian3.fromDegrees(this.center[0], this.center[1], 0)

      // 定义旋转中心点
      // this.rotateCenterPoint = viewer.entities.add({
      //   position: Cesium.Cartesian3.fromDegrees(this.center[0], this.center[1]),
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

      // viewer.zoomTo(this.rotateCenterPoint, offset)

      // 转经纬度
      // let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2)
      // let lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2)
      // let height = (cartographic.height / 1000).toFixed(2)
      // console.log(lat, lng, height)
      // console.log(cartographic)

      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
      this.cameraPitch = Cesium.Math.toRadians(-45)
      // 给定相机距离点多少距离飞行，这里取值为2500m
      const startTime = Cesium.JulianDate.fromDate(new Date())
      viewer.clock.startTime = startTime.clone() // 开始时间
      viewer.clock.currentTime = startTime.clone() // 当前时间
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED // 行为方式
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK // 时钟设置为当前系统时间; 忽略所有其他设置。
      // 相机的当前heading
      this.initialHeading = viewer.camera.heading
      // 00017392278
      // 107.22278584439623, 30.015782140446223
      // [107.22137177370278, 30.013419127647463]   [107.22227790879403, 30.01515835544826]
      // 初始视角
      const viewCenter = [this.center[0] - 0 + 0.00141407069, this.center[1] - 0 + 0.002363012789]
      const startViewPoint = Cesium.Cartesian3.fromDegrees(viewCenter[0], viewCenter[1], 0)
      viewer.scene.camera.setView({
        destination: startViewPoint, // 点的坐标
        orientation: {
          heading: Cesium.Math.toRadians(30) + this.initialHeading,
          pitch: this.cameraPitch
        }
      })
      viewer.scene.camera.moveBackward(1900)
      // viewer.clock.onTick.addEventListener(this.Exection)

      // 计时器 恢复锁定旋转
      // this.resetInterval = setInterval(() => {
      //   if (this.resetTime <= 60) this.resetTime++
      //   if (this.resetTime >= 60 && !this.screenLock) {
      //     this.screenLock = true
      //     viewer.clock.canAnimate = true // 时间轴暂停
      //     viewer.clock.shouldAnimate = true
      //     viewer.clock.onTick.addEventListener(this.Exection)
      //   }
      // }, 1000)

      // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      //   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      // )
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(
        this.viewerClick,
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )

      // viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(e => {
      //   this.resetTime = 0
      //   if (this.screenLock) {
      //     // 解除锁定自动旋转
      //     this.screenLock = false
      //     viewer.clock.canAnimate = false // 时间轴暂停
      //     viewer.clock.shouldAnimate = false
      //     this.resetTime = 0
      //     viewer.clock.onTick.removeEventListener(this.Exection)
      //   }
      //   // 获取到的是鼠标经过cesium的屏幕坐标
      // }, _this.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      // viewer.cesiumWidget.screenSpaceEventHandler.setInputAction(e => {
      //   const position = viewer.camera.pickEllipsoid(e.position)
      //   console.log(e)
      //   const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
      //     position
      //   )
      //   const lng = Cesium.Math.toDegrees(cartographic.longitude) // 经纬度
      //   const lat = Cesium.Math.toDegrees(cartographic.latitude)
      //   console.log(lng, lat)
      //   viewer.camera.flyTo({
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
      viewer.scene.postRender.addEventListener(() => {
        // console.log(e);
        if (this.infoPop) {
          const bubble = this.$refs.infoPop.$refs.popup
          const poph = bubble.offsetHeight
          const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            this.infoPop.geometry
          )
          bubble.style.left = position.x + 40 + 'px'
          bubble.style.top = position.y + 20 - poph + 'px'
        }
        if (this.videoPop) {
          const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            this.videoPop.geometry
          )
          const bubble = this.$refs.videoPop.$refs.popup
          const poph = bubble.offsetHeight
          bubble.style.left = position.x + 40 + 'px'
          bubble.style.top = position.y + 20 - poph + 'px'
        }
      })
    },

    // 旋转计时器函数
    Exection() {
      // if (this.rotateCenterPoint) viewer.zoomTo(this.rotateCenterPoint)

      // 当前已经过去的时间，单位s
      const delTime = Cesium.JulianDate.secondsDifference(
        viewer.clock.currentTime,
        viewer.clock.startTime
      )
      // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
      // 转动速度360 / 120
      this.cameraHeading = Cesium.Math.toRadians(delTime * (360 / 120)) + this.initialHeading
      viewer.scene.camera.setView({
        destination: this.cameraPosition, // 点的坐标
        orientation: {
          heading: this.cameraHeading,
          pitch: this.cameraPitch
        }
      })
      // viewer.scene.camera.moveUp(800)
      viewer.scene.camera.moveBackward(1500)
      if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
        viewer.clock.onTick.removeEventListener(this.Exection)
      }
    },

    // 锁定/解锁屏幕旋转
    setScreenLock() {
      this.screenLock = !this.screenLock
      viewer.clock.canAnimate = this.screenLock // 时间轴暂停
      viewer.clock.shouldAnimate = this.screenLock
      viewer.clock.onTick.removeEventListener(this.Exection)
      if (this.screenLock) {
        viewer.clock.onTick.addEventListener(this.Exection)
      }
    },

    // cesium点击事件
    viewerClick(e) {
      viewer.entities.remove({ id: 'clickBillboard' })

      const cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid)
      const pick = new Cesium.Cartesian2(e.position.x, e.position.y)
      const geometry = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene)
      console.log(e, geometry)
      if (cartesian) {
        const pickdObject = viewer.scene.pick(e.position)
        // const position = viewer.camera.pickEllipsoid(e.position)
        console.log(pickdObject)
        if (Cesium.defined(pickdObject) && pickdObject.id) {
          // 根据点击对象的id删除该对象
          // viewer.entities.getById(pickdObject.id._id).show = false // 隐藏标记
          this.openDialog(pickdObject.id, geometry)
        } else {
          const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(geometry)
          const lng = Cesium.Math.toDegrees(cartographic.longitude) // 经纬度
          const lat = Cesium.Math.toDegrees(cartographic.latitude)
          console.log([lng, lat], '点击地图获取坐标')
          // viewer.entities.add({
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
    },

    // 获取标记
    async getMarkers() {
      // const videoRes = await findByProjectAndType(this.$route.query.projectId)
      const videoData = [
        {
          lng: 107.2245,
          lat: 30.0147,
          height: 10,
          icon: videoMarkerImg,
          type: 'video',
          name: '标记4',
          id: 4
        },
        {
          lng: 107.2246,
          lat: 30.0147,
          height: 10,
          icon: videoMarkerImg,
          type: 'video',
          name: '标记5',
          id: 5
        }
      ]
      this.videoList = videoData.map(video => ({
        ...video,
        icon: videoMarkerImg,
        type: 'video'
      }))
      this.setMarkers(this.videoList)

      // const deviceRes = await getDevice(this.$route.query.projectId)
      const deviceData = [
        {
          lng: 107.22459,
          lat: 30.0147,
          height: 10,
          icon: deviceMarkerImg,
          type: 'info',
          name: '标记1',
          id: 1
        },
        {
          lng: 107.22459,
          lat: 30.0148,
          height: 10,
          icon: deviceMarkerImg,
          type: 'info',
          name: '标记3',
          id: 3
        }
      ]
      this.deviceList = deviceData.map(device => ({
        ...device,
        icon: deviceMarkerImg,
        type: 'info'
      }))
      this.setMarkers(this.deviceList)
    },

    // 设置标记
    setMarkers(data) {
      data.forEach(item => {
        viewer.entities.add({
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
    },

    // 打开弹窗
    openDialog({ name, id, type }, geometry) {
      console.log(name, id, type)
      if (type === 'info') {
        this.deviceList.forEach(device => {
          if (device.id === id) {
            this.infoPop = {
              ...device,
              type,
              geometry
            }
          }
        })
      } else if (type === 'video') {
        this.videoList.forEach(video => {
          if (video.id === id) {
            this.videoPop = {
              ...video,
              type,
              geometry
            }
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
// @import url(ThirdParty/Cesium/Widgets/widgets.css);
.cesiumContainer {
  width: 100vw;
  height: 100vh;
  .mapContainer {
    width: 100%;
    height: 100%;
  }
  .screenLock {
    display: flex;
    justify-content: center;
    align-content: center;
    position: absolute;
    top: 12px;
    right: 250px;
    width: 32px;
    height: 32px;
    // background-color: #111213;
    cursor: pointer;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .baseInfoBox {
    padding: 12px;
    width: 380px;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    overflow: hidden;
    border-radius: 4px;
    color: #fff;
  }
}
</style>

<style lang="scss">
.cesiumContainer {
  .cesium-viewer-animationContainer {
    display: none !important;
  }
}
</style>
