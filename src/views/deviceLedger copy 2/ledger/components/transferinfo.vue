<template>
  <!--转移记录 -->
  <div class="info-container">
    <h3>转移记录</h3>
    <CardTable :config="cardTableConfig" style="height: 600px" />
  </div>
</template>

<script lang="ts">
import CardTable from '@/components/cardTable/index.vue'
import { ref, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable } from '@/common/types/ledger/ledger'
//接口
import router from '@/router'
import { QueryListParam } from '@/common/types/common'
const { $message } = useGlobal()
import useProject from '@/hooks/project/useProject'
import { getTableData } from '@/api/ledger/trans'
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
        {
          prop: 'transferNo',
          label: '转移编号',
          width: 200,
          textDecoration: 'underline',
          textColor: '#6BD2F8FF',
          //跳转转移的信息
          handleClick: row => handleEdit(row)
        },
        { prop: 'applicantName', label: '申请人' },
        {
          prop: '',
          label: '申请时间',
          width: 190,
          formatter: row => $format(row.createTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: 'projectName', label: '调往部门' },
        { prop: 'position', label: '调往地址' },
        { prop: 'director', label: '新资产负责人' },
        { prop: 'remark', label: '转移说明' }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfig.value.pagination.limit = val
          getData(props.currentId)
        },
        pageHandle: val => {
          cardTableConfig.value.pagination.page = val
          getData(props.currentId)
        }
      }
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
        getData(props.currentId)
      }
    }
    const getData = async (deviceid: string) => {
      cardTableConfig.value.loading = true
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: 0,
        limit: cardTableConfig.value.pagination.limit,
        deviceId: deviceid
      }
      try {
        const res = await getTableData(paramsObj)
        console.log(res)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $message.error('获取失败')
        }
        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    const handleEdit = async row => {
      sessionStorage.setItem('row', JSON.stringify(row))
      router.push({ name: 'addTransApply', query: { delFlag: 0, title: formatStatus(row) } })
    }
    //标题
    const formatStatus = (row: any) => {
      return row.status == 2 ? '调拨审核' : '调拨详情'
    }
    const FileList = ref<any>([])
    //返回
    return {
      FilesList,
      FileList,
      cardTableConfig,
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
      console.log(file, FileList)
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
