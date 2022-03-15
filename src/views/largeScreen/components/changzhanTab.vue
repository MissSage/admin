<template>
  <div class="tabContainer">
    <p class="title">水厂列表</p>
    <el-table
      height="270"
      highlight-current-row
      size="mini"
      :data="shuichangList"
      style="width: 100%"
      @row-click="openScadaDialog"
    >
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column show-overflow-tooltip label="水厂名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="地址" prop="address"> </el-table-column>
    </el-table>
    <p class="title">泵站列表</p>
    <el-table
      height="270"
      highlight-current-row
      size="mini"
      :data="bengzhanList"
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column show-overflow-tooltip label="泵站名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="地址" prop="address"> </el-table-column>
    </el-table>
    <!-- <p class="title">摄像头列表</p>
    <el-table height="270" highlight-current-row size="mini" :data="dataList" style="width: 100%">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column show-overflow-tooltip label="水厂名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="地址" prop="value"> </el-table-column>
    </el-table> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const shuichangList = ref<any[]>([])
    const bengzhanList = ref<any[]>([])

    watch(
      () => shuichangList.value,
      () =>
        ctx.emit(
          'setRestaurants',
          shuichangList.value.map(item => ({ value: item.name, id: item.id }))
        )
    )

    onMounted(() => {
      shuichangList.value = [
        {
          name: '自来水厂',
          address: '甘孜藏族自治州解放东街道孚一中北',
          location: [101.12823194921312, 30.98799702519725],
          scada: 'http://139.155.92.140:7081/viewer/GZLNkrhVipKuE4go'
        }
      ]

      bengzhanList.value = [
        // { name: '1号泵站房', address: '建设路13号' },
        // { name: '2号泵站房', address: '人民路22号' },
        // { name: '3号泵站房', address: '剑南大道95号s' }
      ]
    })
    const openScadaDialog = (item: ChangzhanData) => {
      ctx.emit('openScadaDialog', item)
    }

    return { shuichangList, bengzhanList, openScadaDialog }
  }
})
</script>

<style lang="scss" scoped>
.tabContainer {
  overflow-y: auto;
  height: calc(100% - 70px);
}
.title {
  color: #717d92;
  margin: 0;
  height: 32px;
  line-height: 32px;
  background: #1c1d24;
  padding: 0 16px;
}
.deviceInfo {
  height: 80px;
  align-items: center;
  justify-content: space-evenly;
  display: flex;
  display: flex;
  .item {
    color: #808184;
    display: flex;
    .iconfont {
      margin-right: 5px;
      font-size: 12px;
    }
    > div {
      > span {
        color: #808184;
      }
      margin-top: 2px;
      color: #fff;
      .countBox {
        margin-top: 8px;
        height: 25px;
        line-height: 25px;
      }
      .count {
        height: 25px;
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        &.total {
          color: #598dff;
        }
        &.online {
          color: #59ff84;
        }
        &.outline {
          color: #ff5959;
        }
      }
    }
  }
}
.chartsBox {
  height: 181px;
  width: 100%;

  .echarts {
    height: 100%;
    width: 100%;

    div:nth-of-type(1) {
      height: 100%;
      width: 100% !important;

      canvas {
        height: 100%;
        width: 100% !important;
      }
    }
  }
}
</style>
