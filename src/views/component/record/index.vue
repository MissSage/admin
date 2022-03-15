<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddDialog
      v-if="AddDialogConfig.visible"
      :visible="AddDialogConfig.visible"
      :close="AddDialogConfig.close"
      :current-id="AddDialogConfig.currentId"
      :readonly="AddDialogConfig.readonly"
      :width="'60%'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import AddDialog from './components/AddDialog.vue'
import { ICTCardTable, ITableItem } from '@/common/types/component/record'
import { QueryListParam } from '@/common/types/common'
import { getInOutRecordTable } from '@/api/component'
import useGlobal from '@/hooks/global/useGlobal'
export default defineComponent({
  name: 'ComponentRecord',
  components: { CardTable, CardSearch, AddDialog },
  setup() {
    const { $messageError, $format } = useGlobal()
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() }
      },
      filters: [{ label: '编号', key: 'code', type: 'input', width: '360px' }]
    })
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'code', label: '单号' },
        { prop: 'remark', label: '说明' },
        {
          prop: 'type',
          label: '出入库类型',
          formatter: row => (row.type == '1' ? '入库' : '出库')
        },
        { prop: 'nameList', label: '涉及组件' },
        { prop: 'username', label: '操作人员' },
        {
          prop: 'time',
          label: '操作时间',
          formatter: row => {
            return $format(row.time)
          }
        }
      ],
      operations: [
        {
          label: '详情',
          perm: true,
          icon: 'iconfont icon-xiangqing',
          handle: row => handleDetail(row)
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
      title: '',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    const handleDetail = (row: ITableItem) => {
      //
      AddDialogConfig.value.visible = true
      AddDialogConfig.value.currentId = row.id
      AddDialogConfig.value.readonly = true
    }
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { code } = cardSearch.value?.queryParams
      const params = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        code
      } as QueryListParam
      try {
        const res = await getInOutRecordTable(params)
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
        $messageError('获取失败')
      }
    }
    onMounted(() => {
      refreshData()
    })
    return {
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      AddDialogConfig
    }
  }
})
</script>

<style lang="scss" scoped></style>
