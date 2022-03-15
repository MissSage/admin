<template>
  <div class="tabContainer">
    <p class="title">设备列表</p>
    <el-table highlight-current-row size="mini" :data="dataList" style="width: 100%">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column show-overflow-tooltip label="测压点名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="监测值(Mpa)" prop="value" width="120">
        <template #default="scope">{{ scope.row.value || '-' }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { getPipeLineYaliList } from '@/api/pipeLine'

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const dataList = ref<any[]>([])

    watch(
      () => dataList.value,
      () =>
        ctx.emit(
          'setRestaurants',
          dataList.value.map(item => ({ value: item.name, id: item.id }))
        )
    )

    onMounted(async () => {
      const res = await getPipeLineYaliList()
      dataList.value = res.data
    })

    return { dataList }
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
