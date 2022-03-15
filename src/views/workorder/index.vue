<template>
  <!-- 工单 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <Chart
        class="tree-left-chart"
        :query-type="treeData.currentProject.id"
        :count-type="countType"
      />
      <div class="chart-btns">
        <el-button
          type="default"
          size="mini"
          :class="countType == '1' ? 'tree-left-chart__btn_active' : ''"
          @click="countType = '1'"
          >类型</el-button
        >
        <el-button
          type="default"
          size="mini"
          :class="countType == '2' ? 'tree-left-chart__btn_active' : ''"
          @click="countType = '2'"
          >优先级</el-button
        >
      </div>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AouForm
          v-if="AouFormVisible"
          :close="AouFormClose"
          :visible="AouFormVisible"
          @refreshData="refreshData"
        />
        <OrderFormStepForm
          v-if="orderAOUFormDialog.visible && orderAOUFormDialog.order"
          :config="orderAOUFormDialog"
          @refreshData="refreshData"
        />
      </div>
    </template>
  </treeBox>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import TreeList from '@/components/SLTree/index.vue'
import ShowCompletedButton from './components/showCompletedButton.vue'
import OrderFormStepForm from './components/orderStepForm.vue'
import DateFilter from './components/dateFilter.vue'
import AouForm from './components/aouForm.vue'
import Chart from './components/Chart.vue'

import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'

import useGlobal from '@/hooks/global/useGlobal'

import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import {
  IWorkOrder,
  ICTCardTable,
  ITreeNode,
  IWorkOrderListParams,
  ISetpOrderConfig,
  ITreeConfig
} from '@/common/types/workorder'
import { orderList } from '@/api/workorder'
import {
  createTimeOptions,
  initTreeData,
  orderTypeOptions,
  priorityOptions,
  initInnerUser,
  formateRowPriority,
  formateRowOrderType,
  formateRowStatus,
  formateRowIsOutsider,
  statusOptions,
  formatRowDate,
  formateTypeColor,
  formateStatusColor,
  formatePriorityColor
} from './index'
import { getTenantUsersByPage } from '@/api/user/index'
import { removeSlash } from '@/utils/removeIdSlash'
import router from '@/router'

const { $messageWarning, $messageError, $confirm } = useGlobal()

