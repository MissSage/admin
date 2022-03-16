<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="table-box" :config="slCardTableConfig"></SLCardTable>
  </div>
</template>
<script lang="ts">
import SLCardTable from '@/components/SLCardTable/index.vue'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import { ISLCardTable } from '@/components/SLCardTable/type'
import { COLORS, ICONS } from '@/common/constans/common'
import { SLConfirm, SLMessage } from '@/utils/global'
import { DeleteComplaints, GeComplaintsList } from '@/api/yinshou/shenqing/Complaints'
import { IQuery_YinShou_Complaints } from '../types/shengqing/Complaints'
import { formatComplaintsStatus } from './components/Complaints'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'LeakApply',
  components: { SLCardTable, SLCardSearch },
  setup () {
    const router = useRouter()
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const state = reactive<{
      slCardTableConfig: ISLCardTable
      slCardSearchConfig: ISLCardSearch
    }>({
      slCardSearchConfig: {
        filters: [
          { type: 'input', label: '搜索：', field: 'keywords', onChange: () => refreshData() }
        ],
        rightOperations: []
      },
      slCardTableConfig: {
        columns: [
          { minWidth: 180, prop: 'code', label: '投诉编号' },
          { minWidth: 180, prop: 'createTime', label: '投诉时间' },
          { minWidth: 180, prop: 'custName', label: '用户名称' },
          { minWidth: 180, prop: 'custId', label: '用户编号' },
          { minWidth: 180, prop: 'tel', label: '联系电话' },
          { minWidth: 180, prop: 'remark', label: '投诉内容' },
          {
            minWidth: 180,
            prop: 'status',
            label: '状态',
            formatter: (row: any, val: any) => formatComplaintsStatus(val)
          }
          // { width: 180, prop: 'reply', label: '回复内容' },
          // { width: 180, prop: 'replyTime', label: '回复时间' },
          // { width: 180, prop: 'img', label: '图片', image: true }
        ],
        // handleSelectChange: (rows: any) => {
        //   state.slCardTableConfig.selectList = rows || []
        // },
        dataList: [],
        selectList: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          handleSize: (size: number) => {
            state.slCardTableConfig.pagination.limit = size
            refreshData()
          },
          handlePage: (page: number) => {
            state.slCardTableConfig.pagination.page = page
            refreshData()
          }
        },
        operationWidth: '170px',
        operations: [
          {
            type: 'text',
            text: '回复',
            icon: ICONS.EDIT,
            color: COLORS.CUSTOM,
            click: (row: any) => handleReply(row),
            perm: true
          },
          {
            type: 'text',
            text: '删除',
            icon: ICONS.UPLOAD,
            color: COLORS.DELETE,
            disabled: true,
            click: (row: any) => handleDelete(row),
            perm: true
          }
        ],
        title: '',
        headerBtns: []
      }
    })
    const handleDelete = (row?: any) => {
      SLConfirm('确定删除吗？', '删除提示').then(async () => {
        const ids = row ? [row.id] : []
        const res = await DeleteComplaints(ids)
        ;(res.data?.success === true && (SLMessage.success('删除成功！'), refreshData())) ||
          SLMessage.error(res.data?.msg || '删除失败！')
      })
    }
    const handleReply = (row: any) => {
      router.push({
        name: 'ComplaintsDialog',
        query: { id: row.id, row: JSON.stringify(row) }
      })
    }
    const refreshData = async () => {
      const query = refSLCardSearch.value?.queryParams
      const params: IQuery_YinShou_Complaints = {
        page: state.slCardTableConfig.pagination?.page,
        rows: state.slCardTableConfig.pagination?.limit,
        keywords: query?.keywords
      }
      const res = await GeComplaintsList(params)
      state.slCardTableConfig.dataList = res.data?.rows || []
      state.slCardTableConfig.pagination.total = res.data?.total || 0
    }
    onMounted(() => {
      refreshData()
    })
    return {
      ...toRefs(state),
      refSLCardSearch
    }
  }
})
</script>
<style scoped lang="scss">
.wrapper {
  padding: 15px;
  width: 100%;
  height: 100%;
}
.card-box {
  height: calc(100% - 105px);
}
</style>
