<template>
  <!-- 企业管理 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <TenantDetail :tenant="treeData.currentProject" />
      </div>
      <AddOrUpdateDialog
        v-if="addOrUpdateConfig.visible"
        dialog-width="860px"
        :config="addOrUpdateConfig"
        @refreshData="getTreeData"
      />
    </template>
  </treeBox>
</template>

<script>
import TreeList from '@/components/treeList/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
// import { delDeviceGroup } from '@/api/template-management'
import TenantDetail from './components/tenantDetail.vue'
import { getCurrentTenantList, delTenant } from '@/api/project'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()

export default {
  name: 'MaintainingInfo',
  components: {
    TreeList,
    AddOrUpdateDialog,
    TenantDetail
  },
  mixins: [tBaseMixin],
  data() {
    return {
      addOrUpdateConfig: {
        visible: false,
        title: '新增企业',
        close: () => {
          this.addOrUpdateConfig.visible = false
        },
        addUrl: 'api/tenant',
        editUrl: 'api/tenant/edit',
        defaultValue: {
          location: [116.4, 39.91]
        },
        labelWidth: '90px',
        externalParams: {
          appTypeId: '2c9835d272929e05017292b17457003e'
        },
        columns: [
          {
            type: 'input',
            label: '企业名称',
            key: 'title',
            rules: [{ required: true, message: '请输入企业名称' }]
          },
          {
            type: 'textarea',
            label: '企业简介',
            key: 'remark'
          },
          {
            type: 'input',
            label: '企业地址',
            key: 'address',
            rules: [{ required: true, trigger: 'blur', message: '请输入地址' }]
          },
          {
            type: 'location',
            label: '经纬度',
            key: 'location', // 固定 （必须给默认值，
            replaceKey: 'address2' // 替换键名
          },
          {
            type: 'input',
            label: '用户邮箱',
            key: 'email',
            rules: [{ required: true, validator: this.checkEmail, trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '手机号',
            key: 'phone',
            rules: [{ required: true, validator: this.checkPhone, trigger: 'blur' }]
          },
          {
            type: 'input',
            label: '姓名',
            key: 'firstName',
            rules: [{ required: true, message: '请输入用户姓名' }]
          }
        ]
      },
      treeData: {
        that: this,
        title: '企业管理',
        data: [],
        nodeBtnWidth: '120px',
        btnPerms: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          noChild: true
        },
        isFilterTree: true,
        treeNodeHandleClick: data => {
          this.treeData.currentProject = data
          this.refreshData()
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        allowCreate: true,
        allowNew: true,
        // expandNodeId: Array,
        currentProject: {},
        clickAddOrEdit: (data, action) => {
          this.addOrUpdateConfig.defaultValue = {
            location: [116.4, 39.91]
          }
          this.addOrUpdateConfig.columns[6] = {
            type: 'input',
            label: '姓名',
            key: 'firstName',
            rules: [{ required: true, message: '请输入用户姓名' }]
          }
          if (action === 'edit') {
            if (!this.treeData.currentProject.id) {
              $message('请先选择企业')
              return
            }
            this.addOrUpdateConfig.columns.length = 6
            this.addOrUpdateConfig.defaultValue = {
              ...data,
              location: data.address2 || [116.4, 39.91]
            }
          }
          this.addOrUpdateConfig.visible = true
        }, // 点击增加或者编辑
        projectDelete: id => this.delTenant(id.id),
        operationText: ['新建企业', '子企业']
      },

      totalLoading: false
    }
  },
  created() {
    this.getTreeData()
  },

  methods: {
    async refreshData() {
      // get tenant
    },

    async getTreeData() {
      this.totalLoading = true
      try {
        const res = await getCurrentTenantList()
        this.totalLoading = false
        if (res.status === 200) {
          this.treeData.data = res.data || []
          if (!this.treeData.data.length) {
            $message('暂无企业 不可操作，请创建企业')
            return
          }
          this.treeData.currentProject = res.data[0]
          await this.$store.dispatch('getTenantList', res.data)
          this.refreshData()
        } else {
          this.treeData.data = []
          $message.error('获取企业失败')
        }
      } catch (err) {
        this.totalLoading = false
      }
    },
    async delTenant(id) {
      try {
        const res = await delTenant(id)
        if (res.statule === 200) {
          $message.success('删除成功')
          this.getTreeData()
        }
      } catch (err) {
        $message.error(err.data.message)
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  height: 48px;
}
</style>
