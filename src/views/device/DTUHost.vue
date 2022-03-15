<template>
  <treeBox v-loading="totalLoading" class="DTU-host-container">
    <!-- 设备管理 DTU网关 -->
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <el-scrollbar>
        <div class="tree-right-detail-box">
          <!-- <div class="top-title-box unified-theme-bg-color">
          <p class="top-title">
            <i class="iconfont icon-shuangjiantouyou"></i
            >{{ treeData.currentProject.name || '' }} 网关列表
          </p>
        </div> -->
          <div class="content-box-container">
            <CardSearch ref="cardSearch" :config="cardSearchConfig" />
            <CardTable :config="hostTableConfig" />
            <div class="host-bottom-details-box">
              <el-tabs class="host-details-tabs hhvac-tabs-device">
                <!-- 采集器 -->
                <el-tab-pane label="采集器" class="tab-panel">
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
                        @click="() => refreshSensor()"
                        >查询</el-button
                      >
                    </div>
                    <el-button
                      size="small"
                      icon="el-icon-circle-plus-outline"
                      type="primary"
                      @click="() => addOrEditSensor()"
                      >添加采集器</el-button
                    >
                  </div>
                  <CardTable :config="sensorTableConfig" />
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
            :config="projectDialog"
            @refreshData="refreshTree"
          />
          <AddOrUpdateDialog
            v-if="hostDialog.visible"
            :config="hostDialog"
            @refreshData="refreshHost"
          />
          <AddOrUpdateDialog
            v-if="sensorDialog.visible"
            :config="sensorDialog"
            @refreshData="refreshSensor"
          />
        </div>
      </el-scrollbar>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { delProject, getProjectRoot } from '@/api/project'
import {
  copyGateway,
  deleteGatewayAndDevice,
  getDevicesListByGatewayId,
  getHostOrDeviceByType,
  deleteDevice
} from '@/api/device'
import { getFindScadaList } from '@/api/scada'
import { getTemplateListByType } from '@/api/device' // getHostOrDevice,
import TreeList from '@/components/treeList/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import { removeSlash } from '@/utils/removeIdSlash' // 处理id
import useGlobal from '@/hooks/global/useGlobal'
//接口
import { getDeviceType } from '@/api/ledger/ledger2'
const { $btnPerms, $messageInfo, $messageSuccess, $confirm } = useGlobal()
// import attributeProtocolDialog from './components/attributeProtocolDialog.vue'

