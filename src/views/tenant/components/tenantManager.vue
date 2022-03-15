<template>
  <el-dialog
    v-model="visible"
    :width="dialogWidth || '800px'"
    :title="config.title || ''"
    :lock-scroll="false"
    @close="config.close"
  >
    <div class="dialogPageContainer">
      <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
      <CardTable :config="cardTableConfig" />
      <AddOrUpdateDialog
        v-if="addOrUpdateConfig.visible"
        ref="addOrUpdate"
        :config="addOrUpdateConfig"
        @refreshData="refreshData"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import { ref, computed, defineComponent, PropType, onMounted } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { getTenantAdminsAndSys, deleteUser } from '@/api/user'

export default defineComponent({
  components: { CardSearch, CardTable, AddOrUpdateDialog },
  props: {
    config: {
      type: Object as PropType<DialogConfig>,
      default() {
        return {
          title: '企业管理员列表',
          visible: false
        }
      }
    }
  },
  setup(props: any) {
    const { $btnPerms, $message } = useGlobal()
    const visible = computed(() => props.config.visible)

    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: '添加',
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.title = '添加管理员'
            addOrUpdateConfig.value.visible = true
          }
        },
        del: {
          text: '删除',
          perm: true,
          handle: () => handleDelete(null)
        }
      },
      filters: [{ label: '搜索', key: 'name', type: 'input', width: '240px' }]
    })

    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: val => (cardTableConfig.value.selectList = val),
      columns: [
        { prop: 'name', label: '名称' },
        { prop: 'firstName', label: '昵称' }
      ],
      operations: [
        {
          label: '编辑',
          perm: true || $btnPerms('pc_gateway_hostTable_edit'),
          icon: 'iconfont icon-bianji',
          handle: row => {
            addOrUpdateConfig.value.title = '编辑管理员'
            addOrUpdateConfig.value.defaultValue = {
              ...row,
              ...JSON.parse(row.additionalInfo)
            }
            addOrUpdateConfig.value.visible = true
          }
        },
        {
          label: '删除',
          // perm: $btnPerms('pc_gateway_hostTable_del'),
          perm: true,
          icon: 'iconfont icon-bianji',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '160px',
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfig.value.pagination.limit = val
          refreshData()
        },
        pageHandle: val => {
          cardTableConfig.value.pagination.page = val
          refreshData()
        }
      }
    })

    const addOrUpdateConfig = ref<AOUConfig>({
      visible: false,
      title: '',
      close: () => (addOrUpdateConfig.value.visible = false),
      editUrl: 'api/device',
      addUrl:
        'api/newUser?istarCreatePasswordUrl=' +
        encodeURIComponent('https://ems.istarscloud.com/createPassword'),
      defaultValue: {},
      columns: [
        {
          type: 'input',
          label: '用户邮箱',
          key: 'email',
          rules: [{ required: true, validator: checkEmail, trigger: 'blur' }],
          message: '管理员账号即邮箱'
        },
        {
          type: 'password',
          label: '密码:',
          key: 'password',
          rules: [{ required: true, message: '请输入密码' }]
        },
        {
          type: 'input',
          label: '联系手机',
          key: 'phone',
          rules: [{ required: true, validator: checkPhone, trigger: 'blur' }]
        },
        {
          type: 'select',
          label: '管理员权限:',
          key: 'authority',
          options: [{ value: 'TENANT_ADMIN', label: '企业管理员' }],
          rules: [{ required: true, message: '请选择管理员权限', trigger: 'change' }]
        },
        {
          type: 'input',
          label: '昵称',
          key: 'lastName',
          rules: [
            { validator: validateName, trigger: 'blur' },
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { max: 16, message: '昵称输入不可超过16位', trigger: 'blur' }
          ]
        }
      ],
      setSubmitParams(params) {
        params.firstName = params.lastName
        params.name = params.email
        params.tenantId = props.config.currentId
        return params
      }
    })

    const cardSearch = ref<any>(null)

    const refreshData = async () => {
      const params: any = {}
      if (cardSearch.value) {
        params.name = cardSearch.value.queryParams.name
      }
      const res = await getTenantAdminsAndSys(props.config.currentId.id)
      cardTableConfig.value.dataList = res.data.data
    }

    const handleDelete = async (row: any) => {
      if (row) {
        await deleteUser(row.id.id)
        $message.success('删除成功')
        refreshData()
      } else {
        await cardTableConfig.value.selectList.forEach(async item => {
          await deleteUser(item.id.id)
        })
        $message.success('删除成功')
        refreshData()
      }
    }

    function checkEmail(rule, value, callback) {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }

    function validateName(rules, value, callback) {
      if (value.trim() === '') {
        callback(new Error('名称不可为空，请输入'))
      } else {
        callback()
      }
    }

    function checkPhone(rule, value, callback) {
      const phoneReg = /^1[34578]\d{9}$$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换

        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }

    onMounted(() => refreshData())

    return {
      visible,
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      refreshData,
      addOrUpdateConfig
    }
  }
})
</script>

<style lang="scss">
.dialogPageContainer {
  .cardSearch {
    margin: 0 !important;
    border-radius: 0;
  }
}
</style>
