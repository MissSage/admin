<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      :config="addOrUpdateConfig"
      @refreshData="refreshData"
    />
    <TenantManager v-if="tenantManagerManage.visible" :config="tenantManagerManage" />
  </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import TenantManager from './components/tenantManager.vue'
import { getTenants, deleteTenants } from '@/api/tenant'
import useGlobal from '@/hooks/global/useGlobal'
import { getAppList } from '@/api/application'
const { $message, $confirm, $btnPerms } = useGlobal()

export default {
  name: 'OperationLog',
  name: 'roleManageH',
  components: { CardSearch, CardTable, AddOrUpdateDialog, TenantManager },
  data() {
    return {
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加',
            perm: true,
            handle: () => {
              // add
              this.addOrUpdateConfig.title = '添加企业'
              this.addOrUpdateConfig.visible = true
            }
          },
          del: {
            text: '批量删除',
            perm: true,
            disableHandle: () => !this.cardTableConfig.selectList.length,
            handle: () => this.handleDelete()
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [{ prop: 'name', label: '名称' }],
        operations: [
          {
            label: '管理企业管理员',
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => {
              this.tenantManagerManage.currentId = row.id
              this.tenantManagerManage.visible = true
            }
          },
          {
            label: '企业授权管理',
            perm: true,
            icon: 'iconfont icon-icon_fuzhi',
            handle: row => {
              this.tenantManagerManage.row = row
              this.tenantManagerManage.visible = false
            }
          },
          {
            label: '编辑',
            perm: $btnPerms('pc_gateway_deviceTable_edit'),
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              this.addOrUpdateConfig.title = '编辑企业'
              this.addOrUpdateConfig.defaultValue = { ...row }
              this.addOrUpdateConfig.visible = true
            }
          },
          {
            perm: $btnPerms('pc_gateway_sensorTable_del'),
            label: '删除',
            perm: true,
            icon: 'iconfont icon-shanchu',
            handle: row => this.handleDelete(row)
          }
        ],
        operationWidth: '430px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, prev, pager, next, jumper',
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
        title: '添加企业',
        close: () => {
          this.addOrUpdateConfig.visible = false
          this.addOrUpdateConfig.columns.length = 10
        },
        addUrl: 'api/tenant',
        editUrl: 'api/tenant',
        defaultValue: {},
        columns: [
          {
            type: 'input',
            label: '企业名称',
            key: 'title',
            rules: [{ required: true, message: '请填写企业名称' }]
          },
          {
            type: 'input',
            label: '邮箱',
            key: 'email',
            rules: [{ type: 'email', message: '请输入正确邮箱地址', trigger: 'blur' }]
          },
          {
            type: 'select',
            label: '应用',
            key: 'appTypeId',
            options: [],
            rules: [{ required: true, message: '请选择应用', trigger: 'change' }]
          },
          {
            type: 'input',
            label: '联系手机',
            key: 'phone',
            rules: [{ validator: this.validatePhone, trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '国家',
            key: 'country',
            rules: [{ max: 20, message: '输入不可超过20位', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '省',
            key: 'state',
            rules: [{ max: 20, message: '输入不可超过20位', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '城市',
            key: 'city',
            rules: [{ max: 20, message: '输入不可超过20位', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '地址',
            key: 'address',
            rules: [
              { required: true, message: '请输入企业地址', trigger: 'blur' },
              { max: 40, message: '输入不可超过40位', trigger: 'blur' }
            ]
          },
          {
            type: 'input-number',
            label: '经度',
            key: 'lgtd',
            rules: [{ required: true, message: '请输入企业经度', trigger: 'blur' }]
          },
          {
            type: 'input-number',
            label: '纬度',
            key: 'latd',
            rules: [{ required: true, message: '请输入企业纬度', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '邮编',
            key: 'zip',
            rules: [
              { validator: this.postcode, trigger: 'blur' },
              { max: 20, message: '名称不超过20位', trigger: 'blur' }
            ]
          },
          {
            type: 'input',
            label: '地区',
            key: 'region',
            rules: [{ max: 40, message: '输入不可超过40位', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '平台名称',
            key: 'platformName',
            aInfo: true,
            rules: [{ max: 40, message: '输入不可超过40位', trigger: 'blur' }]
          },
          {
            type: 'textarea',
            label: '企业简介',
            key: 'companyProfiles',
            aInfo: true,
            rules: [{ max: 200, message: '输入不可超过200位', trigger: 'blur' }]
          },
          {
            type: 'input',
            label: 'App标题',
            key: 'apptitle',
            aInfo: true,
            rules: [{ max: 40, message: '输入不可超过200位', trigger: 'blur' }]
          }
        ]
      },

      tenantManagerManage: {
        title: '企业管理员列表',
        visible: false,
        currentId: '',
        close: () => (this.tenantManagerManage.visible = false)
      }
    }
  },
  created() {
    this.refreshData(true)
    getAppList().then(res => {
      console.log(res.data)
      this.addOrUpdateConfig.columns[2].options = res.data.map(item => ({
        label: item.appName,
        value: item.id
      }))
    })
  },
  methods: {
    refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        limit: this.cardTableConfig.pagination.limit
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)

      try {
        getTenants(paramsObj).then(res => {
          this.total = res.data.total
          this.cardTableConfig.dataList = res.data.data
          this.cardTableConfig.loading = false
        })
      } catch (error) {
        this.cardTableConfig.loading = false
      }
    },

    handleDelete(row) {
      $confirm('确定删除指定企业?', '删除提示', {
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
        deleteTenants(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          this.refreshData()
        })
      })
    },

    validatePhone(rule, value, callback) {
      // const valid = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g
      const valid = /^1\d{10}$/
      if (value === '' || value === null) {
        callback()
      } else {
        if (valid.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确手机号'))
        }
      }
    },

    postcode(rule, value, callback) {
      const valid = /^[1-9][0-9]{5}$/
      if (value === '' || value === null) {
        callback()
      } else {
        if (valid.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确邮政编码'))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
