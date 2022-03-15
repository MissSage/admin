<template>
  <!-- 步骤库管理 -->
  <div class="tree-right-detail-box tabsPage">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />

    <CardTable :config="cardTableConfig" />
    <StepStoreDialog
      v-if="stepStoreDialog.visible"
      :config="stepStoreDialog"
      @refreshData="refreshData"
    />
  </div>
</template>

<script lang="ts">
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import StepStoreDialog from './components/stepStoreDialog.vue'
import { getStepList, delStep } from '@/api/patrol'
import useGlobal from '@/hooks/global/useGlobal'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import useDevice from '@/hooks/device/useDevice'
const { $messageError, $messageSuccess, $confirm, $format } = useGlobal()
export default defineComponent({
  name: 'StepStore',
  components: { CardTable, StepStoreDialog, CardSearch },
  setup() {
    const { DeviceTypes, getDeviceTypeTree } = useDevice()
    const state = reactive<{
      totalLoading: boolean
      keyWord: string
      cardSearchConfig: CSSearchConfig
      cardTableConfig: CTCardTable
      stepStoreDialog: IStepStoreDialog
    }>({
      totalLoading: false,
      keyWord: '',
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => refreshData() },
          add: { text: '添加标准', perm: true, handle: () => addStepStore() }
        },
        defaultParams: {},
        filters: [
          { label: '搜索', key: 'name', type: 'input', width: '360px' },
          {
            label: '设备类型',
            key: 'deviceType',
            type: 'select',
            width: '360px',
            multiple: true,
            options: DeviceTypes.value
          }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        columns: [
          { prop: 'name', label: '标准名称', width: 260 },
          {
            prop: 'deviceType',
            label: '设备类型',
            width: 260
          },
          { prop: 'remark', label: '要求' },
          { prop: 'creator', label: '创建人', width: 140, formatter: row => row.creator || '-' },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 200,
            formatter: row => $format(row.createTime) || '-'
          }
        ],
        operations: [
          // {
          //   label: '复制',
          //   perm: $btnPerms('bs_step_copy'),
          //   perm: true,
          //   icon: 'iconfont icon-fuzhi',
          //   handle: row => this.copyStepStore(row)
          // },
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              state.stepStoreDialog.title = '编辑步骤库'
              state.stepStoreDialog.currentId = row.id
              state.stepStoreDialog.visible = true
            }
          },
          {
            // perm: $btnPerms('bs_step_del'),
            perm: true,
            label: '删除',
            icon: 'iconfont icon-shanchu1',
            handle: row => handleDelete(row)
          }
        ],
        operationWidth: '230px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            state.cardTableConfig.pagination.limit = val
            refreshData()
          },
          pageHandle: val => {
            state.cardTableConfig.pagination.page = val
            refreshData()
          }
        }
      },
      stepStoreDialog: {
        visible: false,
        title: '添加步骤库',
        close: () => {
          state.stepStoreDialog.visible = false
        },
        currentId: ''
      }
    })
    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const refreshData = async () => {
      state.cardTableConfig.loading = true
      state.cardTableConfig.dataList = []
      state.cardTableConfig.pagination.total = 0
      const queryParams = cardSearch.value && cardSearch.value.queryParams
      const paramsObj: {
        page: string | number
        size: string | number
        deviceType?: string
        name?: string
      } = {
        page: state.cardTableConfig.pagination.page,
        size: state.cardTableConfig.pagination.limit,
        deviceType: queryParams&&queryParams.deviceType&&queryParams.deviceType.join(','),
        name: queryParams&&queryParams.name
      }
      try {
        const res = await getStepList(paramsObj)
        state.cardTableConfig.loading = false
        if (res.status === 200) {
          state.cardTableConfig.dataList = res.data.data
          state.cardTableConfig.pagination.total = res.data.total
        } else {
          $messageError('获取失败')
        }
      } catch (error) {
        state.cardTableConfig.loading = false
      }
    }

    const addStepStore = () => {
      state.stepStoreDialog.currentId = ''
      state.stepStoreDialog.title = '添加步骤库'
      state.stepStoreDialog.visible = true
    }

    const handleDelete = (row: any) => {
      $confirm('确定删除指定步骤吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = state.cardTableConfig.selectList?state.cardTableConfig.selectList.map(item => item.id):[]
        }
        delStep(ids).then(() => {
          $messageSuccess('操作成功')
          refreshData()
        })
      })
    }
    onMounted(() => {
      refreshData()
      getDeviceTypeTree().then(()=>{
        const filter = state.cardSearchConfig.filters.find(item=>item.key==='deviceType')
        filter&& (filter.options = DeviceTypes.value)
      })
    })
    return {
      ...toRefs(state),
      DeviceTypes,
      cardSearch,
      getDeviceTypeTree,
      refreshData,
      addStepStore,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
.cardSearch {
  margin: 16px 0;
}
.cardSearchContainer {
  display: flex;
  justify-content: space-between;
}
input {
  height: 48px;
}
.tableBox {
  margin-top: 20px;
}
</style>

<style lang="scss">
.tabsPage {
  padding-bottom: 20px !important;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    display: none;
  }

  .tooltip {
    .el-input__inner {
      height: 48px;
    }
  }
}
</style>
