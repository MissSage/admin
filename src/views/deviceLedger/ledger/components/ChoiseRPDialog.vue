<template>
  <!--选择备件 弹框页-->
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="dialogvisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="width"
    custom-class="addDialog"
    :lock-scroll="false"
    :title="title || ''"
    @close="close"
  > -->
    <div class="tableContainer">
      <!-- <h2>选择备件</h2> -->
      <div class="tableTitle"><span class="midText"></span></div>
      <!--搜索栏-->
      <CardSearch ref="cardSearch" :config="cardSearchConfig" />
      <!--表格-->
      <CardTable :config="cardTableConfig" style="height: 400px" />
    </div>
    <template #footer style="background-color: #33374d">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button v-if="!readonly" size="mini" type="primary" @click="submitData">确 定</el-button>
    </template>
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import { DEVICETYPE } from '@/common/constans/ledger'
import { ref, defineComponent, PropType, onMounted, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import type { ICTCardTable, ITableItem } from '@/common/types/ledger/ledger'
import { QueryListParam } from '@/common/types/common'
import { getStorageData } from '@/api/ledger/ledger'
//获取备件列表
import { getSpecificationList } from '@/api/component/index'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  name: 'ChoiseDevice',
  components: { CardTable, CardSearch, SLDialog },

  props: {
    width: {
      type: [String, Number],
      default: '60%'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Function as PropType<() => void>,
      default: () => {
        //
      }
    },
    currentId: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    selectIds: {
      type: String,
      default: ''
    }
  },
  emits: ['sendMsgSpareList'],
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: '选择设备',
      visible: props.visible,
      scrollbar: true,
      cancel: {
        handler: async() => await props.close()
      },
      confirm: {
        text: '确 定',
        handler: async () => await submitData()
      }
    })
    watch(
      () => props.visible,
      () => {
        slDialogConfig.value.visible = props.visible
        slDialogConfig.value.cancel = {
          handler: async() => await props.close()
        }
        slDialogConfig.value.width = props.width
      },
      {
        deep: true,
        immediate: true
      }
    )
    //1.定义
    const { $message } = useGlobal()
    //搜索
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    //弹框显示控制
    const dialogvisible = ref<boolean>(props.visible)
    //查询栏
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'name', type: 'input', width: '200px' }]
    })
    //表格栏
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      operationFixed: 'right',
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'code', label: '设备编号' },
        { prop: 'name', label: '设备名称' },
        {
          prop: 'type',
          label: '备件类别'
        },
        { prop: 'specification', label: '规格型号' },
        { prop: 'unit', label: '单位' }
      ],
      operationWidth: '150px',
      pagination: {
        page: 1,
        limit: 10,
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
    let typeList = ref<any>({
      list: []
    })
    //备件类型
    const SpecificationList = async () => {
      const res = await getSpecificationList()
      res.data.forEach(item => {
        typeList.value.list.push({ label: item, value: item })
      })
      cardSearchConfig.value.filters.push({
        label: '备件类别',
        key: 'deviceType',
        type: 'select',
        width: '200px',
        options: typeList.value.list
      })
    }
    //2.方法
    //挂载后再加载数据
    onMounted(async () => {
      console.log('备件弹框')
      SpecificationList()
      initTableData()
    })
    //初始化表格
    const initTableData = async () => {
      cardTableConfig.value.loading = true
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit
      }
      getData(paramsObj)
    }
    //默认选择
    const initSelect = (selectIds: string) => {
      if (selectIds) {
        const selectList = cardTableConfig.value.dataList.filter(
          (item, index) => selectIds.indexOf(item.id) !== -1
        )
        cardTableConfig.value.selectList = selectList
      }
    }
    //查询数据
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { name } = cardSearch.value?.queryParams
      const { deviceType } = cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        name,
        deviceType
      }
      getData(paramsObj)
    }
    //表格请求
    const getData = async paramsObj => {
      try {
        const res = await getStorageData(paramsObj)
        console.log(res)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
          initSelect(props.selectIds)
        } else {
          $message.error('获取失败')
        }
        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    //保存
    const submitData = () => {
      let ids: string[] = []
      ctx.emit('sendMsgSpareList', cardTableConfig.value?.selectList)
      props.close()
    }
    //返回
    return {
      dialogvisible,
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      refreshData,
      submitData,
      typeList,
      slDialogConfig
    }
  }
})
</script>

<style lang="scss" scoped>
.addDialog {
  .el-dialog__body {
    padding: 0 !important;
  }

  .iconfont::before {
    margin-right: 5px;
  }
}

.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}

.flexFromItem {
  display: flex;
  justify-content: space-between;
}

.baseForm {
  border-bottom: 1px solid #ebebeb;
  padding: 0 32px 12px;
}

.tableContainer {
  border-bottom: 1px solid #33374d;
  padding: 16px 32px 24px;

  .stepTable {
    margin-top: 16px;

    .selectText {
      /*background-color: #eeeeee;*/
      border-radius: 4px;
      line-height: 40px;
      width: 100%;
      height: 40px;
      border: 1px solid #dcdfe6;
      padding: 0 12px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }

  .workContentInput {
    height: 40px;
    line-height: 40px;
    border: none;
    outline: none;
    width: 100%;
  }
}
</style>
