<template>
  <div class="mapContainer wushui">
    <div id="mapView"></div>
    <LayerSwitcher :layer-types="layerTree" :legend="legend" @setLayer="setLayer" />
    <LeftContainer
      @openScadaDialog="openScadaDialog"
      @openChartBox="openChartBox"
      @mapPlanTo="mapPlanTo"
    />
    <div class="selectBox">
      <!-- <el-select
        v-model="projectId"
        class="projectSelect"
        :popper-append-to-body="false"
        placeholder="请选择"
      >
        <el-option label="所有项目" value="0"> </el-option>
        <el-option label="项目1" value="1"> </el-option>
        <el-option label="项目2" value="2"> </el-option>
        <el-option label="项目3" value="3"> </el-option>
      </el-select> -->
      <Treeselect
        ref="treeSelect"
        v-model="projectId"
        :options="projectTree"
        style="width: 200px"
        :normalizer="areaNormalizer"
        placeholder="所有项目"
        no-options-text="无数据"
        no-results-text="无匹配数据"
        :clearable="false"
      ></Treeselect>
      <el-select v-model="dataType" :popper-append-to-body="false" placeholder="请选择">
        <el-option label="压力" value="1"> </el-option>
        <el-option label="流量" value="2"> </el-option>
      </el-select>
    </div>
    <ScadaDialog :scada-info="scadaDialogConfig" />
    <ChartBox :config="chartBoxConfig" />
  </div>
</template>

