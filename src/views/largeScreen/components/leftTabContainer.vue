<template>
  <div class="mapLeftContainer" :class="{ opened: tabOpened }">
    <el-autocomplete
      v-model="state1"
      class="filterInput"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      :trigger-on-focus="false"
      :popper-append-to-body="false"
      style="width: 320px"
      @select="handleSelect"
    >
      <template #suffix>
        <Hamburger
          class="hamburger-container"
          :class="{ rotateHamburger: !tabOpened }"
          :is-active="tabOpened"
          :toggle-click="toggleSideBar"
        ></Hamburger>
      </template>
    </el-autocomplete>
    <div class="dataViewer" :class="{ tabOpened: !tabOpened }">
      <div class="tabHeader">
        <div
          class="tabItem"
          :class="{ active: curTab === 'yunxing' }"
          @click="selectTab('yunxing')"
        >
          <i class="iconfont icon-yunhang1"></i>
          <span>运行</span>
        </div>
        <div class="tabItem" :class="{ active: curTab === 'yali' }" @click="selectTab('yali')">
          <i class="iconfont icon-yalijiance"></i>
          <span>压力</span>
        </div>
        <!-- <div
          class="tabItem"
          :class="{ active: curTab === 'liuliang' }"
          @click="selectTab('liuliang')"
        >
          <i class="iconfont icon-liuliangjiance"></i>
          <span>流量</span>
        </div> -->
        <div
          class="tabItem"
          :class="{ active: curTab === 'changzhan' }"
          @click="selectTab('changzhan')"
        >
          <i class="iconfont icon-shuichangguanli"></i>
          <span>厂站</span>
        </div>
      </div>
      <YunxingTab
        v-if="curTab === 'yunxing'"
        @setRestaurants="setRestaurants"
        @openChartBox="openChartBox"
        @mapPlanTo="mapPlanTo"
      />
      <YaliTab v-if="curTab === 'yali'" @setRestaurants="setRestaurants" />
      <LiuliangTab v-if="curTab === 'liuliang'" @setRestaurants="setRestaurants" />
      <ChangzhanTab
        v-if="curTab === 'changzhan'"
        @setRestaurants="setRestaurants"
        @openScadaDialog="openScadaDialog"
        @mapPlanTo="mapPlanTo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Hamburger from '@/components/Hamburger/index.vue'
import YunxingTab from './yunxingTab.vue'
import YaliTab from './yaliTab.vue'
import LiuliangTab from './liuliangTab.vue'
import ChangzhanTab from './changzhanTab.vue'

export default defineComponent({
  components: { Hamburger, YunxingTab, YaliTab, LiuliangTab, ChangzhanTab },
  setup(props, ctx) {
    // 搜索框
    const restaurants = ref<any[]>([])
    const querySearch = (queryString, cb) => {
      var results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value
      // 调用 callback 返回建议列表的数据
      cb(results)
    }
    const createFilter = queryString => {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    }

    const handleSelect = item => {
      console.log(item)
    }

    const setRestaurants = (data: any[]) => (restaurants.value = data)

    // 下拉显示切换
    const tabOpened = ref<boolean>(false)
    const toggleSideBar = () => (tabOpened.value = !tabOpened.value)

    const curTab = ref<string>('yunxing')
    const selectTab = (val: string) => (curTab.value = val)

    const openScadaDialog = (item: ChangzhanData) => ctx.emit('openScadaDialog', item)
    const openChartBox = (data: any) => ctx.emit('openChartBox', data)
    const mapPlanTo = (center: [number, number]) => ctx.emit('mapPlanTo', center)

    return {
      restaurants,
      state1: ref(''),
      querySearch,
      createFilter,
      handleSelect,
      tabOpened,
      toggleSideBar,
      curTab,
      selectTab,
      setRestaurants,
      openScadaDialog,
      openChartBox,
      mapPlanTo
    }
  }
})
</script>

<style lang="scss">
.mapLeftContainer {
  .filterInput {
    margin-bottom: 12px;
    .el-input__inner {
      background-color: #25262d !important;
      color: #fff !important;
      border: none !important;
    }
    .hamburger-container {
      width: 40px;
      height: 40px;
      background: #598dff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-input__suffix {
      right: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.mapLeftContainer {
  &.opened {
    height: calc(100% - 32px);
  }
  font-size: 12px !important;
  transition: all 0.5s ease;
  // padding: 52px 0 12px;
  height: 40px;
  width: 320px;
  overflow: hidden;
  left: 16px;
  top: 16px;
  background: transparent;
  z-index: 2000;
  position: absolute;
}
.dataViewer {
  &.tabOpened {
    transform-origin: 0 0;
    transform: rotateX(90deg);
  }
  width: 320px;
  height: calc(100% - 52px);
  transform: rotateX(0deg);

  overflow: hidden;
  background-color: #25262d;
  border-radius: 4px;
  color: #fff;
  transition: all 0.5s ease;

  .tabHeader {
    display: flex;
    .tabItem {
      cursor: pointer;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
      &.active {
        color: #fff;
        background-color: #36373d;
      }
      color: #808184;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      width: 33.33%;
      height: 56px;
      border-radius: 4px 4px 0px 4px;
      .iconfont {
        font-size: 16px;
      }
    }
  }
}
</style>
