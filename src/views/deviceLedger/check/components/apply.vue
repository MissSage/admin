<template>
  <el-card class="sl-device-card">
    <template #header>
      <div class="dialog-title" @click="goOff">
        <span class="icon iconfont icon-arrowleft back-btn"></span>
        <span class="dialog-title-text">返回</span>
      </div>
    </template>
    <!--添加滚动条-->
    <el-scrollbar>
      <!--添加盘点 申请页 -->
      <div style="margin-right: 20px">
        <!--表单数据-->
        <el-form
          ref="baseForm"
          label-position="top"
          :rules="rules"
          :model="formData"
          class="demo-form-inline from-margin"
        >
          <SLDescriptionHeader>盘点信息</SLDescriptionHeader>
          <SLFlexGroup>
            <el-form-item label="盘点单号：" prop="inventoryNo">
              <el-input
                v-model="formData.inventoryNo"
                :disabled="inputStu.inputStu"
                placeholder="自动生成"
              ></el-input>
            </el-form-item>
            <el-form-item label="盘点名称：" prop="inventoryName">
              <el-input
                v-model="formData.inventoryName"
                :disabled="inputStu.inputStu"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="计划盘点时间：" prop="expectInventoryTime">
              <el-date-picker
                v-model="formData.expectInventoryTime"
                :disabled="inputStu.inputStu"
                style="width: 100%"
                type="date"
                value-format="x"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="盘点人：" prop="inventoryPersonIds">
              <template v-if="$route.query.title == '盘点详情'">
                <el-input
                  v-model="formData.inventoryPersonNames"
                  :disabled="inputStu.inputStu"
                ></el-input>
              </template>
              <template v-else>
                <ChooseUserByRole :users="users" @checkUsers="checkUsers" />
              </template>
            </el-form-item>
            <br />
            <el-form-item label="盘点说明：" prop="remark" class="ls-flex-item--1">
              <el-input
                v-model="formData.remark"
                :disabled="inputStu.inputStu"
                placeholder="请输入"
                type="textarea"
                :rows="4"
              ></el-input>
            </el-form-item>
          </SLFlexGroup>
          <SLDescriptionHeader>
            <span>盘点设备</span>
            <template v-if="$route.query.title == '添加盘点计划'" #right>
              <el-button type="primary" class="add-btn add-btn-left" @click="addDialog()"
                >添加</el-button
              >
            </template>
          </SLDescriptionHeader>

          <template v-if="$route.query.title == '添加盘点计划'">
            <el-form-item>
              <!--表格-->
              <CardTable :config="cardTableConfig" style="height: 500px" />
            </el-form-item>
          </template>
          <template v-else-if="$route.query.title == '盘点详情'">
            <el-form-item>
              <CardTable :config="cardTableConfigInfo" style="height: 500px" />
            </el-form-item>
          </template>
        </el-form>
        <div class="btn-style">
          <el-button size="mini" class="btn-cancel-style" @click="goOff()">取 消</el-button>
          <el-button
            size="mini"
            class="btn-confirm-style"
            type="primary"
            @click="submit()"
            >保 存
          </el-button>
        </div>
        <AddDialog
          v-if="AddDialogConfig.visible"
          :visible="AddDialogConfig.visible"
          :close="AddDialogConfig.close"
          :current-id="AddDialogConfig.currentId"
          :readonly="AddDialogConfig.readonly"
          :title="AddDialogConfig.title"
          :width="'60%'"
          :device-ids="formData.deviceIds"
          @sendMsgList="getDeviceList"
        />
        <!--盘点-功能弹框-->
        <el-dialog
          v-model="dialogVisible.visible"
          title="盘点"
          width="20%"
          :before-close="handleClose"
        >
          <div class="tableTitle" style="width: 100%"><span class="midText"></span></div>
          <el-form :model="checkForm" style="margin: 30px 20px">
            <h3>是否变动:</h3>
            <el-form-item prop="">
              <el-radio-group v-model="checkForm.change">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <h3>盘点备注:</h3>
            <el-form-item>
              <el-input v-model="checkForm.remark" :rows="5" type="textarea"> </el-input>
            </el-form-item>
          </el-form>
          <div class="tableTitle" style="width: 100%"><span class="midText"></span></div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible.visible = false">关闭</el-button>
              <template v-if="dialogVisible.status !== '2'">
                <el-button type="primary" @click="checkSub(row)">确认</el-button>
              </template>
            </span>
          </template>
        </el-dialog>
        <!--设备信息弹框-->
        <InfoDialog
          v-if="deviceDialogConfig.visible"
          :visible="deviceDialogConfig.visible"
          :close="deviceDialogConfig.close"
          :current-id="deviceDialogConfig.currentId"
          :device-no="deviceDialogConfig.deviceNo"
          :readonly="deviceDialogConfig.readonly"
          :title="deviceDialogConfig.title"
          :width="'60%'"
        />
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import SLDescriptionHeader from '@/components/SLDescriptionHeader/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddDialog from './AddDialog.vue'
import { ref, onMounted } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import type { ICTCardTable, ITableItem } from '@/common/types/ledger/transf'
import router from '@/router'
// import PDeviceTree from '../../../../components/treeList/pDeviceTree.vue'
//引入接口方法：保存数据
import { saveData } from '@/api/ledger/check'
//引入弹框需要文件
import ChooseUserByRole from '@/components/chooseUserByRole/index.vue'
import { CHEFORMATSTATUS, CHEFORMATSTATUSCOR, ISFLAG, ISFLAGCOR } from '@/common/constans/ledger'
import { useRoute } from 'vue-router'
import InfoDialog from '../../ledger/components/InfoDialog.vue'
import moment from 'moment'
export default {
  name: 'CheckApply',
  components: {
    CardTable,
    AddDialog,
    ChooseUserByRole,
    InfoDialog,
    SLDescriptionHeader,
    SLFlexGroup
  },
  setup() {
    //1.定义变量
    const { $confirm, $message, $format } = useGlobal()
    const users = ref<any>([])
    //表格栏
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'deviceNo',
          label: '设备编号',
          textColor: '#6BD2F8FF',
          handleClick: row => OpenInfoDialog(row),
          width: 200,
          textDecoration: 'underline',
          cellStyle: {
            cursor: 'pointer'
          }
        },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'brand', label: '品牌' },
        { prop: 'specificationModel', label: '规格型号' }
      ],
      operations: [
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row.id)
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
    const baseForm = ref<any>()
    //表格输入要求
    const rules = ref<FormRules>({
      inventoryName: [{ required: true, message: '请输入', trigger: 'blur' }],
      expectInventoryTime: [{ required: true, message: '请输入', trigger: 'blur' }],
      inventoryPersonIds: [{ required: true, message: '请输入', trigger: 'blur' }]
    })
    //设置盘点弹框
    const dialogVisible = ref<any>({
      visible: false,
      id: '',
      status: ''
    })
    //弹出框
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '添加任务',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    //设备信息弹框
    const deviceDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '设备信息',
      currentId: '',
      deviceNo: '',
      close: () => {
        deviceDialogConfig.value.visible = false
      }
    })
    //表格数据
    const cardTableConfigInfo = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: '',
          label: '盘点状态',
          formatter: (row: ITableItem) => CHEFORMATSTATUS[row.status],
          textColorHandle: (row: ITableItem) => CHEFORMATSTATUSCOR[row.status]
        },
        {
          prop: 'deviceNo',
          label: '设备编号',
          textColor: '#6BD2F8FF',
          width: 200,
          handleClick: row => OpenInfoDialog(row),
          textDecoration: 'underline',
          cellStyle: {
            cursor: 'pointer'
          }
        },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'specificationModel', label: '规格型号' },
        { prop: 'inventoryPersonName', label: '盘点人' },
        {
          prop: '',
          label: '盘点时间',
          width: 200,
          formatter: (row: ITableItem) => (row.inventoryTime ? $format(row.inventoryTime) : '')
        },
        {
          prop: '',
          label: '是否变动',
          formatter: (row: ITableItem) => ISFLAG[row.change],
          textColorHandle: (row: ITableItem) => ISFLAGCOR[row.change]
        },
        { prop: 'remark', label: '备注' }
      ],
      operations: [
        {
          labelHandle: row => (row.status == '2' ? '详情' : '盘点'),
          perm: true,
          colorHandle: row => (row.status == '2' ? '#2A96D5FF' : '#FF59E9FF'),
          iconHandle: row =>
            row.status == '2' ? 'iconfont icon-xiangqing' : 'iconfont icon-qitingcaozuo-tingzhi',
          handle: row => {
            dialogVisible.value.visible = true
            dialogVisible.value.id = row.id
            dialogVisible.value.status = row.status
            //弹框表格内容
            if (row.change) {
              if (row.change == '是') {
                checkForm.value.change = '1'
              } else {
                checkForm.value.change = '0'
              }
            }
            checkForm.value.remark = row.remark
          }
        }
      ],
      operationWidth: '150px',
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigInfo.value.pagination.limit = val
          refreshDataInfo()
        },
        pageHandle: val => {
          cardTableConfigInfo.value.pagination.page = val
          refreshDataInfo()
        }
      }
    })
    //详情
    const handleDetail = (row?: ITableItem) => {
      AddDialogConfig.value.title = ''
      AddDialogConfig.value.currentId = row?.id || ''
      AddDialogConfig.value.readonly = true
      AddDialogConfig.value.visible = true
    }
    //控制禁用
    let inputStu = ref<any>({
      inputStu: true
    })
    //表格
    let formData = ref<any>({
      inventoryNo: '', //盘点编号
      inventoryName: '', //盘点名称
      expectInventoryTime: '', //计划盘点时间
      inventoryPersonIds: '', //关联盘点人
      inventoryPersonNames: '', //盘点人名称
      remark: '', //备注
      inventoryCList: [], //盘点列表
      inventoryAllCList: [], //本地储存盘点列表
      deviceIds: ''
    })
    //盘点form
    let checkForm = ref<any>({
      change: '1', //盘点是否改变
      remark: '' //盘点单条备注
    })
    //临时转化类
    let inventoryObj = ref<any>({
      id: '',
      deviceId: '',
      change: '',
      remark: ''
    })
    //路由
    const route = useRoute()
    //2.定义方法
    //挂载后再加载数据
    onMounted(async () => {
      initForm()
      changeStu()
    })
    //    改变输入框状态
    const changeStu = () => {
      if (route.query.type == '1') {
        inputStu.value.inputStu = false
      } else {
        inputStu.value.inputStu = true
      }
    }
    const OpenInfoDialog = (row: any) => {
      console.log('表格，此单元格被点击')
      deviceDialogConfig.value.title = ''
      deviceDialogConfig.value.currentId = row.deviceId
      deviceDialogConfig.value.deviceNo = row.deviceNo
      deviceDialogConfig.value.readonly = false
      deviceDialogConfig.value.visible = true
    }
    //关闭弹框
    const handleClose = done => {
      dialogVisible.value.visible = false
    }
    //添加-表格的数据
    const refreshData = async () => {
      const begin =
        (Number(cardTableConfig.value.pagination.page) - 1) *
        Number(cardTableConfig.value.pagination.limit)
      const end =
        Number(cardTableConfig.value.pagination.page) *
        Number(cardTableConfig.value.pagination.limit)
      cardTableConfig.value.dataList = formData.value.inventoryAllCList.slice(begin, end)
      cardTableConfig.value.pagination.total = formData.value.inventoryAllCList
        ? formData.value.inventoryAllCList.length
        : 0
    }
    //编辑-表格的数据
    const refreshDataInfo = async () => {
      const begin =
        (Number(cardTableConfigInfo.value.pagination.page) - 1) *
        Number(cardTableConfigInfo.value.pagination.limit)
      const end =
        Number(cardTableConfigInfo.value.pagination.page) *
        Number(cardTableConfigInfo.value.pagination.limit)
      cardTableConfigInfo.value.dataList = formData.value.inventoryAllCList.slice(begin, end)
      cardTableConfigInfo.value.pagination.total = formData.value.inventoryAllCList
        ? formData.value.inventoryAllCList.length
        : 0
    }
    //获取列表数据
    const getDeviceList = value => {
      formData.value.inventoryAllCList = value
      if (value) {
        const ids: any = []
        formData.value.inventoryAllCList.forEach(item => {
          ids.push(item.id)
        })
        formData.value.deviceIds = ids.join(',')
      }
      refreshData()
    }
    const addDialog = () => {
      AddDialogConfig.value.title = '选择设备'
      AddDialogConfig.value.currentId = ''
      AddDialogConfig.value.readonly = false
      AddDialogConfig.value.visible = true
    }
    //删除
    const handleDelete = id => {
      console.log(id)
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = formData.value.inventoryAllCList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.inventoryAllCList.splice(index, 1)
        const ids = formData.value?.inventoryAllCList?.map(node => node.id) ?? []
        const idstr = ids.join(',')
        formData.value.deviceIds = idstr
        refreshData()
      })
    }
    //过滤盘点数据
    const filtSpare = list => {
      const inventoryCList: any[] = []
      if (list) {
        list.forEach(emt => {
          inventoryObj = {
            deviceId: emt.id
          }
          inventoryCList.push(inventoryObj)
        })
      }
      return inventoryCList
    }
    //获取盘点人id
    const checkUsers = (users: any[]) => {
      console.log(users, 'usersusers')
      const userIds = users.map(user => user.id)
      console.log(userIds, 'userIdsuserIds')
      formData.value.inventoryPersonIds = userIds
    }
    //保存
    const submit = () => {
      // 1.检查表格数据数据正确性
      baseForm.value.validate(async valid => {
        if (!valid) {
          $message.warning('请将必填数据填写')
          return false
        }
        //过滤盘点设备数据
        if (route.query.type) {
          //判断是新增还是盘点功能
          formData.value.inventoryCList = filtSpare(formData.value.inventoryAllCList)
        }
        // 时间格式转换
        formData.value.expectInventoryTime = Number(new Date(formData.value.expectInventoryTime))
        // if(typeof formData.value.expectInventoryTime === 'string'){
        // }
        //过滤盘点人
        if (!(typeof formData.value.inventoryPersonIds === 'string')) {
          if (formData.value.inventoryPersonIds.length > 0) {
            formData.value.inventoryPersonIds = formData.value.inventoryPersonIds.join(',')
          }
        }
        // 2.保存数据
        saveData(formData.value)
          .then(() => {
            $message.success('保存成功')
            router.push({ name: 'deviceCheckIndex' })
          })
          .catch(err => {
            if(err.response){
              $message.error(err.response.message)
            }else{
              $message.error(err.message)
            }
            router.push({ name: 'deviceCheckIndex' })
          })
      })
    }
    //盘点弹出框-保存
    const checkSub = (row: any) => {
      dialogVisible.value.visible = false
      //添加表单值到表格
      if (checkForm.value.change !== null && checkForm.value.change !== '') {
        formData.value.inventoryCList.filter(res => {
          if (res.id == dialogVisible.value.id) {
            if (checkForm.value.change == '1') {
              res.change = '1'
            } else {
              res.change = '0'
            }
            res.remark = checkForm.value.remark
            res.status = '2'
            res.inventoryPersonId = formData.value.inventoryPersonId
            res.inventoryPersonName = formData.value.inventoryPersonNames
            res.inventoryTime = Number(new Date())
          }
        })
      }
      refreshDataInfo()
    }
    //编辑,初始化数据表格
    const initForm = () => {
      let storage = (window as any).sessionStorage.getItem('check')
      const row = JSON.parse(storage)
      if (row) {
        /*if (row.inventoryPersonNames) {
                        const newNames = row.inventoryPersonNames.split(',')
                        const newids = row.inventoryPersonIds.split(',')
                        for (let i in newNames) {
                            users.value.push({firstName: newNames[i], id: newids[i]})
                        }
                    }*/

        formData.value = row
        row.expectInventoryTime &&
          (formData.value.expectInventoryTime = new Date(row.expectInventoryTime))
        if (formData.value.inventoryCList) {
          formData.value.inventoryAllCList = formData.value.inventoryCList
          refreshDataInfo()
        }
      }
    }
    return {
      users,
      dialogVisible,
      handleClose,
      formData,
      addDialog,
      cardTableConfig,
      cardTableConfigInfo,
      AddDialogConfig,
      refreshData,
      refreshDataInfo,
      checkUsers,
      value: ref([]),
      submit,
      getDeviceList,
      checkForm,
      checkSub,
      rules,
      baseForm,
      inputStu,
      deviceDialogConfig,
      OpenInfoDialog
    }
  },
  //其他方法
  methods: {
    goOff() {
      sessionStorage.removeItem('check')
      router.push({ name: 'deviceCheckIndex' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/ledger-router.scss';

.check-item-style {
  width: 400px;
  margin-left: 15px;
}

.div-TBform-style {
  height: 910px;
  /*background-color: #FFFFFF*/
}
.el-form-item {
  padding-right: 15px;
}
</style>