<script lang="ts">
import * as L from 'leaflet'
import 'leaflet.chinatmsproviders'
import LayerSwitcher from './components/layerSwitcher.vue'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import LeftContainer from './components/leftTabContainer.vue'
import ScadaDialog from './components/scadaDIalog.vue'
import ChartBox from './components/chartBox.vue'
import { getPipeList, getPipeNodeList, getValveList } from '@/api/pipeLine'
import useGlobal from '@/hooks/global/useGlobal'
import { getDatasList } from '@/api/device'
import { getProjectRoot } from '@/api/project'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default defineComponent({
  components: { LayerSwitcher, LeftContainer, Treeselect, ScadaDialog, ChartBox },

  setup() {
    const { $messageWarning, $formatTree } = useGlobal()
    const mapLayers: SubParams = {}

    // 初始化图层控件结构
    const layerTree = ref<any>({
      guanxian: {
        label: '管线类',
        children: {
          pipeline: { icon: 'icon-baogao', label: '管线', visible: true },
          valve: { icon: 'icon-baogao', label: '阀门', visible: true },
          pump: { icon: 'icon-baogao', label: '水泵', visible: false }
        }
      },
      jiedian: {
        label: '节点类',
        children: {
          node: { icon: 'icon-baogao', label: '节点', visible: true },
          tower: { icon: 'icon-baogao', label: '水塔', visible: false },
          cistern: { icon: 'icon-baogao', label: '水池', visible: false }
        }
      },
      device: {
        label: '设备类',
        children: {
          meter: { icon: 'icon-baogao', label: '水表', visible: false },
          fireTied: { icon: 'icon-baogao', label: '消防栓', visible: false }
        }
      },
      scada: {
        label: 'SCADA',
        children: {
          yali: {
            icon: 'icon-baogao',
            label: '压力监测点',
            visible: false
          },
          liuliang: {
            icon: 'icon-baogao',
            label: '流量监测点',
            visible: false
          },
          pumpStation: {
            icon: 'icon-baogao',
            label: '水厂泵站',
            visible: true
          }
        }
      }
    })

    // 初始化图层结构
    for (const key in layerTree.value) {
      mapLayers[key] = {}
    }

    // 地图对象
    let mapView: any = null

    // 初始化地图
    const initMap = () => {
      const LayerConfig = {
        maxZoom: 17,
        minZoom: 4,
        zoomOffset: 1
      }
      // 自定义图层 天地图key: 0ff12fb2d76b77d4cf2f3dddf3d09c75
      const tiandituLayerUrl =
        '&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=0ff12fb2d76b77d4cf2f3dddf3d09c75'
      // const normalMapm = L.tileLayer(
      //   'http://t3.tianditu.com/vec_c/wmts?layer=vec' + tiandituLayerUrl,
      //   LayerConfig
      // )
      // const normalMapa = L.tileLayer(
      //   'http://t0.tianditu.gov.cn/cva_c/wmts?layer=cva' + tiandituLayerUrl,
      //   LayerConfig
      // )
      const imgMapm = L.tileLayer(
        'http://t0.tianditu.gov.cn/img_c/wmts?layer=img' + tiandituLayerUrl,
        LayerConfig
      )
      const imgMapa = L.tileLayer(
        'http://t0.tianditu.gov.cn/cia_c/wmts?layer=cia' + tiandituLayerUrl,
        LayerConfig
      )
      // const normalMap = L.layerGroup([normalMapm, normalMapa])
      const imgMap = L.layerGroup([imgMapm, imgMapa])
      // const terrainMap = L.layerGroup([terrainMapm, terrainMapa])
      // const baseLayers = { 行政: normalMap, 卫星: imgMap }
      mapView = L.map('mapView', {
        center: [40.02404009136253, 116.50641060224784],
        zoom: 4,
        crs: L.CRS.EPSG4326,
        layers: [imgMap],
        zoomControl: false,
        scrollWheelZoom: true, // 默认开启鼠标滚轮缩放
        attributionControl: false
      })
      // L.control.layers(baseLayers).addTo(mapView)
      // L.tileLayer(
      //   'https://api.mapbox.com/styles/v1/huangmiliang/cksjwkr9674je18qxrhf3skei/draft/tiles/256/{z}/{x}/{y}?access_token=sk.eyJ1IjoiaHVhbmdtaWxpYW5nIiwiYSI6ImNrc2p4NXRhYzE2OXAzMW1ibG5lNXdnajQifQ.FtgPAgEcxK9pV7M74JcOkQ',
      //   {
      //     minZoom: 4,
      //     subdomains: '1234'
      //   }
      // ).addTo(mapView)
    }

    const mapPlanTo = (position: [number, number]) => {
      console.log(position, 'position')

      let center = L.latLng(...position)
      // 平移
      mapView.panTo(center)
    }

    // 图层控件控制图层显示隐藏
    const setLayer = (typeKey, childKey, visible) => {
      console.log(typeKey, childKey, visible)
      layerTree.value[typeKey].children[childKey].visible = visible
      mapLayers[typeKey][childKey].remove()
      if (!visible) {
        mapLayers[typeKey][childKey].remove()
      } else {
        console.log(mapLayers[typeKey][childKey])

        // for (const key in mapLayers[typeKey][childKey]._layers) {
        //   if (mapLayers[typeKey][childKey]._layers[key].getBounds)
        //     mapView.fitBounds(mapLayers[typeKey][childKey]._layers[key].getBounds())
        //   break
        // }
        mapView.addLayer(mapLayers[typeKey][childKey])
      }
    }

    const dataViewer = ref<any>(null)

    const projectTree = ref<any>([])
    const projectId = ref<string>('1')
    const treeSelect = ref<any>(null)

    onMounted(() => {
      initMap()
      getGuanxianPipeline('guanxian', 'pipeline')
      getJiedianNode('jiedian', 'node')
      getScadaPumpStation('scada', 'pumpStation')
      getGuanxianValve('guanxian', 'valve')
      // getGuanxianPump('guanxian', 'pump')
      getProjectRoot(false).then(res => {
        const treeData = $formatTree(res.data)
        treeData.unshift({ label: '所有项目', value: '1' })
        projectTree.value = treeData
        projectId.value = treeData[0].value
        // console.log(treeSelect.value, treeData, projectId.value)
        // treeSelect.value.addValue({ label: '所有项目', value: '1' })
      })
      // 监听地图弹窗点击事件
      document.addEventListener('click', mapDocumentClickEvent)
    })

    const mapDocumentClickEvent = e => {
      if ((e.target as HTMLElement).className === 'popupTitle') {
        dataViewer.value.tableClick('', (e.target as HTMLElement).dataset.idx)
      }
    }

    onBeforeUnmount(() => document.removeEventListener('click', mapDocumentClickEvent))

    // 标点点击事件
    const handleMapMarerClick = item => {
      console.log(item)
    }

    let polylinePopup: any = null

    // 管线点击事件
    const polylineClick = async (e: any, pipe: any) => {
      if (polylinePopup) polylinePopup.remove()
      const res = await getDatasList(pipe.deviceId, { page: 1, size: 9999999 })

      let pHtmls = ''
      res.data.data.forEach(
        item =>
          (pHtmls += `<p class="popupInfo"><i class="iconfont icon-"></i>${item.propertyName}: ${
            item.value || '-'
          }${pipe.unit || ''}</p>`)
      )

      polylinePopup = L.popup({
        minWidth: 100,
        className: 'mypopup',
        maxWidth: 150,
        closeButton: false,
        autoClose: false,
        closeOnClick: false
      })
        .setLatLng(e.latlng)
        .setContent(`<h1 class="dataInfoTile">${pipe.name}</h1>${pHtmls}`)
        .openOn(mapView)
      mapPlanTo([e.latlng.lat, e.latlng.lng])
    }

    // 获取、渲染管线
    const getGuanxianPipeline = async (typeKey, childKey) => {
      const res = await getPipeList({ page: '1', size: '9999999' })

      if (res.status !== 200) {
        return $messageWarning('获取管线失败！')
      }
      const polylines: any = []
      res.data.data.forEach(pipe => {
        if (!pipe.startPointLocation || !pipe.endPointLocation) return
        const start = pipe.startPointLocation.split(',').reverse()
        const end = pipe.endPointLocation.split(',').reverse()

        // 画管线
        const polyline = L.polyline([start, end] as any, {
          color: 'rgb(51, 136, 255)',
          weight: 4
        })
        console.log((polyline as any).click)
        polyline.on('click', (e: any) => polylineClick(e, pipe))
        polylines.push(polyline)
      })

      mapLayers[typeKey][childKey] = L.layerGroup(polylines)

      for (const key in mapLayers[typeKey][childKey]._layers) {
        mapView.fitBounds(mapLayers[typeKey][childKey]._layers[key].getBounds())
        break
      }

      setLayer(typeKey, childKey, layerTree.value[typeKey].children[childKey].visible)
    }

    const getGuanxianValve = async (typeKey, childKey) => {
      const res = await getValveList({ page: 1, size: 999999 })
      console.log(res.data, 'getValveListgetValveList')

      const markers: any[] = []
      var icon4 = L.divIcon({
        html: `<div class='iconfont icon-famen iconMarker' style='color:#fff;'></div>`,
        className: 'ss',
        iconAnchor: [10, 10]
      })
      res.data.data.forEach((valve: any) => {
        const marker = L.marker(valve.location.split(',').reverse() as [number, number], {
          icon: icon4
        })
        markers.push(marker)
        marker.on(`click`, (e: any) => {
          handleMapMarerClick(valve)
          mapPlanTo([e.latlng.lat, e.latlng.lng])
        })
      })
      mapLayers[typeKey][childKey] = L.layerGroup(markers)
      setLayer(typeKey, childKey, layerTree.value[typeKey].children[childKey].visible)

      // const popups: any[] = []
      // const popup = L.popup({
      //   minWidth: 100,
      //   className: 'mypopup',
      //   maxWidth: 150,
      //   closeButton: false,
      //   autoClose: false,
      //   closeOnClick: false
      // })
      //   .setLatLng(valve.location.split(',').reverse() as [number, number])
      //   .setContent(
      //     `<h1 class="popupTitle">发布消息</h1>
      //     <p class="popupInfo"><i class="iconfont icon-fasong"></i>当前信息</p>
      //     <p class="popupInfo"><i class="iconfont icon-fasong"></i>实时状态</p>`
      //   )
      // popups.push(popup)
    }

    // const getGuanxianPump = (typeKey, childKey) => {
    //   const data = [
    //     [30.6174373626709, 104.05338048934937],
    //     [30.61741054058075, 104.05378818511963],
    //     [30.617303252220154, 104.05462503433228],
    //     [30.61693847179413, 104.05508637428284],
    //     [30.616294741630554, 104.05507028102875],
    //     [30.615763664245605, 104.05492007732391],
    //     [30.61588168144226, 104.05453383922577],
    //     [30.616214275360107, 104.0541422367096],
    //     [30.6161230802536, 104.05360043048859],
    //     [30.61593532562256, 104.0530264377594],
    //     [30.61641275882721, 104.05274212360382],
    //     [30.61591386795044, 104.05201256275177],
    //     [30.61517894268036, 104.05205547809601],
    //     [30.61513066291809, 104.05430316925049],
    //     [30.61513066291809, 104.05541360378265],
    //     [30.61562418937683, 104.05658841133118],
    //     [30.616257190704346, 104.05664205551147],
    //     [30.615817308425903, 104.05741453170776],
    //     [30.61488926410675, 104.05725359916687],
    //     [30.61442255973816, 104.0557461977005],
    //     [30.61418652534485, 104.05476987361908],
    //     [30.613532066345215, 104.05422806739807],
    //     [30.613108277320862, 104.05350923538208],
    //     [30.613505244255066, 104.05284941196442]
    //   ]
    //   const markers: any[] = []
    //   var icon4 = L.divIcon({
    //     html: "<div style='width:12px;height:12px;border-radius:4px;background-color:#00e400 ;'></div>",
    //     className: 'ss'
    //   })
    //   for (const item of data) {
    //     const marker = L.marker(item as [number, number], { icon: icon4 })
    //     markers.push(marker)
    //     marker.on(`click`, () => {
    //       handleMapMarerClick(item)
    //     })
    //   }
    //   mapLayers[typeKey][childKey] = L.layerGroup(markers)
    //   setLayer(typeKey, childKey, layerTree.value[typeKey].children[childKey].visible)
    //   // this.mapView.removeLayer(popupsLayer)
    // }

    // 地图管道节点标点
    const getJiedianNode = async (typeKey, childKey) => {
      const res = await getPipeNodeList({ page: 1, size: 999999 })
      console.log(res, 'getPipeNodeList')

      const markers: any[] = []
      var icon4 = L.divIcon({
        html: `<div class='iconfont icon-jiedian iconNodeMarker' style='color:${getColorByLegend(
          12
        )} ;'></div>`,
        className: 'ss'
      })
      for (const item of res.data.data) {
        const marker = L.marker(item.location.split(',').reverse() as [number, number], {
          icon: icon4
        })
        markers.push(marker)
        marker.on(`click`, (e: any) => {
          handleMapMarerClick(item)
          mapPlanTo([e.latlng.lat, e.latlng.lng])
        })
      }
      mapLayers[typeKey][childKey] = L.layerGroup(markers)
      setLayer(typeKey, childKey, layerTree.value[typeKey].children[childKey].visible)
      // this.mapView.removeLayer(popupsLayer)
    }

    // 组态弹窗
    const scadaDialogConfig = ref<ChangzhanDialog>({
      visible: false,
      title: '组态详情',
      close: () => (scadaDialogConfig.value.visible = false),
      url: ''
    })

    // 打开组态弹窗
    const openScadaDialog = (item: ChangzhanData) => {
      scadaDialogConfig.value.title = item.name
      scadaDialogConfig.value.url = item.scada
      scadaDialogConfig.value.visible = true
    }

    // 场站列表
    const changzhanList = ref<ChangzhanData[]>([
      {
        name: '自来水厂',
        address: '甘孜藏族自治州解放东街道孚一中北',
        location: [101.12823194921312, 30.98799702519725],
        scada: 'http://139.155.92.140:7081/viewer/GZLNkrhVipKuE4go'
      }
    ])

    // 地图场站标点 点击弹窗
    const getScadaPumpStation = async (typeKey, childKey) => {
      const markers: any[] = []
      var icon4 = L.divIcon({
        html: "<div style='width:16px;height:16px;border-radius:6px;background-color:red ;'></div>",
        className: 'ss'
      })
      for (const item of changzhanList.value) {
        const marker = L.marker(item.location.reverse() as [number, number], {
          icon: icon4,
          title: item.name
        })
        markers.push(marker)
        marker.on(`click`, (e: any) => {
          openScadaDialog(item)
          mapPlanTo([e.latlng.lat, e.latlng.lng])
        })
      }
      mapLayers[typeKey][childKey] = L.layerGroup(markers)
      setLayer(typeKey, childKey, layerTree.value[typeKey].children[childKey].visible)
      // this.mapView.removeLayer(popupsLayer)
    }

    // chartbox配置
    const chartBoxConfig = ref<any>({
      visible: false,
      title: '',
      close: () => (chartBoxConfig.value.visible = false),
      data: []
    })

    // 打开chart图 并传入数据
    const openChartBox = (data: any) => {
      chartBoxConfig.value.data = data
      chartBoxConfig.value.visible = true
    }

    // ---------图例管路---------
    const legend = ref<{ color: string; label: string; max?: number; min?: number }[]>([
      { color: '#A6E1FF', label: '小于36', max: 36 },
      { color: '#6DB5D9', label: '36~180', min: 36, max: 180 },
      { color: '#59C7FF', label: '180~360', min: 180, max: 360 },
      { color: '#1F729C', label: '360~720', min: 360, max: 720 },
      { color: '#0C3F59', label: '大于等于720', min: 720 }
    ])

    // 根据图例获取颜色
    const getColorByLegend = (val: number | string) => {
      for (const item of legend.value) {
        let minable = false
        let maxable = false
        minable = val >= (item.min as number)
        maxable = val < (item.max as number)
        if (!item.min) minable = true
        if (!item.max) maxable = true
        if (minable && maxable) return item.color
      }
    }

    return {
      layerTree,
      setLayer,
      dataViewer,
      dataType: ref<string>('1'),
      areaNormalizer: (node: any) => {
        return {
          id: node.value,
          label: node.label
        }
      },
      projectTree,
      treeSelect,
      scadaDialogConfig,
      changzhanList,
      openScadaDialog,
      chartBoxConfig,
      openChartBox,
      mapPlanTo,
      legend
    }
  },

  // 多边形绘制
  data() {
    return {
      // areaPoints: [],
      // areaGeometry: [],
      // areaLineLayer: new L.polyline([], { weight: 6 }),
      // areaTempLinesLayer: new L.polyline([], { dashArray: 5, weight: 4 }),
      // areaAllow: true
    }
  },
  methods: {
    // 设置绘制区域事件
    // setDrawArea() {
    //   this.mapView.on('click', e => {
    //     if (!this.areaPoints.length) {
    //       this.areaGeometry.map(item => item.remove())
    //     }
    //     this.areaPoints.push([e.latlng.lat, e.latlng.lng])
    //     console.log(this.areaPoints)
    //     this.areaLineLayer.addLatLng(e.latlng)
    //     this.mapView.addLayer(this.areaTempLinesLayer)
    //     this.mapView.addLayer(this.areaLineLayer)
    //     const node = L.circle(e.latlng, {
    //       color: 'rgb(51, 136, 255)',
    //       fillColor: 'white',
    //       fillOpacity: 1,
    //       radius: 10
    //     })
    //     this.mapView.addLayer(node)
    //     this.areaGeometry.push(node)
    //   }) // 点击地图
    //   this.mapView.on('dblclick', () => {
    //     this.areaGeometry.push(L.polygon(this.areaPoints).addTo(this.mapView))
    //     this.areaPoints = []
    //     // map.removeLayer(this.areaTempLinesLayer)
    //     // this.areaTempLinesLayer.remove()
    //     this.areaLineLayer.remove()
    //     this.areaTempLinesLayer.remove()
    //     this.areaLineLayer = new L.polyline([])
    //   })
    //   this.mapView.on('mousemove', e => {
    //     if (this.areaPoints.length > 0) {
    //       const ls = [
    //         this.areaPoints[this.areaPoints.length - 1],
    //         [e.latlng.lat, e.latlng.lng],
    //         this.areaPoints[0]
    //       ]
    //       this.areaTempLinesLayer.setLatLngs(ls)
    //       // map.addLayer(this.areaTempLinesLayer)
    //     }
    //   }) // 双击地图
    // }
  }
})
</script>

