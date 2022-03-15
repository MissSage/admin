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
      </div>

      <CardTable :config="cardTableConfig" class="table-height" />
    </template>
  </SLDialog>
  <SLDialog
    v-if="slDialogConfig1.visible"
    v-model="slDialogConfig1.visible"
    title="详情"
    :config="slDialogConfig1"
  >
    <AlarmDetail :list="detailList" />
  </SLDialog>
</template>

<script lang="ts">
import CardHeader from './cardHeader.vue'
import CardTable from '@/components/cardTable/index.vue'
import AlarmDetail from './AlarmDetail.vue'
import SLDialog from '@/components/SLDialog/index.vue'
import { defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { clearAlarmByAuth } from '@/api/alarm'
import useAlarm from '../hooks/useAlarm'
import { alarmTypes, formateColor, formateStatus, severityColor } from './AlarmUtil'
import { IControlAlarm, IControlAlarmDetail, IDialogConfig, QueryAlarmListParam } from '../..'
import moment from 'moment'
import { removeSlash } from '@/utils/removeIdSlash'
import { ISLDialogConfig } from '@/components/SLDialog/type'
export default defineComponent({
  name: 'AlarmDialog',
  components: {
    SLDialog,
    CardHeader,
    CardTable,
    AlarmDetail
  },
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
    const { $confirm, $messageSuccess, $format } = useGlobal()
    const { AlarmTable, getAlarmTable } = useAlarm()
    // codes here
    const state = reactive<{
      date: any[]
      slDialogConfig: ISLDialogConfig
      slDialogConfig1: ISLDialogConfig
      cardTableConfig: CTCardTable
      detailList: IControlAlarmDetail[]
    }>({
      date: [moment().valueOf() - 86400000, new Date()],
      slDialogConfig1: {
        title: 'AlarmDetail',
        visible: false,
        scrollbar: true,
        cancel: {
          handler: async() => {
            state.slDialogConfig1.visible = false
          },
          text: '关 闭'
        },
        width: '60%'
      },
      slDialogConfig: {
        title: props.config.title,
        visible: props.config.visible,
        scrollbar: true,
        cancel: {
          handler: async() => ctx.emit('update:model-value', false),
          text: '关 闭'
        },
        width: '60%'
      },
      cardTableConfig: {
        loading: false,
        dataList: AlarmTable.value,
        selectList: [],
        tableSelectChangeHandle: (val: any[]) => {
          state.cardTableConfig.selectList = val
        },
        columns: [
          {
            prop: 'startTs',
            label: '告警时间',
            fixed: 'left',
            width: '180',
            formatter: (row: any) => (row.startTs ? $format(row.startTs) : '')
          },
          {
            prop: 'clearTs',
            label: '解除时间',
            width: '180',
            formatter: (row: any) => (row.clearTs ? $format(row.clearTs) : '')
          },
          {
            prop: 'name',
            label: '报警名称',
            width: '130',
            formatter: (row: IControlAlarm) => {
              const dName = row.deviceName
              return row.alarmJsonName ? row.alarmJsonName : '掉线 - ' + dName
            }
          },
          {
            prop: 'type',
            label: '告警类型',
            width: '100',
            formatter: (row: any) => {
              return alarmTypes[row.type]
            }
          },
          {
            prop: 'severity',
            label: '告警级别',
            width: '90',
            backgroundHandle: (row: IControlAlarm) => {
              return row.severity ? severityColor[row.severity] : ''
            },
            cellStyle: {
              'border-radius': '15px',
              color: '#fff',
              'line-height': '25px',
              height: '30px',
              padding: '3px 15px 2px'
            }
          },
          { prop: 'attachValue', label: '告警触发值', width: '100' },
          { prop: 'restoreValue', label: '恢复触发值', width: '100' },
          {
            prop: 'confirm',
            label: '报警状态',
            width: '180',
            formatter: (row: IControlAlarm) => formateStatus(row),
            textColorHandle: (row: IControlAlarm) => formateColor(row)
          }
        ],
        operationFixed: 'right',
        operations: [
          {
            label: '强制解除',
            perm: true,
            disableHandle: (row: IControlAlarm) => {
              return row.status === 'CLEAR_FORCED'
            },
            icon: 'iconfont icon-xiangqing',
            handle: row => handleDelete(row)
          },
          {
            label: '详情',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => handleDetail(row)
          }
        ],
        operationWidth: '220px',
        pagination: {
          page: 1,
          limit: 20,
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
      detailList: []
    })
    const handleDetail = (row: IControlAlarm) => {
      console.log(row)
      state.slDialogConfig1.visible = true
      state.detailList = row.details.record
    }
    const handleDelete = (row: IControlAlarm) => {
      $confirm('强制解除该告警, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        // 批量解除
        clearAlarmByAuth({
          alarmId: [id]
          // remark: this.form2.removeRemark.trim()
        }).then(() => {
          $messageSuccess('删除成功')
          refreshData()
        })
      })
    }

    const refreshData = async () => {
      const [start, end] =
        state.date.length === 2
          ? [moment(state.date[0]).valueOf(), moment(state.date[1]).valueOf()]
          : [moment().valueOf() - 86400000, moment().valueOf()]
      const params: QueryAlarmListParam = {
        page: state.cardTableConfig.pagination.page,
        size: state.cardTableConfig.pagination.limit,
        start: start,
        end: end,
        projectId: props.config.projectId,
        deviceId: [removeSlash(props.config.deviceId || '')]
      }
      const res = await getAlarmTable(params)
      state.cardTableConfig.pagination.total = res.total
      state.cardTableConfig.dataList = AlarmTable.value
    }
    onMounted(() => {
      refreshData()
    })
    return {
      ...toRefs(state),
      refreshData,
      handleDelete,
      handleDetail
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
    line-height: 34px !important;
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
