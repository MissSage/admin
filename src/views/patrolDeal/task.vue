<template>
  <!-- 计划巡检任务 -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <TaskDialog
      v-if="taskDialogConfig.visible"
      :config="taskDialogConfig"
      @refreshData="refreshData"
    />
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import TaskDialog from './components/taskDialog.vue'
import { getPatrolList, delPatrol, setPatrol } from '@/api/patrol'
import { ref, onBeforeMount, defineComponent, reactive, toRefs } from 'vue'
// import useProject from '@/hooks/project/useProject'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  name: 'PatrolTask',
  components: { CardTable, CardSearch, TaskDialog },
  setup() {
    const { $messageError, $messageSuccess, $format, $confirm } = useGlobal()
    const state = reactive<{
      cardSearchConfig: CSSearchConfig
      cardTableConfig: CTCardTable
      taskDialogConfig: DialogConfig
    }>({
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => refreshData() },
          add: {
            text: '添加任务',
            perm: true,
            handle: () => {
              state.taskDialogConfig.title = '添加任务'
              state.taskDialogConfig.currentId = ''
              state.taskDialogConfig.readonly = false
              state.taskDialogConfig.visible = true
            }
          }
        },
        defaultParams: {},
        filters: [
          {
            label: '搜索',
            key: 'content',
            type: 'input',
            width: '360px',
            handleChange: () => refreshData()
          },
          {
            label: '任务状态',
            key: 'status',
            type: 'select',
            width: '360px',
            options: [
              { label: '启用', value: '1' },
              { label: '停用', value: '2' }
            ]
          }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        columns: [
          { prop: 'content', label: '计划名称' },
          {
            prop: 'createTime',
            icon: 'el-icon-time',
            label: '创建时间',
            width: 218,
            formatter: row => $format(row.createTime),
            iconStyle: { color: '#69E850', display: 'inline-block', 'font-size': '16px' }
          },
          { prop: 'creator', label: '创建人' },
          {
            prop: 'executeTime',
            icon: 'el-icon-time',
            width: 218,
            label: '下次巡检时间',
            formatter: row => $format(row.executeTime),
            iconStyle: {
              color: '#1B8EBCFF',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: 'limitTime',
            label: '限制时间',
            formatter: row => row.limitTime + '小时',
            width: 100
          },
          {
            prop: 'periodTime',
            label: '循环周期',
            symbolIcon: '#icon-naozhong',
            formatter: row => (row.periodTime || 0) + '天',
            width: 90
          },
          { prop: 'userNames', label: '任务人' },
          {
            prop: 'status',
            label: '启用状态',
            formatter: (row: any) => (row.status === '1' ? '启用' : '停用')
          }
        ],
        operations: [
          {
            // label: '停用',
            labelHandle: row => (row.status === '1' ? '停用' : '启用'),
            iconHandle: row =>
              row.status === '1'
                ? 'iconfont icon-qitingcaozuo-tingzhi'
                : 'iconfont icon-jiechuhezuoguanxi',
            // icon: 'iconfont icon-qitingcaozuo-tingzhi',
            perm: true,
            handle: row => setPatrolState(row)
          },
          {
            label: '详情',
            perm: true,
            icon: 'iconfont icon-baogao',
            handle: row => {
              state.taskDialogConfig.title = '巡检计划详情'
              state.taskDialogConfig.currentId = row.id
              state.taskDialogConfig.readonly = true
              state.taskDialogConfig.visible = true
            }
          },
          {
            label: '删除',
            perm: true,
            icon: 'iconfont icon-shanchu',
            handle: row => handleDelete(row)
          }
        ],
        operationWidth: '240px',
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
      taskDialogConfig: {
        visible: false,
        title: '添加任务',
        currentId: '',
        close: () => {
          state.taskDialogConfig.visible = false
        }
      }
    })
    const cardSearch = ref<InstanceType<typeof CardSearch>>()

    const refreshData = async (isFirst?: boolean) => {
      state.cardTableConfig.loading = true
      const paramsObj: any = {
        page: state.cardTableConfig.pagination.page,
        size: state.cardTableConfig.pagination.limit
      }
      if (!isFirst && cardSearch.value) Object.assign(paramsObj, cardSearch.value.queryParams)
      try {
        const res = await getPatrolList(paramsObj)
        console.log(res, 'getPatrolList')
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
    onBeforeMount(async () => {
      refreshData(true)
    })

    const handleDelete = (row?: any) => {
      $confirm('确定删除指定巡检?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = state.cardTableConfig.selectList
            ? state.cardTableConfig.selectList.map(item => item.id)
            : []
        }
        delPatrol(ids).then(() => {
          $messageSuccess('操作成功')
          refreshData()
        })
      })
    }

    const setPatrolState = async (row?: any) => {
      const status = row.status === '1' ? '2' : '1'
      const res = await setPatrol({
        id: row.id,
        status: status
      })
      if (res.status === 200) {
        $messageSuccess('操作成功')
        refreshData()
      }
    }

    return {
      ...toRefs(state),
      refreshData,
      cardSearch
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
