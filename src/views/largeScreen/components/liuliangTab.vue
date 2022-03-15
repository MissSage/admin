<template>
  <div class="tabContainer">
    <p class="title">概览</p>
    <div class="header">
      <p><i class="iconfont icon-tubiaozhizuomoban"></i>累计出水流量</p>
      <span>22423.74 m³</span>
    </div>
    <p class="title">监测列表</p>
    <el-table highlight-current-row size="mini" :data="dataList" style="width: 100%">
      <el-table-column label="序号" type="index" width="50"> </el-table-column>
      <el-table-column show-overflow-tooltip label="流量点名称" prop="name"> </el-table-column>
      <el-table-column show-overflow-tooltip label="监测值(m³/h)" prop="value" width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

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

    onMounted(() => {
      dataList.value = [
        { name: '天府五街', value: '23.42' },
        { name: '天府三街', value: '22.63' },
        { name: '华谷大道', value: '23.14' },
        { name: '中国-欧洲中心', value: '24.17' },
        { name: '美年广场', value: '22.68' },
        { name: '中德英伦A区', value: '22.65' },
        { name: '中德英伦B区', value: '23.15' },
        { name: '中德英伦C区', value: '23.38' },
        { name: '天府五街', value: '23.42' },
        { name: '天府三街', value: '22.63' },
        { name: '华谷大道', value: '23.14' },
        { name: '中国-欧洲中心', value: '24.17' },
        { name: '美年广场', value: '22.68' },
        { name: '中德英伦A区', value: '22.65' },
        { name: '中德英伦B区', value: '23.15' },
        { name: '中德英伦C区', value: '23.38' },
        { name: '天府五街', value: '23.42' },
        { name: '天府三街', value: '22.63' },
        { name: '华谷大道', value: '23.14' },
        { name: '中国-欧洲中心', value: '24.17' },
        { name: '美年广场', value: '22.68' },
        { name: '中德英伦A区', value: '22.65' },
        { name: '中德英伦B区', value: '23.15' },
        { name: '中德英伦C区', value: '23.38' },
        { name: '天府五街', value: '23.42' },
        { name: '天府三街', value: '22.63' },
        { name: '华谷大道', value: '23.14' },
        { name: '中国-欧洲中心', value: '24.17' },
        { name: '美年广场', value: '22.68' },
        { name: '中德英伦A区', value: '22.65' },
        { name: '中德英伦B区', value: '23.15' },
        { name: '中德英伦C区', value: '23.38' },
        { name: '天府五街', value: '23.42' },
        { name: '天府三街', value: '22.63' },
        { name: '华谷大道', value: '23.14' },
        { name: '中国-欧洲中心', value: '24.17' },
        { name: '美年广场', value: '22.68' },
        { name: '中德英伦A区', value: '22.65' },
        { name: '中德英伦B区', value: '23.15' },
        { name: '中德英伦C区', value: '23.38' }
      ]
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
.header {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  > p {
    margin: 0;
    color: #808184;
  }
}
</style>
