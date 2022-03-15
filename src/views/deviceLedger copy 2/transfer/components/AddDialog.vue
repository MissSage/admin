<template>
  <!--选择设备 弹框-->
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
            v-model="dialogvisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            custom-class="addDialog"
            :lock-scroll="false"
            :width="width"
            @close="close"
    > -->
    <div class="tableContainer">
      <!-- <h2>选择设备</h2> -->
      <div class="tableTitle"><span class="midText"></span></div>
      <!--搜索栏-->
      <CardSearch ref="cardSearch" :config="cardSearchConfig" />
      <!--表格-->
      <CardTable :config="cardTableConfig" style="height: 400px" />
    </div>
    <!-- <template #footer>
            <el-button size="mini" @click="close">取 消</el-button>
            <el-button v-if="!readonly" size="mini" type="primary" @click="submitData">确 定</el-button>
        </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import { ref, defineComponent, PropType, onMounted, reactive, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import type { ICTCardTable, ITableItem } from '@/common/types/ledger/dispose'
import { QueryListParam } from '@/common/types/common'
//格式化字段
import { DEVICETYPE } from '@/common/constans/ledger'
//引入接口方法：查询列表数据
import { getTableData } from '@/api/ledger/ledger'
import useProject from '@/hooks/project/useProject'
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
    close: {
      type: Function as PropType<() => void>,
      default: () => {
        //
      }
    },
    rows: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    deviceIds: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.title,
      visible: props.visible,
      scrollbar: true,
      width: props.width,
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
    //1.定义变量
    const { $message } = useGlobal()
    const cardSearch = ref<any>(null)
    //控制弹框显示
    const dialogvisible = ref<boolean>(props.visible)
    //查询栏
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() }
      },
      defaultParams: {},
      filters: [
        { label: '搜索', key: 'name', type: 'input', width: '200px' },
        {
          label: '设备类别',
          key: 'deviceType',
          type: 'select',
          width: '200px',
          options: [
            { value: '0', label: '生产设备' },
            { value: '1', label: '工艺设备' },
            { value: '2', label: '压力设备' }
          ]
        }
      ]
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
        { prop: 'deviceNo', label: '设备编号' },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'specificationModel', label: '规格型号' },
        { prop: 'projectName', label: '所属部门' },
        {
          prop: '',
          label: '设备类型',
          formatter: (row: ITableItem) => DEVICETYPE[row.deviceType]
        }
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
    //所属部门数据
    const { getAreaTreeData } = useProject()
    //添加级联选择
    const state = reactive<{
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
    }>({
      areaTree: [],
      projectId: '',
      dialogVisible: false
    })
    //2.方法
    // 挂载后再加载数据
    onMounted(async () => {
      init()
      initTableData()
    })
    const init = async () => {
      state.areaTree = await getAreaTreeData()
      cardSearchConfig.value.filters.push({
        label: '所属部门',
        key: 'projectId',
        type: 'cascader',
        width: '200px',
        props: { emitPath: false },
        options: state.areaTree
      })
    }
    //初始化表格
    const initTableData = async () => {
      cardTableConfig.value.loading = true
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        limit: cardTableConfig.value.pagination.limit
      }
      getData(paramsObj)
    }
    //查询数据
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { name } = cardSearch.value?.queryParams
      const { deviceType } = cardSearch.value?.queryParams
      const { projectId } = cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        limit: cardTableConfig.value.pagination.limit,
        size:cardTableConfig.value.pagination.limit,
        name,
        deviceType,
        projectId
      }
      getData(paramsObj)
    }
    //默认选择
    const initSelect = deviceIds => {
      if (deviceIds) {
        const selectList = cardTableConfig.value.dataList.filter(
          (item, index) => deviceIds.indexOf(item.id) !== -1
        )
        cardTableConfig.value.selectList = selectList
      }
    }
    //表格请求
    const getData = async paramsObj => {
      try {
        const res = await getTableData(paramsObj)
        console.log(res)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
          initSelect(props.deviceIds)
        } else {
          $message.error('获取失败')
          cardTableConfig.value.loading = false
        }
      } catch (error: any) {
        $message.error('报错' + error.toString())
        cardTableConfig.value.loading = false
      }
    }
    //保存
    const submitData = () => {
      let ids: string[] = []
      ids = cardTableConfig.value?.selectList?.map(node => node.id) ?? []
      ctx.emit('sendMsgIds', ids)
      ctx.emit('sendMsgList', cardTableConfig.value?.selectList)
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
