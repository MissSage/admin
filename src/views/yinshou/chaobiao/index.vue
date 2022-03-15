<template>
  <div class="wrapper">
    <SLCardSearch ref="refSLCardSearch" :config="slCardSearchConfig"></SLCardSearch>
    <SLCardTable class="card-box" :config="slCardTableConfig"></SLCardTable>
    <SLDialogForm
      v-if="slDialogFormConfig.dialogConfig.visible"
      ref="refSLDialogForm"
      :config="slDialogFormConfig"
      @close="handleDialogClose"
    >
      <SLTable v-if="tableShow" class="form-card-box" :config="slCardTableConfig_form"></SLTable>
    </SLDialogForm>
  </div>
</template>
<script lang="ts">
import SLCardTable from '@/components/SLCardTable/index.vue'
import SLCardSearch from '@/components/SLCardSearch/index.vue'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ISLCardSearch } from '@/components/SLCardSearch/type'
import { ISLCardTable } from '@/components/SLCardTable/type'
import SLDialogForm from '@/components/SLDialogForm/index.vue'
import { ISLDialogFormConfig } from '@/components/SLDialogForm/type'
import { IQueryUserBill } from '../types/chaobiao'
import { SLConfirm, SLMessage } from '@/utils/Message'
import {
  initCBSJ,
  initYHZD,
  initLSZL,
  initYDZDTableColumn,
  OPERATETYPE,
  initCBGLClolumns,
  initKGFAColumns
} from '.'
import {
  GetMeterReadDetail,
  GetZhiLinHistory,
  GetMeterReadList,
  ToggleValve,
  GetUserBill,
  GetMeterDataNow
} from '@/api/yinshou/chaobiao'
import { ISLTableConfig } from '@/components/SLTable/type'
import SLTable from '../../../components/SLTable/index.vue'
import { IQueryMeterRead } from '../types/chaobiao'
import moment from 'moment'
import useCustType from '../hooks/useCustType'
export default defineComponent({
  name: 'MeterReadManage',
  components: { SLCardTable, SLCardSearch, SLDialogForm, SLTable },
  setup() {
    const refSLDialogForm = ref<InstanceType<typeof SLDialogForm>>()
    const refSLCardSearch = ref<InstanceType<typeof SLCardSearch>>()
    const { CustTypeList, getCustTypeList } = useCustType()
    const state = reactive<{
      tableShow: boolean
      currentOperate: number
      slCardTableConfig_form: ISLTableConfig
      slCardSearchConfig: ISLCardSearch
      slDialogFormConfig: ISLDialogFormConfig
    }>({
      tableShow: true,
      currentOperate: OPERATETYPE.CHAOBIAOSHUJU,
      slCardSearchConfig: {
        filters: [
          // { label: '区域', field: 'area', type: 'input', onChange: () => refreshData() },
          { label: '户号', field: 'custCode', type: 'input', onChange: () => refreshData() },
          { label: '表具编号', field: 'meterCode', type: 'input', onChange: () => refreshData() }
        ],
        rightOperations: []
      },
      /**
       * 弹窗中的table配置
       */
      slCardTableConfig_form: {
        height: 'none',
        columns: [],
        dataList: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total,sizes, prev, pager, next, jumper',
          handleSize: (size: number) => {
            state.slCardTableConfig_form.pagination &&
              (state.slCardTableConfig_form.pagination.limit = size)
            refreshFormTable()
          },
          handlePage: (page: number) => {
            state.slCardTableConfig_form.pagination &&
              (state.slCardTableConfig_form.pagination.page = page)
            refreshFormTable()
          }
        }
      },

      slDialogFormConfig: {
        dialogConfig: {
          width: '60%',
          confirm: {
            handler: async () => {
              await refSLDialogForm.value?.refSLForm?.Submit()
              refreshData()
              SLMessage.success('提交成功！')
            },
            show: false
          },
          cancel: {
            handler: async () => {
              state.slDialogFormConfig.dialogConfig.visible = false
            }
          }
        },
        formConfig: {
          labelWidth: '130px',
          columns: [],
          labelPosition: 'left',
          defaultQuerys: { ydzd: moment().format('YYYY-MM') }
        }
      }
    })
    const slCardTableConfig = ref<ISLCardTable>({
      title: '抄表数据',
      headerBtns: [
        {
          perm: true,
          text: '抄表数据',
          click: () => openDialog(OPERATETYPE.CHAOBIAOSHUJU),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: true,
          text: '用户账单',
          click: () => openDialog(OPERATETYPE.YONGHUZHANGDAN),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: true,
          text: '开/关阀',
          click: () => openDialog(OPERATETYPE.GUANFA),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: false,
          text: '开 阀',
          click: () => toggleValve(OPERATETYPE.KAIFA),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: false,
          text: '更改表具低数',
          click: () => openDialog(OPERATETYPE.GGBJDZ),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: false,
          text: '更改上报周期',
          click: () => openDialog(OPERATETYPE.GGSBZQ),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        },
        {
          perm: false,
          text: '历史指令',
          click: () => openDialog(OPERATETYPE.LISHIZHILIN),
          disabled: (() => !slCardTableConfig.value.currentRow) as () => any
        }
      ],
      columns: initCBGLClolumns(),
      dataList: [],
      // handleSelectChange: (rows: any) => {
      //   slCardTableConfig.value.selectList = rows
      // },
      handleRowClick: (row: any) => {
        slCardTableConfig.value.currentRow = row
      },
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
          state.slCardTableConfig_form.pagination.page = page
          refreshData()
        }
      },
      operations: []
    })
    /**
     * 打开弹窗
     * 根据不同的操作类型进行不同的数据格式化操作
     * @param type
     */
    const openDialog = (type: number) => {
      state.currentOperate = type
      switch (type) {
        case OPERATETYPE.CHAOBIAOSHUJU:
          initForChaobiaoshuju()
          break
        case OPERATETYPE.YONGHUZHANGDAN:
          initForYonghuzhangdan()
          break
        case OPERATETYPE.GUANFA:
          initForToggleValve()
          break
        case OPERATETYPE.GGBJDZ:
          initFormGGBJDZ()
          break
        case OPERATETYPE.GGSBZQ:
          initForGGSBZQ()
          break
        case OPERATETYPE.LISHIZHILIN:
          initForLishizhilin()
          break
        default:
          break
      }
    }
    /**
     * 关闭弹窗
     */
    const handleDialogClose = () => {
      state.tableShow = false
    }
    /**
     * 更新表单数据
     */
    const refreshFormTable = async () => {
      if (!slCardTableConfig.value.currentRow) return
      const id = slCardTableConfig.value.currentRow?.meterCode
      let res: any = {
        total: 0,
        rows: []
      }
      const params = {
        page: state.slCardTableConfig_form.pagination?.page,
        rows: state.slCardTableConfig_form.pagination?.limit
      }
      switch (state.currentOperate) {
        case OPERATETYPE.CHAOBIAOSHUJU:
          res = await GetMeterReadDetail(id, params)
          break
        case OPERATETYPE.LISHIZHILIN:
        case OPERATETYPE.GUANFA:
        case OPERATETYPE.KAIFA:
          res = await GetZhiLinHistory({
            page: state.slCardTableConfig_form.pagination.page,
            rows: state.slCardTableConfig_form.pagination.limit,
            meterCode: id
          })
        default:
          break
      }

      state.slCardTableConfig_form.dataList = res?.data?.rows || []
      state.slCardTableConfig_form.pagination.total = res.data?.total || 0
    }
    /**
     * 初始化抄表数据
     */
    const initForChaobiaoshuju = async () => {
      state.tableShow = true
      state.slCardTableConfig_form.columns = initCBSJ()
      await refreshFormTable()
      state.slDialogFormConfig.dialogConfig.title = '抄表数据'
      state.slDialogFormConfig.dialogConfig.visible = true
      state.slDialogFormConfig.showForm = false
    }
    /**
     * 初始化用户账单
     * @param date 查询时间，默认本月
     */
    const initForYonghuzhangdan = async (date?: any) => {
      console.log(date)
      console.log(moment(date, 'YYYY-MM').add(0, 'd').startOf('M').valueOf())

      state.tableShow = false
      let start: number = moment().startOf('M').valueOf()
      let end: number = moment().endOf('M').valueOf()
      if (date) {
        start = moment(date, 'YYYY-MM').add(0, 'd').startOf('M').valueOf() || start
        end = moment(date, 'YYYY-MM').add(0, 'd').endOf('M').valueOf() || end
      }
      const params: IQueryUserBill = {
        custCode: slCardTableConfig.value?.currentRow?.custCode || '',
        start: start,
        end: end
      }
      const res = await GetUserBill(params)
      const defaultValue = {
        ...(res.data?.cust_info || {}),
        ...(res.data?.bill || {})
      }
      defaultValue.dataList = res.data?.bill?.dataList || []
      defaultValue.custType = formateCustType(defaultValue.custType)
      state.slCardTableConfig_form.dataList = defaultValue.dataList || []
      state.slCardTableConfig_form.pagination.hide = true
      state.slDialogFormConfig.formConfig.defaultValue = defaultValue
      date &&
        refSLDialogForm.value &&
        refSLDialogForm.value.refSLForm &&
        (refSLDialogForm.value.refSLForm.dataForm = defaultValue)
      state.slDialogFormConfig.showForm = true
      state.slDialogFormConfig.dialogConfig.title = '用户账单'
      state.slDialogFormConfig.dialogConfig.visible = true
      state.slCardTableConfig_form.columns = initYDZDTableColumn()
      state.slDialogFormConfig.formConfig.columns = initYHZD(
        state.slCardTableConfig_form as ISLTableConfig,
        initForYonghuzhangdan
      )
    }
    /**
     * 格式化用户类型
     * @param val 用户类型值
     */
    const formateCustType = (val?: string) => {
      const cust = CustTypeList.value.find(item => item.code === val)
      return cust?.text || '-'
    }
    /**
     * 初始化更改表具低值
     */
    const initFormGGBJDZ = () => {
      //
    }
    /**
     * 更改上报周期
     */
    const initForGGSBZQ = () => {
      //
    }
    /**
     * 初始化历史指令
     */
    const initForLishizhilin = async () => {
      state.tableShow = true
      state.slCardTableConfig_form.columns = initLSZL()
      await refreshFormTable()
      state.slDialogFormConfig.dialogConfig.title = '历史指令'
      state.slDialogFormConfig.dialogConfig.visible = true
      state.slDialogFormConfig.showForm = false
    }

    const initForToggleValve = async () => {
      if (!slCardTableConfig.value.currentRow) return
      const id = slCardTableConfig.value.currentRow?.meterCode
      state.tableShow = false
      const res = await GetMeterDataNow(id)
      state.slDialogFormConfig.formConfig.defaultValue = {
        ...(res.data || {}),
        meterCode: id
      }
      state.slDialogFormConfig.dialogConfig.title =
        '开/关阀 -- ' + slCardTableConfig.value.currentRow.custName
      state.slDialogFormConfig.dialogConfig.visible = true
      state.slDialogFormConfig.showForm = true
      state.slDialogFormConfig.formConfig.columns = initKGFAColumns(
        state.slCardTableConfig_form as ISLTableConfig,
        toggleValve
      )

      // state.slDialogFormConfig.formConfig.defaultValue = []
      state.slCardTableConfig_form.columns = initLSZL()
      refreshFormTable()
    }
    /**
     * 开关阀
     * @param type 开或关
     */
    const toggleValve = (type: number) => {
      const id = slCardTableConfig.value.currentRow?.meterCode
      if (!id) {
        SLMessage.error('操作失败！')
        return
      }
      SLConfirm(
        '确定' +
          (type === OPERATETYPE.KAIFA ? '打开' : '关闭') +
          '用户 ' +
          slCardTableConfig.value.currentRow?.custName +
          ' 的阀门？',
        '状态变更提示'
      )
        .then(async () => {
          const res = await ToggleValve({
            option: type === OPERATETYPE.KAIFA ? '0' : '1',
            meterCode: id
          })
          res?.data?.code === 200
            ? SLMessage.success('操作成功！')
            : SLMessage.error(res?.data?.message || '操作失败！')
          await refreshFormTable()
        })
        .catch(() => {
          //
        })
    }
    /**
     * 刷新主表格
     */
    const refreshData = async () => {
      const queryParams = refSLCardSearch.value?.queryParams
      const params: IQueryMeterRead = {
        page: slCardTableConfig.value.pagination?.page,
        rows: slCardTableConfig.value.pagination?.limit,
        custCode: queryParams?.custCode?.trim(),
        meterCode: queryParams?.meterCode?.trim()
      }
      const res = await GetMeterReadList(params)
      slCardTableConfig.value.dataList = res.data?.rows
      slCardTableConfig.value.pagination.total = res.data?.total
    }
    onMounted(async () => {
      refreshData()
      CustTypeList.value = await getCustTypeList()
    })
    return {
      ...toRefs(state),
      slCardTableConfig,
      handleDialogClose,
      refSLCardSearch,
      refSLDialogForm
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
.card-box {
  height: calc(100% - 105px);
}
.form-card-box {
  height: 100%;
}
</style>
