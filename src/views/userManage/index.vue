<template>
  <!-- 用户管理 -->
  <div v-loading="totalLoading" class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      ref="addOrUpdateDialog"
      :config="addOrUpdateConfig"
      @refreshData="refreshData"
    />
    <CharacterDialog
      v-if="characterDialog.visible"
      :table-config="characterDialog"
      @refreshData="refreshData"
    />
    <ProfileDialog v-if="profileDialog.visible" :table-config="profileDialog" />
    <TenantListDialog v-if="tenantListDialog.visible" :table-config="tenantListDialog" />
  </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import ProfileDialog from './components/profileDialog.vue'
import CharacterDialog from './components/characterDialog.vue'
import TenantListDialog from './components/tenantListDialog.vue'
import ImportBtn from './components/ImportBtn.vue'
import { getRolesByPage } from '@/api/menu'
import {
  getTenantUsersByPage,
  deleteUsers,
  disableUser,
  enableUser,
  resetPWD,
  importUserList,
  exportUserList
} from '@/api/user' // saveUser,
// import { parse } from 'semver'

import { removeSlash } from '@/utils/removeIdSlash'
import useGlobal from '@/hooks/global/useGlobal'
const { $message, $confirm, $btnPerms } = useGlobal()
export default {
  name: 'UserManage',
  components: {
    ProfileDialog,
    CharacterDialog,
    CardSearch,
    CardTable,
    AddOrUpdateDialog,
    TenantListDialog
  },
  data() {
    // const validatePhone = (rule, value, callback) => {
    //   const reg = /^1\d{10}$/ //  /^1[34578]\d{9}$/
    //   if (!reg.test(value)) {
    //     callback(new Error('请输入正确的手机号'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      totalLoading: false,
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加用户',
            handle: () => this.clickCreatedRole(),
            perm: true
          },
          permArea: {
            text: '权限赋予',
            handle: () => this.projectDispatch(),
            disableHandle: () => !this.cardTableConfig.selectList.length,
            perm: true
          },
          del: {
            text: '批量删除',
            disableHandle: () => !this.cardTableConfig.selectList.length,
            handle: () => this.haneleDelete(),
            perm: true
          }
        },
        filters: [
          { label: '搜索', key: 'title', type: 'input', width: '240px' },
          { label: '角色', key: 'roleId', type: 'select', width: '240px', options: [] }
        ],
        extraOperations: [
          {
            text: '下载模板',
            perm: $btnPerms('user_manage_addUser'),
            handle: () => this.downloadTemplate()
          },
          {
            text: '导出',
            perm: $btnPerms('user_manage_addUser'),
            handle: () => this.exportUserList()
          },
          {
            text: '导入',
            perm: $btnPerms('user_manage_addUser'),
            handle: (file, roleId, projectIdsString) =>
              this.importUserList(file, roleId, projectIdsString),
            component: ImportBtn
          }
        ]
      },
      cardTableConfig: {
        loading: false,
        selectList: [],
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        operationFixed:'right',
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        dataList: [],
        columns: [
          //   { prop: 'loginName', label: '工号' },
          { prop: 'firstName', label: '姓名' },
          { prop: 'phone', label: '手机号' }
          // { prop: 'roleName', label: '角色' }
        ],
        operations: [
          {
            label: '企业赋予',
            icon: 'iconfont icon-guanli',
            disableHandle: row => this.tenantSetDisable(row),
            perm: false,
            handle: row => this.clickSetTenant(row)
          },
          {
            label: '角色赋予',
            perm: true,
            icon: 'iconfont icon-jiaose',
            handle: row => this.roleDispatch(row)
          },
          {
            label: '权限范围',
            perm: $btnPerms('user_manage_permArea'),
            icon: 'iconfont icon-quanxian',
            handle: row => this.projectDispatch(row)
          },
          {
            // label: '停用',
            key: '停用',
            labelHandle: row => (row.status ? '停用' : '启用'),
            iconHandle: row =>
              row.status ? 'iconfont icon-qitingcaozuo-tingzhi' : 'iconfont icon-jiechuhezuoguanxi',
            // icon: 'iconfont icon-qitingcaozuo-tingzhi',
            perm: true,
            handle: row => {
              if (row.status) {
                this.clickDisableUser(row)
                return
              }
              this.clickEnableUser(row)
            }
          },
          {
            label: '重置密码',
            icon: 'iconfont icon-jiechuhezuoguanxi',
            perm: true,
            handle: row => this.clickResetPWD(row)
          },
          {
            label: '编辑',
            icon: 'iconfont icon-bianji',
            perm: true,
            handle: row => this.clickEdit(row)
          },
          {
            label: '删除',
            perm: true,
            icon: 'iconfont icon-shanchu1',
            handle: row => this.haneleDelete(row)
          }
        ],
        operationWidth: '540px',
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
        title: '添加用户',
        labelWidth: '120px',
        close: () => {
          this.addOrUpdateConfig.visible = false
        },
        addUrl:
          'api/newUser?istarCreatePasswordUrl=https%3A%2F%2Fems.istarscloud.com%2FcreatePassword',
        editUrl:
          'api/updateUser?istarCreatePasswordUrl=https%3A%2F%2Fems.istarscloud.com%2FcreatePassword',
        defaultValue: {},
        externalParams: {
          customerId: {
            entityType: 'CUSTOMER',
            id: 'b49ef6e0-8100-11e8-9cbe-77a34f885729'
          },
          authority: 'CUSTOMER_USER',
          password: 'Indark116!'
        },
        columns: [
          //   {
          //     type: 'input',
          //     label: '工号',
          //     key: 'loginName',
          //     rules: [{ required: true, message: '请输入工号' }]
          //   },
          {
            type: 'input',
            label: '姓名',
            key: 'firstName',
            rules: [{ required: true, message: '请输入用户姓名' }]
          },
          {
            type: 'input',
            label: '电话号码',
            key: 'phone',
            rules: [{ required: true, validator: this.checkPhone, trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '邮箱',
            key: 'email',
            rules: [{ required: true, validator: this.checkEmail, trigger: 'blur' }]
          }
          //   {
          //     type: 'input',
          //     label: 'IC卡号',
          //     key: 'serialNo'
          //   }
        ]
      },
      characterDialog: {
        visible: false,
        userId: '',
        close: () => (this.characterDialog.visible = false)
      },
      profileDialog: {
        visible: false,
        userIds: '',
        single: false,
        close: () => (this.profileDialog.visible = false)
      },
      tenantListDialog: {
        visible: false,
        userId: '',
        close: () => (this.profileDialog.visible = false)
      }
    }
  },
  computed: {
    multipleRow() {
      return this.tableSelection.length > 0
    },
    emailDis() {
      if (this.currentId !== '') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.init()
    this.refreshData(true)
    this.getRoleList()
  },
  methods: {
    selectionChange(val) {
      this.tableSelection = val
    },
    additionalInfoFormat(row) {
      const result = []
      if (row.additionalInfo) {
        if (row.additionalInfo.alarmFromSms) {
          result.push('短信')
        }
        if (row.additionalInfo.alarmFromEmail) {
          result.push('邮件')
        }
      }
      console.log(result)
      return result.join(',')
    },
    refreshData(isFirst) {
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        authority: 'CUSTOMER_USER'
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)

      getTenantUsersByPage(paramsObj)
        .then(res => {
          const data = []
          res.data.data.forEach(element => {
            console.log(element.additionalInfo, 'forEachforEach')
            if (element.additionalInfo && typeof element.additionalInfo === 'string') {
              element.additionalInfo = JSON.parse(element.additionalInfo)
            }
            if (element.authority === 'TENANT_ADMIN') {
              element.authority = '企业管理人员'
            } else if (element.authority === 'TENANT_SYS') {
              element.authority = '企业配置人员'
            } else if (element.authority === 'CUSTOMER_USER') {
              element.authority = '企业用户'
            } else if (element.authority === 'SYS_ADMIN') {
              element.authority = '超级管理员'
            } else if (element.authority === 'TENANT_SUPPORT') {
              element.authority = '技术支持'
            } else if (element.authority === 'TENANT_PROMOTE') {
              element.authority = '市场推广'
            }
            data.push(element)
          })
          console.log(data, 'dataListdataListdataListdataListdataList')
          this.cardTableConfig.dataList = data
          this.cardTableConfig.pagination.total = res.data.total
          // this.clickReset()
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 角色查询列表
    getRoleList() {
      getRolesByPage({
        size: 9999999,
        page: 1
      }).then(res => {
        this.cardSearchConfig.filters[1].options = res.data.data.map(role => ({
          label: role.name,
          value: removeSlash(role.id.id)
        }))
      })
    },
    // 点击 添加用户
    clickCreatedRole() {
      this.addOrUpdateConfig.title = '添加用户'
      this.addOrUpdateConfig.defaultValue = {}
      delete this.addOrUpdateConfig.externalParams.id

      this.addOrUpdateConfig.visible = true
    },
    haneleDelete(row) {
      $confirm('确定删除该用户, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids = []
        if (row) {
          ids = [row.id.id]
        } else {
          ids = this.cardTableConfig.selectList.map(item => item.id.id)
        }
        deleteUsers(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          this.refreshData()
        })
      })
    },
    // 点击 角色赋予
    roleDispatch(row) {
      this.characterDialog.visible = true
      this.characterDialog.userId = row.id.id
    },
    // 点击 项目赋予
    projectDispatch(row) {
      if (row) {
        this.profileDialog.userIds = [row.id.id]
        this.profileDialog.single = true
      } else {
        const users = this.cardTableConfig.selectList.map(item => item.id.id)
        this.profileDialog.single = false
        this.profileDialog.userIds = users
      }
      this.profileDialog.visible = true
    },
    clickEdit(row) {
      this.addOrUpdateConfig.title = '编辑用户'
      this.addOrUpdateConfig.defaultValue = { ...row }
      this.addOrUpdateConfig.externalParams.id = row.id

      this.addOrUpdateConfig.visible = true
    },
    clickDisableUser(row) {
      const id = removeSlash(row.id.id)
      disableUser(id).then(res => {
        console.log(res)
        $message('已停用该用户')
        this.refreshData()
      })
    },
    clickEnableUser(row) {
      const id = removeSlash(row.id.id)
      enableUser(id).then(res => {
        console.log(res)
        $message('已启用用户，当前用户可以正常登录')
        this.refreshData()
      })
    },
    checkPhone(rule, value, callback) {
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
    },
    checkEmail(rule, value, callback) {
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
    },
    async clickResetPWD(row) {
      $confirm('确定重置密码吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await resetPWD(removeSlash(row.id.id))
          if (res.status === 200) {
            $message.success('重置成功')
          }
        } catch (err) {
          $message.error(err.data.message)
        }
      })
    },
    tenantSetDisable(row) {
      return row.authority !== '市场推广'
    },
    init() {
      const isSysAdmin = this.$store.state.user.roles[0] === 'SYS_ADMIN'
      if (isSysAdmin) {
        // 开启按钮
        this.cardSearchConfig.operation.add.perm = true
        const sysAdminBtnPerms = ['企业赋予', '重置密码', '启用', '停用', '编辑', '删除']
        for (const item of this.cardTableConfig.operations) {
          item.perm = sysAdminBtnPerms.some(key => key === item.label || key === item.key)
        }

        // 开启角色配置选择
        this.addOrUpdateConfig.columns.push({
          type: 'select',
          label: '角色配置',
          key: 'authority',
          handleChange: val => {
            const isJszc = val === 'TENANT_SUPPORT'
            delete this.$refs.addOrUpdateDialog.dataForm.jszc
            delete this.$refs.addOrUpdateDialog.dataForm.sctg
            this.addOrUpdateConfig.columns[4] = {
              type: 'radio',
              label: isJszc ? '固件升级权限' : '是否代理商',
              key: isJszc ? 'jszc' : 'sctg',
              options: [
                { label: isJszc ? '开启' : '是', value: true },
                { label: isJszc ? '关闭' : '否', value: false }
              ],
              rules: [{ required: true, message: '请选择' }]
            }
            this.$refs.addOrUpdateDialog.dataForm[isJszc ? 'jszc' : 'sctg'] = false
          },
          options: [
            { label: '技术支持', value: 'TENANT_SUPPORT' },
            { label: '市场推广', value: 'TENANT_PROMOTE' }
          ],
          rules: [{ required: true, message: '请选择用户角色配置' }]
        })
        delete this.addOrUpdateConfig.externalParams.authority
      }
    },
    clickSetTenant(row) {
      this.tenantListDialog.userId = row.id.id
      this.tenantListDialog.visible = true
    },

    async importUserList(formData, roleId, projectIdsString) {
      this.totalLoading = true
      formData.append('roleId', removeSlash(roleId))
      formData.append('projectIdsString', projectIdsString)
      const res = await importUserList(formData)
      this.totalLoading = false
      console.log(res, 'importRealDevice')
      if (~~res.data.code === 0 && ~~res.status === 200) {
        $message.success('导入成功')
        this.refreshData()
      }
    },
    async exportUserList() {
      const res = await exportUserList()
      const url = window.URL.createObjectURL(res.data)
      console.log(url)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `用户列表.xlsx`)
      document.body.appendChild(link)
      link.click()
    },
    downloadTemplate() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = 'http://124.112.49.66:9950/user_template.xlsx'
      // link.href = 'http://139.155.92.140:8999/group1/M00/00/00/rBsADGDxGLOAH0F1AAAnsQ1RlwA63.xlsx'
      // link.href = 'http://139.155.92.140:29999/group1/M00/00/00/rBsADGDxGLOAH0F1AAAnsQ1RlwA63.xlsx'
      link.setAttribute('download', '设备模板.xlsx')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-manage-h-container {
  margin: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  overflow-y: auto;

  .content-box-container {
    padding: 10px;
    height: calc(100% - 60px);
    .operate-btn {
      button {
        border-radius: 20px;
      }
    }
  }
  .filter-box {
    display: flex;
    height: 48px;
    margin-bottom: 10px;
    justify-content: space-between;
    .box-btns {
      display: flex;
      align-items: center;
    }
    .filter-input {
      width: 200px;
      margin-right: 10px;
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
