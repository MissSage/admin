<template>
  <!-- tempname here -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
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
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddDialog from './components/AddDialog.vue'
import { ref, defineComponent, onMounted } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import type { ICTCardTable, ITableItem } from '@/common/types/maintenance/plan'
import { CHUFAXINGJIHUA, GUDINGRIQIJIHUA, YUFANGXINGJIHUA } from '@/common/constans/maintenance'
import { changeMaintainPlanStatus, deleteMaintainPlans, getMaintainPlanTable } from '@/api/maintenance/plan'
import { QueryListParam } from '@/common/types/common'
export default defineComponent({
  components: { CardTable, CardSearch, AddDialog },
  setup() {
    const { $confirm, $messageSuccess, $messageError, $format } = useGlobal()
    const addBtnTxt = '添加计划'
    const formVisible = ref<boolean>(false)
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: addBtnTxt,
          perm: true,
          handle: () => {
            AddDialogConfig.value.title = addBtnTxt
            AddDialogConfig.value.currentId = ''
            AddDialogConfig.value.readonly = false
            AddDialogConfig.value.visible = true
          }
        },
        del: {
          text: '批量删除',
          disableHandle: () => {
            return (!cardTableConfig.value.selectList)||(cardTableConfig.value.selectList.length===0)
          },
          handle: () => handleDelete(),
          perm: true
        }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'keyword', type: 'input', width: '360px' }]
    })

    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'name', label: '计划名称' },
        { prop: 'type', label: '计划类型',formatter:(row:ITableItem)=>formatType(row)  },
        { prop: 'createTime', label: '创建时间' ,formatter:(row:ITableItem)=>row.createTime?$format(row.createTime):''},
        { prop: 'creator', label: '创建人' },
        { prop: 'excuteTime', label: '下次检修时间',formatter:(row:ITableItem)=>row.executeTime?$format(row.executeTime):'' },
        {
          prop: 'deviceNameList',
          label: '检修设备',
          width: 200
        },
        { prop: 'status', label: '启用状态',formatter:(row:ITableItem)=>formatStatus(row) }
      ],
      operations: [
        {
          labelHandle: row => (row.status=='1' ? '停用' : '启用'),
          perm: true,
          iconHandle: row =>
            row.status == '1'
              ? 'iconfont icon-qitingcaozuo-tingzhi'
              : 'iconfont icon-jiechuhezuoguanxi',
          handle: row => handleStatusChange(row)
        },
        {
          label: '详情',
          perm: true,
          icon: 'iconfont icon-xiangqing',
          handle: row => handleDetail(row)
        },
        {
          label: '删除',
          perm: true,
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '220px',
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

    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { name } = cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        name: name
      }
      // Object.assign(paramsObj, cardSearch.value?.queryParams)
      try {
        const res = await getMaintainPlanTable(paramsObj)
        console.log(res)
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
    onMounted(() => {
      // 挂载后再加载数据
      refreshData()
    })
    const handleStatusChange = async (row: ITableItem) => {
      const res = await changeMaintainPlanStatus(row.id)
      if(res.status==200){
        refreshData()
      }
    }
    const handleDetail = (row: ITableItem) => {
      AddDialogConfig.value.title = '详情'
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
          ids = cardTableConfig.value?.selectList?.map(node => node.id)??[]
        }
        deleteMaintainPlans(ids).then(() => {
          $messageSuccess('操作成功')
          refreshData()
        })
      })
    }

    const formatStatus = (row:ITableItem) =>{
      return row.status=='1'?'启用':'停用'
    }
    const formatType = (row:ITableItem) =>{
      switch (row.type) {
        case GUDINGRIQIJIHUA:
          return '固定日期计划'
      case YUFANGXINGJIHUA:
          return '预防性计划'
      case CHUFAXINGJIHUA:
          return '触发性计划'
        default:
          return row.type
      }
    }
    return {
      formVisible,
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      AddDialogConfig,
      refreshData,
      handleStatusChange,
      handleDetail,
      handleDelete
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
