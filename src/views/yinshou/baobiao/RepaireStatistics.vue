<template>
  <div class="wrapper">
    <SLCard class="header-card">
      <div class="header-item">
        <div class="item">
          <el-image class="image" :src="defaultImage"></el-image>
          <div class="item-info">
            <p class="text">待维修数量</p>
            <p class="number">{{ RepairSummary?.prepareRepair || 0 }}</p>
          </div>
        </div>
        <div class="item">
          <el-image class="image" :src="defaultImage"></el-image>
          <div class="item-info">
            <p class="text">维修中数量</p>
            <p class="number">{{ RepairSummary?.repairing || 0 }}</p>
          </div>
        </div>
        <div class="item">
          <el-image class="image" :src="defaultImage"></el-image>
          <div class="item-info">
            <p class="text">已维修数量</p>
            <p class="number">{{ RepairSummary?.repaired || 0 }}</p>
          </div>
        </div>
        <div class="item">
          <el-image class="image" :src="defaultImage"></el-image>
          <div class="item-info">
            <p class="text">维修总数量</p>
            <p class="number">{{ RepairSummary?.repaireTotal || 0 }}</p>
          </div>
        </div>
      </div>
    </SLCard>
    <SLCardTable
      ref="refSLCardTable"
      class="table-box"
      :config="slCardTableConfig"
    ></SLCardTable>
  </div>
</template>
<script lang="ts">
import SLCardTable from '@/components/SLCardTable/index.vue'
import { ISLCardTable } from '@/components/SLCardTable/type'
import moment from 'moment'
import SLCard from '@/components/SLCard/index.vue'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ExportRepairSummary, GetRepairSummary } from '@/api/yinshou/baobiao/RepairSummary'
import { ExportReport } from '.'
import { getImageUrl } from '@/utils/helper'
interface IRepairSummary {
  prepareRepair: string
  repairList: [
    {
      custCode: string
      code: string
      repairTime: string
      person: string
      remark: string
      applyTime: string
      custName: string
      reply: string
    }
  ]
  repairing: '维修中'
  repaireTotal: '维修总数'
  repaired: '已维修'
}
export default defineComponent({
  name: 'RepaireStatistics',
  components: { SLCardTable, SLCard },
  setup () {
    const state = reactive<{
      RepairSummary: IRepairSummary | undefined
      defaultImage:any
    }>({
      RepairSummary: undefined,
      defaultImage: getImageUrl('moren.png')
    })

    const slCardTableConfig = ref<ISLCardTable>({
      title: '维修统计',
      headerBtns: [
        { perm: true, text: '搜 索', click: () => refreshData() },
        { perm: true, text: '导 出', click: () => refreshData(true) }
      ],
      headerQuery: [
        { type: 'daterange', field: 'date', label: '时间段：', onChange: () => refreshData() }
      ],
      columns: [
        { label: '时间', prop: '' },
        { label: '用户姓名', prop: '' },
        { label: '联系电话', prop: '' },
        { label: '区域', prop: '' },
        { label: '地址', prop: '' },
        { label: '用户性质', prop: '' }
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
    const refSLCardTable = ref<InstanceType<typeof SLCardTable>>()

    const refreshData = async (isExport?: boolean) => {
      const query = refSLCardTable.value?.queryParams
      const date = query?.date
      let [start, end] = [moment().add(-3, 'M').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      if (date && date.length === 2) {
        start = moment(date[0]).format('YYYY-MM-DD')
        end = moment(date[1]).format('YYYY-MM-DD')
      }
      const params = {
        start: start,
        end: end
      }
      if (isExport) {
        const res = await ExportRepairSummary(params)
        ExportReport(res.data)
      } else {
        const res = await GetRepairSummary(params)
        state.RepairSummary = res.data
        slCardTableConfig.value.dataList = state.RepairSummary?.repairList || []
      }
    }
    onMounted(() => {
      refreshData()
    })
    return {
      ...toRefs(state),
      refSLCardTable,
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
  height: calc(100% - 115px);
}
.header-card {
  margin-bottom: 15px;
}
.header-item {
  height: 100px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  .item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
    .image {
      width: 60px;
      height: 60px;
      min-width: 60px;
    }
    .item-info {
      height: 100%;
      width: 100%;
      margin-left: 20px;
      text-align: left;
      .text {
        font-size: 12px;
        line-height: 20px;
      }
      .number {
        font-size: 20px;
        line-height: 30px;
        font-weight: 500;
        margin-top: 10px;
      }
    }
  }
}
</style>
