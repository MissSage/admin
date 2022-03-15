<template>
  <el-card class="ledger-card">
    <template #header>
      <div class="dialog-title" @click="goOff">
        <span class="icon iconfont icon-arrowleft back-btn"></span>
        <span class="dialog-title-text">返回</span>
      </div>
    </template>
    <el-scrollbar>
      <el-form ref="baseForm" label-position="top" :rules="rules" :model="formData">
        <SLDescriptionHeader>基本信息</SLDescriptionHeader>
        <SLFlexGroup>
          <el-form-item class="ls-flex-item--4" label="设备编号：" prop="deviceNo">
            <el-input
              v-model="formData.deviceNo"
              placeholder="请输入"
              :disabled="inputStu.inputStu"
            ></el-input>
          </el-form-item>
          <el-form-item class="ls-flex-item--4" label="设备名称：" prop="deviceName" required>
            <el-input
              v-model="formData.deviceName"
              placeholder="请输入"
              :disabled="inputStu.inputStu"
            ></el-input>
          </el-form-item>
          <el-form-item class="ls-flex-item--4" label="单位：" prop="unit">
            <el-input v-model="formData.unit"  class="ls-flex-item--4" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="设备类别：" prop="deviceType">
            <el-select
              v-model="formData.deviceType"
              placeholder="请选择"
              style="width: 100%"
              filterable
              allow-create
              :disabled="inputStu.inputStu"
            >
              <!--<el-option label="生产设备" value="0"></el-option>
                            <el-option label="工艺设备" value="1"></el-option>
                            <el-option label="压力设备" value="2"></el-option>-->
              <!--循环 接口获取设备类别-->
              <el-option
                v-for="option of device.type"
                :key="option"
                :value="option"
                :label="option"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="规格型号：">
            <el-input v-model="formData.specificationModel" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="品牌：" prop="brand">
            <el-input v-model="formData.brand" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--2" label="供应商：" prop="supplier">
            <el-input v-model="formData.supplier" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="设备来源：" prop="deviceSource">
            <el-select v-model="formData.deviceSource" placeholder="请选择" style="width: 100%">
              <el-option label="租赁" value="0"></el-option>
              <el-option label="借用" value="1"></el-option>
              <el-option label="采购" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="采购金额：" prop="purchaseAmount">
            <el-input
              v-model="formData.purchaseAmount"
              placeholder="请输入"
              oninput="value=value.replace(/[^0-9.]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="购置日期：" prop="purchaseTime">
            <el-date-picker
              v-model="formData.purchaseTime"
              style="width: 100%"
              type="date"
              placeholder="选择日期"
              value-format="x"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="保修期至：" prop="warrantyTime">
            <el-date-picker
              v-model="formData.warrantyTime"
              style="width: 100%"
              type="date"
              value-format="x"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="启用日期：" prop="enableTime">
            <el-date-picker
              v-model="formData.enableTime"
              style="width: 100%"
              type="date"
              value-format="x"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="报废日期：" prop="expectScrapTime">
            <el-date-picker
              v-model="formData.expectScrapTime"
              style="width: 100%"
              type="date"
              value-format="x"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="设备状态：" prop="deviceStatus">
            <el-select v-model="formData.deviceStatus" placeholder="请选择" style="width: 100%">
              <el-option label="在用" value="0"></el-option>
              <el-option label="闲置" value="1"></el-option>
              <el-option label="待维修" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="设备等级：" prop="deviceGrade">
            <el-select v-model="formData.deviceGrade" placeholder="请选择" style="width: 100%">
              <el-option label="重点设备" value="0"></el-option>
              <el-option label="主要设备" value="1"></el-option>
              <el-option label="一般设备" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="负责人：" prop="director">
            <el-input v-model="formData.director" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--4" label="所属部门：" prop="projectId">
            <el-cascader
              v-model="formData.projectId"
              placeholder="选择部门"
              clearable
              :disabled="inputStu.inputStu"
              style="width: 100%"
              :props="{ emitPath: false }"
              :options="areaTree"
              filterable
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item  class="ls-flex-item--2" label="设备位置：" prop="devicePosition">
            <el-input v-model="formData.devicePosition" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--2" label="备注：" prop="remark">
            <el-input
              v-model="formData.remark"
              placeholder="请输入"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item  class="ls-flex-item--2" label="设备定位：" prop="location">
            <SLAmap v-model="formData.location" />
          </el-form-item>
        </SLFlexGroup>

        <SLDescriptionHeader>折旧信息</SLDescriptionHeader>
        <SLFlexGroup>
          <el-form-item label="折旧方法：" prop="depreciationMethod">
            <el-select v-model="formData.depreciationMethod" placeholder="请选择">
              <el-option label="无" value="0"></el-option>
              <el-option label="年限平均法" value="1"></el-option>
              <el-option label="年数总和法" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用寿命（月）：" prop="useLife">
            <el-input
              v-model="formData.useLife"
              placeholder="请输入"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="原值：" prop="originValue">
            <el-input
              v-model="formData.originValue"
              placeholder="请输入"
              oninput="value=value.replace(/[^0-9.]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="净残率（%）：" prop="netResidualRate">
            <el-input
              v-model="formData.netResidualRate"
              placeholder="请输入"
              oninput="value=value.replace(/[^0-9.]/g,'')"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="净值：" prop="netValue">
            <el-input v-model="formData.netValue" disabled></el-input>
          </el-form-item>
          <el-form-item label="月折旧额：" prop="depreciationAmountMonth">
            <el-input v-model="formData.depreciationAmountMonth" disabled></el-input>
            <!--monthDepreciationAmount-->
          </el-form-item>
        </SLFlexGroup>

        <SLDescriptionHeader>自定义属性</SLDescriptionHeader>
        <SLFlexGroup>
          <el-form-item label="文本1号" prop="text1">
            <el-input v-model="formData.text1" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本2号" prop="text2">
            <el-input v-model="formData.text2" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本3号" prop="text3">
            <el-input v-model="formData.text3" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本4号" prop="text4">
            <el-input v-model="formData.text4" placeholder="请输入"></el-input>
          </el-form-item>
          <br />
          <el-form-item label="文本5号" prop="text5">
            <el-input v-model="formData.text5" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本6号" prop="text6">
            <el-input v-model="formData.text6" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本7号" prop="text7">
            <el-input v-model="formData.text7" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="文本8号" prop="text8">
            <el-input v-model="formData.text8" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="数字型1" prop="number1">
            <el-input-number
              v-model="formData.number1"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="数字型2" prop="number2">
            <el-input-number
              v-model="formData.number2"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="日期型1" prop="date1">
            <el-date-picker
              v-model="formData.date1"
              style="width: 100%"
              type="date"
              value-format="x"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日期型2" prop="date2">
            <el-date-picker
              v-model="formData.date2"
              style="width: 100%"
              type="date"
              value-format="x"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </SLFlexGroup>

        <SLDescriptionHeader>设备图片</SLDescriptionHeader>

        <el-form-item label="上传图片(最多上传5张图片)">
          <el-upload
            :http-request="uploadPic"
            :before-upload="handleUpload"
            action=""
            accept=".png,.jpg,.jpeg,.gif,.webp"
            :on-remove="handleRemove"
            :limit="5"
            multiple
            class="upload-demo"
            :on-exceed="handleExceed"
            :file-list="FileList"
            list-type="picture-card"
            style="border: 0px"
          >
            <span class="icon iconfont icon-jia"></span>
            <!-- <div class="image-up-style">
            </div> -->
          </el-upload>
        </el-form-item>
        <SLDescriptionHeader>
          <span>设备相关文件</span>
          <template #right>
            <el-upload
              class="upload-demo"
              action=""
              style="display: inline-block"
              :http-request="uploadFile"
              :before-upload="handleUploadFile"
              :show-file-list="false"
              accept=".xls,.doc,.docx,.pdf,.xlsx"
            >
              <el-button class="add-btn" type="primary"> 上传 </el-button>
            </el-upload>
          </template>
        </SLDescriptionHeader>

        <el-form-item>
          <!--表格-->
          <CardTable :config="cardTableConfigFile" style="height: 300px" />
        </el-form-item>
        <SLDescriptionHeader>
          <span>子设备</span>
          <template #right>
            <el-button type="primary" class="add-btn" @click="addSonDialog">添加 </el-button>
          </template>
        </SLDescriptionHeader>

        <el-form-item>
          <!--表格-->
          <CardTable :config="cardTableConfigSon" style="height: 300px" />
        </el-form-item>
        <SLDescriptionHeader>
          <span>父设备</span>
          <template #right>
            <el-button type="primary" class="add-btn" @click="addFaDialog()"> 添加 </el-button>
          </template>
        </SLDescriptionHeader>

        <el-form-item>
          <!--表格-->
          <CardTable
            :config="cardTableConfigFa"
            :set-current-row="formData.parentAssetsAccountList"
            style="height: 178px"
          />
        </el-form-item>
        <SLDescriptionHeader>
          <span>设备关联备件</span>
          <template #right>
            <el-button type="primary" class="add-btn" @click="addReleDialog()"> 添加 </el-button>
          </template>
        </SLDescriptionHeader>

        <el-form-item>
          <!--表格-->
          <CardTable :config="cardTableConfigRele" style="height: 300px" />
        </el-form-item>
      </el-form>
      <div class="btn-style">
        <el-button size="mini" class="btn-cancel-style" @click="goOff()">取 消</el-button>
        <el-button
          size="mini"
          class="btn-confirm-style"
          
          type="primary"
          @click="submit()"
          >保 存</el-button
        >
      </div>
      <!--子设备 弹框-->
      <AddDialog
        v-if="AddDialogConfig.visible"
        :visible="AddDialogConfig.visible"
        :close="AddDialogConfig.close"
        :current-id="AddDialogConfig.currentId"
        :father-id="formData.parentDeviceIds"
        :readonly="AddDialogConfig.readonly"
        :title="AddDialogConfig.title"
        :width="'60%'"
        :device-ids="formData.subDeviceIds"
        :sub-device-ids="formData.subDeviceIds"
        :sub-assets-account-list="formData.subAssetsAccountList"
        @sendMsgIds="getSondata"
        @sendMsgList="getSondataList"
      />
      <!--父设备 弹框-->
      <AddFaDialog
        v-if="AddDialogConfigFa.visible"
        :visible="AddDialogConfigFa.visible"
        :close="AddDialogConfigFa.close"
        :current-id="AddDialogConfigFa.currentId"
        :son-id="formData.subDeviceIds"
        :readonly="AddDialogConfigFa.readonly"
        :title="AddDialogConfigFa.title"
        :width="'60%'"
        :parent-device-ids="formData.parentDeviceIds"
        :parent-assets-account-list="formData.parentAssetsAccountList"
        @sendMsgFaIds="getFadata"
        @sendMsgFaList="getFadataList"
      />
      <!--设备关联设备 弹框 -->
      <ChoiseRPDialog
        v-if="AddDialogConfigRele.visible"
        :visible="AddDialogConfigRele.visible"
        :close="AddDialogConfigRele.close"
        :current-id="AddDialogConfigRele.currentId"
        :readonly="AddDialogConfigRele.readonly"
        :title="AddDialogConfigRele.title"
        :width="'60%'"
        :select-ids="formData.componentIds"
        @sendMsgSpareList="getSparePart"
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

  <!-- <el-scrollbar
    ref="scrollbarContainer"
    wrap-class="scrollbar-wrap"
    :style="{ height: scrollHeight }"
  >
    <div class="content">
      <div class="title-style" style="margin: 0px">
        <el-button icon="icon iconfont icon-arrowleft" style="border: 0px" @click="goOff()">
          返回</el-button
        >
      </div>
      
      
    </div>
  </el-scrollbar> -->
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import SLAmap from '@/components/SLAmap/index.vue'
import SLDescriptionHeader from '@/components/SLDescriptionHeader/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddDialog from './AddDialog.vue'
import AddFaDialog from './AddFaDialog.vue'
import ChoiseRPDialog from './ChoiseRPDialog.vue'
import { ref, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable, ITableItem } from '@/common/types/ledger/ledger'
//接口
import {
  saveData,
  getDataById,
  upLoadImages,
  upLoadFile,
  showFile,
  getDeviceType
} from '@/api/ledger/ledger2'
import router from '@/router'
const { $confirm, $message, $format } = useGlobal()
import { useRoute } from 'vue-router'
import useProject from '@/hooks/project/useProject'
import InfoDialog from './InfoDialog.vue'
export default {
  name: 'Registration',
  components: {
    CardTable,
    AddDialog,
    ChoiseRPDialog,
    AddFaDialog,
    InfoDialog,
    SLDescriptionHeader,
    SLAmap,
    SLFlexGroup
  },
  props: ['projectId'],
  setup(props, ctx) {
    //1.定义变量
    const { $confirm, $message, $format } = useGlobal()
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
    const device = ref<any>({
      type: ['生产设备', '工艺设备', '压力设备']
    })
    const addSonDialog = () => {
      AddDialogConfig.value.title = ''
      if (route.query.id) {
        const str = route.query.id.toString()
        AddDialogConfig.value.currentId = str
      } else {
        AddDialogConfig.value.currentId = ''
      }
      AddDialogConfig.value.readonly = false
      AddDialogConfig.value.visible = true
    }
    const addFaDialog = () => {
      AddDialogConfigFa.value.title = ''
      if (route.query.id) {
        const str = route.query.id.toString()
        AddDialogConfigFa.value.currentId = str
      } else {
        AddDialogConfigFa.value.currentId = ''
      }
      AddDialogConfigFa.value.readonly = false
      AddDialogConfigFa.value.visible = true
    }
    const addReleDialog = () => {
      AddDialogConfigRele.value.title = ''
      AddDialogConfigRele.value.currentId = ''
      AddDialogConfigRele.value.readonly = false
      AddDialogConfigRele.value.visible = true
    }
    const OpenInfoDialog = (row: any) => {
      console.log('表格，此单元格被点击')
      deviceDialogConfig.value.title = ''
      deviceDialogConfig.value.currentId = row.id
      deviceDialogConfig.value.deviceNo = row.deviceNo
      deviceDialogConfig.value.readonly = false
      deviceDialogConfig.value.visible = true
    }
    const onlinePreview = async (row: any) => {
      const res = await showFile(row.url)
      debugger
      //判断文件类型
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.setAttribute('target', '_blank')
      link.setAttribute('href', url)
      document.body.appendChild(link)
      link.click()
    }
    const baseForm = ref<any>()
    //表格输入要求
    const rules = ref<FormRules>({
      deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }]
    })
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
      operations: [
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDeleteFile(row.id)
        }
      ],
      operationWidth: '150px',
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
      operations: [
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDeleteSon(row.id)
        }
      ],
      operationWidth: '150px',
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
      operations: [
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDeleteFa(row.id)
        }
      ],
      operationWidth: '150px',
      pagination: {
        page: 1,
        limit: 1,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          //
        },
        pageHandle: val => {
          //
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
      operations: [
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDeleteRele(row.id)
        }
      ],
      operationWidth: '150px',
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
    //添加任务-子设备
    const AddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '添加任务',
      currentId: '',
      close: () => {
        AddDialogConfig.value.visible = false
      }
    })
    //添加任务-父设备
    const AddDialogConfigFa = ref<DialogConfig>({
      visible: false,
      title: '添加任务',
      currentId: '',
      close: () => {
        AddDialogConfigFa.value.visible = false
      }
    })
    //添加任务-设备关联设备
    const AddDialogConfigRele = ref<DialogConfig>({
      visible: false,
      title: '添加任务',
      currentId: '',
      close: () => {
        AddDialogConfigRele.value.visible = false
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

    //关联设备临时对象
    let SpareObj = ref<any>({
      sparePartId: '',
      num: ''
    })
    //表单内容
    let formData = ref<any>({
      projectId: route.query.projectId,
      deviceId: '',
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
    //控制禁用
    let inputStu = ref<any>({
      inputStu: false
    })
    //2.方法
    //开始一个生命周期钩子,挂载后再加载数据
    onMounted(async () => {
      initForm()
      initDeviceType()
      state.areaTree = await getAreaTreeData()
    })
    //初始化-数据表格
    const initForm = () => {
      const route = useRoute()
      const id = route.query.id
      if (id) {
        getDataById(id).then(res => {
          formData.value = res.data
          if (formData.value.deviceId) {
            inputStu.value.inputStu = true
          }
          if (formData.value.imgs) {
            formData.value.imgs.split(',').forEach((img, index) => {
              FilesList.value.list.push({ url: img })
            })
            FileList.value = FilesList.value.list
          }
          if (formData.value.fileIds) {
            refreshDataFile()
          }
          if (formData.value.subDeviceIds) {
            refreshDataSon()
          }
          if (formData.value.parentDeviceIds) {
            refreshDataFa()
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
          }
        })
      }
    }
    const initDeviceType = () => {
      //    调用获取设备类型接口
      getDeviceType().then((res: any) => {
        if (res.data) {
          device.value.type = res.data
        }
      })
    }
    //图片上传
    const uploadPic = (file: any) => {
      const params = new FormData()
      params.append('file', file.file)
      params.append('projectId', formData.value.projectId)
      upLoadImages(params)
        .then(res => {
          FileList.value.push({ uid: file.file.uid, url: res.data.fileName })
        })
        .catch(err => {
          console.log('上传图片报错')
        })
    }
    //文件上传
    const uploadFile = file => {
      const params = new FormData()
      params.append('file', file.file)
      params.append('projectId', formData.value.projectId)
      //调用上传文件接口
      upLoadFile(params)
        .then(res => {
          formData.value.assetsFileList.push(res.data)
          refreshDataFile()
        })
        .catch(err => {
          console.log('上传文件报错')
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
    //获取弹框返回数据-子设备
    const getSondata = value => {
      formData.value.subDeviceIds = value.join(',')
    }
    //获取弹框返回数据-子设备
    const getSondataList = value => {
      formData.value.subAssetsAccountList = value
      refreshDataSon()
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
      // cardTableConfigFa.value.pagination.total = formData.value.parentAssetsAccountList.length
    }
    //获取弹框返回数据-父设备
    const getFadata = value => {
      formData.value.parentDeviceIds = value.join(',')
      console.log('获取的父类的id是 ' + value)
    }
    //获取弹框返回数据-父设备
    const getFadataList = value => {
      if (value) {
        formData.value.parentAssetsAccountList = []
        formData.value.parentAssetsAccountList.push(value)
      }
      refreshDataFa()
    }
    //更新查询数据-关联设备
    const refreshDataRele = async () => {
      //根据当前也进行过滤需要显示的数据
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
    const getSparePart = (value: any) => {
      if (value) {
        //如果有返回值
        const list: any = []
        //如果当前列表有值
        value.forEach(item => {
          if (formData.value.componentIds.indexOf(item.id) !== -1) {
            //如果返回集合循环到当前列表有的值，则查询对应的列表数据 id，num（备注，可能id为空）
            const index = getIndex(formData.value.sparePartAllList, item.id)
            list.push({
              id: formData.value.sparePartAllList[index].id, //可能存在id
              componentId: item.id,
              componentNo: item.code,
              name: item.name,
              type: item.type,
              specification: item.specification,
              unit: item.unit,
              num: formData.value.sparePartAllList[index].num
            })
          } else {
            //如果循环的值，没有则直接添加
            list.push({
              id: '',
              componentId: item.id,
              componentNo: item.code,
              name: item.name,
              type: item.type,
              specification: item.specification,
              unit: item.unit
            })
          }
        })
        //赋值
        formData.value.sparePartAllList = list
      }
      //转化被选中的备件ids
      const ids: any = []
      formData.value.sparePartAllList.forEach(item => {
        ids.push(item.componentId)
      })
      formData.value.componentIds = ids.join(',')
      // }
      //无值直接返回
      refreshDataRele()
    }
    const getIndex = (list, id) => {
      let index = list.findIndex((item, i) => {
        // console.log('循环次数', i)
        return item.componentId === id
      })
      console.log('查询到的下标是', index)
      return index
    }
    //过滤关联设备数据
    const filtSpare = (list: any) => {
      const spareList: any = []
      if (list) {
        list.forEach(emt => {
          SpareObj = { id: emt.id, componentId: emt.componentId, num: emt.num }
          spareList.push(SpareObj)
        })
      }
      return spareList
    }
    //删除-文件
    const handleDeleteFile = (id: string) => {
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var index = formData.value.assetsFileList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.assetsFileList.splice(index, 1)
        // const ids = formData.value?.assetsFileList?.map(node => node.id) ??[]
        // const idstr  = ids.join(',')
        // formData.value.subDeviceIds = idstr
        refreshDataFile()
      })
    }
    //删除-子设备
    const handleDeleteSon = id => {
      console.log('下标' + id)
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('ok ')
        var index = formData.value.subAssetsAccountList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.subAssetsAccountList.splice(index, 1)
        const ids = formData.value?.subAssetsAccountList?.map(node => node.id) ?? []
        const idstr = ids.join(',')
        formData.value.subDeviceIds = idstr
        refreshDataSon()
      })
    }
    //父设备删除
    const handleDeleteFa = id => {
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('ok ')
        var index = formData.value.parentAssetsAccountList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.parentAssetsAccountList.splice(index, 1)
        const ids = formData.value?.parentAssetsAccountList?.map(node => node.id) ?? []
        const idstr = ids.join(',')
        formData.value.parentDeviceIds = idstr
        refreshDataFa()
      })
    }
    //删除-关联设备
    const handleDeleteRele = id => {
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('ok ')
        var index = formData.value.sparePartAllList.findIndex(item => {
          if (item.id == id) {
            return true
          }
        })
        formData.value.sparePartAllList.splice(index, 1)
        //复制当前选中的ids
        const ids = formData.value?.sparePartAllList?.map(node => node.id) ?? []
        const idstr = ids.join(',')
        formData.value.componentIds = idstr
        refreshDataRele()
      })
    }
    //改变
    const handleChange = value => {
      console.log(value)
    }
    //上传图片限制
    const handleUpload = file => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        $message.error('上传图片只能是 JPG/PNG 格式!')
      }
      return isJPG && isLt2M
    }
    //文件上传限制
    const handleUploadFile = file => {
      const sufFile = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = sufFile === 'doc'
      const extension2 = sufFile === 'docx'
      const extension3 = sufFile === 'pdf'
      const extension4 = sufFile === 'xls'
      const extension5 = sufFile === 'xlsx'
      if (!extension && !extension2 && !extension3 && !extension4 && !extension5) {
        $message.warning('上传文件只能是word/pdf/excel')
      }
      return extension || extension2 || extension3 || extension4 || extension5
    }
    //提交时-过滤文件
    const filtFile = () => {
      const arr = cardTableConfigFile.value?.dataList?.map(node => node.id) ?? []
      formData.value.fileIds = arr.join(',')
    }
    //保存
    const submit = () => {
      // 1.检查表格数据数据正确性
      baseForm.value.validate(async valid => {
        if (!valid) {
          $message.warning('请将必填数据填写')
          return false
        }
        //转化图片列表
        if (FileList.value) {
          const files = FileList.value
          let urls: any = []
          for (let i in files) {
            urls.push(files[i].url)
          }
          formData.value.imgs = urls.length > 0 ? urls.join(',') : ''
        }
        //转化文件数据
        if (formData.value.assetsFileList.length > 0) {
          filtFile()
        }
        //过滤获取关联备件
        if (formData.value.sparePartAllList ? formData.value.sparePartAllList.length : 0) {
          formData.value.componentList = filtSpare(formData.value.sparePartAllList)
        }
        // 2.保存数据
        saveData(formData.value)
          .then(() => {
            $message.success('保存成功')
            router.push({ name: 'deviceLedgerIndex' })
          })
          .catch(err => {
            $message.error('系统错误')
            router.push({ name: 'deviceLedgerIndex' })
          })
      })
    }
    //图片删除
    const handleRemove = (file, files) => {
      FileList.value = files
    }
    const handleSuccess = (response, file, files) => {
      console.log('上传结果', response)
    }
    const FileList = ref<any>([])
    //返回
    return {
      formData,
      FilesList,
      FileList,
      handleSuccess,
      cardTableConfigRele,
      cardTableConfigFile,
      cardTableConfigSon,
      cardTableConfigFa,
      getSondata,
      getSondataList,
      getFadata,
      getFadataList,
      getSparePart,
      AddDialogConfig,
      AddDialogConfigFa,
      AddDialogConfigRele,
      deviceDialogConfig,
      refreshDataFile,
      refreshDataSon,
      refreshDataFa,
      refreshDataRele,
      ...toRefs(state), //添加级联选择
      handleChange,
      handleUpload,
      handleUploadFile,
      submit,
      initForm,
      uploadPic,
      uploadFile,
      handleRemove,
      rules,
      baseForm,
      getIndex,
      addSonDialog,
      addFaDialog,
      addReleDialog,
      OpenInfoDialog,
      onlinePreview,
      device,
      inputStu
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
.blue-span {
  width: 5px;
  height: 20px;
  color: #4aa9d8ff;
  background-color: #4aa9d8ff;
  margin-left: -26px;
}
.upload-demo {
  :deep(.el-upload--picture-card) {
    background-color: rgb(39, 42, 61);
    border-color: #34384cff;
    // height: 150px;
    color: #969cc2ff;
    box-sizing: border-box;
    // width: 167px;
    // border-radius: 2px !important;
  }
}

.uploadPic-style {
  width: 100%;
}

.uploadFile-btn-style {
  margin-left: 1290px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;flex-wrap: nowrap;
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
.ledger-card {
  width: 100%;
  height: 100%;
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.5);
}

.el-form {
  margin-right: 20px;
}
.el-select {
  width: 100%;
}
.el-button {
  &.add-btn {
    height: 25px;
    min-height: 25px;
    line-height: 21px;
    padding: 2px 8px;
  }
}
.dialog-title {
  cursor: pointer;
}
</style>
