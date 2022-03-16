<template>
  <div class="wrapper">
    <SLCard class="header-card" :title="'水卡信息'">
      <template #right>
        <div class="btn-wrapper">
          <template v-for="(btn, i) in headerBtns" :key="i">
            <SLButton :config="btn"></SLButton>
          </template>
        </div>
      </template>
      <div class="header-items">
        <div
          v-for="(item, i) in fields"
          :key="i"
          class="item"
        >
          <label class="label">{{ item.label }}</label>
          <span v-if="item.type !== 'table'" class="text">{{
            (item.formatter &&
              item.formatter(
                slCardTableConfig.currentRow ? slCardTableConfig.currentRow[item.field] : '-'
              )) ||
              (slCardTableConfig.currentRow ? slCardTableConfig.currentRow[item.field] : '-')
          }}</span>
        </div>
      </div>
    </SLCard>
    <SLCardTable
      ref="refCardTable"
      class="table-box"
      :config="slCardTableConfig"
    ></SLCardTable>
    <SLDialogForm
      v-if="slDialogFormConfig.dialogConfig.visible"
      ref="refSLDialogForm"
      :config="slDialogFormConfig"
      @close="handleDialogClose"
    >
      <!-- <div
        v-if="currentOperate === OPERATES.BILL || currentOperate === OPERATES.BIND"
        class="query-form"
      >
        <SLForm ref="refFormInDialog" :config="slFormInDialogConfig">
          <template v-if="currentOperate === OPERATES.BIND" #follows>
            <div class="btn-wapper">
              <SLButton v-for="(item, i) in bindBtns" :key="i" :config="item"></SLButton>
            </div>
          </template>
        </SLForm>
      </div> -->

      <!-- <SLTable
        v-if="currentOperate === OPERATES.BILL"
        class="form-table-box"
        :config="slTableConfig"
      ></SLTable> -->
    </SLDialogForm>
  </div>
</template>
<script lang="ts">
import SLCardTable from '@/components/SLCardTable/index.vue'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ISLOperation } from '@/components/SLCardSearch/type'
import { ISLCardTable } from '@/components/SLCardTable/type'
import SLDialogForm from '@/components/SLDialogForm/index.vue'
import { ISLDialogFormConfig } from '@/components/SLDialogForm/type'
import { SLConfirm, SLMessage } from '@/utils/global'
import SLCard from '@/components/SLCard/index.vue'
import SLButton from '@/components/SLButton/index.vue'
import { ISLFormItem } from '@/components/SLFormItem/type'
// import SLTable from '@/components/SLTable/index.vue'
import { ISLTableConfig } from '@/components/SLTable/type'
import {
  OPERATES,
  initAOUColumns,
  initBindTableColumns,
  initYSZDTableColumns,
  initUserInfoColumns,
  formatShuikaStatus
  , SHUIKASTATUS
} from './index'
import SLForm from '@/components/SLForm/index.vue'
import { ISLFormConfig } from '@/components/SLForm'
import { IQuery_Yinshou_WaterCard } from '../types/shuika'
import {
  BindUser,
  DeleteWaterCard,
  GetWaterCardList,
  SaveWaterCard,
  UpdateWaterCard,
  UpdateWaterCardStatus
} from '@/api/yinshou/shuika'

