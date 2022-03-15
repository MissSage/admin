<template>
  <el-scrollbar>
    <div class="reports">
      <CardSearch
        ref="cardSearch"
        style="width: 100%"
        class="cardSearch"
        :config="cardSearchConfig"
      />
      <div class="detail-box-item gslfx-box hastitle">
        <div class="detail-box-item-title">供水量分析</div>
        <VChart :option="GSLFX"></VChart>
      </div>
      <div class="detail-box-item">
        <SLTable :config="slTableConfig" />
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import CardSearch from '@/components/cardSearch/index.vue'
import SLTable from '@/components/SLTable/index.vue'
import { GSLFX } from './index'
import useGlobal from '@/hooks/global/useGlobal'
import { ISLTableConfig } from '@/components/SLTable/type'
export default defineComponent({
  name: 'WaterAnalys',
  components: { CardSearch, SLTable },
  setup() {
    const { format } = useGlobal()
    const state = reactive<{
      cardSearchConfig: CSSearchConfig
      slTableConfig: ISLTableConfig
    }>({
      cardSearchConfig: {
        operation: {
          // search: { text: '查询', handle: () => refreshData() }
        },
        filters: [
          {
            label: '选择区域',
            key: 'projectId',
            type: 'select',
            options: [{ label: '宜秀区', value: 'yixiu' }],
            width: '240px',
            handleChange: () => refreshData()
          }
        ],
        rightFilter: [
          { label: '选择时间', key: 'date', type: 'daterange', handleChange: () => refreshData() }
        ]
      },
      slTableConfig: {
        pagination: { hide: true },
        columns: [
          {
            label: '时间',
            prop: 'time',
            formatter: row => format(row, 'time')
          },
          {
            label: '供水量-宜秀区(m³)',
            prop: 'gsl'
          }
        ],
        dataList: [
          {
            time: '2021-08-31 11:33:45',
            gsl: 2000
          },
          {
            time: '2021-08-31 11:33:45',
            gsl: 2000
          },
          {
            time: '2021-08-31 11:33:45',
            gsl: 2000
          },
          {
            time: '2021-08-31 11:33:45',
            gsl: 2000
          },
          {
            time: '2021-08-31 11:33:45',
            gsl: 2000
          }
        ]
      }
    })
    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const refreshData = () => {
      console.log(cardSearch.value?.queryParams)
    }
    return {
      ...toRefs(state),
      cardSearch,
      GSLFX,
      refreshData
    }
  }
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
