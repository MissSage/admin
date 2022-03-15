<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      ref="addOrUpdate"
      :config="addOrUpdateConfig"
      dialog-width="560px"
      @refreshData="refreshData"
    />
    <MenuAssign v-if="menuConfig.visible" :config="menuConfig" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import MenuAssign from './components/menuAssign.vue'
import { getAppList, deleteApp } from '@/api/application'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  components: { CardSearch, CardTable, AddOrUpdateDialog, MenuAssign },
  setup() {
    const { $messageError, $messageSuccess, $confirm } = useGlobal()
    const cardSearch = ref<any>(null)

    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: '添加',
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.defaultValue = {}
            addOrUpdateConfig.value.visible = true
          }
        }
      },
      filters: [{ label: '搜索', key: 'keyWord', type: 'input', width: '360px' }],
      defaultParams: {}
    })

    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      columns: [
        { prop: 'appName', label: '名称' },
        { prop: 'additionalInfo', label: '备注' }
      ],
      operations: [
        {
          label: '菜单赋予',
          perm: true,
          icon: 'iconfont icon-guanli',
          handle: row => {
            menuConfig.value.currentId = row.id
            menuConfig.value.visible = true
          }
        },
        {
          label: '编辑',
          perm: true,
          icon: 'iconfont icon-baogao',
          handle: row => {
            addOrUpdateConfig.value.defaultValue = row
            addOrUpdateConfig.value.visible = true
          }
        },
        {
          label: '删除',
          perm: true,
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '260px',
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

    const addOrUpdateConfig = ref<AOUConfig>({
      visible: false,
      title: '应用操作',
      close: () => (addOrUpdateConfig.value.visible = false),
      addUrl: 'api/app/type',
      editUrl: 'api/app/type/edit',
      defaultValue: {},
      externalParams: {},
      columns: [
        {
          type: 'input',
          label: '应用名称',
          key: 'appName',
          rules: [{ required: true, message: '请填写应用名称' }]
        },
        {
          type: 'textarea',
          label: '备注',
          key: 'additionalInfo',
          rows: 3
        }
      ]
    })

    const refreshData = async (isFirst?: boolean) => {
      cardTableConfig.value.loading = true
      const paramsObj: any = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit
      }
      if (!isFirst && cardSearch.value) Object.assign(paramsObj, cardSearch.value.queryParams)
      try {
        const res = await getAppList()
        console.log(res, 'getAppList')
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data
          cardTableConfig.value.pagination.total = res.data.length
        } else {
          $messageError('获取失败')
        }
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }

    const handleDelete = (row?: any) => {
      $confirm('确定删除指定企业?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApp(row.id).then(() => {
          $messageSuccess('操作成功')
          refreshData()
        })
      })
    }

    const menuConfig = ref<DialogConfig>({
      currentId: '',
      visible: false,
      close: () => (menuConfig.value.visible = false)
    })

    onBeforeMount(() => {
      refreshData(true)
    })

    return {
      cardSearchConfig,
      cardTableConfig,
      addOrUpdateConfig,
      refreshData,
      menuConfig
    }
  }
})
</script>
