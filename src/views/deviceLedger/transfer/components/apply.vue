<template>
  <el-card class="sl-device-card">
    <template #header>
      <div class="dialog-title" @click="goOff">
        <span class="icon iconfont icon-arrowleft back-btn"></span>
        <span class="dialog-title-text">返回</span>
      </div>
    </template>
    <!--设备转移 申请 -->
    <el-scrollbar>
      <div style="margin-right: 20px">
        <!--数据-->
        <el-form
          ref="baseForm"
          label-position="top"
          :rules="rules"
          :model="formData"
          class="demo-form-inline from-margin"
          style="margin-left: 16px"
        >
          <SLDescriptionHeader>调拨信息</SLDescriptionHeader>
          <SLFlexGroup>
            <el-form-item label="调往部门：" class="ls-flex-span--4" props="projectId">
              <el-cascader
                v-model="formData.projectId"
                style="width: 100%"
                placeholder="选择部门"
                clearable
                filterable
                :disabled="inputStu.inputStu"
                :props="{ emitPath: false }"
                :options="areaTree"
                @change="id => projectIdChange(id)"
              />
            </el-form-item>
            <el-form-item label="调往地点：" props="position" class="ls-flex-span--4">
              <el-input
                v-model="formData.position"
                placeholder="请输入"
                :disabled="inputStu.inputStu"
              ></el-input>
            </el-form-item>
            <el-form-item label="新负责人：" props="director" class="ls-flex-span--4">
              <el-input
                v-model="formData.director"
                :disabled="inputStu.inputStu"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
            <el-form-item label="调拨说明：" props="remark" class="ls-flex-item--1">
              <el-input
                v-model="formData.remark"
                placeholder="请输入"
                type="textarea"
                :disabled="inputStu.inputStu"
                :rows="4"
              ></el-input>
            </el-form-item>
          </SLFlexGroup>
          <SLDescriptionHeader>
            <span>调拨设备</span>
            <template v-if="$route.query.title == '添加调拨申请'" #right>
              <el-button type="primary" class="add-btn" @click="addDialog()"> 添加 </el-button>
            </template>
          </SLDescriptionHeader>
          <div>
            <!--表格-->
            <template v-if="$route.query.type == '0'">
              <CardTable :config="cardTableConfig" style="height: 450px" />
            </template>
            <template v-else>
              <CardTable :config="cardTableConfigEdit" style="height: 350px" />
              <template v-if="$route.query.title == '调拨详情'">
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
            </template>
          </div>
        </el-form>

        <div class="tableTitle" style="margin-top: 45px"><span class="midText"></span></div>
        <div class="btn-style">
          <template v-if="$route.query.title == '添加调拨申请'">
            <el-button size="mini" class="btn-cancel-style" @click="goOff()">取 消</el-button>
            <el-button
              size="mini"
              class="btn-left"
              style="
                margin-left: 20px;
                width: 120px;
                border-radius: 2px;
                height: 40px;
                background: linear-gradient(90deg, #2980b9 0%, #6dd5fa 100%);
              "
              type="primary"
              @click="submit()"
              >保 存</el-button
            >
          </template>
          <template v-else-if="$route.query.title == '调拨审核'">
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
            <el-button
              size="mini"
              class="btn-comfirm-style"
              
              type="primary"
              @click="reviewSub(1)"
              >通过</el-button
            >
          </template>
          <template v-else>
            <el-button
              size="mini"
              class="btn-cancel-style"
              @click="goOff()"
              >关闭</el-button
            >
          </template>
        </div>
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
//引入接口方法：保存
import { saveData, review } from '@/api/ledger/trans'
import router from '@/router'
import { reactive, toRefs } from 'vue'
import useProject from '@/hooks/project/useProject'
import { useRoute } from 'vue-router'
import InfoDialog from '../../ledger/components/InfoDialog.vue'
export default {
  name: 'TranApply',
  components: { CardTable, AddDialog, InfoDialog, SLDescriptionHeader, SLFlexGroup },
  setup(props, ctx) {
    //1.定义变量
    const { $confirm, $message } = useGlobal()
    //表格栏
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'deviceNo',
          label: '设备编号',
          textDecoration: 'underline',
          textColor: '#6BD2F8FF',
          handleClick: row => OpenInfoDialog(row),
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
    //表格栏
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
        limit: 10, //默认10条每页
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigEdit.value.pagination.limit = val
          refreshDataEdit()
        },
        pageHandle: val => {
          cardTableConfigEdit.value.pagination.page = val
          refreshDataEdit()
        }
      }
    })
    //验证
    const baseForm = ref<any>()
    //表格输入要求
    const rules = ref<FormRules>({
      position: [{ required: true, message: '请输入', trigger: 'blur' }],
      director: [{ required: true, message: '请输入', trigger: 'blur' }]
    })
    //弹框
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '选择设备',
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
    //控制禁用
    let inputStu = ref<any>({
      inputStu: true
    })
    //路由
    const route = useRoute()
    //表格
    let formData = ref<any>({
      projectId: '',
      position: '',
      director: '',
      remark: '',
      reviewerName: '', //审核人
      status: '', //添加设备的状态
      deviceIds: '', //设备的id
      assetsAccountList: []
    })
    let RevformData = ref<any>({
      id: '',
      status: ''
    })
    //2.方法
    //挂载后再加载数据
    onMounted(async () => {
      initForm()
      state.areaTree = await getAreaTreeData()
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
    //编辑功能，初始化数据表格
    const initForm = () => {
      let storage = (window as any).sessionStorage.getItem('row')
      const row = JSON.parse(storage)
      if (row) {
        formData.value = row
        if (formData.value.assetsAccountList) {
          const begin =
            (Number(cardTableConfigEdit.value.pagination.page) - 1) *
            Number(cardTableConfigEdit.value.pagination.limit)
          const end =
            Number(cardTableConfigEdit.value.pagination.page) *
            Number(cardTableConfigEdit.value.pagination.limit)
          cardTableConfigEdit.value.dataList = formData.value.assetsAccountList.slice(begin, end)
        }
      }
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
    }
    //查询数据
    const refreshDataEdit = async () => {
      const begin =
        (Number(cardTableConfigEdit.value.pagination.page) - 1) *
        Number(cardTableConfigEdit.value.pagination.limit)
      const end =
        Number(cardTableConfigEdit.value.pagination.page) *
        Number(cardTableConfigEdit.value.pagination.limit)
      cardTableConfigEdit.value.dataList = formData.value.assetsAccountList.slice(begin, end)
      cardTableConfigEdit.value.pagination.total = formData.value.assetsAccountList
        ? formData.value.assetsAccountList.length
        : 0
    }
    const getDeviceIds = value => {
      formData.value.deviceIds = value.join(',')
    }
    const getDeviceList = value => {
      formData.value.assetsAccountList = value
      refreshData()
    }
    const addDialog = () => {
      // AddDialogConfig.value.title = ''
      AddDialogConfig.value.currentId = ''
      AddDialogConfig.value.readonly = false
      AddDialogConfig.value.visible = true
    }
    const OpenInfoDialog = (row: any) => {
      deviceDialogConfig.value.title = ''
      deviceDialogConfig.value.currentId = row.id
      deviceDialogConfig.value.deviceNo = row.deviceNo
      deviceDialogConfig.value.readonly = false
      deviceDialogConfig.value.visible = true
    }
    //删除
    const handleDelete = id => {
      console.log(id)
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
    //
    const projectIdChange = async id => {
      //: IPlanJob
      console.log('点击选择项目', id)
    }
    //保存
    const submit = (status: number) => {
      baseForm.value.validate(async valid => {
        if (!valid) {
          debugger
          $message.warning('请将必填数据填写')
          return false
        }
        // 1.检查表格数据数据正确性
        if (status) {
          //通过 1 不通过0
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
            sessionStorage.removeItem('row')
            router.push({ name: 'deviceTransferIndex' })
          })
          .catch(err => {
            $message.error('系统错误')
            router.push({ name: 'deviceTransferIndex' })
          })
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
          sessionStorage.removeItem('row')
          router.push({ name: 'deviceTransferIndex' })
        })
        .catch(err => {
          $message.error('系统错误')
          router.push({ name: 'deviceTransferIndex' })
        })
    }
    //返回
    return {
      formData,
      RevformData,
      addDialog,
      cardTableConfig,
      cardTableConfigEdit,
      AddDialogConfig,
      refreshData,
      refreshDataEdit,
      ...toRefs(state), //添加级联选择
      projectIdChange,
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
  //方法
  methods: {
    goOff() {
      sessionStorage.removeItem('row')
      router.push({ name: 'deviceTransferIndex' })
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
