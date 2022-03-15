<template>
  <!-- 设备状态统计 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList ref="tenantTreeList" :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
        <CardFineReport ref="cardFineReport" :config="cardFineReportConfig" />
      </div>
    </template>
  </treeBox>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardFineReport from '@/components/cardFineReport/index.vue'
import TreeList from '@/components/treeList/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import moment from 'moment'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MaintainingInfo',
  components: { CardSearch, TreeList, CardFineReport },
  mixins: [tBaseMixin],
  data() {
    return {
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          export: {
            text: '导出',
            perm: true,
            handle: () => this.fineReportExport()
          }
        },
        defaultParams: {
          dateType: 'daterange',
          daterange: [
            moment().subtract(1, 'month').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
          ],
          year: moment()
        },
        filters: [
          {
            label: '查询时间',
            key: 'dateType',
            type: 'select',
            unClearable: true,
            options: [
              { value: 'daterange', label: '日' },
              { value: 'monthrange', label: '月' },
              { value: 'year', label: '年' }
            ],
            handleChange: val => this.dateTypeChange(val),
            width: '120px'
          },
          {
            key: 'daterange',
            dateType: 'daterange',
            type: 'daterange',
            width: '360px'
          }
        ]
      },

      treeData: {
        that: this,
        title: '区域列表',
        data: [],
        isFilterTree: true,
        currentProject: {},
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.refreshData()
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      cardFineReportConfig: {
        url: 'http://218.17.233.4:8080/report/decision/view/report?viewlet=deviceStatus%252FtendencyChart.cpt',
        queryParams: {},
        header: {
          title: '设备状态统计',
          operations: [
            {
              perm: false,
              text: '添加到剪切板',
              icon: 'iconfont icon-clippy',
              handle: () => {
                // do sth
              }
            }
          ]
        }
      },
      totalLoading: false
    }
  },
  created() {
    this.getTreeData()
  },

  methods: {
    refreshData() {
      const { dateType, daterange, year } = this.$refs.cardSearch.queryParams
      let startTime = ''
      let endTime = ''
      const formatter = 'YYYY-MM-DD'
      if (dateType === 'daterange') {
        startTime = moment(daterange[0]).format(formatter)
        endTime = moment(daterange[1]).add(1, 'days').format(formatter)
      } else if (dateType === 'monthrange') {
        startTime = moment(daterange[0]).format('YYYY-MM')
        startTime = moment(startTime).format(formatter)
        endTime = moment(daterange[1]).format('YYYY-MM')
        endTime = moment(endTime).add(1, 'month').format(formatter)
      } else if (dateType === 'year') {
        startTime = moment(year).format('YYYY')
        startTime = moment(startTime).format(formatter)
        endTime = moment(year).format('YYYY')
        endTime = moment(endTime).add(1, 'year').format(formatter)
      }
      this.cardFineReportConfig.queryParams = {
        startTime,
        endTime,
        projectId: this.treeData.currentProject.id
      }
    },
    getTreeData() {
      this.totalLoading = true
      getProjectRoot(false, this.treeData.curTenant)
        .then(res => {
          this.totalLoading = false
          if (res.data) {
            this.treeData.data = res.data
            // this.treeData.data = res.data
            const fTData = this.treeData.data.filter(v => !v.disabled)
            this.treeData.currentProject = fTData[0]
            this.refreshData()
          } else {
            this.$message('暂无项目 不可操作，请创建项目')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message('暂无项目 不可操作，请创建项目')
          this.totalLoading = false
        })
    },
    dateTypeChange(val) {
      if (val === 'year') {
        this.cardSearchConfig.filters[1].key = 'year'
      } else {
        this.cardSearchConfig.filters[1].key = 'daterange'
      }
      this.cardSearchConfig.filters[1].dateType = val
    },
    fineReportExport() {
      this.$refs.cardFineReport.export('word')
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
</style>
