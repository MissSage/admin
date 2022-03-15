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
      <!--设备处置 申请 -->
      <div style="margin-right: 20px">
        <!--数据-->
        <el-form
          ref="baseForm"
          label-position="top"
          :rules="rules"
          :model="formData"
          class="demo-form-inline from-margin"
        >
          <SLDescriptionHeader>处置信息</SLDescriptionHeader>
          <SLFlexGroup>
            <el-form-item label="处置方式：" props="handleType" class="ls-flex-span--4">
              <el-select
                v-model="formData.handleType"
                placeholder="请选择"
                :disabled="inputStu.inputStu"
                style="width: 100%"
              >
                <el-option label="报废" value="0"></el-option>
                <el-option label="闲置" value="1"></el-option>
                <el-option label="在用" value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="inputStu.inputStu"
              label="申请人："
              props="applicantName"
              class="ls-flex-span--4"
            >
              <el-input v-model="formData.applicantName" :disabled="inputStu.inputStu"></el-input>
            </el-form-item>
            <el-form-item label="处置说明：" props="remark" class="ls-flex-item--1">
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
            <span>处置设备</span>
            <template v-if="$route.query.type == '0'" #right>
              <el-button type="primary" class="add-btn" @click="addDialog()">添加</el-button>
            </template>
          </SLDescriptionHeader>
          <el-form-item class="ls-flex-item--1">
            <!--表格部分-->
            <template v-if="$route.query.type == '0'">
              <CardTable :config="cardTableConfig" style="height: 450px" />
            </template>
            <template v-else>
              <CardTable :config="cardTableConfigEdit" style="height: 300px" />
            </template>
          </el-form-item>

          <template v-if="$route.query.title == '处置详情'">
            <SLDescriptionHeader>审核结果</SLDescriptionHeader>
            <SLFlexGroup>
              <el-form-item label="审核人：" props="reviewerName" class="ls-flex-span--4">
                <el-input v-model="formData.reviewerName" disabled></el-input>
              </el-form-item>
              <el-form-item label="审核结果：" props="status" class="ls-flex-span--4">
                <el-select
                  v-model="formData.status"
                  placeholder="请选择"
                  style="width: 100%"
                  disabled
                >
                  <el-option label="不通过" value="0"></el-option>
                  <el-option label="通过" value="1"></el-option>
                </el-select>
              </el-form-item>
            </SLFlexGroup>
          </template>
        </el-form>
        <div class="btn-style">
          <template v-if="$route.query.title == '添加处置申请'">
            <el-button size="mini" class="btn-cancel-style" @click="goOff()">取 消</el-button>
            <el-button size="mini" class="btn-confirm-style" type="primary" @click="submit()"
              >保 存</el-button
            >
          </template>
          <template v-else-if="$route.query.title == '处置审核'">
            <el-button size="mini" class="btn-cancel-style" @click="goOff()">关闭</el-button>
            <el-button
              size="mini"
              style="background-color: #ff0033"
              class="btn-cancel-style"
              type="primary"
              @click="reviewSub(2)"
            >
              不通过
            </el-button>
            <el-button size="mini" class="btn-confirm-style" type="primary" @click="reviewSub(1)"
              >通过</el-button
            >
          </template>
          <template v-else>
            <el-button size="mini" class="btn-cancel-style" @click="goOff()">关闭</el-button>
          </template>
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
          @sendMsgIds="getDeviceIds"
          @sendMsgList="getDeviceList"
          @refreshData="refreshData"
        />
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
import type { ICTCardTable } from '@/common/types/ledger/transf'
import router from '@/router'
//引入接口方法：保存
import { saveData, review } from '@/api/ledger/disposition'
import { useRoute } from 'vue-router'
import InfoDialog from '../../ledger/components/InfoDialog.vue'
export default {
  name: 'Apply',
  components: { CardTable, AddDialog, InfoDialog, SLDescriptionHeader, SLFlexGroup },
  setup() {
    //1.定义变量
    const { $confirm, $message } = useGlobal()
    //控制禁用
    let inputStu = ref<any>({
      inputStu: true
    })
    //路由
    const route = useRoute()
    //表格
    let formData = ref<any>({
      handleType: '', //处理编号
      remark: '', //备注
      reviewerId: '', //处理人id
      status: '', //状态
      deviceIds: '', //设备的id
      assetsAccountList: [] //设备列表
    })
    let RevformData = ref<any>({
      id: '',
      status: ''
    })
    const baseForm = ref<any>()
    //表格输入要求
    const rules = ref<FormRules>({
      handleType: [{ required: true, message: '请选择', trigger: 'change' }]
    })
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
    //表格栏-编辑
    const cardTableConfigEdit = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'deviceNo',
          label: '设备编号',
          textColor: '#6BD2F8FF',
          textDecoration: 'underline',
          handleClick: row => OpenInfoDialog(row),
          cellStyle: {
            cursor: 'pointer'
          }
        },
        { prop: 'deviceName', label: '设备名称' },
        { prop: 'brand', label: '品牌' },
        { prop: 'specificationModel', label: '规格型号' }
      ],
      operationWidth: '150px',
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigEdit.value.pagination.limit = val
          refreshData()
        },
        pageHandle: val => {
          cardTableConfigEdit.value.pagination.page = val
          refreshData()
        }
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
    //弹框
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '添加设备',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    //2.方法
    //挂载后再加载数据
    onMounted(async () => {
      initForm()
      changeStu()
    })
    //    改变输入框状态
    const changeStu = () => {
      if (route.query.type == '0') {
        inputStu.value.inputStu = false
      } else {
        inputStu.value.inputStu = true
      }
    }
    const OpenInfoDialog = (row: any) => {
      console.log('表格，此单元格被点击')
      deviceDialogConfig.value.title = ''
      deviceDialogConfig.value.currentId = row.id
      deviceDialogConfig.value.deviceNo = row.deviceNo
      deviceDialogConfig.value.readonly = false
      deviceDialogConfig.value.visible = true
    }
    //查询数据
    const refreshData = async () => {
      const begin =
        (Number(cardTableConfig.value.pagination.page) - 1) *
        Number(cardTableConfig.value.pagination.limit)
      const end =
        Number(cardTableConfig.value.pagination.page) *
        Number(cardTableConfig.value.pagination.limit)
      cardTableConfig.value.dataList = formData.value.assetsAccountList.slice(begin, end)
      cardTableConfig.value.pagination.total = formData.value.assetsAccountList
        ? formData.value.assetsAccountList.length
        : 0

      const begin2 =
        (Number(cardTableConfigEdit.value.pagination.page) - 1) *
        Number(cardTableConfigEdit.value.pagination.limit)
      const end2 =
        Number(cardTableConfigEdit.value.pagination.page) *
        Number(cardTableConfigEdit.value.pagination.limit)
      cardTableConfigEdit.value.dataList = formData.value.assetsAccountList.slice(begin2, end2)
      cardTableConfigEdit.value.pagination.total = formData.value.assetsAccountList
        ? formData.value.assetsAccountList.length
        : 0
    }
    //获取弹框返回的选中ids
    const getDeviceIds = (value: any) => {
      formData.value.deviceIds = value.join(',')
    }
    //获取弹框返回list
    const getDeviceList = (value: any) => {
      formData.value.assetsAccountList = value
      refreshData()
    }
    const addDialog = () => {
      // AddDialogConfig.value.title = ''
      AddDialogConfig.value.currentId = ''
      AddDialogConfig.value.readonly = false
      AddDialogConfig.value.visible = true
    }
    //删除
    const handleDelete = (id: any) => {
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('ok ')
        var index = formData.value.assetsAccountList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.assetsAccountList.splice(index, 1)
        const ids = formData.value?.assetsAccountList?.map(node => node.id) ?? []
        const idstr = ids.join(',')
        formData.value.deviceIds = idstr
        refreshData()
      })
    }
    //保存
    const submit = (status: number) => {
      // 1.检查表格数据数据正确性
      if (status) {
        if (status == 2) {
          formData.value.status = 0
        } else {
          formData.value.status = status
        }
      }
      // 2.保存数据
      saveData(formData.value)
        .then(() => {
          $message.success('保存成功')
          sessionStorage.removeItem('data')
          router.push({ name: 'deviceDisposeIndex' })
        })
        .catch(() => {
          $message.error('系统错误')
          router.push({ name: 'deviceDisposeIndex' })
        })
    }
    //审核
    const reviewSub = (status: number) => {
      if (status) {
        //通过 1 不通过0
        if (status == 2) {
          formData.value.status = 0
        } else {
          formData.value.status = status
        }
      }
      RevformData.value.id = formData.value.id
      RevformData.value.status = formData.value.status
      // 2.保存数据
      review(RevformData.value)
        .then(() => {
          $message.success('保存成功')
          sessionStorage.removeItem('data')
          router.push({ name: 'deviceDisposeIndex' })
        })
        .catch(() => {
          $message.error('系统错误')
          router.push({ name: 'deviceDisposeIndex' })
        })
    }
    //编辑功能时，初始化数据表格
    const initForm = () => {
      let storage = (window as any).sessionStorage.getItem('data')
      const row = JSON.parse(storage)
      if (row) {
        formData.value = row
        if (formData.value.assetsAccountList) {
          refreshData()
        }
      }
    }
    //返回
    return {
      formData,
      RevformData,
      initForm,
      addDialog,
      cardTableConfig,
      cardTableConfigEdit,
      AddDialogConfig,
      refreshData,
      getDeviceIds,
      getDeviceList,
      submit,
      reviewSub,
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
      sessionStorage.removeItem('data')
      router.push({ name: 'deviceDisposeIndex' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/ledger-router.scss';
.el-form-item {
  padding-right: 15px;
}
</style>
