<template>
  <treeBox v-loading="totalLoading" class="DTU-host-container">
    <!-- 设备管理 DTU网关 -->
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <!-- <div class="top-title-box unified-theme-bg-color">
          <p class="top-title">
            <i class="iconfont icon-shuangjiantouyou"></i
            >{{ treeData.currentProject.name || '' }} 网关列表
          </p>
        </div> -->
        <div class="content-box-container">
          <div class="filter-box">
            <div class="left-btn">
              <el-input
                v-model="hostFilter"
                placeholder="输入网关名称搜索"
                class="filter-input"
              ></el-input>
              <el-button icon="el-icon-search" type="primary" @click="refreshHost">查询</el-button>
            </div>
            <div class="right-btns">
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="() => addOrEditHost()"
                >添加网关</el-button
              >
            </div>
          </div>
          <CardTable :config="hostTableConfig" />
          <div class="host-bottom-details-box">
            <el-tabs class="host-details-tabs hhvac-tabs-device">
              <el-tab-pane label="基础信息" class="tab-panel">
                <AttributePane
                  :current-project="treeData.currentProject"
                  :current-host="currentHost"
                />
              </el-tab-pane>
              <!-- 变量 -->
              <el-tab-pane label="变量" class="tab-panel">
                <div class="operation-bar">
                  <div class="o-bra-left">
                    <el-input
                      v-model="sensorFilter"
                      size="small"
                      placeholder="请输入名称搜索"
                      class="filter-input"
                    ></el-input>
                    <el-button
                      size="small"
                      icon="el-icon-search"
                      type="primary"
                      @click="() => refreshTemplateData()"
                      >查询</el-button
                    >
                  </div>
                  <!-- <el-button
                    size="small"
                    icon="el-icon-circle-plus-outline"
                    type="primary"
                    @click="() => addOrEditSensor()"
                    >添加采集器</el-button
                  > -->
                </div>
                <CardTable :config="templateTableConfig" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- <attributeProtocolDialog
          v-if="deviceProtocolData.seeProtocol"
          :table-config="deviceProtocolData"
        ></attributeProtocolDialog> -->
        <AddOrUpdateDialog
          v-if="projectDialog.visible"
          dialog-width="560px"
          :config="projectDialog"
          @refreshData="refreshTree"
        />
        <AddOrUpdateDialog
          v-if="hostDialog.visible"
          dialog-width="560px"
          :config="hostDialog"
          @refreshData="refreshHost"
        />
      </div>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { delProject, getProjectRoot } from '@/api/project'
import {
  copyGateway,
  deleteGatewayAndDevice,
  getTemplateProtocol,
  getHostOrDeviceByType,
  deleteDevice
} from '@/api/device'
import { getFindScadaList } from '@/api/scada'
import TreeList from '@/components/treeList/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AttributePane from './components/attributePane.vue'
import { removeSlash } from '@/utils/removeIdSlash' // 处理id
import useGlobal from '@/hooks/global/useGlobal'
const { $btnPerms, $messageInfo,$messageSuccess, $confirm } = useGlobal()
// import attributeProtocolDialog from './components/attributeProtocolDialog.vue'