export default defineComponent({
  name: 'WorkOrder',
  components: {
    TreeList,
    CardSearch,
    CardTable,
    OrderFormStepForm,
    AouForm,
    Chart
  },
  mixins: [tBaseMixin],
  setup() {
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const state = reactive<{
      totalLoading: boolean
      AouFormVisible: boolean
      AouFormClose: any
      title: string
      userOptions: NormalOption[]
      countType: string
    }>({
      totalLoading: false,
      AouFormVisible: false,
      AouFormClose: () => {
        state.AouFormVisible = false
      },
      title: '新增工单',
      userOptions: [],
      countType: '1'
    })
    const initMoreFilterColums = () => {
      return [
        {
          label: '发布时间',
          key: 'createTime',
          width: '100%',
          component: DateFilter,
          options: createTimeOptions,
          showOther: true // 是否显示自定义选项
        },
        {
          label: '优先级',
          key: 'priority',
          type: 'radio',
          width: '100%',
          options: priorityOptions
        },
        {
          label: '工单状态',
          key: 'status',
          type: 'select',
          options: statusOptions
        },
        {
          label: '工单类型',
          key: 'orderType',
          type: 'select',
          options: orderTypeOptions
        },
        {
          label: '发布人',
          key: 'creator',
          type: 'select',
          options: state.userOptions
        },
        {
          label: '处理人',
          key: 'executor',
          type: 'select',
          options: state.userOptions
        }
      ]
    }
    const cardSearchConfig = reactive<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: '新增工单',
          perm: true,
          handle: () => {
            state.AouFormVisible = true
          }
        }
        // del: {
        //   text: '批量删除',
        //   disableHandle: () =>!cardTableConfig.selectList ||
        //     (cardTableConfig.selectList && cardTableConfig.selectList.length === 0),
        //   perm: true,
        //   handle: () => handleDelete()
        // }
      },
      extraOperations: [
        {
          key: 'complete', // 设置上key就可以过滤是否已完成工单
          label: '显示已完成工单',
          perm: true,
          component: ShowCompletedButton
        }
      ],
      defaultParams: {},
      filters: [
        {
          label: '搜索',
          key: 'name',
          type: 'input',
          width: '360px',
          handleChange: (val: any) => {
            if (val && val != '') {
              refreshData()
            }
          }
        }
      ],
      moreFilter: {
        filters: [],
        inline: true,
        visible: false,
        handleFilter: () => {
          cardSearchConfig.moreFilter &&
            (cardSearchConfig.moreFilter.visible = !cardSearchConfig.moreFilter.visible)
        }
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

    const cardTableConfig = reactive<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: val => {
        cardTableConfig.selectList = val
      },
      rowCurrentChange: row => handleDetail(row),
      // (row: IWorkOrder) => {
      //   console.log(row)
      //   orderAOUFormDialog.order = row
      //   orderAOUFormDialog.title = formateType(row.type)
      //   orderAOUFormDialog.visible = true
      // },
      columns: [
        {
          prop: 'priority',
          label: '优先级',
          formatter: formateRowPriority,
          icon: 'icon iconfont icon-yiping',
          iconStyleHandler: row => {
            const color = formatePriorityColor(row.priority)
            return `color:${color};`
          }
        },
        {
          prop: 'type',
          label: '工单类型',
          formatter: formateRowOrderType,
          tag: true,
          tagEffect: 'plain',
          tagStyleHandler: row => {
            const color = formateTypeColor(row.type)
            return `background-color:#222536;color:${color};border-color:${color};padding:0 15px;`
          }
        },
        { prop: 'code', label: '工单编号' },
        { prop: 'name', label: '工单标题' },
        {
          prop: 'status',
          label: '状态',
          formatter: formateRowStatus,
          tag: true,
          tagEffect: 'dark',
          tagStyleHandler: row => {
            const color = formateStatusColor(row.status)
            return `border:none;background-color:${color}`
          }
        },
        { prop: 'isOutsider', label: '是否外委', formatter: formateRowIsOutsider },
        { prop: 'executorName', label: '处理人' },
        { prop: 'creatorName', label: '发布人' },
        {
          prop: 'createTime',
          label: '发布时间',
          width: '180',
          icon: 'el-icon-time',
          iconStyle: {
            color: '#5689c2',
            display: 'inline-block',
            'font-size': '16px'
          },
          formatter: row => formatRowDate(row, 'createTime')
        },
        {
          prop: 'deadlineTime',
          label: '截止时间',
          width: '180',
          icon: 'el-icon-time',
          iconStyle: {
            color: '#c05d71',
            display: 'inline-block',
            'font-size': '16px'
          },
          formatter: row => formatRowDate(row, 'deadlineTime')
        }
      ],
      operationWidth: '200px',
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfig.pagination.limit = val
          refreshData()
        },
        pageHandle: val => {
          cardTableConfig.pagination.page = val
          refreshData()
        }
      }
    })

    const treeData = reactive<ITreeConfig>({
      title: '项目列表',
      data: initTreeData,
      loading: false,
      isFilterTree: false,
      currentProject: initTreeData[0],
      expandNodeId: [] as string[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeNodeHandleClick: (data: ITreeNode) => {
        // 设置当前选中项目信息
        treeData.currentProject = data
        refreshData()
      }
    })

    const refreshData = async () => {
      cardTableConfig.loading = true
      console.log(cardSearch.value?.queryParams)
      const { name, complete, createTime, priority, status, orderType, creator, executor } =
        cardSearch.value?.queryParams
      console.log(createTime)
      const paramsObj: IWorkOrderListParams = {
        page: cardTableConfig.pagination.page,
        size: cardTableConfig.pagination.limit,
        type: treeData.currentProject.id, // 这里currentProject储存的是当前目录项，比如'所有工单'或'我处理的'
        code: name ? name.trim() : '',
        complete: Boolean(complete),
        createTimeStart: createTime ? new Date(createTime[0]).valueOf() : '',
        createTimeEnd: createTime ? new Date(createTime[1]).valueOf() : '',
        priority: priority ? priority : '',
        status: status ? status : '',
        orderType: orderType ? orderType : '',
        creator: creator ? removeSlash(creator) : '',
        executor: executor ? removeSlash(executor) : ''
      }

      try {
        const res = await orderList(paramsObj)
        cardTableConfig.loading = false
        cardTableConfig.dataList = res.data.data
        cardTableConfig.pagination.total = res.data.total
      } catch (error: any) {
        $messageError(error.message)
        cardTableConfig.loading = false
      }
    }

    const handleDelete = (row?: IWorkOrder) => {
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids: string[] = []
        if (row) {
          ids = row.id ? [row.id] : []
        } else {
          ids = cardTableConfig.selectList
            ? cardTableConfig.selectList.filter(item => item.id).map(item => item.id as string)
            : []
        }
        console.log(ids)
        $messageWarning('删除失败')
        // delRealDevice(ids).then(() => {
        //   $message({
        //     type: 'success',
        //     message: '操作成功'
        //   })
        //   refreshData()
        // })
      })
    }
    const initUserOption = async () => {
      const params = {
        page: 1,
        size: 999,
        authority: 'CUSTOMER_USER',
        title: ''
      }
      const res = await getTenantUsersByPage(params)
      if (res.status === 200) {
        state.userOptions = initInnerUser(res.data.data)
        cardSearchConfig.moreFilter &&
          (cardSearchConfig.moreFilter.filters = initMoreFilterColums())
      } else {
        state.userOptions = []
      }
    }
    const handleDetail = (row: IWorkOrder) => {
      router.push({
        name: 'OrderDetail',
        query: { projectId: treeData.currentProject.id, id: row.id, title: row.name }
      })
    }
    onMounted(() => {
      refreshData()
      initUserOption()
    })
    return {
      ...toRefs(state),
      cardSearch,
      treeData,
      cardSearchConfig,
      cardTableConfig,
      orderAOUFormDialog,
      refreshData,
      handleDelete,
      handleDetail
    }
  }
})
</script>
<style lang="scss" scoped>
.tree-left-chart {
  width: 100%;
  height: 260px;
  background: #272a3e;
  padding-top: 10px;
}
.chart-btns {
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #272a3e;
  padding: 5px;
  padding-bottom: 15px;
  .el-button {
    &.el-button--mini {
      height: 30px !important;
      border: 1px solid #4aa9d8;
    }

    color: #4aa9d8;
    flex: 1;
    flex-basis: 50%;
    height: 30px;
  }
  .tree-left-chart__btn_active {
    background-color: #4aa9d8;
    color: white;
  }
}
</style>
