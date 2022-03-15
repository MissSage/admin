<template>
  <!-- 终端管理 -->
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
          dialog-width="560px"
          :config="addOrUpdateConfig"
          @refreshData="refreshData"
        />
        <AddOrUpdateDialog
          v-if="projectDialog.visible"
          dialog-width="560px"
          :config="projectDialog"
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
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { delProject, getProjectRoot } from '@/api/project'
import { removeSlash } from '@/utils/removeIdSlash'
import TreeList from '@/components/treeList/index.vue'
import {
  deleteGatewayAndDevice,
  copyGateway,
  getHostOrDeviceByType,
  getTemplateListByType
} from '@/api/device' // getHostOrDevice,
import useGlobal from '@/hooks/global/useGlobal'
import { getDeviceType } from '@/api/ledger/ledger2'
const { $messageInfo,$messageError,$messageSuccess, $confirm } = useGlobal()

export default {
  components: { CardTable, CardSearch, AddOrUpdateDialog, TreeList },
  mixins: [tBaseMixin],
  data() {
    return {
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加终端',
            perm: true,
            perm: true,
            handle: () => {
              this.addOrUpdateConfig.defaultValue = {
                type: 'MQTT',
                dropJudgement: '15m',
                location: [116.4, 39.91],
                gateway: true
              }
              this.addOrUpdateConfig.externalParams = {
                projectId: this.treeData.currentProject.id
              }
              this.addOrUpdateConfig.title = '添加终端'
              this.addOrUpdateConfig.visible = true
            }
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          { prop: 'name', label: '终端名称' },
          // { prop: 'foreignKey', label: '编码' },
          {
            prop: 'status',
            label: '在线状态',
            formatter: row => (row.status ? '在线' : '离线')
          }
        ],
        operations: [
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              const additionInfo = JSON.parse(row.additionalInfo)
              this.addOrUpdateConfig.title = '编辑终端'
              this.addOrUpdateConfig.defaultValue = {
                ...row,
                ...additionInfo,
                //location: additionInfo.position && additionInfo.position.trim() != '' ? additionInfo.position.split(',') : [116.4, 39.91],
                gateway: true
              }
              this.addOrUpdateConfig.visible = true
            }
          },
          {
            label: '复制',
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => this.copyGateway(row)
          },
          {
            label: '删除',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.handleDelete(row)
          }
        ],
        operationWidth: '220px',
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
        title: '添加终端',
        close: () => (this.addOrUpdateConfig.visible = false),
        open: () => this.getTemplateListByType(),
        addUrl: 'api/device',
        editUrl: 'api/device',
        defaultValue: { type: 'MQTT', location: [116.4, 39.91] },
        // externalAinfo: { gateway: true },\

        columns: [
          {
            type: 'input',
            label: '终端名称:',
            key: 'name',
            rules: [{ required: true, message: '请填写终端名称' }]
          },
          // {
          //   type: 'input',
          //   label: '终端编码:',
          //   key: 'foreignKey',
          //   rules: [{ required: true, message: '请填写终端编码' }]
          // },
          {
            type: 'input',
            label: '传输协议:',
            key: 'type',
            disabled: true
            // aInfo: true
          },
          {
            type: 'select',
            label: '协议模板:',
            key: 'templateId',
            options: []
          },
          {
            type: 'select',
            allowCreate: true,
            key: 'deviceTypeName',
            search: true,
            label: '终端类型',
            rules: [{ required: true, message: '请输入终端类型' }]
          },
          {
            type: 'textarea',
            label: '备注:',
            key: 'introduction',
            aInfo: true,
            rows: 3
          },
          {
            type: 'select',
            label: '掉线判断:',
            aInfo: true,
            key: 'dropJudgement',
            options: [
              { value: '1m', label: '1分钟' },
              { value: '5m', label: '5分钟' },
              { value: '10m', label: '10分钟' },
              { value: '15m', label: '15分钟' }
            ]
          },
          {
            type: 'location',
            label: '终端定位:',
            aInfo: true,
            key: 'location',
            rules: [{ required: true, message: '请输入终端定位' }]
          },
          {
            type: 'none',
            aInfo: true,
            key: 'gateway'
          }
        ]
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
          {
            type: 'input',
            label: 'WIFI名称:',
            aInfo: true,
            key: 'WIFIName',
            rules: [{ required: true, message: '请填写WIFI名称' }]
          },
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
      treeData: {
        that: this,
        title: '项目列表',
        data: [],
        loading: false,
        isFilterTree: true,
        currentId: '',
        currentProject: {},
        btnPerms: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          addBtn: true,
          editBtn: true,
          delBtn: true
        },
        allowCreate: false,
        allowNew: false,
        clickAddOrEdit: (node, current) => {
          console.log(node)
          this.projectDialog.externalParams = {}
          if (current === 'edit') {
            if (node.additionalInfo) {
              this.projectDialog.defaultValue = {
                ...node,
                ...JSON.parse(node.additionalInfo)
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
          this.refreshData()
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
      }
    }
  },
  created() {
    this.refreshTree(true)
    this.initDeviceType()
    // this.refreshData(true)
  },

  methods: {
    initDeviceType() {
      //    调用获取设备类型接口
      getDeviceType().then(res => {
        if (res.data) {
          this.addOrUpdateConfig.columns[3].options = res.data.map(item => ({
            label: item,
            value: item
          }))
        }
      })
    },
    async refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit
        // projectId: this.treeData.currentProject.id,
        // type: 'MQTT'
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      try {
        const res = await getHostOrDeviceByType(this.treeData.currentProject.id, 'MQTT', paramsObj)
        if (res.status === 200) {
          this.cardTableConfig.dataList = res.data.data
          this.cardTableConfig.pagination.total = res.data.total
        } else {
          $messageInfo('暂无终端')
        }
        this.cardTableConfig.loading = false
      } catch (err) {
        $messageError(err.data.message)
        this.cardTableConfig.loading = false
      }
    },
    refreshTree(isFirst) {
      getProjectRoot()
        .then(res => {
          this.totalLoading = false
          if (res.data) {
            this.treeData.data = res.data
            const fTData = this.treeData.data.filter(v => !v.disabled)
            this.treeData.currentProject = fTData[0]
            this.refreshData(isFirst)
          } else {
            $messageInfo('暂无项目 不可操作，请创建项目')
          }
        })
        .catch(err => {
          console.log(err)
          $messageInfo('暂无项目 不可操作，请创建项目')
        })
    },
    async edit() {
      const params = {
        type: this.editParams.type,
        name: this.editParams.name,
        timeRange: this.editParams.timeRange.join('-')
      }
      try {
        const res = await editYxscgl(params)
        if (res.status === 200) {
          $messageSuccess('修改成功！')
          this.refreshData()
        } else {
          $messageError('修改失败！')
        }
      } catch (error) {
        $messageError('修改失败！')
      }
    },
    handleDelete(row) {
      $confirm('确定删除指定终端?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        deleteGatewayAndDevice(removeSlash(row.id.id)).then(() => {
          $messageSuccess('操作成功')
          this.refreshData()
        })
      })
    },

    // 复制终端
    async copyGateway(row) {
      try {
        await copyGateway(removeSlash(row.id.id), this.treeData.currentProject.id)
        $messageSuccess('复制成功')
      } catch (err) {
        $messageError(err.message || err.data.message)
      }
    },

    // 获取协议模板
    getTemplateListByType() {
      getTemplateListByType('MQTT').then(res => {
        this.addOrUpdateConfig.columns[2].options = res.data.map(item => ({
          value: item.id,
          label: item.name
        }))
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
