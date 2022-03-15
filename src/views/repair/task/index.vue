<template>
  <!-- tempname here -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      ref="addOrUpdate"
      :config="addOrUpdateConfig"
      dialog-width="560px"
      @refreshData="refreshData"
    />
    <AouForm
      v-if="AouFormVisible"
      :close="AouFormClose"
      :visible="AouFormVisible"
      :task-id="IssueTaskId"
      :task-type="IssueIaskType"
      :disable-type="true"
      @refreshData="refreshData"
    />
    <AddDialog
      v-if="AddDialogConfig.visible"
      :visible="AddDialogConfig.visible"
      :close="AddDialogConfig.close"
      :current-id="AddDialogConfig.currentId"
      :readonly="AddDialogConfig.readonly"
      :title="AddDialogConfig.title"
      :width="'60%'"
      @refreshData="refreshData"
    />
    <OrderFormStepForm
      v-if="orderAOUFormDialog.visible && orderAOUFormDialog.order"
      :config="orderAOUFormDialog"
      @refreshData="refreshData"
    />
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import AddDialog from './components/AddDialog.vue'
import OrderFormStepForm from '@/views/workorder/components/orderStepForm.vue'
import { ref, defineComponent, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import type { ICTCardTable, ITableItem, ITask } from '@/common/types/repair/task'
import {
  addRepairTaskFaultReport,
  deleteRepairTasks,
  getRepairTaskDetail,
  getRepairTaskTable
} from '@/api/repair/task'
import { QueryListParam } from '@/common/types/common'
import { GUZHANGBAOXIU, STATUSCOLORS } from '@/common/constans/repair'
import { setReportParams, formatType, formatStatus } from './index'
import { getProjectRoot } from '@/api/project'

import AouForm from '@/views/workorder/components/aouForm.vue'
import { ISetpOrderConfig } from '@/common/types/workorder'
import router from '@/router'
import useDevice from '@/hooks/device/useDevice'
import useProject from '@/hooks/project/useProject'
export default defineComponent({
  components: { CardTable, CardSearch, AddOrUpdateDialog, AddDialog, AouForm, OrderFormStepForm },
  setup(props, ctx) {
    const state = reactive<{
      AouFormClose: any
      AouFormVisible: boolean
      IssueTaskId: string
      IssueIaskType: string
    }>({
      AouFormClose: () => {
        state.AouFormVisible = false
      },
      AouFormVisible: false,
      IssueTaskId: '',
      IssueIaskType: '1'
    })
    const { $confirm, $message, $format } = useGlobal()
    const { DeviceTree, getDeviceTree } = useDevice()
    const { getAreaTreeData } = useProject()
    const addBtnTxt = '故障报修'
    const detailBtn = '故障报修任务'
    // const editBtnTxt = '编辑'
    const projectList = ref<NormalOption[]>([])
    // const deviceList = ref<SelectOption[]>([
    //   { label: '设备1', value: '设备1' },
    //   { label: '设备2', value: '设备2' }
    // ])
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: addBtnTxt,
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.title = addBtnTxt
            addOrUpdateConfig.value.defaultValue = {
              type: GUZHANGBAOXIU
            }

            addOrUpdateConfig.value.disableSubmit = false
            addOrUpdateConfig.value.columns = [
              {
                type: 'input',
                label: '任务名称',
                key: 'name',
                rules: [{ required: true, message: '请填写名称' }]
              },
              {
                type: 'cascader',
                label: '选择项目',
                key: 'projectId',
                cascaderOptions: projectList.value,
                rules: [{ required: true, message: '请选择项目' }],
                handleChange: handleProjectChange
              },
              {
                type: 'cascader',
                label: '选择设备',
                key: 'deviceId',
                cascaderOptions: DeviceTree.value,
                rules: [{ required: true, message: '请选择设备' }]
              },
              {
                type: 'image',
                label: '上传图片',
                key: 'imgs'
              },
              {
                type: 'textarea',
                label: '故障描述',
                key: 'remark'
              }
            ]
            addOrUpdateConfig.value.submit = addRepairTaskFaultReport
            addOrUpdateConfig.value.visible = true
            addOrUpdateConfig.value.setSubmitParams = setReportParams
          }
        },
        del: {
          text: '批量删除',
          disableHandle: () => !cardTableConfig.value?.selectList?.length,
          handle: () => handleDelete(),
          perm: true
        }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
    })
    const routerGo = (row: ITableItem) => {
      console.log(row.orderId)
      router.push({
        name: 'OrderDetail',
        query: { id: row.orderId, title: row.name }
      })
    }
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        {
          prop: 'name',
          label: '任务名称'
        },
        { prop: 'type', label: '任务类型', formatter: (row: ITableItem) => formatType(row) },
        {
          prop: 'status',
          label: '任务状态',
          textColorHandle: (row: ITableItem) => STATUSCOLORS[row.status],
          formatter: (row: ITableItem) => formatStatus(row)
        },
        {
          prop: 'executeTime',
          label: '任务生成时间',
          formatter: (row: ITableItem) => (row.executeTime ? $format(row.executeTime) : '')
        },
        // { prop: '', label: '关联设备' },
        {
          prop: 'code',
          label: '关联工单',
          width: 300,
          formatter: row => {
            return row.code ? '工单(' + row.code + ')' : row.code
          },
          textColor: '#4195f0',
          handleClick: row => routerGo(row)
          // (row: ITableItem) => {
          //   orderAOUFormDialog.order = {
          //     id: row.orderId
          //   }
          //   orderAOUFormDialog.title = formateType(row.type)
          //   orderAOUFormDialog.visible = true
          // }
        }
      ],
      operations: [
        {
          label: '开具工单',
          perm: true,
          icon: 'iconfont icon-bianji',
          disableHandle: (row: ITableItem) => {
            return row.code ? (row.code.trim() === '' ? false : true) : false
          },
          handle: row => handleIssue(row)
        },
        {
          label: '详情',
          perm: true,
          icon: 'iconfont icon-bianji',
          handle: row => handleDetail(row)
        },
        {
          label: '删除',
          perm: true,
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '260px',
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
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '添加任务',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    const addOrUpdateConfig = ref<AOUConfig>({
      visible: false,
      title: '',
      defaultValue: {},
      externalParams: {},
      columns: [],
      close: () => {
        addOrUpdateConfig.value.visible = false
      }
    })
    const orderAOUFormDialog = reactive<ISetpOrderConfig>({
      visible: false,
      title: '',
      dialogWidth: '60%',
      order: null,
      close: () => {
        orderAOUFormDialog.visible = false
      }
    })

    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { name } = cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        name: name
      }
      Object.assign(paramsObj, cardSearch.value?.queryParams)
      try {
        const res = await getRepairTaskTable(paramsObj)
        console.log(res)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $message.error('获取失败')
        }

        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    const handleProjectChange = async (projectId: string) => {
      await getDeviceTree(projectId).then(() => {
        const colum = addOrUpdateConfig.value.columns.find(item => item.key === 'deviceId')
        colum && (colum.cascaderOptions = DeviceTree.value)
      })
    }
    const getProjectList = async () => {
      projectList.value = await getAreaTreeData()
    }
    onMounted(async () => {
      // 挂载后再加载数据
      refreshData()
      getProjectList()
    })

    // 开具工单
    const handleIssue = (row: ITableItem) => {
      // addOrUpdateConfig.value.columns = IssueColums
      // addOrUpdateConfig.value.visible = true
      // addOrUpdateConfig.value.title = '新增工单'
      // addOrUpdateConfig.value.defaultValue = {
      //   type: GONGDANLEIXING
      // }
      // addOrUpdateConfig.value.submit = addRepairTaskFaultReport
      // addOrUpdateConfig.value.setSubmitParams = params => {
      //   const newPar = {
      //     mainId: row.id,
      //     ...params
      //   }
      //   return newPar
      // }
      state.IssueTaskId = row.id
      state.AouFormVisible = true
    }
    // 详情
    const handleDetail = (row: ITableItem) => {
      if (row.type == GUZHANGBAOXIU) {
        getRepairTaskDetail(row.id).then(res => {
          console.log(res)
          const data: ITask = res.data
          addOrUpdateConfig.value.disableSubmit = true
          addOrUpdateConfig.value.title = detailBtn
          addOrUpdateConfig.value.defaultValue = {
            type: GUZHANGBAOXIU
          }
          addOrUpdateConfig.value.columns = [
            {
              type: 'input',
              label: '任务名称',
              disabled: true,
              key: 'name'
            },
            {
              type: 'input',
              label: '项目名称',
              disabled: true,
              key: 'projectId'
            },
            {
              type: 'input',
              label: '设备',
              disabled: true,
              key: 'deviceId'
            },
            {
              type: 'image',
              label: '上传图片',
              disabled: true,
              key: 'imgs'
            },
            {
              type: 'textarea',
              label: '故障描述',
              disabled: true,
              key: 'remark'
            }
          ]
          addOrUpdateConfig.value.submit = addRepairTaskFaultReport
          addOrUpdateConfig.value.visible = true
          addOrUpdateConfig.value.setSubmitParams = setReportParams
          addOrUpdateConfig.value.defaultValue = {
            name: data.name,
            projectId: data.jobList ? data.jobList[0].projectName : '',
            deviceId: data.jobList ? data.jobList[0].deviceName : '',
            imgs: data.jobList ? data.jobList[0].imgs : '',
            remark: data.jobList ? data.jobList[0].remark : '',
            type: ''
          }
          console.log(addOrUpdateConfig.value.defaultValue)
        })
      } else {
        AddDialogConfig.value.title = ''
        AddDialogConfig.value.currentId = row.id
        AddDialogConfig.value.readonly = true
        AddDialogConfig.value.visible = true
      }
    }
    const handleDelete = (row?: ITableItem) => {
      console.log(row)
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = cardTableConfig.value?.selectList?.map(node => node.id) ?? []
        }
        deleteRepairTasks(ids).then(res => {
          if (res.status == 200) {
            $message({
              type: 'success',
              message: '操作成功'
            })
            refreshData()
          } else {
            $message({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      })
    }

    return {
      ...toRefs(state),
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      addOrUpdateConfig,
      AddDialogConfig,
      orderAOUFormDialog,
      DeviceTree,
      getDeviceTree,
      formatType,
      formatStatus,
      refreshData,
      handleDelete,
      handleIssue,
      routerGo,
      handleProjectChange,
      getAreaTreeData
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
