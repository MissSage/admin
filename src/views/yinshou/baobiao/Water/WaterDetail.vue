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
import { SLMessage } from '@/utils/global'
import moment from 'moment'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'WaterDetail',
  components: { SLCardSearch, SLCardTable },
  setup () {
    const tempData:any[] = []
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const slCardSearchConfig = ref<ISLCardSearch>({
      labelWidth: '100px',
      filters: [
        {
          type: 'select',
          field: 'orgId',
          label: '区域：',
          multiple: true,
          options: tempData,
          formatter: (val: any) => {
            return tempData.find(item => item.value === val)?.label || '-'
          }
        },
        { type: 'user', field: 'user', label: '用户：', width: '300px' }
      ],
      moreFilter: {
        filters: [
          {
            type: 'select',
            field: 'bookType',
            label: '表具类型：',
            options: [{ label: '类型一', value: '1' }],
            formatter: (val?: any) => {
              if (!val) return '-'
              const obj = tempData.find(item => item.value === val)
              return obj?.label || '-'
            }
          },
          {
            type: 'daterange',
            field: 'date',
            label: '时间段：',
            formatter: (val: any) => {
              return val && val.length === 2 ? val[0] + ' 至 ' + val[1] : '-'
            }
          }
        ]
      },
      operations: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '重 置', click: () => resetQuery(), type: 'default' }
      ]
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '用水明细报表',
      headerBtns: [
        {
          perm: true,
          text: '导 出',
          icon: ICONS.EXPORT,
          click: () => {
            // SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
          }
        },
        {
          perm: true,
          text: '导出报表',
          icon: ICONS.EXPORT,
          click: () => {
            // SLMessage.info(JSON.stringify(slCardTableConfig.value.selectList))
          }
        }
      ],
      handleSelectChange: (rows: any[]) => {
        slCardTableConfig.value.selectList = rows || []
      },
      handleRowClick: (row: any) => {
        slCardTableConfig.value.currentRow = row
      },
      columns: [
        { label: '区域', prop: 'field1' },
        { label: '用户编号', prop: 'field2' },
        { label: '用户姓名', prop: 'field3' },
        { label: '手机', prop: 'field4' },
        { label: '当前计数(m³)', prop: 'field5' },
        { label: '用水方量(m³)', prop: 'field6' },
        { label: '水费金额(元)', prop: 'field7' },
        { label: '抄表时间', prop: 'field8' }
      ],
      dataList: [],
      selectList: [],
      pagination: {
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
        user: query?.userId,
        bookType: query?.bookType,
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
