<template>
  <!--备件更换记录 -->
  <div style="height: auto">
    <el-form ref="baseForm" :inline="true" :model="formData">
      <h3>在用备件</h3>
      <CardTable :config="cardTableConfig" style="height: 400px" />
      <h3>更换记录</h3>
      <CardTable :config="cardTableConfigRecord" style="height: 400px" />
    </el-form>
  </div>
</template>

<script lang="ts">
import CardTable from '@/components/cardTable/index.vue'
import { ref, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable } from '@/common/types/ledger/ledger'
//接口
import { getDataById } from '@/api/ledger/ledger2'
import router from '@/router'

const { $message } = useGlobal()
import { useRoute } from 'vue-router'
import useProject from '@/hooks/project/useProject'

export default {
  name: 'Registration',
  components: {
    CardTable
  },
  props: {
    currentId: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    //1.定义变量
    const { $format } = useGlobal()
    //所属部门数据
    const { getAreaTreeData } = useProject()
    //路由
    const route = useRoute()
    //添加级联选择
    const state = reactive<{
      showTable: boolean
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
    }>({
      showTable: true,
      areaTree: [],
      projectId: '',
      dialogVisible: false
    })
    const baseForm = ref<any>()
    //表格栏
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        { prop: 'code', label: '备件编号' },
        { prop: 'name', label: '备件名称' },
        { prop: 'specificationModel', label: '规格型号' },
        {
          prop: '',
          label: '更换时间',
          formatter: row => $format(row.createTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: 'name', label: '已使用时长' },
        { prop: 'unit', label: '数量' }
      ],
      pagination: {
        page: 1,
        limit: 5,
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
    const cardTableConfigRecord = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        { prop: 'name', label: '转移编号', textColor: '#6BD2F8FF' },
        { prop: 'name', label: '申请人' },
        {
          prop: '',
          label: '申请时间',
          formatter: row => $format(row.createTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: 'name', label: '调往部门' },
        { prop: 'name', label: '调往地址' },
        { prop: 'name', label: '新资产负责人' },
        { prop: 'name', label: '转移说明' }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigRecord.value.pagination.limit = val
          refreshDataRecord()
        },
        pageHandle: val => {
          cardTableConfigRecord.value.pagination.page = val
          refreshDataRecord()
        }
      }
    })

    //表单内容
    let formData = ref<any>({
      projectId: route.query.projectId,
      deviceNo: '',
      deviceName: '',
      unit: '',
      type: '',
      specificationModel: '',
      brand: '',
      supplier: '',
      deviceSource: '',
      purchaseAmount: '', //采购金额
      purchaseTime: null,
      warrantyTime: null,
      enableTime: null,
      expectScrapTime: null,
      deviceStatus: '',
      deviceGrade: '',
      director: '',
      dept: '',
      devicePosition: '',
      remark: '',
      depreciationMethod: '', //折旧信息
      useLife: '',
      originValue: '',
      netResidualRate: '',
      netValue: '',
      monthDepreciationAmount: '',
      text1: '', //自定义属性
      text2: '',
      text3: '',
      text4: '',
      text5: '',
      text6: '',
      text7: '',
      text8: '',
      number1: '',
      number2: '',
      date1: '',
      date2: '',
      imgs: '', //图片列表
      fileIds: '', //传到后台保存的文件id
      assetsFileList: [], //关联文件
      subDeviceIds: '', //子设备ids
      subAssetsAccountList: [], //子设备列表
      parentDeviceIds: '', //父设备ids
      parentAssetsAccountList: [], //父设备列表
      componentIds: '', //临时备件ids
      // sparePartList: [],//备件数据
      componentList: [],
      sparePartAllList: [], //备件全部数据
      createTime: null,
      updateTime: null,
      tenantId: '',
      num: '' //用于关联备件的数量
    })
    let FilesList = ref<any>({
      list: []
    })
    //2.方法
    //开始一个生命周期钩子,挂载后再加载数据
    onMounted(async () => {
      initForm()
      state.areaTree = await getAreaTreeData()
    })
    //初始化-数据表格
    const initForm = () => {
      if (props.currentId) {
        getDataById(props.currentId).then(res => {
          formData.value = res.data
          if (formData.value.imgs) {
            formData.value.imgs.split(',').forEach((img, index) => {
              FilesList.value.list.push({ url: img })
            })
            FileList.value = FilesList.value.list
          }
        })
      } else {
        $message.error('获取设备信息失败')
      }
    }
    //更新查询数据-设备文件
    const refreshData = async () => {
      const begin =
        (Number(cardTableConfig.value.pagination.page) - 1) *
        Number(cardTableConfig.value.pagination.limit)
      const end =
        Number(cardTableConfig.value.pagination.page) *
        Number(cardTableConfig.value.pagination.limit)
      cardTableConfig.value.dataList = formData.value.assetsFileList.slice(begin, end)
      cardTableConfig.value.pagination.total = formData.value.assetsFileList.length
    }
    const refreshDataRecord = async () => {
      const begin =
        (Number(cardTableConfigRecord.value.pagination.page) - 1) *
        Number(cardTableConfigRecord.value.pagination.limit)
      const end =
        Number(cardTableConfigRecord.value.pagination.page) *
        Number(cardTableConfigRecord.value.pagination.limit)
      cardTableConfigRecord.value.dataList = formData.value.assetsFileList.slice(begin, end)
      cardTableConfigRecord.value.pagination.total = formData.value.assetsFileList.length
    }
    const FileList = ref<any>([])
    //返回
    return {
      formData,
      FilesList,
      FileList,
      cardTableConfig,
      cardTableConfigRecord,
      ...toRefs(state), //添加级联选择
      initForm,
      baseForm
    }
  },
  //返回
  methods: {
    //返回上一页
    goOff() {
      router.push({ name: 'deviceLedgerIndex' })
    },
    handlePreview(file) {
      console.log('预览图片', file)
    },
    handleExceed(files, FileList) {
      $message.warning(
        `The limit is 5, you selected ${files.length} files this time, add up to ${
          files.length + FileList.length
        } totally`
      )
    },
    beforeRemove(file, FileList) {
      // return $confirm(`Cancel the transfert of ${file.name} ?`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/ledger-router.scss';

el-form-item {
  width: 280px;
  font-size: 15px;
}
.sel {
  position: absolute;
  clip: rect(2px 80px 30px 2px);
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 15px;
  font-weight: bold;
}
.info-item-size {
  width: 280px;
  font-size: 15px;
}

.uploadPic-style {
  margin-left: 30px;
  width: 100%;
}

.uploadFile-btn-style {
  margin-left: 1290px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.item-size-wd {
  height: 80px;
  width: 680px;
  margin-top: 20px;
}

.table-style {
  margin-left: 50px;
  width: 1448px;
}
</style>
