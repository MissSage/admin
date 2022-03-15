<template>
  <!--设备信息 -->
  <el-form ref="baseForm" class="info-container" :model="formData">
    <h3>基本信息</h3>
    <SLFlexGroup>
      <el-form-item label="设备编号：" prop="deviceNo">
        <span>{{ formData.deviceNo }}</span>
      </el-form-item>
      <el-form-item label="设备名称：" prop="deviceName">
        <span>{{ formData.deviceName }}</span>
      </el-form-item>
      <el-form-item label="单位：" prop="unit">
        <span>{{ formData.unit }}</span>
      </el-form-item>
      <el-form-item label="设备类别：" prop="deviceType">
        <span v-if="formData.deviceType !== '' && formData.deviceType !== null"
          >{{ changeType }}
        </span>
      </el-form-item>
      <el-form-item label="规格型号：" prop="specificationModel">
        <span>{{ formData.specificationModel }}</span>
      </el-form-item>
      <el-form-item label="品牌：" prop="brand">
        <span>{{ formData.brand }}</span>
      </el-form-item>
      <el-form-item label="供应商：" prop="supplier" class="ls-flex-item--2">
        <span>{{ formData.supplier }}</span>
      </el-form-item>
      <el-form-item label="设备来源：" prop="deviceSource">
        <span v-if="formData.deviceSource !== '' && formData.deviceSource !== null">{{
          changeSou
        }}</span>
      </el-form-item>
      <el-form-item label="采购金额：" prop="purchaseAmount">
        <span>{{ formData.purchaseAmount }}</span>
      </el-form-item>
      <el-form-item label="购置日期：" prop="purchaseTime">
        <span>{{ changeTime(formData.purchaseTime) }}</span>
      </el-form-item>
      <el-form-item label="保修期至：" prop="warrantyTime">
        <span>{{ changeTime(formData.warrantyTime) }}</span>
      </el-form-item>
      <el-form-item label="启用日期：" prop="enableTime">
        <span>{{ changeTime(formData.enableTime) }}</span>
      </el-form-item>
      <el-form-item label="报废日期：" prop="expectScrapTime">
        <span>{{ changeTime(formData.expectScrapTime) }}</span>
      </el-form-item>
      <el-form-item label="设备状态：" prop="deviceStatus">
        <label v-if="formData.deviceStatus == '' || formData.deviceStatus == null"></label>
        <label v-else class="backStyle" :style="formStat[formData.deviceStatus]">{{
          changeSta
        }}</label>
      </el-form-item>
      <el-form-item label="设备等级：" prop="deviceGrade">
        <span
          v-if="formData.deviceGrade !== '' && formData.deviceGrade !== null"
          class="GrbackStyle"
          :style="formGra[formData.deviceGrade]"
          >{{ changeGrade }}</span
        >
      </el-form-item>
      <br />
      <el-form-item label="负责人：" prop="director">
        <span>{{ formData.director }}</span>
      </el-form-item>

      <el-form-item label="所属部门：" prop="projectId">
        <span>{{ formData.projectName }}</span>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" class="ls-flex-item--1">
        <span>{{ formData.remark }}</span>
      </el-form-item>
      <el-form-item
        label="设备位置："
        prop="devicePosition"
        class="ls-flex-item--1"
      >
        <SLAmap v-model="formData.devicePosition" :disabled="true"/>
      </el-form-item>

      
    </SLFlexGroup>
    <h3>折旧信息</h3>
    <SLFlexGroup>
    <el-form-item label="折旧方法：" prop="depreciationMethod">
      <span v-if="formData.depreciationMethod !== '' && formData.depreciationMethod !== null">{{
        changeDepr
      }}</span>
    </el-form-item>
    <el-form-item label="使用寿命（月）：" prop="useLife">
      <span>{{ formData.useLife }}</span>
    </el-form-item>
    <el-form-item label="原值：" prop="originValue">
      <span>{{ formData.originValue }}</span>
    </el-form-item>
    <el-form-item label="净残率（%）：" prop="netResidualRate">
      <span>{{ formData.netResidualRate }}</span>
    </el-form-item>
    <br />
    <el-form-item label="净值：" prop="netValue">
      <span>{{ formData.netValue }}</span>
    </el-form-item>
    <el-form-item label="月折旧额：" prop="depreciationAmountMonth">
      <span>{{ formData.depreciationAmountMonth }}</span>
      <!--monthDepreciationAmount-->
    </el-form-item>
    </SLFlexGroup>
    <h3>自定义属性</h3>
    <SLFlexGroup>
    <el-form-item label="文本1号：" prop="text1">
      <span>{{ formData.text1 }}</span>
    </el-form-item>
    <el-form-item label="文本2号：" prop="text2">
      <span>{{ formData.text2 }}</span>
    </el-form-item>
    <el-form-item label="文本3号：" prop="text3">
      <span>{{ formData.text3 }}</span>
    </el-form-item>
    <el-form-item label="文本4号：" prop="text4">
      <span>{{ formData.text4 }}</span>
    </el-form-item>
    <br />
    <el-form-item label="文本5号：" prop="text5">
      <span>{{ formData.text5 }}</span>
    </el-form-item>
    <el-form-item label="文本6号：" prop="text6">
      <span>{{ formData.text6 }}</span>
    </el-form-item>
    <el-form-item label="文本7号：" prop="text7">
      <span>{{ formData.text7 }}</span>
    </el-form-item>
    <el-form-item label="文本8号：" prop="text8">
      <span>{{ formData.text8 }}</span>
    </el-form-item>
    <br />
    <el-form-item label="数字型1：" prop="number1">
      <span>{{ formData.number1 }}</span>
    </el-form-item>
    <el-form-item label="数字型2：" prop="number2">
      <span>{{ formData.number2 }}</span>
    </el-form-item>
    <el-form-item label="日期型1：" prop="date1">
      <span>{{ formData.date1 != null ? changeTime(formData.date1) : null }}</span>
    </el-form-item>
    <el-form-item label="日期型2：" prop="date2">
      <span>{{ formData.date2 != null ? changeTime(formData.date2) : null }}</span>
    </el-form-item>
    </SLFlexGroup>
    <h3>设备图片</h3>
    <ul v-if="FilesList.list.length>0">
      <li
        v-for="item in FilesList.list"
        :key="item"
        style="height: 100px; width: 100px; display: inline-block; margin-left: 10px"
      >
        <el-image :src="item.url" :fit="fit"></el-image>
      </li>
    </ul>
    <div v-else><span style="color:#9097C0;font-size:14px;">没有相关图片</span> </div>
    <h3>设备相关文件</h3>
    <CardTable :config="cardTableConfigFile" style="height: 300px" />
    <h3>子设备</h3>
    <CardTable :config="cardTableConfigSon" style="height: 300px" />
    <h3>父设备</h3>
    <CardTable :config="cardTableConfigFa" style="height: 200px" />
    <h3>设备关联备件</h3>
    <CardTable :config="cardTableConfigRele" style="height: 300px" />
  </el-form>
