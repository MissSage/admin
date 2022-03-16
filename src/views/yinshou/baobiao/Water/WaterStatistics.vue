<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="card-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import SLCardTable from '@/components/SLCardTable/index.vue'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { defineComponent, onMounted, ref } from 'vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import { ISLCardTable } from '@/components/SLCardTable/type'
import { COLORS, ICONS } from '@/common/constans/common'
import { GetWaterStatistics } from '@/api/yinshou/baobiao/WaterStatistics'
import { IQuery_YinShou_Water } from '../../types/Water/Statistics'
import moment from 'moment'
import { SLMessage } from '@/utils/Message'
export default defineComponent({
  name: 'WaterStatistics',
  components: { SLCardTable, SLCardSearch },
  setup() {
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      filters: [
        { type: 'select', label: '区域:', field: 'orgId' },
        { type: 'daterange', label: '时间段:', field: 'date' }
      ],
      operations: [
        { perm: true, text: '搜 索', color: COLORS.CUSTOM, click: () => refreshData() },
        { perm: true, text: '重 置', type: 'default', click: () => resetQuery() }
      ]
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '用水统计报表',
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => {
            SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
          }
        },
        {
          perm: true,
          text: '导出报表',
          icon: ICONS.EXPORT,
          click: () => {
            SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
          }
        }
      ],
      showSummary:true,
      columns: [
        { label: '区域', prop: 'orgName' },
        { label: '表具名称', prop: 'bookName' },
        { label: '方量(合计)(m³)', prop: 'waterUseTotal' },
        { label: '消费金额(合计)(元)', prop: 'moneyTotal' }
      ],
      dataList: [],
      pagination: {
        hide: true,
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total,sizes, prev, pager, next, jumper',
        handleSize: (size: number) => {
          slCardTableConfig.value.pagination.limit = size
          refreshData()
        },
        handlePage: (page: number) => {
          slCardTableConfig.value.pagination.page = page
          refreshData()
        }
      }
    })
    const resetQuery = () => {
      refSLCardSearch.value && (refSLCardSearch.value.queryParams = {})
      refreshData()
    }
    const refreshData = async () => {
      const queryParams = refSLCardSearch.value?.queryParams
      const orgId = queryParams?.orgId
      const date = queryParams?.date
      let [start, end] = [moment().add(-3, 'M').valueOf(), moment().valueOf()]
      if (date && date.length === 2) {
        start = moment(date[0], 'YYYY-MM-DD').add(0, 'd').valueOf()
        end = moment(date[1], 'YYYY-MM-DD').add(0, 'd').valueOf()
      }
      const params: IQuery_YinShou_Water = {
        orgId: orgId,
        start: start,
        end: end
      }
      
      const res = await GetWaterStatistics(params)
      slCardTableConfig.value.dataList = res.data || []
      slCardTableConfig.value.pagination.total = res.data?.length || 0
    }
    onMounted(() => refreshData())
    return {
      refSLCardSearch,
      slCardSearchConfig,
      slCardTableConfig
    }
  }
})
</script>
<style scoped lang="scss">
.wrapper {
  padding: 15px;
  width: 100%;
  height: 100%;
}
.card-box {
  height: calc((100% - 100px));
}
</style>
