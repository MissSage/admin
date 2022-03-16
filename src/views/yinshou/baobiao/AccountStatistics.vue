<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="table-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import { ExportAccountSummary, GetAccountSummary } from '@/api/yinshou/baobiao/AccountSummary'
import { ICONS } from '@/common/constans/common'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import SLCardTable from '@/components/SLCardTable/index.vue'
import { ISLCardTable } from '@/components/SLCardTable/type'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'
import { ExportReport } from '.'
import useYinShouArea from '../hooks/useYinShouArea'
export default defineComponent({
  name: 'AccountStatistics',
  components: { SLCardSearch, SLCardTable },
  setup () {
    const { getYinShouArea } = useYinShouArea()
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      labelWidth: '100px',
      filters: [
        { type: 'cascader', field: 'orgId', label: '区域：' },
        { type: 'input', field: 'custName', label: '用户：' }
      ],
      operations: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '重 置', click: () => resetQuery(), type: 'default' }
      ],
      moreFilter: {
        filters: [{ type: 'daterange', field: 'date', label: '时间段：' }]
      }
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '开户统计报表',
      showSummary: true,
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => refreshData(true)
        }
      ],
      columns: [
        { prop: 'address', label: '地址' },
        { prop: 'areaName', label: '区域' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'custType', label: '用户性质' },
        { prop: 'tel', label: '电话' },
        { prop: 'custName', label: '用户名' },
        { prop: 'custCode', label: '用户编号' }
      ],
      dataList: [],
      selectList: [],
      pagination: {
        hide: true,
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
      let [start, end] = [moment().add(-3, 'M').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      if (date && date.length === 2) {
        start = moment(date[0]).format('YYYY-MM-DD')
        end = moment(date[1]).format('YYYY-MM-DD')
      }
      const params = {
        organizationId: query?.orgId,
        start: start,
        end: end,
        custName: query?.custName
      }
      if (isExport) {
        const res = await ExportAccountSummary(params)
        ExportReport(res.data)
      } else {
        const res = await GetAccountSummary(params)
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
