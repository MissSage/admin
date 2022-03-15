<template>
  <!-- tempname here -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AouForm
      v-if="AouFormVisible"
      :close="AouFormClose"
      :visible="AouFormVisible"
      :task-id="IssueTaskId"
      :task-type="IssueIaskType"
      :disable-type="true"
      @refreshData="refreshData"
    />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      ref="addOrUpdate"
      :config="addOrUpdateConfig"
      dialog-width="560px"
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
import { ref, defineComponent, onMounted, reactive, toRefs } from 'vue'
import AouForm from '@/views/workorder/components/aouForm.vue'
import OrderFormStepForm from '@/views/workorder/components/orderStepForm.vue'

import useGlobal from '@/hooks/global/useGlobal'
import type { ICTCardTable, ITableItem } from '@/common/types/maintenance/task'
import { deleteMaintTasks, getMaintTaskTable } from '@/api/maintenance/task'
import { QueryListParam } from '@/common/types/common'
import { STATUSCOLORS } from '@/common/constans/maintenance'
import { formatType, formatStatus } from '@/views/repair/task/index'
import { getProjectRoot } from '@/api/project'
import { ISetpOrderConfig } from '@/common/types/workorder'
import router from '@/router'
export default defineComponent({
  components: { OrderFormStepForm, CardTable, CardSearch, AddOrUpdateDialog, AddDialog, AouForm },
  setup() {
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
      IssueIaskType: '2'
    })
    const { $confirm, $messageSuccess, $messageError, $format } = useGlobal()
    const projectList = ref<SelectOption[]>([])
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },

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
        query: { id: row.orderId, title:row.name }
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
        name
      }
      Object.assign(paramsObj, cardSearch.value?.queryParams)
      try {
        const res = await getMaintTaskTable(paramsObj)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $messageError('获取失败')
        }

        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    const getProjectList = async () => {
      const res = await getProjectRoot(null)
      console.log(res)
      projectList.value = res.data.map(item => {
        const obj = {
          label: item.name,
          value: item.id
        }
        return obj
      })
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
      // addOrUpdateConfig.value.submit = ()=>{
      //   //
      // }
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
      // getRepairTaskDetail(row.id).then(res=>{
      //   console.log(res)
      // })
      AddDialogConfig.value.title = ''
      AddDialogConfig.value.currentId = row.id
      AddDialogConfig.value.readonly = true
      AddDialogConfig.value.visible = true
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
        deleteMaintTasks(ids).then(res => {
          if (res.status == 200) {
            $messageSuccess('操作成功')
            refreshData()
          } else {
            $messageError('操作失败')
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
      formatType,
      formatStatus,
      refreshData,
      handleDelete,
      handleIssue,
      routerGo
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
