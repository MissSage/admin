<template>
  <div class="maptools-view">
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="xzqh"
    >行政区导航</span>
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="maptree"
    >目录树管理</span>
    <el-dropdown
      trigger="click"
      class="maptools-item"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right" /> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            icon="el-icon-plus"
            command="distance"
          >
            距离测量
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-circle-plus"
            command="area"
          >
            面积测量
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-edit"
            command="diymeasurement_distance"
          >
            自定义测量(长度)
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-edit"
            command="diymeasurement_area"
          >
            自定义测量(面积)
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown
      trigger="click"
      class="maptools-item"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right" /> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            icon="el-icon-search"
            command="spacequery"
          >
            空间查询
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-film"
            command="morescreen"
          >
            多屏对比
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-reading"
            command="swipanalyst"
          >
            卷帘分析
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-picture-outline"
            command="printmap"
          >
            地图打印
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-view"
            command="openPopup"
          >
            开启图层弹窗
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="clear"
    >清屏</span>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useGlobal from '@/composables/useGlobal'
import useMapTools2D from '@/composables/useMapTools/useMapTools2D'
const store = useStore()
const router = useRouter()
const { Global } = useGlobal()
const {
  initDistanceMap2D,
  initAreaMap2D,
  initDIYMeasurement2D,
  initSpaceQuery2D,
  handlePrintMap2D,
  initSwipe2D,
  openMapPopup2D,
  handleClearMap2D
} = useMapTools2D()

const handleMapToolsitemClick = (e:any) => {
  switch (e.target.id) {
    case 'xzqh':
      openXZQHPannel()
      break
    case 'maptree':
      openMapTreePannel()
      break
    case 'clear':
      handleClearMap2D()
      break
    default:
      break
  }
}
const handleCommand = (command:string) => {
  switch (command) {
    case 'distance':
      initDistanceMap2D()
      break
    case 'area':
      initAreaMap2D()
      break
    case 'diymeasurement_distance':
      initDIYMeasurement2D('distance')
      break
    case 'diymeasurement_area':
      initDIYMeasurement2D('area')
      break
    case 'spacequery':
      initSpaceQuery2D()
      break
    case 'morescreen':
      router.push('/onemap/one')
      break
    case 'swipanalyst':
      initSwipe2D()
      break
    case 'printmap':
      handlePrintMap2D()
      break
    case 'openPopup':
      openMapPopup2D()
      break
    default:
      break
  }
}
const openXZQHPannel = () => {
  const currentVisible = store.getters._getDefaultXZQHVisible
  store.commit('_setDefaultXZQHVisible', !currentVisible)
}
const openMapTreePannel = () => {
  const currentVisible = store.getters._getDefaultMapTreeVisible
  store.commit('_setDefaultMapTreeVisible', !currentVisible)
}
onMounted(() => {
  const checkView = setInterval(() => {
    if (Global) {
      // _initSketchTool()
      clearInterval(checkView)
    }
  }, 200)
})
</script>

<style>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>
