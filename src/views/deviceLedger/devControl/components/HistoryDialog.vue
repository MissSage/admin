<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <template #title>
      <CardHeader :status="config.status" :icon-class="config.iconClass" :title="config.title" />
    </template>
    <template #default>
      <div class="query-container">
        <div class="query-left">
          <span>自定义时间：</span>
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="到"
            start-placeholder="起始时间"
            end-placeholder="终止时间"
            @change="refreshData"
          >
          </el-date-picker>
        </div>
        <div class="query-center">
          <el-button type="primary" size="mini" @click="refreshData">搜索</el-button>
        </div>
        <div class="query-right">
          <el-button type="primary" size="mini" @click="handleExport">
            <i class="icon iconfont icon-xiazaiAPP"></i>
            <span>导出数据</span>
          </el-button>
        </div>
      </div>
      <CardTable ref="cardTable" :config="cardTableConfig" class="table-height" />
    </template>
  </SLDialog>
</template>

<script lang="ts">
import CardTable from '@/components/cardTable/index.vue'
import SLDialog from '@/components/SLDialog/index.vue'
import CardHeader from './cardHeader.vue'
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import useHistory from '../hooks/useHistory'
import { IDialogConfig, QueryTrendListParam } from '../..'
import moment from 'moment'
import { TrueExcel } from '@/utils/exportExcel'
import { ISLDialogConfig } from '@/components/SLDialog/type'
export default defineComponent({
  name: 'HistoryDialog',
  components: { SLDialog, CardHeader, CardTable },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object as PropType<IDialogConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['update:model-value'],
  setup(props, ctx) {
    //
    const { HistoryTable, getHistoryTable, InitHistoryTableColums } = useHistory()
    const state = reactive<{
      slDialogConfig: ISLDialogConfig
      date: any[]

      cardTableConfig: CTCardTable
    }>({
      date: [moment().valueOf() - 86400000, new Date()],
      cardTableConfig: {
        loading: false,
        dataList: HistoryTable.value,
        selectList: [],
        // tableSelectChangeHandle: (val: any[]) => {
        //   state.cardTableConfig.selectList = val
        // },
        columns: InitHistoryTableColums(props.config.device),
        operationWidth: '220px',
        pagination: {
          hide: true,
          page: 1,
          limit: 10,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            state.cardTableConfig.pagination.limit = val
            refreshData()
          },
          pageHandle: val => {
            state.cardTableConfig.pagination.page = val
            refreshData()
          }
        }
      },
      slDialogConfig: {
        title: props.config.title,
        visible: props.modelValue,
        scrollbar: true,
        cancel: {
          handler: async() => await ctx.emit('update:model-value', false),
          text: '关 闭'
        },
        width: '60%'
      }
    })
    const excel = new TrueExcel()
    const cardTable = ref<InstanceType<typeof CardTable>>()
    const handleExport = () => {
      console.log('export')

      if (!cardTable.value) return
      // export
      excel.addElTable(cardTable.value.$refs.elTable)
      excel.export()
    }
    const refreshData = async () => {
      if (!props.config.device) {
        HistoryTable.value = []
        return
      }
      const [start, end] =
        state.date.length === 2
          ? [moment(state.date[0]).valueOf(), moment(state.date[1]).valueOf()]
          : [moment().valueOf() - 86400000, moment().valueOf()]
      const params: QueryTrendListParam = {
        page: state.cardTableConfig.pagination.page,
        size: state.cardTableConfig.pagination.limit,
        start: start,
        end: end,
        type: 'day',
        attributes: []
      }
      props.config.device && (await getHistoryTable(params, props.config.device))
      state.cardTableConfig.dataList = HistoryTable.value
    }
    onMounted(() => {
      refreshData()
    })
    return {
      cardTable,
      ...toRefs(state),
      handleExport,
      refreshData
    }
  }
})
</script>

<style lang="scss" scoped>
.table-height {
  height: calc(100% - 50px);
}
.query-container {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 0 0 8px;
  :deep(.el-range-separator) {
    line-height: 32px !important;
  }
  .query-left {
    margin-right: 15px;
  }
  .query-center {
    flex: 1;
    justify-self: flex-start;
    align-self: center;
  }
}
</style>
