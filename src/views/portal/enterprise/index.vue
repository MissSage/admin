<template>
  <!-- 企业管理 -->
  <treeBox>
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <EnterpriseDetails :config="enterprisevalue"></EnterpriseDetails>
        <AddOrUpdateDialog
          v-if="projectDialog.visible"
          dialog-width="560px"
          :config="projectDialog"
          @refreshData="refreshTree"
        />
      </div>
    </template>
  </treeBox>
</template>

<script lang="ts">
import TreeList from '../components/SLtree.vue'
import EnterpriseDetails from '../components/card.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getTenants, deleteTenants } from '@/api/tenant'
import { getAppList } from '@/api/application'
import AddOrUpdateDialog from './addOrUpdateDialog/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
import { defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue-demi'

import { ref } from 'vue'
const { $message, $messageInfo } = useGlobal()

export default defineComponent({
  name: '企业管理',
  components: { TreeList, EnterpriseDetails, AddOrUpdateDialog },
  mixins: [tBaseMixin],
  setup() {
    const totalLoading = ref(false)
    // 点击企业，获取当前企业下的应用
    const getProjectData = data => {
      // 设置当前选中企业的应用
      enterprisevalue.value = data
      treeData.currentProject = data
    }

    const treeData = reactive({
      title: '项目列表',
      data: [],
      loading: false,
      isFilterTree: true,
      currentId: '',
      currentProject: {},
      btnPerms: {
        addBtn: true,
        editBtn: true,
        delBtn: true
      },
      allowCreate: true,
      allowNew: true,
      clickAddOrEdit: (node, current) => {
        projectDialog.externalParams = {}
        if (current === 'edit') {
          if (node.additionalInfo) {
            // 2022-01-26 修复additional解析出错的bug
            let additionalInfo:any = null
            try {
              additionalInfo = JSON.parse(node.additionalInfo)
            } catch (error) {
              additionalInfo = node.additionalInfo
            }
            projectDialog.defaultValue = {
              ...node,
              latd: node.latd * 1,
              lgtd: node.lgtd * 1,
              ...additionalInfo
            }
          }
          projectDialog.title = '编辑应用'
        } else {
          projectDialog.title = '新建应用'
          projectDialog.defaultValue = { location: [116.4, 39.91] }
          if (node) {
            projectDialog.defaultValue = { location: [116.4, 39.91] }
            projectDialog.externalParams = { parentId: node.id }
          }
        }
        projectDialog.visible = true
      },
      expandNodeId: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      //   allowAdd: true,
      allowEdit: true,
      allowDelete: true,
      projectDelete(id: any) {
        deleteTenants(id.id).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          refreshTree()
        })
      },
      treeNodeHandleClick: getProjectData
    })

    const verification = reactive({
      validatePhone: (rule, value, callback) => {
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
      postcode: (rule, value, callback) => {
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
    })

    const projectDialog = reactive({
      visible: false,
      title: '新建应用',
      close: () => {
        projectDialog.visible = false
      },
      addUrl: 'api/tenant',
      editUrl: 'api/tenant',
      defaultValue: {},
      externalParams: {},
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
          rules: [{ validator: verification.validatePhone, trigger: 'blur' }]
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
            { validator: verification.postcode, trigger: 'blur' },
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
    })

    const refreshTree = () => {
      getTenants()
        .then(res => {
          console.log(res)

          if (res.data) {
            treeData.data = res.data.data
            const fTData = treeData.data

            enterprisevalue.value = fTData[0]
            totalLoading.value = false
          } else {
            $messageInfo('暂无企业 不可操作，请创建企业')
            totalLoading.value = false
          }
        })
        .catch(err => {
          console.log(err)
          $messageInfo('暂无企业 不可操作，请创建企业')
          totalLoading.value = false
        })
    }

    onBeforeUnmount(() => {
      // refreshInterval.value && clearInterval(refreshInterval.value)
      console.log('dataMonitoring is Unmounted')
    })

    const enterprisevalue = reactive({
      value: {}
    })

    onMounted(() => {
      refreshTree()
      getAppList().then(res => {
        console.log(res.data)
        projectDialog.columns[2].options = res.data.map(item => ({
          label: item.appName,
          value: item.id
        }))
      })
    })
    return {
      getProjectData,
      refreshTree,
      treeData,
      enterprisevalue,
      projectDialog
    }
  }
})
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
