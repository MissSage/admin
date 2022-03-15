<template>
  <!-- 阀门管理 -->
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      ref="addOrUpdate"
      :config="addOrUpdateConfig"
      dialog-width="560px"
      @refreshData="refreshData"
    />
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import { getValveList, delValve, getValveDetail } from '@/api/pipeLine'
import { ref, onBeforeMount, defineComponent } from 'vue'
// import useProject from '@/hooks/project/useProject'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  components: { CardTable, CardSearch, AddOrUpdateDialog },
  setup() {
    const { $message, $format, $confirm } = useGlobal()
    const cardSearch = ref<any>(null)

    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: '添加阀门',
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.title = '添加阀门'
            addOrUpdateConfig.value.defaultValue = {
              location: [110, 30]
            }
            addOrUpdateConfig.value.visible = true
            //do
          }
        }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
    })

    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: val => (cardTableConfig.value.selectList = val),
      columns: [
        { prop: 'name', label: '阀门名称' },
        { prop: 'code', label: '阀门编号' },
        // { prop: 'caliber', label: '阀门通径' },
        { prop: 'address', label: '地址' },
        { prop: 'location', label: '阀门坐标' },
        {
          prop: 'createTime',
          icon: 'el-icon-time',
          label: '创建时间',
          width: 218,
          formatter: row => $format(row.createTime),
          iconStyle: { color: '#69E850', display: 'inline-block', 'font-size': '16px' }
        }
      ],
      operations: [
        {
          label: '编辑',
          perm: true,
          icon: 'iconfont icon-baogao',
          handle: row => editValve(row)
        },
        {
          label: '删除',
          perm: true,
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
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

    const addOrUpdateConfig = ref<AOUConfig>({
      visible: false,
      title: '添加阀门',
      close: () => (addOrUpdateConfig.value.visible = false),
      addUrl: 'api/shuiwu/valve/save',
      editUrl: 'api/shuiwu/valve/save',
      defaultValue: {},
      externalParams: {},
      setSubmitParams: (params: any) => {
        params.location = params.location.join(',')
        return params
      },
      columns: [
        {
          type: 'input',
          label: '阀门名称',
          key: 'name',
          rules: [{ required: true, message: '请填写阀门名称' }]
        },
        {
          type: 'input',
          label: '阀门编号',
          key: 'code',
          rules: [{ required: true, message: '请填写阀门编号' }]
        },
        // {
        //   type: 'input-number',
        //   label: '阀门通径',
        //   key: 'caliber',
        //   rules: [{ required: true, message: '请填写阀门通径' }]
        // },
        {
          type: 'input',
          label: '地址',
          key: 'address',
          rules: [{ required: true, message: '请填写阀门地址' }]
        },
        {
          type: 'location',
          label: '阀门坐标',
          key: 'location',
          rules: [{ required: true, message: '请填写阀门坐标' }]
        }
      ]
    })

    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const paramsObj: any = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit
      }
      if (cardSearch.value) Object.assign(paramsObj, cardSearch.value.queryParams)
      try {
        const res = await getValveList(paramsObj)
        console.log(res, 'getValveList')
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $message.error('获取失败')
        }
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }

    onBeforeMount(async () => {
      refreshData()
    })

    const handleDelete = (row?: any) => {
      $confirm('确定删除指定阀门?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = cardTableConfig.value.selectList.map(node => node.id)
        }
        delValve(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          refreshData()
        })
      })
    }

    const editValve = async (row: any) => {
      const res = await getValveDetail(row.id)
      if (res.status !== 200) return $message.error('获取阀门详情失败！')
      addOrUpdateConfig.value.title = '编辑阀门'
      addOrUpdateConfig.value.defaultValue = { ...res.data, location: res.data.location.split(',') }
      addOrUpdateConfig.value.visible = true
    }

    return {
      cardSearchConfig,
      cardTableConfig,
      refreshData,
      cardSearch,
      addOrUpdateConfig
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
