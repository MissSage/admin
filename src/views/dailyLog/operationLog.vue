<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
  </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import moment from 'moment'
import { getOptionsLogs } from '@/api/dailyLog'
import { setCurTenant, getCurTenant } from '@/api/tenant'
import useGlobal from '@/hooks/global/useGlobal'
const { $format, $messageInfo } = useGlobal()

export default {
  name: 'OperationLog',
  name: 'roleManageH',
  components: { CardSearch, CardTable },
  data() {
    return {
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() }
        },
        filters: [
          { label: '搜索', key: 'keyWord', type: 'input', width: '360px' },
          {
            label: '查询时间',
            key: 'timerange',
            type: 'daterange',
            width: '360px'
          }
        ],
        defaultParams: {
          timerange: [moment().subtract(1, 'month'), moment()],
          tenantId: getCurTenant()
        }
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          {
            prop: 'createTime',
            label: '时间',
            icon: 'iconfont icon-shijian',
            formatter: row => $format(row.createTime),
            iconStyle: {
              color: '#69E850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          { prop: 'firstName', label: '用户名' },
          { prop: 'typeDescription', label: '操作内容' }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, prev, pager, next, jumper',
          sizeHandle: val => {
            this.cardTableConfig.pagination.limit = val
            this.refreshData()
          },
          pageHandle: val => {
            this.cardTableConfig.pagination.page = val
            this.refreshData()
          }
        }
      }
    }
  },
  created() {
    this.hasTenantFilter =
      this.$store.state.user.roles[0] === 'TENANT_SUPPORT' ||
      this.$store.state.user.roles[0] === 'TENANT_PROMOTE'
    if (this.hasTenantFilter) {
      this.cardSearchConfig.filters.splice(1, 0, {
        label: '企业',
        search: true,
        key: 'tenantId',
        type: 'select',
        width: '360px',
        handleChange: val => {
          setCurTenant(val)
        },
        options: []
      })
      this.getTenants()
      return
    }
    this.refreshData(true)
  },
  methods: {
    refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        timerange: [moment().subtract(1, 'month'), moment()]
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      const param = {
        startTime: moment(paramsObj.timerange[0]).valueOf(),
        endTime: moment(paramsObj.timerange[1]).add(1, 'days').valueOf(),
        page: this.cardTableConfig.pagination.page,
        keyWord: paramsObj.keyWord
      }
      try {
        getOptionsLogs(param).then(res => {
          let resultData = []
          resultData = res.data.data.map(item => {
            const resultItem = item
            resultItem.name = item.firstName
            resultItem.time = moment(item.createTime).format('YYYY-MM-DD  HH:mm:ss')
            if (resultItem.authority === 'TENANT_ADMIN') {
              resultItem.authority = '企业管理人员'
            } else if (resultItem.authority === 'TENANT_SYS') {
              resultItem.authority = '企业配置人员'
            } else if (resultItem.authority === 'CUSTOMER_USER') {
              resultItem.authority = '企业用户'
            } else if (resultItem.authority === 'SYS_ADMIN') {
              resultItem.authority = '超级管理员'
            } else if (resultItem.authority === 'TENANT_SUPPORT') {
              resultItem.authority = '技术支持'
            } else if (resultItem.authority === 'TENANT_PROMOTE') {
              resultItem.authority = '市场推广'
            }
            if (resultItem.info === 'Login') {
              resultItem.info = '登录'
            }
            return resultItem
          })
          this.total = res.data.total
          this.cardTableConfig.dataList = resultData
          this.cardTableConfig.loading = false
        })
      } catch (error) {
        this.cardTableConfig.loading = false
      }
    },
    getTenants() {
      const tenantList = this.$store.state.user.tenantList
      if (!tenantList.length) {
        $messageInfo('该账户下没有企业信息')
        return
      }
      this.cardSearchConfig.filters[1].options = tenantList.map(tenant => ({
        label: tenant.title,
        value: tenant.id
      }))
      this.refreshData(true)
    }
  }
}
</script>

<style lang="scss" scoped></style>