export default {
  name: 'DTUHost',
  components: {
    TreeList,
    // attributeProtocolDialog,
    AttributePane,
    AddOrUpdateDialog,
    CardTable
  },
  mixins: [tBaseMixin],
  data() {
    return {
      totalLoading: false,

      treeData: {
        that: this,
        title: '项目列表',
        data: [],
        loading: false,
        isFilterTree: true,
        currentId: '',
        currentProject: {},
        btnPerms: {
          addBtn: $btnPerms('projectTreeAdd'),
          editBtn: $btnPerms('projectTreeEdit'),
          delBtn: $btnPerms('projectTreeDel'),
          addBtn: true,
          editBtn: true,
          delBtn: true
        },
        allowCreate: true,
        allowNew: true,
        clickAddOrEdit: (node, current) => {
          this.projectDialog.externalParams = {}
          if (current === 'edit') {
            if (node.additionalInfo) {
              this.projectDialog.defaultValue = {
                ...node,
                ...node.additionalInfo
              }
            }
            this.projectDialog.title = '编辑项目'
          } else {
            this.projectDialog.title = '新建项目'
            this.projectDialog.defaultValue = { location: [116.4, 39.91] }
            if (node) {
              this.projectDialog.defaultValue = { location: [116.4, 39.91] }
              this.projectDialog.externalParams = { parentId: node.id }
            }
          }
          this.projectDialog.visible = true
        },
        expandNodeId: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.refreshHost()
        },
        allowAdd: true,
        allowEdit: true,
        allowDelete: true,
        projectDelete(id) {
          delProject(id).then(() => {
            $messageSuccess('操作成功')
            this.that.refreshTree()
          })
        }
      },

      projectDialog: {
        visible: false,
        title: '新建项目',
        close: () => {
          this.projectDialog.visible = false
        },
        addUrl: 'api/project',
        editUrl: 'api/project/edit',
        defaultValue: {},
        externalParams: {},
        columns: [
          {
            type: 'input',
            label: '项目名称:',
            key: 'name',
            rules: [{ required: true, message: '请填写项目名称' }]
          },
          // {
          //   type: 'input',
          //   label: 'WIFI名称:',
          //   aInfo: true,
          //   key: 'WIFIName',
          //   rules: [{ required: true, message: '请填写WIFI名称' }]
          // },
          {
            type: 'textarea',
            label: '项目简介:',
            key: 'introduction',
            aInfo: true,
            rows: 3
          },
          {
            type: 'image',
            aInfo: true,
            label: '图片:',
            key: 'imageUrl'
          },
          {
            type: 'input',
            label: '项目地址:',
            aInfo: true,
            key: 'address',
            rules: [{ required: true, message: '请填写项目地址' }]
          },
          {
            type: 'location',
            label: '项目定位:',
            aInfo: true,
            key: 'location',
            rules: [{ required: true, message: '请输入项目定位' }]
          }
        ]
      },

      hostFilter: '',
      hostTableConfig: {
        loading: false,
        dataList: [],
        height: '310px',
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        rowCurrentChange: row => {
          this.refreshTemplateData(row)
        },
        columns: [
          { label: '网关名称', prop: 'name', width: 200 },
          { label: '网关地址', prop: 'address' },
          { label: '网关密钥', prop: 'credentialsId' },
          { label: '掉线判断', prop: 'dropJudgement', width: 100 },
          { label: '网关定位', prop: 'showLocation', width: 200 }
        ],
        operations: [
          {
            label: '编辑',
            perm: $btnPerms('pc_gateway_hostTable_edit'),
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.addOrEditHost(row)
          },
          {
            label: '复制',
            perm: $btnPerms('pc_gateway_hostTable_copy'),
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => this.clickCopyHost(row)
          },
          {
            label: '删除',
            perm: $btnPerms('pc_gateway_hostTable_del'),
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.clickDeleteHost(row)
          }
        ],
        operationWidth: '230px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.hostTableConfig.pagination.limit = val
            this.refreshHost()
          },
          pageHandle: val => {
            this.hostTableConfig.pagination.page = val
            this.refreshHost()
          }
        }
      },

      hostDialog: {
        visible: false,
        title: '添加网关',
        close: () => {
          this.hostDialog.visible = false
        },
        addUrl: 'api/device',
        editUrl: 'api/device',
        defaultValue: {
          type: 'DTU'
        },
        externalParams: {},
        columns: [
          {
            type: 'input',
            label: '网关名称:',
            key: 'name',
            rules: [{ required: true, message: '请输入网关名称' }]
          },
          {
            type: 'input',
            label: '传输协议:',
            disabled: true,
            key: 'type',
            rules: [{ required: true, message: '请填写传输协议' }]
          },
          {
            type: 'textarea',
            label: '网关简介:',
            aInfo: true,
            key: 'introduction',
            rows: 2
          },
          {
            type: 'input',
            aInfo: true,
            label: '硬件ID:',
            key: 'hardwareId',
            rules: [{ required: true, message: '请输入硬件ID' }]
          },
          {
            type: 'input',
            label: '网关地址:',
            aInfo: true,
            key: 'address',
            rules: [{ required: true, message: '请填写网关地址' }]
          },
          {
            type: 'location',
            label: '网关定位:',
            aInfo: true,
            key: 'location',
            rules: [{ required: true, message: '请输入网关定位' }]
          },
          {
            type: 'image',
            aInfo: true,
            label: '网关图片:',
            key: 'imageUrl'
          },
          {
            type: 'select',
            aInfo: true,
            label: '掉线判断:',
            key: 'dropJudgement',
            options: [
              { label: '5m', value: '5m' },
              { label: '10m', value: '10m' },
              { label: '15m', value: '15m' },
              { label: '30m', value: '30m' },
              { label: '60m', value: '60m' }
            ],
            rules: [{ required: true, message: '请选择掉线判断' }]
          },
          {
            type: 'none',
            aInfo: true,
            label: '',
            key: 'gateway'
          }
        ]
      },

      sensorFilter: '',
      templateTableConfig: {
        loading: false,
        dataList: [],
        height: '220px',
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          { prop: 'name', label: '变量名称', width: 80 },
          { prop: 'propertyCategory', label: '实际变量名称(非中文)', width: 180 },
          {
            prop: 'statType',
            label: '统计类型',
            formatter: row => this.valueTextMap.statType[row.statType]
          },

          {
            prop: 'propertyType',
            label: '变量类型',
            width: 140,
            formatter: row => this.valueTextMap.propertyType[row.propertyType]
          },
          { prop: 'unit', label: '单位', width: 80 },
          { prop: 'sampleDeviation', label: '每小时数据偏差值', width: 180 },
          { prop: 'dataOffset', label: '数据偏移量', width: 120 },
          { prop: 'samplingMax', label: '采样最大值', width: 120, textColor: '#FF5722' },
          { prop: 'samplingMin', label: '采样最小值', width: 120, textColor: '#33AB9F' },
          { prop: 'sampleCoef', label: '采样系数', width: 100, textColor: '#FFB800' },
          { prop: 'unitCoef', label: '数据小数位', width: 100 },
          { prop: 'range', label: '量程' },
          { prop: 'formulaProperty', label: '公式' }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.templateTableConfig.pagination.limit = val
            this.refreshTemplateData()
          },
          pageHandle: val => {
            this.templateTableConfig.pagination.page = val
            this.refreshTemplateData()
          }
        }
      },

      // 采集器协议数据
      deviceProtocolData: {
        seeProtocol: false,
        type: 'dtu',
        deviceProtocolList: [],
        close: () => (this.deviceProtocolData.seeProtocol = false)
      },

      currentHost: {}
    }
  },
  created() {
    this.totalLoading = true
    this.refreshTree()
  },
  methods: {
    refreshTree() {
      getProjectRoot()
        .then(res => {
          this.totalLoading = false
          if (res.data) {
            this.treeData.data = res.data
            this.treeData.data.map(item => (item.additionalInfo = JSON.parse(item.additionalInfo)))
            this.treeData.currentProject = this.treeData.data[0]
            this.refreshHost()
          } else {
            $messageInfo('暂无项目 不可操作，请创建项目')
          }
        })
        .catch(err => {
          console.log(err)
          $messageInfo('暂无项目 不可操作，请创建项目')
        })
    },

    clickCopeIdHost(row) {
      console.log('----------', row)
      const el = document.createElement('textarea')
      el.value = row.id.id
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      $messageInfo('已复制设备ID')
    },

    // 获取项目下的网关采集器
    refreshHost() {
      this.hostTableConfig.dataList = []
      const params = {
        page: this.hostTableConfig.pagination.page,
        size: this.hostTableConfig.pagination.limit,
        name: this.hostFilter
      }
      // 调拿设备的方法，拿选中项目的设备
      getHostOrDeviceByType(this.treeData.currentProject.id, 'MQTT', params).then(res => {
        this.hostTableConfig.dataList = res.data.data.map(item => ({
          ...(JSON.parse(item.additionalInfo || '') || {}),
          ...item
        }))
        this.hostTableConfig.pagination.total = res.data.total
        if (!res.data || !res.data.data || !res.data.data[0]) {
          $messageInfo('暂无网关')
        } else {
          this.refreshTemplateData(res.data.data[0])
        }
      })
    },

    // 点击行 选中网关
    refreshTemplateData(row) {
      // this.$refs.hostTable.$refs.simpleTable.setCurrentRow(row)
      if (row) this.currentHost = row
      this.templateTableConfig.dataList = []
      // todo: 获取网关的 采集器，逻辑流程，组态，变量等信息
      const params = {
        key: 'info,prop',
        page: this.templateTableConfig.pagination.page,
        size: this.templateTableConfig.pagination.limit,
        name: this.sensorFilter
      }
      console.log(this.currentHost.id, params)

      // 协议数据
      getTemplateProtocol(this.currentHost.templateId).then(res => {
        console.log(res.data)
        this.protocolData = res.data.protocolList
        this.templateTableConfig.dataList = res.data.data
        this.templateTableConfig.pagination.total = res.data.total
      })

      getFindScadaList(removeSlash(this.currentHost.id.id)).then(res => {
        console.log(res.data, '网关-组态')
      })
    },

    // 点击行 复制网关
    clickCopyHost(row) {
      copyGateway(removeSlash(row.id.id), this.treeData.currentProject.id).then(res => {
        this.refreshHost()
        $messageInfo(res.data.result)
      })
    },

    // 点击行 删除网关
    clickDeleteHost(row) {
      $confirm('确定删除该网关, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGatewayAndDevice(removeSlash(row.id.id)).then(res => {
          this.refreshHost()
          $messageInfo.success(res.data.result)
        })
      })
    },

    // 打开设备协议
    clickOpenProtocolWindow(row) {
      this.deviceProtocolData.seeProtocol = true
      this.deviceProtocolData.deviceProtocolList = JSON.parse(row.prop)
      this.deviceProtocolData.id = row.id
    },

    clickDeleteDevice(row) {
      $confirm('确定删除该采集器, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDevice(row.id.id).then(() => {
          $messageSuccess('操作成功')
          this.refreshTemplateData()
        })
      })
    },

    addOrEditHost(row) {
      console.log(row)
      if (!row) {
        this.hostDialog.defaultValue = {
          location: [116.4, 39.91],
          gateway: true,
          type: 'DTU'
        }
        this.hostDialog.externalParams = {
          projectId: this.treeData.currentProject.id
        }
        this.hostDialog.title = '添加网关'
      } else {
        this.hostDialog.title = '编辑网关'
        if (row.info) {
          for (const key in row.info) {
            row[`info__${key}`] = row.info[key]
          }
        }
        this.hostDialog.defaultValue = {
          ...row,
          ...JSON.parse(row.additionalInfo),
          gateway: true
        }
      }
      this.hostDialog.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css/host-page.scss';

.content-box-container {
  .host-bottom-details-box {
    .host-details-tabs {
      .tab-panel {
        .h-device-table {
          height: calc(100% - 75px);
        }
      }
    }
  }
}
</style>