</template>

<script lang="ts">
import SLAmap from '@/components/SLAmap/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable } from '@/common/types/ledger/ledger'
//接口
import { getDataById, showFile } from '@/api/ledger/ledger2'
import router from '@/router'

const { $message } = useGlobal()
import { useRoute } from 'vue-router'
import useProject from '@/hooks/project/useProject'
import moment from 'moment'
export default {
  name: 'Registration',
  components: {
    CardTable,
    SLFlexGroup,
    SLAmap
  },
  props: {
    currentId: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const changeSou = computed(() => {
      var sou = '租赁'
      switch (Number(formData.value.deviceSource)) {
        case 0:
          sou = '租赁'
          break
        case 1:
          sou = '借用'
          break
        case 2:
          sou = '采购'
          break
      }
      return sou
    })
    const changeType = computed(() => {
      var type = '生产设备'
      switch (Number(formData.value.deviceType)) {
        case 0:
          type = '生产设备'
          break
        case 1:
          type = '工艺设备'
          break
        case 2:
          type = '压力设备'
          break
      }
      return type
    })
    const changeGrade = computed(() => {
      var type = '重点设备'
      switch (Number(formData.value.deviceGrade)) {
        case 0:
          type = '重点设备'
          break
        case 1:
          type = '主要设备'
          break
        case 2:
          type = '一般设备'
          break
      }
      return type
    })
    const changeSta = computed(() => {
      var stu = '在用'
      switch (Number(formData.value.deviceStatus)) {
        case 0:
          stu = '在用'
          break
        case 1:
          stu = '闲置'
          break
        case 2:
          stu = '待维修'
          break
      }
      return stu
    })
    const formStat = ref([
      'background-color:#22A846FF',
      'background-color:#D1B31CFF',
      'background-color:#2078C4FF'
    ])
    const formGra = ref([
      'border:1px red solid;color:red',
      'border:1px yellow solid;color:yellow',
      'border:1px #6BD2F8FF solid;color:#6BD2F8FF'
    ])
    // const dealTime = time => {
    //   return time != null ? changeTime(time) : null
    // }
    const changeTime = (time: string) => {
      return moment(time).format('YYYY-MM-DD')
    }
    const changeDepr = computed(() => {
      var depr = '无'
      switch (Number(formData.value.depreciationMethod)) {
        case 0:
          depr = '无'
          break
        case 1:
          depr = '年限平均法'
          break
        case 2:
          depr = '年数总和法'
          break
      }
      return depr
    })
    //1.定义变量
    const { $format } = useGlobal()
    //所属部门数据
    const { getAreaTreeData } = useProject()
    const onlinePreview = async (row: any) => {
      const res = await showFile(row.url)
      //判断文件类型
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.setAttribute('href', url)
      document.body.appendChild(link)
      link.click()
    }
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
    //表格栏-上传文件
    const cardTableConfigFile = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'name',
          label: '文件名称',
          textDecoration: 'underline',
          textColor: '#6BD2F8FF',
          handleClick: row => onlinePreview(row),
          cellStyle: {
            cursor: 'pointer'
          }
        },
        {
          prop: '',
          label: '上传时间',
          formatter: row => $format(row.createTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigFile.value.pagination.limit = val
          refreshDataFile()
        },
        pageHandle: val => {
          cardTableConfigFile.value.pagination.page = val
          refreshDataFile()
        }
      }
    })
    //表格栏-子设备
    const cardTableConfigSon = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'deviceNo',
          label: '设备编号',
          textDecoration: 'underline',
          textColor: '#6BD2F8FF',
          handleClick: row => changeCurrentId(row)
        },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'brand', label: '品牌' },
        { prop: 'specificationModel', label: '规格型号' }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigSon.value.pagination.limit = val
          refreshDataSon()
        },
        pageHandle: val => {
          cardTableConfigSon.value.pagination.page = val
          refreshDataSon()
        }
      }
    })
    //表格栏-父设备
    const cardTableConfigFa = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'deviceNo',
          label: '设备编号',
          textDecoration: 'underline',
          textColor: '#6BD2F8FF',
          handleClick: row => changeCurrentId(row)
        },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'brand', label: '品牌' },
        { prop: 'specificationModel', label: '规格型号' }
      ],
      pagination: {
        page: 1,
        limit: 1,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigFa.value.pagination.limit = val
          refreshDataFa()
        },
        pageHandle: val => {
          cardTableConfigFa.value.pagination.page = val
          refreshDataFa()
        }
      }
    })
    //表格栏-设备关联设备
    const cardTableConfigRele = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        { prop: 'componentNo', label: '备件编号' },
        { prop: 'name', label: '备件名称' },
        { prop: 'type', label: '类别' },
        { prop: 'specification', label: '规格型号' },
        { prop: 'unit', label: '单位' },
        { prop: 'num', label: '需求量', input: true }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigRele.value.pagination.limit = val
          refreshDataRele()
        },
        pageHandle: val => {
          cardTableConfigRele.value.pagination.page = val
          refreshDataRele()
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
      depreciationAmountMonth: '',
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
    const changeCurrentId = (row: any) => {
      //设置设备弹框的设备id为当前点击的设备id
      ctx.emit('changeCurrentId', row.id)
      //    内部刷新 设备信息的数据
      refreshData(row.id)
    }
    const initForm = () => {
      if (props.currentId) {
        refreshData(props.currentId)
      } else {
        $message.error('获取设备信息失败')
      }
    }
    const refreshData = (deviceId: string) => {
      getDataById(deviceId).then(res => {
        formData.value = res.data
        if (formData.value.imgs) {
          FilesList.value.list = []
          formData.value.imgs.split(',').forEach((img: any) => {
            FilesList.value.list.push({ url: img })
          })
          FileList.value = FilesList.value.list
        } else {
          FileList.value = null
        }
        if (formData.value.fileIds) {
          refreshDataFile()
        } else {
          cardTableConfigFile.value.dataList = []
          cardTableConfigFile.value.pagination.total = 0
        }
        if (formData.value.subDeviceIds) {
          refreshDataSon()
        } else {
          cardTableConfigSon.value.dataList = []
          cardTableConfigSon.value.pagination.total = 0
        }
        if (formData.value.parentDeviceIds) {
          refreshDataFa()
        } else {
          cardTableConfigFa.value.dataList = []
          cardTableConfigFa.value.pagination.total = 0
        }
        if (formData.value.componentList) {
          //填充备件ids
          const ids: any = []
          const list: any = []
          formData.value.componentList.forEach(item => {
            list.push({
              id: item.id,
              componentId: item.componentId,
              componentNo: item.componentNo,
              name: item.name,
              type: item.type,
              specification: item.specification,
              unit: item.unit,
              num: item.num
            })
            ids.push(item.componentId)
          })
          //过滤显示
          formData.value.sparePartAllList = list
          formData.value.componentIds = ids.join(',')
          refreshDataRele()
        } else {
          cardTableConfigRele.value.dataList = []
          cardTableConfigRele.value.pagination.total = 0
        }
      })
    }
    //更新查询数据-设备文件
    const refreshDataFile = async () => {
      const begin =
        (Number(cardTableConfigFile.value.pagination.page) - 1) *
        Number(cardTableConfigFile.value.pagination.limit)
      const end =
        Number(cardTableConfigFile.value.pagination.page) *
        Number(cardTableConfigFile.value.pagination.limit)
      cardTableConfigFile.value.dataList = formData.value.assetsFileList.slice(begin, end)
      cardTableConfigFile.value.pagination.total = formData.value.assetsFileList.length
    }
    //更新查询数据-子设备
    const refreshDataSon = async () => {
      const begin =
        (Number(cardTableConfigSon.value.pagination.page) - 1) *
        Number(cardTableConfigSon.value.pagination.limit)
      const end =
        Number(cardTableConfigSon.value.pagination.page) *
        Number(cardTableConfigSon.value.pagination.limit)
      cardTableConfigSon.value.dataList = formData.value.subAssetsAccountList.slice(begin, end)
      cardTableConfigSon.value.pagination.total = formData.value.subAssetsAccountList.length
    }
    //更新查询数据-父设备
    const refreshDataFa = async () => {
      const begin =
        (Number(cardTableConfigFa.value.pagination.page) - 1) *
        Number(cardTableConfigFa.value.pagination.limit)
      const end =
        Number(cardTableConfigFa.value.pagination.page) *
        Number(cardTableConfigFa.value.pagination.limit)
      cardTableConfigFa.value.dataList = formData.value.parentAssetsAccountList.slice(begin, end)
      cardTableConfigFa.value.pagination.total = 0 //formData.value.parentAssetsAccountList.length
    }
    //更新查询数据-关联设备
    const refreshDataRele = async () => {
      const begin =
        (Number(cardTableConfigRele.value.pagination.page) - 1) *
        Number(cardTableConfigRele.value.pagination.limit)
      const end =
        Number(cardTableConfigRele.value.pagination.page) *
        Number(cardTableConfigRele.value.pagination.limit)
      cardTableConfigRele.value.dataList = formData.value.sparePartAllList.slice(begin, end)
      cardTableConfigRele.value.pagination.total = formData.value.sparePartAllList
        ? formData.value.sparePartAllList.length
        : 0
    }
    const FileList = ref<any>([''])
    //返回
    return {
      formData,
      FilesList,
      FileList,
      cardTableConfigRele,
      cardTableConfigFile,
      cardTableConfigSon,
      cardTableConfigFa,
      refreshDataFile,
      refreshDataSon,
      refreshDataFa,
      refreshDataRele,
      ...toRefs(state), //添加级联选择
      initForm,
      baseForm,
      formStat,
      formGra,
      changeType,
      changeGrade,
      changeSou,
      changeSta,
      changeTime,
      changeDepr,
      onlinePreview,
      refreshData
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
      console.log(file, FileList)

      // return $confirm(`Cancel the transfert of ${file.name} ?`)
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  font-size: 14px;
  line-height: 40px;
}
@import '../../css/ledger-router.scss';
.GrbackStyle {
  border-radius: 8px;
  padding: 5px 15px;
}
.backStyle {
  border-radius: 8px;
  color: #fff;
  padding: 5px 15px;
}

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

// .ls-flex-span--4 {
//   width: 210px;
//   font-size: 15px;
// }

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
