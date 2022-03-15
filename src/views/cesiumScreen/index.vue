<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" class="mapContainer"></div>
    <VideoPopup
      ref="videoPopComponent"
      :style="{ width: '380px', display: videoPop ? 'block' : 'none' }"
      :config="videoPop"
      @close="closeVideo"
    />
    <InfoPopup
      ref="infoPopComponent"
      :style="{ width: '460px', display: infoPop ? 'block' : 'none' }"
      :config="infoPop"
      @close="closeInfo"
    />
    <!-- <div @click="setScreenLock" class="screenLock"><i class="iconfont" :class="{'icon-mima':screenLock,'icon-yulan1':!screenLock}"></i></div> -->
    <div class="screenLock" @click="setScreenLock">
      <img :src="screenLock ? stopIcon : startIcon" />
    </div>
  </div>
</template>

<script lang="ts">
// import * as Cesium from 'cesium'

import VideoPopup from './components/videoPopup.vue'
import InfoPopup from './components/infoPopup.vue'

import deviceMarkerImg from './img/deviceMarker.png'
// import markerImg from './img/marker.png'
import videoMarkerImg from './img/videoMarker.png'
import startIcon from '@/assets/icons/start.png'
import stopIcon from '@/assets/icons/stop.png'
import { defineComponent, ref, onMounted } from 'vue'
import useCesium from '@/hooks/cesium/useCesium'
// import * as Cesium from 'cesium/Cesium'

export default defineComponent({
  components: {
    VideoPopup,
    InfoPopup
  },
  setup(props: any, ctx) {
    const infoPop = ref<any>(null)
    const videoPop = ref<any>(null)
    const infoPopComponent = ref<any>(null)
    const videoPopComponent = ref<any>(null)
    // 标记点击事件 打开弹窗
    const markerClick = ({ name, id, type }, geometry: any) => {
      console.log(name, id, type)
      if (type === 'info') {
        deviceList.value.forEach(device => {
          if (device.id === id) {
            infoPop.value = {
              ...device,
              type,
              geometry
            }
          }
        })
      } else if (type === 'video') {
        videoList.value.forEach(video => {
          if (video.id === id) {
            videoPop.value = {
              ...video,
              type,
              geometry
            }
          }
        })
      }
    }

    // 初始化cesium
    const { setMarkers, setScreenLock, add3dtiles, Cesium, viewer, screenLock } = useCesium(
      props,
      ctx,
      {
        dom: 'cesiumContainer',
        center: [107.22274218697211, 30.013263452056083],
        markerClick: markerClick
      }
    )

    // 渲染事件  渲染时改变弹窗定位
    const postRenderFunction = () => {
      // console.log(e);
      if (infoPop.value) {
        const bubble = infoPopComponent.value.$refs.popup
        const poph = bubble.offsetHeight
        const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.value.scene,
          infoPop.value.geometry
        )
        bubble.style.left = position.x + 40 + 'px'
        bubble.style.top = position.y + 20 - poph + 'px'
      }
      if (videoPop.value) {
        const position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.value.scene,
          videoPop.value.geometry
        )
        const bubble = videoPopComponent.value.$refs.popup
        const poph = bubble.offsetHeight
        bubble.style.left = position.x + 40 + 'px'
        bubble.style.top = position.y + 20 - poph + 'px'
      }
    }

    onMounted(() => {
      getMarkers()
      add3dtiles(
        ['https://www.cqdxzhny.com/cqny/one/tileset.json'],
        [107.22274218697211, 30.013263452056083],
        postRenderFunction
      )
    })

    const videoList = ref<any[]>([])
    const deviceList = ref<any[]>([])

    // 获取标记
    const getMarkers = async () => {
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
      videoList.value = videoData.map(video => ({
        ...video,
        icon: videoMarkerImg,
        type: 'video'
      }))
      setMarkers(videoList.value)

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
      deviceList.value = deviceData.map(device => ({
        ...device,
        icon: deviceMarkerImg,
        type: 'info'
      }))
      setMarkers(deviceList.value)
    }

    const closeVideo = () => (videoPop.value = null)
    const closeInfo = () => (infoPop.value = null)

    return {
      infoPop,
      videoPop,
      infoPopComponent,
      videoPopComponent,
      startIcon: ref<any>(startIcon),
      stopIcon: ref<any>(stopIcon),
      screenLock,
      setScreenLock,
      closeVideo,
      closeInfo
    }
  }
})
</script>

<style lang="scss" scoped>
// @import url(ThirdParty/Cesium/Widgets/widgets.css);
.cesiumContainer {
  // width: 100vw;
  // height: 100vh;
  width: 100%;
  height: 100%;
  position: relative;
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
    position: absolute;
    overflow: hidden;
    border-radius: 4px;
    color: #fff;
    &.right {
      width: 420px;
    }
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
