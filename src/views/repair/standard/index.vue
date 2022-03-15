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
import type { ICTCardTable, ITableItem } from '@/common/types/repair/standard'
import {
  deleteRepairStandards,
  getRepairStandardTable
} from '@/api/repair/standard'
import { QueryListParam } from '@/common/types/common'
export default defineComponent({
  components: { CardTable, CardSearch, AddDialog },
  setup() {
    const { $message, $confirm, $format } = useGlobal()
    const addBtnTxt = '添加标准'
    const editBtnTxt = '编辑标准'

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
          disableHandle: () => !cardTableConfig.value?.selectList?.length,
          handle: () => handleDelete(),
          perm: true
        }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
    })

    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'name', label: '标准名称' },
        { prop: 'deviceType', label: '设备类型' },
        { prop: 'remark', label: '要求' },
        { prop: 'creator', label: '创建人' },
        { prop: 'createTime', label: '创建时间',formatter:$format }
      ],
      operations: [
        {
          label: '编辑',
          perm: true,
          icon: 'iconfont icon-bianji',
          handle: row => handleEdit(row)
        },
        {
          label: '删除',
          perm: true,
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '150px',
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
      title: addBtnTxt,
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })

    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const {name}=cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        name: name
      }
      // Object.assign(paramsObj, cardSearch.value?.queryParams)
      try {
        const res = await getRepairStandardTable(paramsObj)
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
    onMounted(async () => {
      // 挂载后再加载数据
      refreshData()
    })
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
        deleteRepairStandards(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          refreshData()
        })
      })
    }

    const handleEdit = async (row: ITableItem) => {
      AddDialogConfig.value.title = editBtnTxt
      AddDialogConfig.value.currentId = row.id
      AddDialogConfig.value.readonly = false
      AddDialogConfig.value.visible = true
    }
    return {
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      AddDialogConfig,
      refreshData
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
