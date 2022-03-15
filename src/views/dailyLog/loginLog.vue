<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import moment from 'moment'
import { getLoginLogs } from '@/api/dailyLog'
import { ref, onBeforeMount, defineComponent } from 'vue'
import { useStore } from 'vuex'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  name: 'OperationLog',
  components: { CardSearch, CardTable },
  setup() {
    const { $messageInfo, $format } = useGlobal()

    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() }
      },
      filters: [
        { label: '搜索', key: 'keyword', type: 'input', width: '360px' }
        // {
        //   label: '查询时间',
        //   key: 'timerange',
        //   type: 'daterange',
        //   width: '360px'
        // }
      ],
      defaultParams: {
        timerange: [
          moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
          moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }
    })

    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      indexVisible: {
        label: '序号',
        width: '50px',
        align: 'center'
      },
      columns: [
        {
          prop: 'time',
          label: '时间',
          icon: 'iconfont icon-shijian',
          iconStyle: {
            color: '#69E850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: 'name', label: '用户名' },
        { prop: 'authority', label: '用户权限' },
        { prop: 'options', label: '操作类型' },
        { prop: 'typeDescription', label: '操作内容' }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total, prev, pager, next, sizes, jumper',
        sizeHandle: val => {
          if (cardTableConfig.value.pagination) cardTableConfig.value.pagination.limit = val
          refreshData()
        },
        pageHandle: val => {
          if (cardTableConfig.value.pagination) cardTableConfig.value.pagination.page = val
          refreshData()
        }
      }
    })

    const cardSearch = ref<any>(null)

    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const paramsObj: any = {
        // timerange: [moment().subtract(1, 'days'), moment()]
      }
      if (cardSearch.value) Object.assign(paramsObj, cardSearch.value.queryParams)
      const param = {
        // startTime: moment(paramsObj.timerange[0]).valueOf(),
        // endTime: moment(paramsObj.timerange[1]).add(1, 'days').valueOf(),
        page: cardTableConfig.value.pagination?.page,
        size: cardTableConfig.value.pagination?.limit,
        keyword: paramsObj.keyword
      }
      try {
        getLoginLogs(param).then(res => {
          if (res.status !== 200) return
          console.log(res)
          let resultData = []
          resultData = res.data.data.map(item => {
            const resultItem = item
            resultItem.name = item.firstName
            resultItem.time = $format(item.createTime)
            if (resultItem.authority === 'TENANT_ADMIN') {
              resultItem.authority = '企业管理人员'
            } else if (resultItem.authority === 'TENANT_SYS') {
              resultItem.authority = '企业配置人员'
            } else if (resultItem.authority === 'CUSTOMER_USER') {
              resultItem.authority = '企业用户'
            } else if (resultItem.authority === 'SYS_ADMIN') {
              resultItem.authority = '超级管理员'
            }
            if (resultItem.info === 'Login') {
              resultItem.info = '登录'
            }
            return resultItem
          })
          if (cardTableConfig.value.pagination)
            cardTableConfig.value.pagination.total = res.data.total
          cardTableConfig.value.dataList = resultData
          cardTableConfig.value.loading = false
        })
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }

    const hasTenantFilter = ref<boolean>(false)

    const store = useStore()

    const getTenants = () => {
      const tenantList = store.state.user.tenantList
      if (!tenantList.length) {
        $messageInfo('该账户下没有企业信息')
        return
      }
      cardSearchConfig.value.filters[1].options = tenantList.map(tenant => ({
        label: tenant.title,
        value: tenant.id
      }))
      cardSearch.value.queryParams.tenantId = tenantList[0].id
      refreshData()
    }

    onBeforeMount(() => {
      // this.getData()
      hasTenantFilter.value =
        store.state.user.roles[0] === 'TENANT_SUPPORT' ||
        store.state.user.roles[0] === 'TENANT_PROMOTE'
      if (hasTenantFilter.value) {
        cardSearchConfig.value.filters.splice(1, 0, {
          label: '企业',
          search: true,
          key: 'tenantId',
          type: 'select',
          width: '360px',
          handleChange: () => {
            // do sth
          },
          options: []
        })
        getTenants()
        return
      }
      refreshData()
    })

    return {
      cardSearchConfig,
      cardTableConfig,
      refreshData,
      cardSearch
    }
  },
  methods: {}
})
</script>

<style lang="scss" scoped></style>