import useCustType from '../hooks/useCustType'
export default defineComponent({
  name: 'WaterCardManage',
  components: {
    SLCardTable,
    SLDialogForm,
    SLCard,
    SLButton
    // SLTable
    //  SLForm
  },
  setup () {
    const { CustTypeList, getCustTypeList } = useCustType()
    const refCardTable = ref<InstanceType<typeof SLCardTable>>()
    const refSLDialogForm = ref<InstanceType<typeof SLDialogForm>>()
    const refFormInDialog = ref<InstanceType<typeof SLForm>>()
    const state = reactive<{
      currentOperate: number
      headerBtns: ISLOperation[]
      fields: ISLFormItem[]
      bindBtns: ISLOperation[]
    }>({
      currentOperate: -1,
      fields: [
        { type: 'text', label: '水卡编号：', field: 'code' },
        { type: 'text', label: '创建人：', field: 'creator' },
        { type: 'text', label: '创建时间：', field: 'createTime' },
        { type: 'text', label: '备注：', field: 'remark' },
        {
          type: 'text',
          label: '状态：',
          field: 'status',
          formatter: (val: any) => formatShuikaStatus(val)
        },
        { type: 'text', label: '有效时长：', field: 'validityPeriod', unit: '天' },
        // { type: 'text', label: '剩余有效时长：', field: 'field7', unit: '天' },
        // { type: 'text', label: '水卡累计用水：', field: 'field8', unit: 'm³' },
        { type: 'text', label: '绑定户号：', field: 'custCode' },
        { type: 'text', label: '户名：', field: 'custName' },
        { type: 'text', label: '地址：', field: 'address' },
        { type: 'text', label: '启用日期：', field: 'enableTime' }
      ],
      headerBtns: [
        {
          perm: true,
          text: '编辑',
          disabled: () => !slCardTableConfig.value.currentRow,
          click: () => handleAddOrEdit(OPERATES.EDIT)
        },
        {
          perm: true,
          text: '绑定',
          disabled: () => {
            // 状态、0：未绑定；1：未启用；2：已启用；3：过期
            return (
              !slCardTableConfig.value.currentRow ||
              slCardTableConfig.value.currentRow.status !== '0'
            )
          },
          click: () => handleBind()
        },
        {
          perm: true,
          text: '启用',
          disabled: () =>
            !slCardTableConfig.value.currentRow ||
            (slCardTableConfig.value.currentRow.status !== '0' &&
              slCardTableConfig.value.currentRow.status !== '1'),
          click: () => handleStart()
        }
        // {
        //   perm: true,
        //   text: '用水账单',
        //   disabled: () => !slCardTableConfig.value.currentRow,
        //   click: () => openDialog(OPERATES.BILL)
        // }
      ],
      bindBtns: [
        { perm: true, text: '搜索', click: () => refreshBindingUsers() },
        { perm: true, text: '重置', type: 'default', click: () => resetBindForm() }
      ]
    })
    // 主表
    const slCardTableConfig = ref<ISLCardTable>({
      title: '水卡列表',
      headerQuery: [
        { type: 'input', field: 'keyword', label: '搜索：', onChange: () => refreshData() }
      ],

      headerBtns: [
        { text: '添加', perm: true, click: () => openDialog(OPERATES.ADD) },
        {
          text: '删除',
          type: 'default',
          // disabled: (() => !slCardTableConfig.value.selectList?.length) as (...args: any) => any,
          perm: true,
          click: () => handleDelete()
        }
      ],
      handleRowClick: (row: any) => {
        slCardTableConfig.value.currentRow = row
      },
      columns: [
        { prop: 'code', label: '水卡编号' },
        // {  prop: 'bindTime', label: '绑定时间' },
        {
          prop: 'status',
          label: '水卡状态',
          formatter: (row: any, val: any) => formatShuikaStatus(val)
        },
        { prop: 'validityPeriod', label: '有效时长(天)' },
        { prop: 'creator', label: '创建人' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'custName', label: '用户名称' },
        {
          prop: 'custCode',
          label: '绑定户号',
          cellStyle: {
            color: '#409eff',
            textDecoration: 'underline',
            cursor: 'pointer'
          },
          handleClick: (row: any) => openDialog(OPERATES.DETAIL, row)
        },
        { prop: 'enableTime', label: '启用时间' },
        { prop: 'remark', label: '备注' }
        // {  prop: 'expiredTime', label: '过期时间' },
        // {  prop: 'address', label: '用户地址' },
        // {  prop: 'custType', label: '用户类型' },
        // {  prop: 'money', label: '余额' }
      ],
      handleSelectChange: (rows: any) => {
        slCardTableConfig.value.selectList = rows
      },
      dataList: [],
      selectList: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total,sizes, prev, pager, next, jumper',
        handleSize: (size: number) => {
          slCardTableConfig.value.pagination.limit = size
          refreshData()
        },
        handlePage: (page: number) => {
          slCardTableConfig.value.pagination && (slCardTableConfig.value.pagination.page = page)
          refreshData()
        }
      },
      operations: []
    })
    // 弹窗
    const slDialogFormConfig = ref<ISLDialogFormConfig>({
      dialogConfig: {
        confirm: {
          handler: async () => {
            await refSLDialogForm.value?.refSLForm?.Submit()
          },
          show: true
        },
        cancel: {
          text: '关 闭',
          handler: async () => {
            slDialogFormConfig.value.dialogConfig.visible = false
          }
        }
      },
      formConfig: { columns: [] }
    })

    // 弹窗中的table
    const slTableConfig = ref<ISLTableConfig>({
      columns: [],
      dataList: [],
      pagination: {
        hide: true,
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total,sizes, prev, pager, next, jumper',
        handleSize: (size: number) => {
          slTableConfig.value.pagination && (slTableConfig.value.pagination.limit = size)
          refreshFormTable()
        },
        handlePage: (page: number) => {
          slTableConfig.value.pagination && (slTableConfig.value.pagination.page = page)
          refreshFormTable()
        }
      }
    })

    // 绑定弹窗中的查询表单
    const slFormInDialogConfig = ref<ISLFormConfig>({
      labelPosition: 'left',
      columns: [
        {
          flexable: true,
          cols: 3,
          fields: [
            {
              type: 'input',
              field: 'phone',
              label: '手机号码：',
              onChange: () => refreshBindingUsers()
            },
            {
              type: 'input',
              field: 'name',
              label: '用户姓名：',
              onChange: () => refreshBindingUsers()
            },
            {
              type: 'input',
              field: 'meterType',
              label: '表具类型：',
              onChange: () => refreshBindingUsers()
            },
            {
              type: 'input',
              field: 'meterCode',
              label: '表具编号：',
              onChange: () => refreshBindingUsers()
            }
          ]
        }
      ]
    })
    /**
     * 表单中的tableconfig
     */
    const slFormTableConfig = ref<ISLCardTable>({
      columns: initUserInfoColumns(),
      dataList: [],
      pagination: {
        hide: true
      }
    })
    const openDialog = (type: number, row?: any) => {
      state.currentOperate = type
      switch (type) {
        case OPERATES.ADD:
        case OPERATES.EDIT:
          handleAddOrEdit(type)
          break
        case OPERATES.DETAIL:
          setForUserInfo(row)
          break
        case OPERATES.BILL:
          setForUserInfoOrBill(type)
          break

        default:
          break
      }
    }
    /**
     * 编辑或新增
     * @param type
     */
    const handleAddOrEdit = (type: number) => {
      state.currentOperate = type
      slDialogFormConfig.value.dialogConfig.width = '30%'
      slDialogFormConfig.value.dialogConfig.title = type === OPERATES.EDIT ? '编辑水卡' : '添加水卡'
      slDialogFormConfig.value.showForm = true
      slDialogFormConfig.value.dialogConfig.contentMaxHeight = '400px'
      slDialogFormConfig.value.dialogConfig.confirm = {
        handler: async () => {
          await refSLDialogForm.value?.refSLForm?.Submit()
        },
        show: true
      }
      slDialogFormConfig.value.formConfig = {
        labelPosition: 'left',
        labelWidth: '120px',
        columns: initAOUColumns(type),
        defaultValue: {
          ...((type === OPERATES.EDIT && slCardTableConfig.value.currentRow) || {})
        },
        submit: async (params: any) => {
          type === OPERATES.EDIT ? await UpdateWaterCard(params) : await SaveWaterCard(params)
          handleDialogClose()
          refreshData()
          SLMessage.success('提交成功！')
        }
      }
      slDialogFormConfig.value.dialogConfig.visible = true
    }

    /**
     * 绑定
     */
    const handleBind = () => {
      state.currentOperate = OPERATES.BIND
      slDialogFormConfig.value.dialogConfig.width = '30%'
      slDialogFormConfig.value.dialogConfig.contentHeight = '300px'
      slDialogFormConfig.value.dialogConfig.visible = true
      slDialogFormConfig.value.dialogConfig.title = '绑定用户'
      slDialogFormConfig.value.showForm = true
      slDialogFormConfig.value.formConfig.columns = [
        { fields: [{ label: '用户卡号：', field: 'custCode', type: 'input' }] }
      ]
      slDialogFormConfig.value.formConfig.submit = async (params: any) => {
        params = { ...(params || {}), cardId: slCardTableConfig.value.currentRow?.id }
        await BindUser(params)
        SLMessage.success('绑定成功!')
        refreshData()
        handleDialogClose()
      }
      slDialogFormConfig.value.dialogConfig.contentMaxHeight = undefined
      slDialogFormConfig.value.dialogConfig.confirm = {
        show: true,
        handler: async () => {
          await refSLDialogForm.value?.refSLForm?.Submit()
        }
      }
      slTableConfig.value.columns = initBindTableColumns()
      slTableConfig.value.operations = [
        { perm: true, text: '选择', click: (row: any) => handleBindConfirm(row) }
      ]
      // const res = await GetUserList()
      slTableConfig.value.dataList = [
        { field1: '1', field2: '2', field3: '3', field4: '4', field5: '5' }
      ]
    }
    /**
     * 绑定选择用户后的回调
     * @param row 用户信息
     */
    const handleBindConfirm = (row: any) => {
      SLConfirm('确定选择此用户？', '绑定确认')
        .then(() => {
          SLMessage.info('接口没接')
          console.log(row)
        })
        .catch(() => {
          //
        })
    }
    /**
     * 绑定用户的搜索按钮回调
     */
    const refreshBindingUsers = () => {
      SLMessage.info('接口没接')
      const query = refFormInDialog.value?.dataForm
      console.log(query)
    }
    /**
     * 重置绑定用户的搜索条件
     */
    const resetBindForm = () => {
      refFormInDialog.value && (refFormInDialog.value.dataForm = {})
    }
    /**
     * 启用水卡
     */
    const handleStart = async () => {
      const currentRow = slCardTableConfig.value.currentRow
      SLConfirm('确定启用水卡?卡号：' + currentRow?.code, '提示信息')
        .then(async () => {
          await UpdateWaterCardStatus(SHUIKASTATUS.STARTED, currentRow.id)
          SLMessage.success('启用成功')
          refreshData()
        })
        .catch(() => {
          //
        })

      // SLMessage.info(slCardTableConfig.value.currentRow)
    }
    /**
     * 格式化用户类型
     * @param val 用户类型值
     */
    const formateCustType = (val?: string) => {
      const cust = CustTypeList.value.find(item => item.code === val)
      return cust?.text || '-'
    }
    const setForUserInfo = async (row?: any) => {
      const params: IQuery_Yinshou_WaterCard = {
        page: 1,
        rows: 999,
        custCode: row?.custCode
      }
      const res = await GetWaterCardList(params)
      slDialogFormConfig.value.dialogConfig.visible = true
      slDialogFormConfig.value.showForm = true
      slFormTableConfig.value.dataList = res.data?.rows

      slDialogFormConfig.value.dialogConfig.width = '60%'
      slDialogFormConfig.value.dialogConfig.contentHeight = undefined
      slDialogFormConfig.value.dialogConfig.title = '用户信息'
      slDialogFormConfig.value.dialogConfig.contentMaxHeight = 'none'
      slDialogFormConfig.value.dialogConfig.confirm = {
        show: false
      }
      slDialogFormConfig.value.formConfig = {
        labelPosition: 'left',
        defaultValue: {
          ...(row || {}),
          custType: formateCustType(row.custType)
        },
        columns: [
          {
            flexable: true,
            cols: 3,
            fields: [
              { type: 'text', label: '户号：', field: 'custCode' },
              { type: 'text', label: '用户姓名：', field: 'custName' },
              { type: 'text', label: '用户类型：', field: 'custType' },
              { type: 'text', label: '账户余额：', field: 'money', unit: '元' },
              { type: 'text', label: '地址：', field: 'address', cols: 2 }
            ]
          },
          {
            fields: [{ type: 'table', field: '', label: '', config: slFormTableConfig.value }]
          }
        ]
      }
    }
    /**
     * 查看用户的用水账单
     */
    const setForUserInfoOrBill = (type: number) => {
      slDialogFormConfig.value.showForm = false
      slDialogFormConfig.value.dialogConfig.width = '60%'
      slDialogFormConfig.value.dialogConfig.contentHeight = undefined
      slDialogFormConfig.value.dialogConfig.visible = true
      slDialogFormConfig.value.dialogConfig.title =
        type === OPERATES.BILL ? '用水账单' : type === OPERATES.DETAIL ? '用户信息' : ''
      slDialogFormConfig.value.dialogConfig.contentMaxHeight = 'none'
      slDialogFormConfig.value.dialogConfig.confirm = {
        show: false
      }
      slTableConfig.value.operations = []
      slTableConfig.value.columns =
        type === OPERATES.BILL
          ? initYSZDTableColumns()
          : type === OPERATES.DETAIL
            ? initUserInfoColumns()
            : []
      slTableConfig.value.dataList = []
      slFormInDialogConfig.value.columns = [
        {
          flexable: true,
          cols: 4,
          fields: [
            { type: 'text', label: '用水金额：', field: 'field1', unit: '元' },
            { type: 'text', label: '用水总量：', field: 'field2', unit: 'm³' }
          ]
        }
      ]
      slFormInDialogConfig.value.defaultValue = {
        field1: '122.1',
        field2: '56.2'
      }
    }
    const handleDialogClose = () => {
      state.currentOperate = OPERATES.NONE
      slDialogFormConfig.value.dialogConfig.visible = false
    }
    const refreshFormTable = () => {
      //

      SLMessage.info('弹窗中的table还没接')
    }
    /**
     * 批量删除水卡
     */
    const handleDelete = () => {
      SLConfirm('确定删除吗？', '删除提示').then(async () => {
        const ids: string[] = slCardTableConfig.value.selectList?.map(item => item.id) || []
        await DeleteWaterCard(ids)
        SLMessage.success('删除成功！')

        refreshData()
      })
    }
    /**
     * 刷新主表数据
     */
    const refreshData = async () => {
      const query = refCardTable.value?.queryParams
      const params: IQuery_Yinshou_WaterCard = {
        page: slCardTableConfig.value.pagination?.page,
        rows: slCardTableConfig.value.pagination?.limit,
        keyword: query?.keyword,
        custCode: query?.custCode
      }
      const res = await GetWaterCardList(params)
      slCardTableConfig.value.dataList = res.data?.rows
      slCardTableConfig.value.pagination.total = res.data?.total
    }
    onMounted(async () => {
      await refreshData()
      CustTypeList.value = await getCustTypeList()
    })
    return {
      ...toRefs(state),
      refCardTable,
      refSLDialogForm,
      slCardTableConfig,
      slDialogFormConfig,
      handleDialogClose
    }
  }
})
</script>
<style scoped lang="scss">
.wrapper {
  padding: 15px;
  width: 100%;
  height: 100%;
}
.header-card {
  margin-bottom: 15px;
  &.hastitle {
    :deep(.sl-card-title) {
      border-bottom: 1px solid #4e4e4e;
    }
    :deep(.sl-card-content) {
      padding: 0 15px;
    }
  }
}
.table-box {
  height: calc(100% - 160px);
}
.header-items {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  .item {
    flex-basis: 25%;
    min-width: 250px;
    line-height: 30px;
    font-weight: 400;
    font-size: 12px;
  }
}
.btn-wapper {
  padding: 2px 0;
  :deep(.el-button) {
    min-height: 36px;
    height: 36px;
    padding: 0 12px;
    line-height: 34px;
  }
}
</style>
