<template>
  <!-- 实时报警 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" :current-project="currentProject" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <!-- 弹出窗 -->
        <ConfirmDialog
          v-if="confirmInfo.visible"
          :dialog-info="confirmInfo"
          @refresh="refreshData(currentProject)"
        ></ConfirmDialog>
        <!-- <HandleDialog
          v-if="handleInfo.visible"
          :dialog-info="handleInfo"
          :device-name="deviceName"
          @refresh="refreshData(currentProject)"
        ></HandleDialog> -->
        <HistoryTable
          v-if="historyInfo.visible"
          :dialog-info="historyInfo"
          :device-name="deviceName"
        ></HistoryTable>
        <InfoTable
          v-if="detailsInfo.visible"
          :dialog-info="detailsInfo"
          :device-name="deviceName"
        ></InfoTable>
      </div>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import {
  getAlarmRealTimeList,
  alarmConfirmByAuth,
  clearAlarmByAuth,
  getAlarmList
} from '@/api/alarm'
import { getProjectRoot } from '@/api/project'
import { getDevicesAll } from '@/api/device'
import { removeSlash } from '@/utils/removeIdSlash' // 处理id
import TreeList from '@/components/treeList/index.vue'
import ConfirmDialog from './components/confirmDialog.vue'
// import HandleDialog from './components/handleDialog.vue'
import HistoryTable from './components/historyTable.vue'
import InfoTable from './components/infoTable.vue'
import moment from 'moment'
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
// import AlarmFilterBtn from './components/alarmFilterBtn.vue'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageInfo, $messageError, $messageSuccess, $confirm, $format } = useGlobal()

