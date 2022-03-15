<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="table-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import { ICONS } from '@/common/constans/common'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import SLCardTable from '@/components/SLCardTable/index.vue'
import { ISLCardTable } from '@/components/SLCardTable/type'
import { SLMessage } from '@/utils/Message'
import moment from 'moment'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'FinancialStatistics',
  components: { SLCardSearch, SLCardTable },
  setup() {
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      labelWidth: '100px',
      filters: [
        { type: 'input', field: 'orgId', label: '区域：' },
        { type: 'daterange', field: 'date', label: '时间段：' }
      ],
      operations: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '重 置', click: () => resetQuery(), type: 'default' }
      ]
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '账务统计报表',
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => {
            SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
          }
        }
      ],
      columns: [
        { label: '区域', prop: '' },
        { label: '户号', prop: '' },
        { label: '户名', prop: '' },
        { label: '充值金额(合计)(元)', prop: '' },
        { label: '水费(合计)(元)', prop: '' },
        { label: '用户余额(元)', prop: '' }
      ],
      dataList: [],
      selectList: [],
      pagination: {
        page: 1,
        limit: 999,
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
      },
      handleSelectChange: (rows: any) => {
        slCardTableConfig.value.selectList = rows
      }
    })
    const resetQuery = () => {
      refSLCardSearch.value && (refSLCardSearch.value.queryParams = {})
    }
    const refreshData = () => {
      const query = refSLCardSearch.value?.queryParams
      const date = query?.date
      let [start, end] = [moment().add(-3, 'M').valueOf(), moment().valueOf()]
      if (date && date.length === 2) {
        start = moment(date[0], 'YYYY-MM-DD').add(0, 'd').valueOf()
        end = moment(date[1], 'YYYY-MM-DD').add(0, 'd').valueOf()
      }
      const params = {
        orgId: query?.orgId,
        start: start,
        end: end
      }
      SLMessage.info(JSON.stringify(params))
    }
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
.table-box {
  height: calc(100% - 100px);
}
</style>
