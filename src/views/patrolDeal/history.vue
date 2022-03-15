<template>
  <!-- 当天巡检任务 -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <HistoryDialog
      v-if="historyPatrolDetail.visible"
      :config="historyPatrolDetail"
    />
  </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import HistoryDialog from './components/historyDialog.vue'
import { getProjectRoot } from '@/api/project'
import { getHistoryPatrolList, delCurrentPatrol } from '@/api/patrol'
import { defineComponent } from 'vue'
import moment from 'moment'
import useGlobal from '@/hooks/global/useGlobal'
const { $format, $messageError, $messageSuccess, $confirm, $formatTree } = useGlobal()

export default defineComponent({
  components: { CardTable, CardSearch, HistoryDialog },
  data() {
    return {
      patrolStatus: [
        { text: '待执行', color: '#333' },
        { text: '执行中', color: '#1BBC20' },
        { text: '暂停中', color: '#BC901B' },
        { text: '已完成', color: '#1BBC20' },
        { text: '已超时', color: '#BC1B1B' }
      ],
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },

          del: {
            text: '批量删除',
            disableHandle: () => !this.cardTableConfig.selectList.length,
            perm: true,
            handle: () => this.handleDelete()
          }
        },
        defaultParams: {
          daterange: [
            moment().subtract(1, 'months').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ]
        },
        filters: [
          { label: '搜索', key: 'content', type: 'input', width: '360px' },
          {
            label: '查询时间',
            key: 'daterange',
            type: 'daterange',
            width: '360px'
          }
        ]
        // moreFilter: {
        //   filters: [
        //     {
        //       type: 'select',
        //       label: '巡检类型',
        //       key: 'type',
        //       options: [
        //         { label: '人工巡检', value: '1' },
        //         { label: '自动巡检', value: '2' }
        //       ]
        //     },
        //     {
        //       type: 'input',
        //       label: '创建人',
        //       key: 'creator'
        //     },
        //     {
        //       type: 'input',
        //       label: '任务人',
        //       key: 'user'
        //     },
        //     {
        //       type: 'cascader',
        //       label: '所属区域',
        //       key: 'projectId',
        //       props: { checkStrictly: true },
        //       options: []
        //     },
        //     {
        //       type: 'select',
        //       label: '完成状态',
        //       key: 'status',
        //       options: [
        //         { label: '已完成', value: '1' },
        //         { label: '超时', value: '2' }
        //       ]
        //     }
        //   ],
        //   inline: true,
        //   visible: false,
        //   containerStyle: {
        //     'justify-content': 'space-between'
        //   },
        //   handleFilter: () => {
        //     this.cardSearchConfig.moreFilter.visible = !this.cardSearchConfig.moreFilter.visible
        //   }
        // }
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'content', label: '任务名称' },
          {
            prop: 'status',
            label: '完成状态',
            width: 94,
            formatter: row => this.patrolStatus[row.status].text,
            textColorHandle: row => this.patrolStatus[row.status].color
          },
          {
            prop: 'executeTime',
            icon: 'el-icon-time',
            width: 218,
            formatter: row => $format(row.executeTime),
            label: '任务开始时间',
            iconStyle: {
              color: '#1B8EBC',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: 'limitTime',
            label: '限制时间',
            width: 100,
            formatter: row => row.limitTime + '小时'
          },
          { prop: 'userNames', label: '任务人' },
          {
            prop: 'createTime',
            icon: 'el-icon-time',
            label: '完成时间',
            formatter: row => $format(row.createTime),
            width: 218,
            iconStyle: {
              color: '#1B8EBC',
              display: 'inline-block',
              'font-size': '16px'
            }
          }
        ],
        operations: [
          {
            label: '查看报告',
            perm: true,
            icon: 'iconfont icon-baogao',
            handle: row => {
              this.historyPatrolDetail.currentId = row.id
              this.historyPatrolDetail.visible = true
            }
          }
          // {
          //   label: '删除',
          //   perm: true,
          //   icon: 'iconfont icon-shanchu',
          //   handle: row => this.handleDelete(row)
          // }
        ],
        operationWidth: '120px',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.cardTableConfig.pagination.limit = val
            this.refreshData()
          },
          pageHandle: val => {
            this.cardTableConfig.pagination.page = val
            this.refreshData()
          }
        }
      },
      historyPatrolDetail: {
        visible: false,
        currentId: '',
        title: '任务详情',
        close: () => {
          this.historyPatrolDetail.visible = false
        }
      }
    }
  },
  created() {
    this.refreshData(true)
    // this.getAreaTreeData()
  },

  methods: {
    async refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        createTime1: moment().subtract(1, 'months').format('YYYY-MM-DD'),
        createTime2: moment().add(1, 'day').format('YYYY-MM-DD')
      }
      if (!isFirst) {
        Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
        paramsObj.createTime1 = moment(paramsObj.daterange[0]).format('YYYY-MM-DD')
        // paramsObj.daterange[0]
        paramsObj.createTime2 = moment(paramsObj.daterange[1]).format('YYYY-MM-DD')
        delete paramsObj.daterange
      }
      try {
        const res = await getHistoryPatrolList(paramsObj)
        console.log(res, 'getHistoryPatrolList')
        this.cardTableConfig.loading = false
        if (res.status === 200) {
          this.cardTableConfig.dataList = res.data.data
          this.cardTableConfig.pagination.total = res.data.total
        } else {
          $messageError('获取失败')
        }
      } catch (error) {
        this.cardTableConfig.loading = false
      }
    },
    getAreaTreeData() {
      getProjectRoot().then(res => {
        const areaTree = $formatTree(res.data)
        this.cardSearchConfig.moreFilter.filters[3].options = areaTree
      })
    },
    async edit() {
      const params = {
        type: this.editParams.type,
        name: this.editParams.name,
        timeRange: this.editParams.timeRange.join('-')
      }
      try {
        const res = await editYxscgl(params)
        if (res.status === 200) {
          $messageSuccess('修改成功！')
          this.refreshData()
        } else {
          $messageError('修改失败！')
        }
      } catch (error) {
        $messageError('修改失败！')
      }
    },
    handleDelete(row) {
      $confirm('确定删除指定记录?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids = []
        if (row) {
          ids = [row.id]
        } else {
          ids = this.cardTableConfig.selectList.map(item => item.id)
        }
        delCurrentPatrol(ids).then(() => {
          $messageSuccess('操作成功')
          this.refreshData()
        })
      })
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