export default {
  name: 'RealTimeAlarm',
  components: {
    TreeList,
    ConfirmDialog,
    // HandleDialog,
    HistoryTable,
    InfoTable,
    CardTable,
    CardSearch
  },
  mixins: [tBaseMixin],
  data() {
    return {
      totalLoading: false,
      treeData: {
        title: '项目列表',
        data: [],
        isFilterTree: true,
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.refreshData()
          // 更新设备列表
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentProject: {}
      },
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '批量确认',
            perm: true,
            disableHandle: () => !this.cardTableConfig.selectList.length,
            handle: () => this.alarmConfirm()
          },
          del: {
            text: '批量解除',
            perm: true,
            disableHandle: () => !this.cardTableConfig.selectList.length,
            handle: () => this.handleDelete()
          }
        },
        filters: [
          { label: '搜索', key: 'keyword', type: 'input', width: '240px' },
          {
            key: 'type',
            type: 'select',
            label: '报警类型',
            width: '240px',
            options: [
              { value: 'scope', label: '范围报警' },
              { value: 'change', label: '变动报警' },
              { value: 'offline', label: '掉线报警' }
            ]
          }
          // {
          //   key: 'alarmState',
          //   component: AlarmFilterBtn,
          //   props: {}
          // }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'name', label: '报警名称', width: 160 },
          { prop: 'showDeviceN', label: '报警设备', width: 160 },
          { prop: 'showDeviceN', label: '报警类型', width: 120 },
          { prop: 'cycleName', label: '周期', width: 55 },
          { prop: 'alarmValue', label: '报警触发值', width: 120 },
          { prop: 'recoverSet', label: '恢复触发值', width: 120 },
          {
            prop: 'createdTime',
            label: '报警时间',
            width: 180,
            icon: 'el-icon-time',
            formatter: row => $format(row.createdTime, 'Y-M-D H:m'),
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: 'severity',
            label: '报警级别',
            icon: 'el-icon-time',
            textColorHandle: row => row.severityColor,
            width: 80
          },

          {
            prop: 'confirm',
            label: '报警状态',
            width: 240,
            textColorHandle: row => (row.confirm !== '未恢复 | 未确认' ? '#36a624' : '')
          }
        ],
        operationFixed:'right',
        operations: [
          {
            label: '强制解除',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => this.handleDelete(row)
          },
          {
            label: '历史',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => this.rowHistory(row)
          },
          {
            label: '详情',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => this.rowInfo(row)
          }
        ],
        operationWidth: '260px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.cardTableConfig.pagination.limit = val
            this.refreshData()
          },
          pageHandle: val => {
            this.cardTableConfig.pagination.page = val
            this.refreshData()
          }
        }
      },
      alarmState: '',
      deviceName: new Map(),
      alarmInfo: new Map(),
      listFilter: false,
      filterItem: '',
      unconfirmed: 0,
      unsolved: 0,
      unconfirmedList: new Map(),
      // 弹出窗配置
      confirmInfo: {
        visible: false,
        row: {},
        close: () => (this.confirmDialog.visible = false)
      },
      handleInfo: {
        visible: false,
        row: {},
        close: () => (this.handleInfo.visible = false)
      },
      historyInfo: {
        visible: false,
        project: {},
        row: {},
        close: () => (this.historyInfo.visible = false)
      },
      detailsInfo: {
        visible: false,
        row: {},
        close: () => (this.detailsInfo.visible = false)
      },
      // 批量 小窗 配置
      severityColor: {
        提示: 'rgb(85,204,244)',
        次要: 'rgb(255,216,0)',
        重要: '#f58717',
        紧急: 'rgb(245,75,23)',
        严重: '#FF0000'
      },

      alarmTypes: { offline: '掉线报警', scope: '范围报警', change: '变动报警' }
    }
  },

  async created() {
    this.totalLoading = true
    // 获取设备
    const deviceRes = await getDevicesAll('info')
    console.log(deviceRes, 'deviceResdeviceRes')
    if (deviceRes.data && deviceRes.data.length)
      deviceRes.data.forEach(item => this.deviceName.set(item.id.id, item.name))

    getProjectRoot()
      .then(res => {
        this.totalLoading = false
        if (res.data) {
          this.treeData.data = res.data
          this.treeData.currentProject = res.data[0]
          this.refreshData(true)
        } else {
          $messageInfo('暂无项目 不可操作，请创建项目')
        }
      })
      .catch(err => {
        console.log(err)
        $messageInfo('暂无项目 不可操作，请创建项目')
      })
  },
  methods: {
    // 点击项目获取项目信息
    async refreshData(isFirst) {
      if (!this.treeData.currentProject.disabled) {
        this.cardTableConfig.loading = true
        // todo: 获取设备 存,然后或者对应报警
        const alarmSetRes = await getAlarmList()
        console.log(alarmSetRes, 'alarmSetResalarmSetResalarmSetRes')
        alarmSetRes.data.forEach(item => this.alarmInfo.set(removeSlash(item.id.id), item.details))

        const paramsObj = {
          start: moment().subtract(1, 'year').startOf('day').valueOf(),
          end: new Date().getTime(),
          page: this.cardTableConfig.pagination.page,
          size: this.cardTableConfig.pagination.limit
        }

        if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)

        const res = await getAlarmRealTimeList(paramsObj, this.treeData.currentProject.id)
        this.cardTableConfig.loading = false
        this.tableData = res.data
        this.handleAlarm(res.data)
      }
    },

    handleAlarm(val) {
      const originalData = val.data
      const data = []
      this.unconfirmed = 0
      this.unsolved = 0
      const date = {
        day: '日',
        month: '月',
        year: '年'
      }

      // originalData.forEach(item => {
      for (const item of originalData) {
        // 未确认 CONFIRM_UNACK   已确认 CONFIRM_ACK   已恢复 RESTORE_ACK
        // 解除 CLEARED_ACK  强制解除 CLEAR_FORCED
        item.severityColor = this.severityColor[item.severity]
        if (item.status === 'CONFIRM_UNACK' || item.status === 'ACTIVE_ACK') {
          item.confirm = '未恢复 | 未确认'
          this.unconfirmed++
          this.unsolved++
          this.unconfirmedList.set(item.id.id, item.confirm)
        }
        if (item.status === 'CONFIRM_ACK') {
          item.confirm = '未恢复 | 已确认'
          this.unsolved++
        }
        if (item.status === 'RESTORE_ACK') {
          item.confirm = '已恢复 | 未确认'
          this.unconfirmed++
          this.unconfirmedList.set(item.id.id, item.confirm)
        }

        item.alarmType = this.alarmTypes[item.type]

        if (item.details !== null) {
          item.alarmRemarks = item.details.alarmRemarks
          const info = this.alarmInfo.get(item.alarmJsonId)

          if (info) {
            item.alarmValue = info.attributeName + ': ' + info.alarmSetValue
            item.recoverSet = info.recoverSetValue
            item.alarmRemarks = info.alarmRemarks
          } else {
            item.alarmValue = '此条设置已删除'
            item.recoverSet = '此条设置已删除'
            if (item.type === 'offline') {
              item.alarmValue = '-'
              item.recoverSet = '-'
            }
          }
        }

        if (item.alarmCycle) {
          item.cycleName = date[item.alarmCycle]
          item.recoverSet = '-'
        } else {
          item.cycleName = ''
        }

        item.info = []

        if (item.details) {
          if (item.details.record) {
            for (const i of item.details.record) {
              const infoItem = {
                time: $format(parseInt(i.ts), 'Y-M-D H:m'),
                infoValue: i.info,
                status: i.status.toUpperCase() === 'ALARM' ? '触发报警' : '恢复'
              }
              item.info.push(infoItem)
            }
          }
          item.activeRemarks = item.details.activeRemarks
        }

        const dName = this.deviceName.get(item.originator.id) || '设备已删除'

        item.name = (item.alarmJsonName || '掉线 - ') + dName

        item.showDeviceN = dName

        if (this.listFilter) {
          if (
            this.filterItem === 'unconfirmed' &&
            (item.status === 'CONFIRM_UNACK' || item.status === 'RESTORE_ACK')
          ) {
            data.push(item)
          }
          if (
            this.filterItem === 'unsolved' &&
            (item.status === 'CONFIRM_UNACK' || item.status === 'CONFIRM_ACK')
          ) {
            data.push(item)
          }
        } else {
          data.push(item)
        }
      }

      this.cardTableConfig.dataList = data
      this.cardTableConfig.pagination.total = val.total
      console.log(data)
    },

    handleDelete(row) {
      const successMessage = row?'强制解除成功':'批量解除成功'
      $confirm('确定解除告警, 是否继续?', '解除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        if (row) {
          ids = [removeSlash(row.id.id)]
        } else {
          ids = this.cardTableConfig.selectList.map(item => removeSlash(item.id.id))
        }

        // 批量解除
        clearAlarmByAuth({
          alarmId: ids
          // remark: this.form2.removeRemark.trim()
        }).then(() => {
          $messageSuccess(successMessage)
          this.refreshData()
        })
      })
    },

    alarmConfirm(row) {
      $confirm('确定解除目标告警, 是否继续?', '解除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        if (row) {
          ids = [removeSlash(row.id.id)]
          if (!this.unconfirmedList.get(row.id.id)) {
            $messageError('只能选择未确认数据，请重选')
            return
          }
        } else {
          ids = this.cardTableConfig.selectList.map(item => removeSlash(item.id.id))
          for (const item of this.cardTableConfig.selectList) {
            if (!this.unconfirmedList.get(item.id.id)) {
              $messageError('只能选择未确认数据，请重选')
              return
            }
          }
        }
        // 批量解除
        alarmConfirmByAuth({
          alarmId: ids
          // remark: this.form2.removeRemark.trim()
        }).then(() => {
          $messageSuccess('确认成功')
          this.refreshData()
        })
      })
    },

    // rowSolved(row) {
    //   this.handleInfo.row = row
    //   this.handleInfo.visible = true
    // },
    rowHistory(row) {
      this.historyInfo.row = row
      this.historyInfo.project = this.treeData.currentProject
      this.historyInfo.visible = true
    },
    rowInfo(row) {
      this.detailsInfo.row = row
      this.detailsInfo.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.content-box-container {
  .filter-box {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    .box-btns {
      display: flex;
      align-items: center;
      .select-title {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
    .box-btns-right {
      width: 45%;
      p {
        float: left;
      }
      .together-release {
        float: right;
      }
      .together-confirm {
        float: right;
        margin-right: 10px;
      }
    }
    .filter-input {
      width: 200px;
      margin-right: 10px;
    }
    .filter-select {
      width: 120px;
      margin: 0 10px 0 5px;
    }
    .alarm-p-btn {
      height: 38px;
      font-size: 14px;
      padding: 0 10px;
      cursor: pointer;
      // color: #fff;2
      line-height: 38px;
      border-radius: 5px;
      margin: 0 10px 0 0;
      border: 1px solid #404354;
      background-color: #4c506b;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1),
      //   inset 0 0 10px 2px rgba(0, 149, 255, 0.3);
      &:hover {
        border-color: rgb(212, 192, 193);
      }
    }
    .active-btn {
      color: #3e8ef7;
      border-color: #3e8ef7;
    }
  }
  .alarm-h-table {
    margin-bottom: 8px;
    .severity_span_color {
      font-size: 12px;
      color: #fff;
      padding: 4px 13px;
      border-radius: 14px;
      line-height: 20px;
    }
    .operate-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .icon-time-c {
      color: #69e850;
    }
    .a-state-box {
      margin: 0 0;
      padding: 3px 10px;
      color: #9e2727;
      background-color: #ffcece;
    }
    .a-state-color {
      color: #36a624;
      background-color: #d5ffce;
    }
    .alarm-row-btn {
      padding: 7px 12px;
      border-radius: 20px;
    }
  }
}
</style>
<style>
/* 弹出框颜色 */
.el-message-box {
  display: inline-block;
  width: var(--el-messagebox-width);
  padding-bottom: 10px;
  vertical-align: middle;
  background-color: #222536;
  border-radius: var(--el-messagebox-border-radius);
  border: 1px solid #000000;
  font-size: var(--el-messagebox-font-size);
  box-shadow: var(--el-box-shadow-light);
  text-align: left;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
</style>
