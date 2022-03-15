<template>
  <div class="tree-right-detail-box">
    <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
    <CardTable :config="cardTableConfig" />
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      :config="addOrUpdateConfig"
      @refreshData="refreshData"
    />
    <AddDialog
      v-if="AddDialogConfig.visible"
      :visible="AddDialogConfig.visible"
      :close="AddDialogConfig.close"
      :readonly="AddDialogConfig.readonly"
      :title="AddDialogConfig.title"
      :width="'60%'"
      :opt-type="optType"
      @refreshData="refreshData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import AddDialog from './components/AddDialog.vue'
import { getSpecificationList, getStorageTable, saveStorage } from '@/api/component/index'
import { QueryListParam } from '@/common/types/common'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable, ISaveItem, ITableItem } from '@/common/types/component/storage'
import { initAddComponentCloums, OptionType } from './index'
import { ADDBTNTXT, BEIJIANCHUKU, BEIJIANRUKE } from '@/common/constans/component'
export default defineComponent({
  name: 'Storage',
  components: { CardSearch, CardTable, AddOrUpdateDialog, AddDialog },
  setup() {
    const { $messageError } = useGlobal()
    const optType = ref<string>(OptionType.IN)
    const typeList = ref<SelectOption[]>([])
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },

        add: {
          text: ADDBTNTXT,
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.visible = true
            addOrUpdateConfig.value.title = ADDBTNTXT
            addOrUpdateConfig.value.setSubmitParams = (params: ISaveItem) => {
              if (params.type.length) {
                params.type = params.type.toString()
              }
              console.log(params)
              return params
            }
            addOrUpdateConfig.value.submit = saveStorage
            addOrUpdateConfig.value.columns = initAddComponentCloums(typeList.value as SelectOption[])
          }
        }
      },
      extraOperations: [
        {
          text: BEIJIANRUKE,
          perm: true,
          handle: () => {
            console.log(BEIJIANRUKE)
            AddDialogConfig.value.title = '备件入库'
            AddDialogConfig.value.visible = true
            optType.value = OptionType.IN
          }
        },
        {
          text: BEIJIANCHUKU,
          perm: true,
          handle: () => {
            AddDialogConfig.value.visible = true
            AddDialogConfig.value.title = '备件出库'
            optType.value = OptionType.OUT
          }
        }
      ],
      defaultParams: {},
      filters: [
        { label: '编号', key: 'code', type: 'input', width: '360px' },
        { label: '名称', key: 'name', type: 'input', width: '360px' }
      ]
    })

    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'code', label: '备件编号' },
        { prop: 'name', label: '备件名称' },
        { prop: 'type', label: '备件类别' },
        { prop: 'specification', label: '规格型号' },
        { prop: 'unit', label: '单位' },
        { prop: 'number', label: '数量' }
      ],
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
      title: '',
      defaultValue: {},
      externalParams: {},
      columns: [],
      close: () => {
        addOrUpdateConfig.value.visible = false
      }
    })
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '备件入库',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { name, code } = cardSearch.value?.queryParams
      const params = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        code,
        name
      } as QueryListParam
      try {
        const res = await getStorageTable(params)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $messageError('获取失败')
        }
        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
        $messageError('获取失败')
      }
    }
    const SpecificationList = async () => {
      const res = await getSpecificationList()
      typeList.value = res.data.map(item => {
        return { label: item, value: item } as SelectOption
      })
    }
    onMounted(() => {
      refreshData()
      SpecificationList()
    })
    return {
      optType,
      cardSearch,
      addOrUpdateConfig,
      cardSearchConfig,
      cardTableConfig,
      AddDialogConfig,
      refreshData
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
