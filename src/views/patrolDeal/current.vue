<template>
  <!-- 当天巡检任务 -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <CurrentDialog
      v-if="currentPatrolDetail.visible"
      :config="currentPatrolDetail"
    />
  </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import CurrentDialog from './components/currentDialog.vue'
import { getProjectRoot } from '@/api/project'
import { getCurrentPatrolList, delCurrentPatrol, changePatrolStatus } from '@/api/patrol'
import useGlobal from '@/hooks/global/useGlobal'
const { $format, $messageSuccess, $messageError, $confirm } = useGlobal()

export default {
  components: { CardTable, CardSearch, CurrentDialog },
  data() {
    return {
      patrolStatus: [
        { text: '待执行', color: '#fff' },
        { text: '执行中', color: '#1BBC20' },
        { text: '暂停中', color: '#BC901B' },
        { text: '已完成', color: '#1BBC20' },
        { text: '已超时', color: '#BC1B1B' }
      ],
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() }

          // del: {
          //   text: '批量删除',
          //   handleDisabled: () => !this.cardTableConfig.selectList.length,
          //   perm: true,
          //   handle: () => this.handleDelete()
          // }
        },
        defaultParams: {
          daterange: []
        },
        filters: [
          { label: '搜索', key: 'content', type: 'input', width: '360px' },
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
          // {
          //   label: '查询时间',
          //   key: 'daterange',
          //   type: 'daterange',
          //   width: '360px'
          // }
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
        // selectList: [],
        // tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          { prop: 'content', label: '任务名称' },
          {
            prop: 'status',
            label: '完成状态',
            width: 90,
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
            prop: 'periodTime',
            label: '限制时间',
            width: 100,
            formatter: row => row.limitTime || '-' + '小时'
          },
          { prop: 'userNames', label: '任务人' }
        ],
        operations: [
          // {
          //   labelHandle: row => (row.status === '2' ? '启用' : '暂停'),
          //   iconHandle: row =>
          //     row.status === '2'
          //       ? 'iconfont icon-jiechuhezuoguanxi'
          //       : 'iconfont icon-qitingcaozuo-tingzhi',
          //   perm: true,
          //   handle: row => this.changePatrolStatus(row)
          // },
          {
            label: '详情',
            perm: true,
            icon: 'iconfont icon-xiangqing',
            handle: row => {
              this.currentPatrolDetail.currentId = row.id
              this.currentPatrolDetail.visible = true
            }
          }
          // {
          //   label: '删除',
          //   perm: true,
          //   icon: 'iconfont icon-shanchu',
          //   handle: row => this.handleDelete(row),
          //   disableHandle: row => row.status !== '2'
          // }
        ],
        operationWidth: '90px',
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
      currentPatrolDetail: {
        visible: false,
        currentId: '',
        title: '任务详情',
        close: () => {
          this.currentPatrolDetail.visible = false
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
        size: this.cardTableConfig.pagination.limit
        // createTime1: moment().subtract(1, 'months').format('YYYY-MM-DD'),
        // createTime2: moment().add(1, 'day').format('YYYY-MM-DD')
      }
      if (!isFirst) {
        Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
        // paramsObj.createTime1 = paramsObj.daterange[0]
        // paramsObj.createTime2 = moment(paramsObj.daterange[1]).add(1, 'day').format('YYYY-MM-DD')
        // delete paramsObj.daterange
      }
      try {
        const res = await getCurrentPatrolList(paramsObj)
        console.log(res, 'getCurrentPatrolList')
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
        const areaTree = res.data
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
      $confirm('确定删除改任务?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCurrentPatrol([row.id]).then(() => {
          $messageSuccess('操作成功')
          this.refreshData()
        })
      })
    },

    async changePatrolStatus(row) {
      try {
        const res = await changePatrolStatus({
          xjrwId: row.id,
          status: row.status === '2' ? '1' : '2'
        })
        if (res.status === 200) {
          $messageSuccess('操作成功')
          this.refreshData()
        } else {
          $messageError('操作失败')
        }
      } catch (err) {
        $messageError(err.data.message)
      }
    }
  }
}
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
