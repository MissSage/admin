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
import { DeleteInstallApply, GetInstallList } from '@/api/yinshou/shenqing/InstallApply'
import { IQuery_YinShou_Install } from '../types/shengqing/InstallApply'
import { InstallStatusFormatter } from './components/Install'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'InstallApply',
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
          { minWidth: 180, prop: 'code', label: '报装编号' },
          { minWidth: 180, prop: 'applyTime', label: '申请时间' },
          { minWidth: 180, prop: 'custName', label: '用户名称' },
          { minWidth: 180, prop: 'tel', label: '联系电话' },
          { minWidth: 180, prop: 'bookName', label: '所在小区' },
          { minWidth: 180, prop: 'address', label: '详细地址' },
          { minWidth: 180, prop: 'idCardNo', label: '身份证号' },
          { minWidth: 180, prop: 'packageName', label: '套餐' },
          {
            minWidth: 180,
            prop: 'status',
            label: '状态',
            formatter: (row: any, val: any) => InstallStatusFormatter(val)
          }
          // { width: 180, prop: 'zysInstallSurvey', label: '勘察情况' },
          // { width: 180, prop: 'zysInstallCost', label: '缴费情况' },
          // { width: 180, prop: 'zysInstallBuild', label: '施工情况' }
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
            text: '审核',
            icon: ICONS.EDIT,
            color: COLORS.CUSTOM,
            click: (row: any) => handleApply(row),
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
        const res = await DeleteInstallApply(ids)
        ;(res.data?.success === true && (SLMessage.success('删除成功！'), refreshData())) ||
          SLMessage.error(res.data?.msg || '删除失败！')
      })
    }
    const handleApply = (row: any) => {
      router.push({
        name: 'InstallApplyDialog',
        query: { id: row.id }
      })
    }
    const refreshData = async () => {
      const query = refSLCardSearch.value?.queryParams
      const params: IQuery_YinShou_Install = {
        page: state.slCardTableConfig.pagination.page,
        rows: state.slCardTableConfig.pagination.limit,
        keywords: query?.keywords
      }

      const res = await GetInstallList(params)
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
