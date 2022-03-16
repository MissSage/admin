<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="table-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import { ExportFinancialSummary, GetFinancialSummary } from '@/api/yinshou/baobiao/FinancialSummary'
import { ICONS } from '@/common/constans/common'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import SLCardTable from '@/components/SLCardTable/index.vue'
import { ISLCardTable } from '@/components/SLCardTable/type'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'
import useYinShouArea from '../hooks/useYinShouArea'
import { ExportReport, PayMeTypes } from '.'
export default defineComponent({
  name: 'FinancialStatistics',
  components: { SLCardSearch, SLCardTable },
  setup () {
    const { getYinShouArea } = useYinShouArea()
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      labelWidth: '100px',
      filters: [
        { type: 'cascader', field: 'orgId', label: '区域：' },
        { type: 'input', field: 'custName', label: '用户名：' }
      ],
      operations: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '重 置', click: () => resetQuery(), type: 'default' }
      ],
      moreFilter: {
        filters: [
          {
            type: 'select',
            field: 'payMode',
            label: '支付方式：',
            formatter: (val: any) => {
              return PayMeTypes.find(item => item.value === val)?.label || '-'
            },
            options: PayMeTypes
          },
          { type: 'daterange', field: 'date', label: '时间段：' }
        ]
      }
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '账务统计报表',
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => refreshData(true)
        }
      ],
      columns: [
        { prop: 'payee', label: '收费员' },
        { prop: 'payAmount', label: '充值金额' },
        { prop: 'payType', label: '支付方式' },
        { prop: 'areaName', label: '区域' },
        { prop: 'payTime', label: '充值时间' },
        { prop: 'payMode', label: '充值方式' },
        { prop: 'tel', label: '手机' },
        { prop: 'custName', label: '户名' },
        { prop: 'custCode', label: '户号' }
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
    const refreshData = async (isExport?: boolean) => {
      const query = refSLCardSearch.value?.queryParams
      const date = query?.date
      let [start, end] = [moment().add(-3, 'M').valueOf(), moment().valueOf()]
      if (date && date.length === 2) {
        start = moment(date[0], 'YYYY-MM-DD').add(0, 'd').valueOf()
        end = moment(date[1], 'YYYY-MM-DD').add(0, 'd').valueOf()
      }
      const params = {
        organizationId: query?.orgId,
        custName: query?.custName,
        payMode: query?.payMode,
        start: start,
        end: end
      }
      if (isExport) {
        const res = await ExportFinancialSummary(params)
        ExportReport(res.data)
      } else {
        const res = await GetFinancialSummary(params)
        slCardTableConfig.value.dataList = res.data || []
      }
    }
    onMounted(async () => {
      refreshData()
      const filter = slCardSearchConfig.value.filters?.find(item => item.field === 'orgId')
      filter && filter.type === 'cascader' && (filter.options = await getYinShouArea())
    })
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
