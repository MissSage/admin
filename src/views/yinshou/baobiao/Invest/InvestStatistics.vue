<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="table-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import { ExportInvests, GetInvestStatistics } from '@/api/yinshou/baobiao/InvestStatistics'
import { ICONS } from '@/common/constans/common'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import SLCardTable from '@/components/SLCardTable/index.vue'
import { ISLCardTable } from '@/components/SLCardTable/type'
import { SLMessage } from '@/utils/Message'
import moment from 'moment'
import { defineComponent, onMounted, ref } from 'vue'
import useYinShouArea from '../../hooks/useYinShouArea'
import { IQuery_Yinshou_Invest } from '../../types/Invest/Statistics'
export default defineComponent({
  name: 'InvestStatistics',
  components: { SLCardSearch, SLCardTable },
  setup() {
    const { getYinShouArea } = useYinShouArea()
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      labelWidth: '100px',
      filters: [
        { type: 'cascader', field: 'orgId', label: '区域：', options: [] },
        // { type: 'user', field: 'user', label: '用户：', width: '300px' }
        { type: 'daterange', field: 'date', label: '时间段：' }
      ],
      operations: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '重 置', click: () => resetQuery(), type: 'default' }
      ]
      // moreFilter: {
      //   filters: [
      //     { type: 'select', field: 'yinyeting', label: '营业厅：', options: [] },
      //     { type: 'select', field: 'bookType', label: '收费方式：', options: [] },
      //     { type: 'select', field: 'bookType', label: '表具类型：', options: [] },
      //     { type: 'daterange', field: 'date', label: '时间段：' }
      //   ]
      // }
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '用户充值报表',
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => refreshData(true)
        }
        // {
        //   perm: true,
        //   text: '导出报表',
        //   icon: ICONS.EXPORT,
        //   click: () => {
        //     SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
        //   }
        // }
      ],
      columns: [
        { label: '区域', prop: 'areaName' },
        { label: '用户编号', prop: 'custCode' },
        { label: '用户姓名', prop: 'custName' },
        { label: '用水类别', prop: 'useType' },
        { label: '充值金额(合计)(元)', prop: 'payAmount' },
        { label: '水费(合计)(元)', prop: 'useAmount' }
      ],
      showSummary: true,

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
        start = moment(date[0], 'YYYY-MM-DD').format('YYYY-MM-DD')
        end = moment(date[1], 'YYYY-MM-DD').format('YYYY-MM-DD')
      }
      const params: IQuery_Yinshou_Invest = {
        organizationId: query?.orgId,
        start: start,
        end: end
      }
      if (isExport) {
        const res = await GetInvestStatistics(params)
        const url = window.URL.createObjectURL(res.data)
        console.log(url)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', `用户充值报表.xlsx`)
        document.body.appendChild(link)
        link.click()
      } else {
        const res = await GetInvestStatistics(params)
        slCardTableConfig.value.dataList = res.data || []
      }
    }
    const setArearFilter = async () => {
      const filter = slCardSearchConfig.value.filters?.find(item => item.field === 'orgId')
      filter && filter.type === 'cascader' && (filter.options = await getYinShouArea())
    }
    onMounted(async () => {
      refreshData()
      setArearFilter()
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