export default {
  name: 'DTUHost',
  components: {
    TreeList,
    // attributeProtocolDialog,
    AddOrUpdateDialog,
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
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshHost() },
          add: {
            text: '添加网关',
            perm: true,
            handle: () => this.addOrEditHost()
          }
        },
        defaultParams: {},
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
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
          this.refreshSensor(row)
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
      sensorTableConfig: {
        loading: false,
        dataList: [],
        height: '220px',
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          { label: '采集器名称', prop: 'name', width: '140px' },
          { label: '接入类型', prop: 'accessType' },
          { label: '设备协议', prop: 'type' },
          { label: '从站地址', prop: 'unitId' },
          { label: 'Modbus类型', prop: 'modbusType', width: '120px' },
          { label: 'RTU串口', prop: 'portName' },
          { label: 'TCP地址', prop: 'host' },
          { label: 'TCP端口', prop: 'port' },
          { label: 'rtuOverTcp', prop: 'useRtuTcp', width: '140px' },
          { label: '波特率', prop: 'baudRate' },
          { label: 'Modbus 数据位', prop: 'dataBits', width: '140px' },
          { label: 'Modbus 校验位', prop: 'parity', width: '140px' },
          { label: 'Modbus 停止位', prop: 'stopBits', width: '140px' }
        ],
        operations: [
          {
            label: '复制ID',
            perm: $btnPerms('pc_gateway_hostTable_copy'),
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => this.clickCopeIdHost(row)
          },
          {
            label: '编辑',
            perm: $btnPerms('pc_gateway_hostTable_edit'),
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              this.sensorDialog.title = '编辑采集器'
              const defaultValue = {
                ...row,
                location:
                  row.location && row.location.trim() != ''
                    ? row.location.split(',')
                    : [116.4, 39.91],
                ...JSON.parse(row.additionalInfo),
                gateway: true
              }
              for (const key in row.info) {
                defaultValue[`info__${key}`] = row.info[key]
              }
              this.sensorDialog.defaultValue = defaultValue
              this.sensorDialog.visible = true
            }
          },
          {
            label: '协议',
            perm: $btnPerms('pc_gateway_hostTable_copy'),
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => {
              this.clickOpenProtocolWindow(row)
            }
          },
          {
            label: '删除',
            perm: $btnPerms('pc_gateway_hostTable_del'),
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.clickDeleteDevice(row)
          }
        ],
        operationWidth: '320px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.sensorTableConfig.pagination.limit = val
            this.refreshSensor()
          },
          pageHandle: val => {
            this.sensorTableConfig.pagination.page = val
            this.refreshSensor()
          }
        }
      },

      sensorDialog: {
        visible: false,
        title: '添加采集器',
        close: () => {
          this.sensorDialog.visible = false
        },
        addUrl: 'api/device?needUpdateGateway=false',
        editUrl: 'api/device?needUpdateGateway=false',
        defaultValue: {
          type: 'DTU'
        },
        externalParams: {},
        setSubmitParams: params => {
          params.info = {}
          for (const key in params) {
            if (key.indexOf('__') !== -1) {
              const subKey = key.split('__')[1]
              params.info[subKey] = params[key]
              delete params[key]
            }
          }
          // params.location = params.location instanceof Array ? params.location.join(',') : ''
          params.info = JSON.stringify(params.info)
          params.projectId = this.treeData.currentProject.id
          return params
        },
        columns: [
          {
            type: 'input',
            label: '采集器名称:',
            key: 'name',
            rules: [{ required: true, message: '请输入采集器名称' }]
          },
          {
            type: 'select',
            label: '协议模板:',
            key: 'templateId',
            options: [],
            handleChange: val => {
              this.sensorDialog.columns[1].options.forEach(option => {
                if (option.value === val) {
                  this.sensorDialog.externalParams.type = option.label
                }
              })
            },
            readonly: false,
            rules: [{ required: true, message: '请选择' }]
          },

          {
            type: 'select',
            allowCreate: true,
            key: 'deviceTypeName',
            search: true,
            label: '采集器类型',
            rules: [{ required: true, message: '请输入采集器类型' }]
          },
          {
            type: 'input',
            label: '从站地址:',
            key: 'info__unitId',
            rules: [{ required: true, message: '请输入从站地址' }]
          },
          {
            type: 'radio',
            label: '接入类型:',
            key: 'info__accessType',
            options: [
              { label: '232', value: '232' },
              { label: '485', value: '485' }
            ],
            rules: [{ required: true, message: '请输入硬件ID' }]
          },
          {
            type: 'input',
            label: '读取超时时间 单位：(ms):',
            message: '如无特殊，无需修改',
            key: 'info__timeout',
            rules: [{ required: true, message: '请填写网关地址' }]
          },
          {
            type: 'location',
            label: '采集器定位:',
            key: 'location',
            returnType:'str',
            rules: [{ required: true, message: '请输入采集器定位' }]
          },
          {
            type: 'select',
            label: '波特率',
            key: 'info__baudRate',
            options: [
              { label: '1200', value: 1200 },
              { label: '2400', value: 2400 },
              { label: '4800', value: 4800 },
              { label: '9600', value: 9600 },
              { label: '14400', value: 1400 },
              { label: '19200', value: 19200 },
              { label: '38400', value: 38400 },
              { label: '57600', value: 57600 },
              { label: '115200', value: 115200 },
              { label: '128000', value: 128000 }
            ],
            rules: [{ required: true, message: '请选择波特率' }]
          },
          {
            type: 'select',
            label: 'Modbus数据位',
            key: 'info__dataBits',
            options: [
              { label: '7', value: 7 },
              { label: '8', value: 8 }
            ],
            rules: [{ required: true, message: '请选择Modbus数据位' }]
          },
          {
            type: 'select',
            label: 'Modbus校验',
            key: 'info__parity',
            options: [
              { value: 'none', label: 'none' },
              { value: 'even', label: 'even' },
              { value: 'odd', label: 'odd' }
            ],
            rules: [{ required: true, message: '请选择Modbus校验' }]
          },
          {
            type: 'select',
            label: 'Modbus停止位',
            key: 'info__stopBits',
            options: [
              { value: '1', label: 1 },
              { value: '2', label: 2 }
            ],
            rules: [{ required: true, message: '请输入Modbus停止位' }]
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
          }
        ]
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
    this.initDeviceType()
    // 获取协议模板
    getTemplateListByType('DTU').then(res => {
      console.log(res, 'getTemplateListByTypegetTemplateListByType')
      this.sensorDialog.columns[1].options = res.data.map(item => ({
        label: item.name,
        value: item.id
      }))
    })
  },
  methods: {
    initDeviceType() {
      //    调用获取设备类型接口
      getDeviceType().then(res => {
        if (res.data) {
          this.sensorDialog.columns[2].options = res.data.map(item => ({
            label: item,
            value: item
          }))
        }
      })
    },
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
      const queryParams = this.$refs.cardSearch && this.$refs.cardSearch.queryParams
      const params = {
        page: this.hostTableConfig.pagination.page,
        size: this.hostTableConfig.pagination.limit,
        name: queryParams && queryParams.name
      }
      // 调拿设备的方法，拿选中项目的设备
      getHostOrDeviceByType(this.treeData.currentProject.id, 'DTU', params).then(res => {
        this.hostTableConfig.dataList = res.data.data.map(item => ({
          ...(JSON.parse(item.additionalInfo || '') || {}),
          ...item
        }))
        this.hostTableConfig.pagination.total = res.data.total
        if (!res.data || !res.data.data || !res.data.data[0]) {
          this.sensorTableConfig.dataList = []
          // $messageInfo('暂无网关')
        } else {
          this.refreshSensor(res.data.data[0])
        }
      })
    },

    // 点击行 选中网关
    refreshSensor(row) {
      // this.$refs.hostTable.$refs.simpleTable.setCurrentRow(row)
      if (row) this.currentHost = row
      this.sensorTableConfig.dataList = []
      // todo: 获取网关的 采集器，逻辑流程，组态，变量等信息
      const params = {
        key: 'info,prop',
        page: this.sensorTableConfig.pagination.page,
        size: this.sensorTableConfig.pagination.limit,
        name: this.sensorFilter
      }
      console.log(this.currentHost.id, params)
      // 采集器 'info,prop',
      getDevicesListByGatewayId(removeSlash(this.currentHost.id.id), params).then(res => {
        const data = res.data.data
        const deviceList = []
        data.forEach(element => {
          const name = element.name
          const info = JSON.parse(element.info)
          element.info = JSON.parse(element.info)
          for (const key in info) {
            element[key] = info[key]
          }
          const aInfo = JSON.parse(element.additionalInfo)
          for (const key in aInfo) {
            element[key] = aInfo[key]
          }
          element.name = name
          deviceList.push(element)
        })
        this.sensorTableConfig.dataList = deviceList
        this.sensorTableConfig.pagination.total = res.data.total
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
          $messageSuccess(res.data.result)
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
          this.refreshSensor()
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
    },

    addOrEditSensor(row) {
      console.log(row)
      if (!row) {
        if (!this.currentHost.id) return $messageInfo('请选择网关')
        this.sensorDialog.defaultValue = {
          type: 'DTU',
          location: [116.4, 39.91]
        }
        this.sensorDialog.externalParams = {
          gateWayId: this.currentHost.id
        }
        this.sensorDialog.title = '添加采集器'
      } else {
        this.sensorDialog.title = '编辑采集器'
        if (row.info) {
          for (const key in row.info) {
            row[`info__${key}`] = row.info[key]
          }
        }
        this.sensorDialog.defaultValue = {
          ...row,
          location:
            row.position && row.position.trim() != '' ? row.position.split(',') : [116.4, 39.91],
          ...JSON.parse(row.additionalInfo || {})
        }
      }
      this.sensorDialog.visible = true
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