<style lang="scss" scoped>
$baseColor: #fff;
.mapContainer {
  width: 100%;
  height: 100%;
  #mapView {
    width: 100%;
    height: 100%;
  }
  .selectBox {
    width: 196px;
    height: 40px;
    background: #25262d;
    border-radius: 4px;
    position: absolute;
    left: 352px;
    top: 16px;
    z-index: 2000;
    display: flex;
  }
}
</style>

<style lang="scss">
.iconMarker {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.iconfont::before {
    font-size: 16px !important;
  }
}
.iconNodeMarker {
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.iconfont::before {
    font-size: 12px !important;
  }
}
.wushui.mapContainer {
  ::-webkit-scrollbar {
    height: 0 !important;
    width: 0px !important;
    display: none !important;
  }
  .el-input__inner {
    background-color: #25262d !important;
    color: #fff !important;
    border: none !important;
    font-size: 12px;
  }

  .projectSelect {
    position: relative;
    &::after {
      content: ' ';
      width: 1px;
      height: 24px;
      position: absolute;
      top: 8px;
      right: 0;
      background-color: #383a43;
    }
    .el-input__inner {
      color: #598dff !important;
    }
  }

  .el-autocomplete__popper,
  .el-select__popper,
  .el-select-dropdown {
    color: #fff !important;
    background-color: #25262d !important;
    border: none !important;
    .selected {
      background-color: #36373d !important;
    }
    .el-scrollbar__view > li,
    .selected {
      color: #fff !important;
      &:hover {
        background-color: #36373d !important;
      }
    }
    .el-popper__arrow::before {
      border: none !important;
      background-color: #25262d !important;
    }
  }
  .mypopup {
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    max-width: 150px;
    border: 1px solid #406ed8;
    min-width: 100px;
    cursor: pointer;
    .popupTitle {
      text-align: center;
      color: #fff;
      margin: 0;
      padding: 0 5px;
      background-color: #406ed8;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .dataInfoTile {
      text-align: center;
      padding: 16px;
      color: #fff;
      height: 36px;
      line-height: 36px;
      margin: 0;
      padding: 0 16px 0 10px;
      background-color: #406ed8;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .popupInfo {
      height: 32px;
      line-height: 32px;
      color: #333;
      margin: 0;
      padding: 0 16px 0 5px;
    }
  }
  .leaflet-popup-content {
    margin: 0;
  }

  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 4px;
  }
  .leaflet-tile {
    // -webkit-filter: grayscale(70%) invert(100%) brightness(100%) contrast(100%)
    //   hue-rotate(111111111deg) saturate(200%) sepia(0%) !important;
    // opacity: 0.5 !important;
  }

  .el-table.el-table--mini {
    background-color: transparent;
    .current-row {
      background: #598dff !important;
      border-radius: 2px;
    }
    .el-table__header-wrapper,
    .el-table__body-wrapper {
      background-color: transparent;

      .el-table__header {
        background-color: transparent;
        border-bottom: 1px solid #3a3b44;
        .cell {
          font-size: 12px;
          font-weight: normal;
          color: #808184;
        }
        th {
          background-color: transparent;
          height: 24px;
          border: none;
        }
        tr {
          height: 24px;

          background-color: transparent;
        }
      }

      .el-table__body {
        tr {
          height: 24px;
          background-color: transparent;

          &:hover {
            td {
              background-color: transparent; // 可 $bg-color1;
            }

            .cell {
              background-color: transparent;
              color: #fff;
            }
          }

          th,
          td {
            height: 24px;
            background-color: transparent;
            padding: 3px;
            border: none;
            font-family: PingFangSC-Regular, PingFang SC;
          }

          .cell {
            color: #fff;
          }

          .is-leaf {
            border-bottom: 1px solid #4e5166;
          }

          td {
            background-color: transparent;
            font-size: 12px;
            font-weight: normal;
          }
        }

        tr.hover-row > td {
          background-color: transparent;
        }
      }
    }
  }

  .vue-treeselect__control {
    border: none !important;
  }

  .vue-treeselect__placeholder {
    color: #598dff !important;
    line-height: 40px !important;
    font-size: 12px !important;
  }
  .vue-treeselect__single-value {
    line-height: 40px !important;
    color: #598dff !important;
    font-size: 12px !important;
  }
  .vue-treeselect__menu {
    color: #fff !important;
    background-color: #25262d !important;
    font-size: 12px !important;
    border: none !important;
    margin-top: 12px;
  }
  .vue-treeselect__option {
    height: 34px;
    line-height: 34px;
  }
  .vue-treeselect__option:hover {
    background-color: #36373d !important;
  }
  .vue-treeselect__option--selected {
    color: #598dff !important;
  }
}
</style>
