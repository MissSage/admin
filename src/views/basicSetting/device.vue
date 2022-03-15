<template>
  <!-- 设备管理 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AddOrUpdateDialog
          v-if="addOrUpdateConfig.visible"
          ref="addOrUpdate"
          :config="addOrUpdateConfig"
          @refreshData="refreshData"
        />
      </div>
    </template>
  </treeBox>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import QRCodePopover from './components/QRCodePopover.vue'
import ImportBtn from './components/ImportBtn.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import { removeSlash } from '@/utils/removeIdSlash'
import TreeList from '@/components/treeList/index.vue'
import {
  getRealDevice,
  delRealDevice,
  exportRealDevice,
  importRealDevice,
  downloadQrCode,
  getTenantGateway
} from '@/api/device'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageSuccess,$messageInfo,$messageError, $confirm } = useGlobal()

export default {
  components: { CardTable, CardSearch, AddOrUpdateDialog, TreeList },
  mixins: [tBaseMixin],
  data() {
    return {
      totalLoading: false,
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加设备',
            perm: true,
            handle: () => {
              this.addOrUpdateConfig.defaultValue = { isRemoteCommand: '0' }
              this.addOrUpdateConfig.externalParams = {
                projectId: this.treeData.currentProject.id
              }
              this.addOrUpdateConfig.columns.length = 10
              this.addOrUpdateConfig.title = '添加设备'
              this.addOrUpdateConfig.visible = true
            }
          }

          // del: {
          //   text: '批量删除',
          //   perm: true,
          //   handleDisabled: () => !this.cardTableConfig.selectList.length,
          //   handle: () => this.handleDelete()
          // }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }],
        moreFilter: {
          filters: [
            {
              type: 'select',
              label: '所属终端',
              key: 'deviceId',
              options: []
            }
          ],
          visible: false,
          handleFilter: () => {
            this.cardSearchConfig.moreFilter.visible = !this.cardSearchConfig.moreFilter.visible
          }
        },
        extraOperations: [
          {
            text: '二维码下载',
            perm: true,
            handle: () => this.downloadQrCode()
          },
          {
            text: '下载模板',
            perm: true,
            handle: () => this.downloadTemplate()
          },
          {
            text: '导出',
            perm: true,
            handle: () => this.exportRealDevice()
          },
          {
            text: '导入',
            perm: true,
            handle: file => this.importRealDevice(file),
            component: ImportBtn
          }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        columns: [
          { prop: 'name', label: '设备名称' },
          { prop: 'deviceCode', label: '设备编号' },
          { prop: 'position', label: '设备位号', width: '80px' },
          { prop: 'deviceType', label: '设备类型' },
          { prop: 'deviceName', label: '所属终端' },
          {
            prop: 'deviceName2',
            label: '远点终端',
            formatter: row => row.deviceName2 || '无'
          }
        ],
        operations: [
          {
            label: '二维码',
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            components: QRCodePopover
          },
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              this.addOrUpdateConfig.title = '编辑设备'
              this.addOrUpdateConfig.defaultValue = { ...row }
              if (row.isRemoteCommand === '1') {
                this.addOrUpdateConfig.columns.push({
                  type: 'select',
                  label: '远点关联终端',
                  key: 'remoteCommandDeviceId',
                  options: this.terminalList,
                  rules: [{ required: true, message: '请选择' }]
                })
              }
              this.addOrUpdateConfig.visible = true
            }
          },
          {
            perm: true,
            label: '删除',
            icon: 'iconfont icon-shanchu',
            handle: row => this.handleDelete(row)
          }
        ],
        operationWidth: '230px',
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
      addOrUpdateConfig: {
        visible: false,
        title: '添加设备',
        close: () => {
          this.addOrUpdateConfig.visible = false
          this.addOrUpdateConfig.columns.length = 10
        },
        addUrl: 'api/xjRealDevice/save',
        editUrl: 'api/xjRealDevice/save',
        defaultValue: {},
        externalParams: {},
        columns: [
          {
            type: 'input',
            label: '设备名称',
            key: 'name',
            rules: [{ required: true, message: '请填写设备名称' }]
          },
          {
            type: 'input',
            label: '设备编号',
            key: 'deviceCode',
            rules: [{ required: true, message: '请填写设备编号' }]
          },
          {
            type: 'select',
            label: '设备类型',
            key: 'deviceType',
            options: [
              { label: '普通设备', value: 'PT' },
              { label: 'IO设备', value: 'IO' },
              { label: '串口设备', value: 'RS' }
            ],
            rules: [{ required: true, message: '请选择' }]
          },
          {
            type: 'select',
            label: '设备位号',
            key: 'position',
            options: [
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' }
            ],
            rules: [{ required: true, message: '请选择' }]
          },
          {
            type: 'number',
            label: '保养周期',
            unit: '天',
            key: 'maintenance',
            rules: [{ required: true, message: '请填写保养周期' }]
          },
          {
            type: 'date',
            label: '投产时间',
            key: 'productionTime'
          },
          {
            type: 'input',
            label: '生产厂家',
            key: 'productionBrand'
          },
          {
            type: 'input',
            label: '设备型号',
            key: 'deviceModel'
          },
          {
            type: 'select',
            label: '所属终端',
            key: 'deviceId',
            options: [],
            rules: [{ required: true, message: '请选择' }]
          },
          {
            type: 'radio',
            label: '是否支持远点试跳',
            key: 'isRemoteCommand',
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '0' }
            ],
            rules: [{ required: true, message: '请选择' }],
            handleChange: val => {
              if (~~val === 1) {
                this.addOrUpdateConfig.columns.push({
                  type: 'select',
                  label: '远点关联终端',
                  key: 'remoteCommandDeviceId',
                  options: this.terminalList,
                  rules: [{ required: true, message: '请选择' }]
                })
              } else {
                this.addOrUpdateConfig.columns.length = 10
                delete this.$refs.addOrUpdate.dataForm.remoteCommandDeviceId
                this.addOrUpdateConfig.columns = [...this.addOrUpdateConfig.columns]
              }
            }
          }
        ]
      },
      terminalList: [],
      treeData: {
        that: this,
        title: '项目列表',
        data: [],
        loading: false,
        isFilterTree: true,
        currentId: '',
        currentProject: {},
        expandNodeId: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          console.log(data)
          this.treeData.currentProject = data
          this.refreshData()
        }
      }
    }
  },
  created() {
    this.refreshTree(true)
    this.getTerminal()
  },

  methods: {
    async refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        projectId: this.treeData.currentProject.id
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      try {
        const res = await getRealDevice(paramsObj)
        this.cardTableConfig.loading = false
        if (res.status === 200) {
          this.cardTableConfig.dataList = res.data.data
          this.cardTableConfig.pagination.total = res.data.total
        } else {
          $messageError('获取失败')
        }
      } catch (error) {
        this.cardTableConfig.loading = false
      }
    },
    refreshTree(isFirst) {
      getProjectRoot()
        .then(res => {
          if (res.data) {
            this.treeData.data = res.data
            const fTData = this.treeData.data.filter(v => !v.disabled)
            this.treeData.currentProject = fTData[0]
            this.refreshData(isFirst)
            this.totalLoading = false
          } else {
            $messageInfo('暂无项目 不可操作，请创建项目')
            this.totalLoading = false
          }
        })
        .catch(err => {
          console.log(err)
          $messageInfo('暂无项目 不可操作，请创建项目')
          this.totalLoading = false
        })
    },

    handleDelete(row) {
      $confirm('确定删除指定设备?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids = []
        if (row) {
          ids = [row.id]
        } else {
          ids = this.cardTableConfig.selectList.map(item => item.id)
        }
        delRealDevice(ids).then(() => {
          $$messageSuccess('操作成功')
          this.refreshData()
        })
      })
    },

    async getTerminal() {
      const res = await getTenantGateway()
      this.terminalList = res.data.map(item => ({
        label: item.name,
        value: removeSlash(item.id.id)
      }))
      console.log(this.terminalList)
      this.addOrUpdateConfig.columns[8].options = this.terminalList
      this.cardSearchConfig.moreFilter.filters[0].options = this.terminalList
    },
    async importRealDevice(formData) {
      this.totalLoading = true
      formData.append('projectId', this.treeData.currentProject.id)
      const res = await importRealDevice(formData)
      this.totalLoading = false
      console.log(res, 'importRealDevice')
      if (~~res.data.code === 0 && ~~res.status === 200) {
        $messageSuccess('导入成功')
        this.refreshData()
      }
    },
    async exportRealDevice() {
      const res = await exportRealDevice({
        page: 1,
        size: 99999,
        projectId: this.treeData.currentProject.id
      })
      const url = window.URL.createObjectURL(res.data)
      console.log(url)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${this.treeData.currentProject.name}-设备列表.xlsx`)
      document.body.appendChild(link)
      link.click()
    },

    async downloadQrCode() {
      const res = await downloadQrCode(this.treeData.currentProject.id)
      console.log(res, 'exportRealDevice')
      const url = window.URL.createObjectURL(res.data)
      console.log(url)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${this.treeData.currentProject.name}-设备二维码.zip`)
      document.body.appendChild(link)
      link.click()
    },

    downloadTemplate() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = 'http://139.155.92.140:29999/group1/M00/00/00/rBsADGDv9wmAFtEPAAAnoD0qTl032.xlsx'
      link.setAttribute('download', '设备模板.xlsx')
      document.body.appendChild(link)
      link.click()
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
