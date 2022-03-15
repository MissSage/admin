<template>
  <!-- 告警设置 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <SettingsDialog
          v-if="dialogConfig.visible"
          :dialog-config="dialogConfig"
          @Save="Save"
        ></SettingsDialog>
        <ConnectDialog v-if="connectDialog.visible" :connect-dialog="connectDialog"></ConnectDialog>
      </div>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { saveAlarm, deleteAlarm, getAlarmSettingList } from '@/api/alarm' // getAlarmList,
import { getProjectRoot } from '@/api/project'
import { getDevice } from '@/api/device'
import { removeSlash } from '@/utils/removeIdSlash'
import TreeList from '@/components/treeList/index.vue'
import SettingsDialog from './components/settingsDialog.vue'
import ConnectDialog from './components/connectDialog.vue'
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageInfo,$messageSuccess, $confirm } = useGlobal()

export default {
  name: 'AlarmSettings',
  components: {
    TreeList,
    SettingsDialog,
    ConnectDialog,
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
            text: '添加告警',
            perm: true,
            handle: () => this.addAlarmSet()
          }
          // del: {
          //   text: '批量删除',
          //   perm: true,
          //   handleDisabled: () => !this.cardTableConfig.selectList.length,
          //   handle: () => this.handleDelete()
          // }
        },
        filters: [{ label: '搜索', key: 'keyword', type: 'input', width: '360px' }],
        extraOperations: [
          // {
          //   text: '导入',
          //   perm: $btnPerms('pc_device_deviceAdd'),
          //   handle: file => this.importRealDevice(file),
          //   component: ImportBtn
          // }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        // selectList: [],
        // tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'name', label: '告警名称', width: 130 },
          { prop: 'dName', label: '告警设备', width: 180 },
          { prop: 'attributeName', label: '监测数据', width: 150 },
          { prop: 'alarmTypeName', label: '告警类型' },
          { prop: 'cycleName', label: '周期', width: 120 },
          { prop: 'alarmValue', label: '告警触发值', width: 120 },
          { prop: 'recoverSet', label: '恢复类型', width: 120 },
          { prop: 'recoverValue', label: '恢复触发值', width: 120 },
          {
            prop: 'severity',
            label: '告警级别',
            textColorHandle: row => row.severityColor
          },
          {
            prop: 'period',
            label: '有效时间段',
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            },
            width: 200
          },
          { prop: 'alarmRemarks', label: '告警描述' }
        ],
        operations: [
          {
            label: '关联联系人',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => this.connect(row)
          },
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.editAlarmSet(row)
          },
          {
            label: '删除',
            perm: true,
            icon: 'iconfont icon-shanchu',
            handle: row => this.handleDelete(row)
          }
        ],
        operationWidth: '280px',
        // operationFixed: 'right',
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
      connectDialog: {
        visible: false,
        tableData: [],
        close: () => (this.connectDialog.visible = false)
      },
      filterText: '',
      devices: [],
      ents: new Map(),
      dialogConfig: {
        visible: false,
        temp: {},
        project: {},
        deviceList: [],
        close: () => (this.dialogConfig.visible = false)
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
  computed: {
    multipleRow() {
      return this.cardTableConfig.selectList.length > 0
    }
  },
  created() {
    this.totalLoading = true
    getProjectRoot()
      .then(res => {
        this.totalLoading = false
        if (res.data) {
          console.log(res.data, 'root p')
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
    connect(row) {
      this.connectDialog.visible = true
      this.connectDialog.tableData = row
    },
    // 点击项目获取项目信息
    async refreshData(isFirst) {
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      // todo: 获取设备 存,然后或者对应告警
      const res = await getAlarmSettingList(this.treeData.currentProject.id, paramsObj)
      const list = await this.handleAlarm(res.data)
      console.log(list, 'listlistlistlist')
      this.cardTableConfig.dataList = list
      this.cardTableConfig.pagination.total = res.data.total
    },
    // 告警信息处理
    async handleAlarm(val) {
      this.devices = []
      let list = val.data
      this.cardTableConfig.pagination.total = val.data?.length
      // 获取设备name id
      if (this.devices.length === 0 || this.ents.size === 0) {
        const tempDevice = await getDevice(this.treeData.currentProject.id)
        tempDevice.data.forEach(v => {
          const deviceInfo = {
            label: v.name,
            value: v.id.id
          }
          this.ents.set(v.id.id, v.name)
          this.devices.push(deviceInfo)
        })
      }
      const date = {
        day: '日',
        month: '月',
        year: '年'
      }
      list = list.map(listItem => {
        const resultItem = {}
        listItem.alarmValue = listItem.details.alarmSetValue
        listItem.recoverValue = listItem.details.recoverSetValue
        listItem.alarmTypeName = listItem.details.setAlarmType
        listItem.recoverSet = listItem.details.rType
        listItem.alarmRemarks = listItem.details.alarmRemarks
        listItem.attributeName = listItem.details.attributeName
        listItem.severityColor = this.severityColor[listItem.severity]
        console.log(this.severityColor)
        for (const item in listItem) {
          resultItem[item] = listItem[item]
        }
        resultItem.isCycle = listItem.isCycle || false
        if (listItem.cycle) {
          resultItem.cycleName = date[listItem.cycle]
          resultItem.recoverSet = '-'
          resultItem.recoverValue = '-'
        } else {
          resultItem.cycleName = ''
          resultItem.cycle = null
        }
        console.log(this.ents)
        resultItem.dName = this.ents.get(listItem.deviceId.id)
        resultItem.name = listItem.name
        return resultItem
      })
      const compare = function (obj1, obj2) {
        const val1 = obj1.createdTime
        const val2 = obj2.createdTime
        if (val1 < val2) {
          return 1
        } else if (val1 > val2) {
          return -1
        } else {
          return 0
        }
      }
      list = list.sort(compare)
      return list
    },

    // 批量删除设置
    async handleDelete(row) {
      console.log(row)
      $confirm('确定删除该告警, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // let ids = []
        // if (row) {
        //   ids = [removeSlash(row.id.id)]
        // } else {
        //   ids = this.cardTableConfig.selectList.map(item => removeSlash(item.id.id))
        // }
        const res = await deleteAlarm(removeSlash(row.id.id))
        if (res.status === 200) {
          $messageSuccess('删除成功')
          this.refreshData()
        }
      })
    },
    // 点击 添加告警设置
    addAlarmSet() {
      this.dialogConfig.project = this.treeData.currentProject
      this.dialogConfig.temp = {}
      this.dialogConfig.deviceList = this.devices
      this.dialogConfig.visible = true
    },
    // 点击 编辑告警设置
    editAlarmSet(item) {
      this.dialogConfig.project = this.treeData.currentProject
      this.dialogConfig.temp = item
      this.dialogConfig.deviceList = this.devices
      this.dialogConfig.visible = true
    },
    // dialog 保存告警
    Save(params) {
      params.projectId = this.treeData.currentProject.id
      saveAlarm(params).then(() => {
        $messageSuccess('保存成功')
        this.cardTableConfig.pagination.page = 1
        this.refreshData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cardSearch {
  margin: 16px 0;
}
input {
  height: 48px;
}
.tableBox {
  margin-top: 20px;
}
</style>
