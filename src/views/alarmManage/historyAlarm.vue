<template>
  <!-- 历史告警 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <treeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <!-- 历史告警 -->
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <infoTable
          v-if="detailsInfo.visible"
          :dialog-info="detailsInfo"
          :device-name="deviceName"
        ></infoTable>
      </div>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import { getHistoryAlarmList, getAlarmList } from '@/api/alarm' // getAlarmReal, , getDevicesAlarm, getAlarmRealByProjectId
import { getDevice } from '@/api/device' // , getGateway
import { removeSlash } from '@/utils/removeIdSlash' // 处理id, idRemoveSlash

import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import treeList from '@/components/treeList/index.vue'
import infoTable from './components/infoTable.vue'
import moment from 'moment'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageInfo } = useGlobal()

export default {
  name: 'HistoryAlarm',
  components: {
    treeList,
    infoTable,
    CardTable,
    CardSearch
  },
  mixins: [tBaseMixin],
  data() {
    return {
      totalLoading: false,
      treeData: {
        that: this,
        title: '项目列表',
        data: [],
        isFilterTree: true,
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.getProjectData()
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentProject: {}
      },

      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() }
        },
        filters: [
          { label: '搜索', key: 'name', type: 'input', width: '240px' },
          {
            label: '设备',
            key: 'deviceId',
            type: 'select',
            multiple: true,
            width: '240px',
            options: []
          },
          { label: '日期', key: 'daterange', type: 'daterange', width: '360px' }
        ],
        moreFilter: {
          inline: true,
          visible: false,
          handleFilter: () => {
            this.cardSearchConfig.moreFilter.visible = !this.cardSearchConfig.moreFilter.visible
          },
          itemRight: '100px',
          filters: [
            {
              label: '告警类型',
              key: 'type',
              type: 'select',
              width: '240px',
              options: [
                { value: 'scope', label: '范围告警' },
                { value: 'change', label: '变动告警' },
                { value: 'offline', label: '掉线告警' }
              ]
            },
            {
              label: '解除类型',
              key: 'alarmTypes',
              type: 'select',
              width: '240px',
              options: [
                { value: 'CLEAR_FORCED', label: '强制解除' },
                { value: 'CLEARED_ACK', label: '自动恢复' },
                { value: 'offline', label: '掉线告警' }
              ]
            }
          ]
        },
        defaultParams: {
          daterange: [
            moment().subtract(1, 'months').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        }
      },

      cardTableConfig: {
        loading: false,
        dataList: [],
        // selectList: [],
        // tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'name', label: '告警名称', width: 160 },
          { prop: 'showDeviceN', label: '告警设备', width: 200 },
          { prop: 'alarmType', label: '告警类型' },
          { prop: 'cycleName', label: '周期' },
          {
            prop: 'createdTime',
            label: '告警时间',
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            },
            width: 160
          },
          {
            prop: 'severity',
            label: '告警级别',
            backgroundHandle: row => row.severityColor,
            cellStyle: {
              'border-radius': '14px',
              color: '#fff',
              'line-height': '20px',
              height: '20px',
              padding: '4px 13px',
              'font-size': '12px'
            }
          },
          { prop: 'alarmValue', label: '告警触发值', width: 120 },
          { prop: 'recoverSet', label: '恢复触发值', width: 120 },
          { prop: 'recoverType', label: '解除类型' },
          { prop: 'dismissal', label: '确认/解除人', width: 150 },
          {
            prop: 'clearTime',
            label: '解除时间',
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            },
            width: 160
          },
          {
            prop: 'clearRemarks',
            label: '操作备注',
            width: 160,
            formatter: row => row.details.clearRemarks
          }
        ],
        operations: [
          {
            label: '详情',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => this.rowInfo(row)
          }
        ],
        operationWidth: '80px',
        operationFixed: 'right',
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
      // 搜索栏

      deviceName: new Map(),
      alarmSetValue: new Map(),
      alarmInfo: new Map(),
      detailsInfo: {
        visible: false,
        isStatistics: true,
        row: {},
        close: () => (this.detailsInfo.visible = false)
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      severityColor: {
        提示: 'rgb(85,204,244)',
        次要: 'rgb(255,216,0)',
        重要: '#f58717',
        紧急: 'rgb(245,75,23)',
        严重: '#FF0000'
      }
    }
  },
  created() {
    this.totalLoading = true
    getProjectRoot()
      .then(res => {
        if (res.data) {
          this.treeData.data = res.data
          this.treeData.currentProject = this.treeData.data[0]
          this.getProjectData(true)
          this.totalLoading = false
        } else {
          $messageInfo('暂无项目 不可操作，请创建项目')
          this.totalLoading = false
        }
      })
      .catch(() => {
        $messageInfo('暂无项目 不可操作，请创建项目')
        this.totalLoading = false
      })
  },
  methods: {
    async getProjectData(isFirst) {
      if (!this.treeData.currentProject.disabled) {
        if (!isFirst) {
          delete this.$refs.cardSearch.queryParams.deviceId
        }
        // 获取项目设备
        const devices = await getDevice(this.treeData.currentProject.id)
        this.cardSearchConfig.filters[1].options = devices.data.map(item => ({
          label: item.name,
          value: removeSlash(item.id.id)
        }))
        devices.data.forEach(item => {
          this.deviceName.set(item.id.id, item.name)
        })
        const aData = await getAlarmList()
        for (const item of aData.data) {
          this.alarmSetValue.set(removeSlash(item.id.id), item.details)
        }
        this.refreshData(isFirst)
      }
    },

    handleAlarm(val) {
      const data = val.data
      const alarmList = []
      const date = {
        day: '日',
        month: '月',
        year: '年'
      }
      data.forEach(item => {
        const dName = this.deviceName.get(item.originator.id)
          ? this.deviceName.get(item.originator.id)
          : '设备已删除'
        item.name = item.alarmJsonName ? item.alarmJsonName : '掉线 - ' + dName
        item.showDeviceN = dName
        const infoV = this.alarmSetValue.get(item.alarmJsonId)
        item.severityColor = this.severityColor[item.severity]

        if (infoV) {
          item.alarmValue = infoV.attributeName + ': ' + infoV.alarmSetValue
          item.recoverSet = infoV.recoverSetValue
        } else {
          item.alarmValue = '此条设置已删除'
          item.recoverSet = '此条设置已删除'
          if (item.type === 'offline') {
            item.alarmValue = '-'
            item.recoverSet = '-'
          }
        }
        if (item.alarmCycle) {
          item.cycleName = date[item.alarmCycle]
          item.recoverSet = '-'
        } else {
          item.cycleName = ''
          item.cycle = null
        }
        item.alarmType = '范围告警'
        item.alarmType = item.type === 'change' ? '变动告警' : item.alarmType
        item.alarmType = item.type === 'offline' ? '掉线告警' : item.alarmType
        // item.showStatus = '强制解除'
        // item.showStatus = item.status === ''
        item.clearTime = moment(item.clearTs).format('YYYY-MM-DD HH:mm')
        item.removeRemark = item.details.removeRemark
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm')
        if (item.status === 'CLEAR_FORCED') {
          item.recoverType = '强制解除'
          item.clearRemarks = item.details.clearRemarks ? item.details.clearRemarks : ''
          item.dismissal = item.details.dismissal ? item.details.dismissal : ''
        } else {
          item.recoverType = '自动恢复'
          item.clearRemarks = item.details.confirmRemarks ? item.details.confirmRemarks : ''
          item.dismissal = item.details.confirm ? item.details.confirm : ''
        }
        item.recordList = [] // details.record 详细告警
        if (item.details.record) {
          for (const i of item.details.record) {
            const infoItem = {
              time: moment(parseInt(i.ts)).format('YYYY-MM-DD HH:mm'),
              infoValue: i.info,
              status: i.status.toUpperCase() === 'ALARM' ? '触发报警' : '恢复'
            }
            item.recordList.push(infoItem)
          }
        }

        alarmList.push(item)
      })
      this.cardTableConfig.dataList = alarmList
      this.cardTableConfig.pagination.total = val.total
      this.loading = false
    },

    // 刷新
    async refreshData(isFirst) {
      for (const item in this.filter) {
        this.filter[item] = ''
      }
      const params = {
        projectId: this.treeData.currentProject.id,
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        ...this.cardSearchConfig.defaultParams
      }
      if (!isFirst) {
        Object.assign(params, this.$refs.cardSearch.queryParams)
      }
      const [start, end] = params.daterange
      params.start = moment(start).valueOf()
      params.end = moment(end).valueOf()
      delete params.daterange

      const res = await getHistoryAlarmList(params)
      this.cardTableConfig.pagination.page = 1
      this.handleAlarm(res.data)
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
    // margin-bottom: 10px;
    .box-btns {
      // height: 30px;
      margin-bottom: 10px;
      .top-filter {
        width: 600px;
        margin-left: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .filter_btns {
        width: 100%;
      }
    }
    .filter-label {
      margin-left: 40px;
    }
    .line {
      width: 15px;
      height: 32px;
      border-right: 2px solid gray;
      margin-right: 10px;
    }
    .filter-input {
      width: 240px;
      margin-right: 5px;
    }
    .filter-inputs {
      width: 360px !important;
    }
    .filter-select {
      width: 130px;
      margin: 0 5px 0 5px;
    }
    .time-type {
      width: 70px;
    }
    .data-time {
      width: 130px;
      margin: 0 10px;
    }
  }
  .alarm-s-table {
    .severity_span_color {
      font-size: 12px;
      color: #fff;
      padding: 4px 13px;
      border-radius: 14px;
      line-height: 20px;
    }
    .icon-time-c {
      color: #69e850;
    }
    .alarm-row-btn {
      padding: 7px 15px;
      border-radius: 20px;
    }
  }
}
</style>
