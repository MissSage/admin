<template>
  <el-card class="order-card">
    <template #header>
      <div class="dialog-title" @click="routerBack">
        <span class="icon iconfont icon-arrowleft back-btn"></span>
        <span class="dialog-title-text">{{ title }}</span>
      </div>

      <el-button
        class="dialog-title-extra"
        type="default"
        size="small"
        @click="followOrder"
      >
        <span v-if="!workOrder.follow" class="icon iconfont icon-jia"></span>
        {{ workOrder.follow ? '取消关注' : '关注' }}
      </el-button>
    </template>
    <el-scrollbar>
      <div class="order-content">
        <!-- 进度条 -->
        <SLSteps
          v-if="
            activeIndex >= statusToNumber(Status.COMFIRMING) &&
              activeIndex <= statusToNumber(Status.ACCEPTED)
          "
          :config="slStepsConfig"
          :current-index="activeIndex"
        />
        <!-- 工单信息 -->
        <DescriptionHeader>工单信息</DescriptionHeader>
        <!-- 工单基础信息 -->
        <OrderDetailBase :work-order="workOrder" />
        <!-- 处理内容 -->
        <template v-if="activeIndex >= statusToNumber(Status.DEALING)">
          <DescriptionHeader>处理内容</DescriptionHeader>
          <el-card v-if="workOrder.type === OrderTypes.OTHER" class="deal-card">
            <el-form
              label-position="top"
              class="flex-form"
              :model="workOrder"
            >
              <el-form-item label="实际开始时间">
                <el-date-picker
                  v-if="activeIndex === statusToNumber(Status.DEALING)"
                  v-model="workOrder.realStartTime"
                  type="datetime"
                  placeholder="请选择时间"
                >
                </el-date-picker>
                <TextItem v-else>{{ formatDate(workOrder.realStartTime) }}</TextItem>
              </el-form-item>
              <el-form-item label="实际结束时间">
                <el-date-picker
                  v-if="activeIndex === statusToNumber(Status.DEALING)"
                  v-model="workOrder.realEndTime"
                  type="datetime"
                  placeholder="请选择时间"
                >
                </el-date-picker>
                <TextItem v-else>{{ formatDate(workOrder.realStartTime) }}</TextItem>
              </el-form-item>
              <div></div>
              <div></div>
              <el-form-item label="处理反馈" class="colspan2">
                <el-input
                  v-model="workOrder.remark"
                  :disabled="activeIndex > statusToNumber(Status.DEALING)"
                  :rows="4"
                  type="textarea"
                  placeholder="请输入反馈内容"
                />
              </el-form-item>
              <el-form-item label="上传图片">
                <SlUploader
                  v-model="workOrder.processImgs"
                  :disabled="activeIndex > statusToNumber(Status.DEALING)"
                />
              </el-form-item>
              <el-form-item label="上传音频">
                <el-upload
                  class="upload-demo"
                  :disabled="activeIndex > statusToNumber(Status.DEALING)"
                  :action="fileActionUrl"
                  :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                  :show-file-list="false"
                  :on-success="
                    (res, file) => handleUploadSuccess(res, file, undefined, 'processVoiceFile')
                  "
                  :before-upload="beforeFileUpload"
                >
                  <el-button
                    size="small"
                    type="primary"
                    :disabled="activeIndex > statusToNumber(Status.DEALING)"
                  >
                    点击上传
                  </el-button>
                </el-upload>
                <div
                  v-if="workOrder.processVoiceFile && workOrder.processVoiceFile !== ''"
                  class="fileBox"
                >
                  <el-tag
                    v-if="workOrder.processVoiceFile"
                    class="questfile-download"
                    :title="workOrder.processVoiceFile"
                    :closable="activeIndex <= statusToNumber(Status.DEALING)"
                    @close="workOrder.processVoiceFile = ''"
                    @click="downloadFile(workOrder.processVoiceFile, '附件', 'file')"
                  >
                    {{ workOrder.processVoiceFile }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
          <template v-else>
            <template
              v-if="activeIndex >= statusToNumber(Status.DEALING) && workOrder.contentDetail"
            >
              <el-card
                v-for="(item, i) in workOrder.contentDetail.jobList"
                :key="i"
                class="deal-card"
              >
                <template
                  v-if="
                    workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN
                  "
                  #header
                >
                  <span class="el-descriptions__title_h5">
                    {{ item.projectName + '/' + item.deviceName + '/' + item.deviceName }}
                  </span>
                </template>

                <el-form
                  label-position="top"
                  class="flex-form"
                  :model="workOrder"
                >
                  <el-form-item
                    v-if="
                      workOrder.type === OrderTypes.REPAIRE ||
                        workOrder.type === OrderTypes.MAINTAIN
                    "
                    label="设备状况"
                  >
                    <el-select
                      v-if="activeIndex === statusToNumber(Status.DEALING)"
                      v-model="item.status"
                      placeholder="请选择"
                      style="width: 70%"
                    >
                      <el-option
                        v-for="(status, j) in devStatusOptions"
                        :key="j"
                        :label="status.label"
                        :value="status.value"
                      ></el-option>
                    </el-select>
                    <TextItem v-else>{{ formateDevStatus(item.status) }}</TextItem>
                  </el-form-item>
                  <el-form-item label="实际开始时间">
                    <el-date-picker
                      v-if="activeIndex === statusToNumber(Status.DEALING)"
                      v-model="item.startTime"
                      type="datetime"
                      placeholder="请选择时间"
                    >
                    </el-date-picker>
                    <TextItem v-else>{{ formatDate(item.startTime) }}</TextItem>
                  </el-form-item>
                  <el-form-item label="实际结束时间">
                    <el-date-picker
                      v-if="activeIndex === statusToNumber(Status.DEALING)"
                      v-model="item.endTime"
                      type="datetime"
                      placeholder="请选择时间"
                    >
                    </el-date-picker>
                    <TextItem v-else>{{ formatDate(item.endTime) }}</TextItem>
                  </el-form-item>
                  <div></div>
                  <el-form-item label="处理反馈" class="colspan2">
                    <el-input
                      v-model="item.processRemark"
                      :disabled="activeIndex > statusToNumber(Status.DEALING)"
                      :rows="4"
                      type="textarea"
                      placeholder="请输入反馈内容"
                    />
                  </el-form-item>
                  <el-form-item label="上传图片">
                    <SlUploader
                      v-model="item.imgs"
                      :disabled="activeIndex > statusToNumber(Status.DEALING)"
                    />
                  </el-form-item>
                  <el-form-item label="上传音频">
                    <el-upload
                      class="upload-demo"
                      :disabled="activeIndex > statusToNumber(Status.DEALING)"
                      :action="fileActionUrl"
                      :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                      :show-file-list="false"
                      :on-success="(res, file) => handleUploadSuccess(res, file, item, 'voiceFile')"
                      :before-upload="beforeFileUpload"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        :disabled="activeIndex > statusToNumber(Status.DEALING)"
                      >
                        点击上传
                      </el-button>
                    </el-upload>
                    <div v-if="item.voiceFile && item.voiceFile !== ''" class="fileBox">
                      <el-tag
                        v-if="item.voiceFile"
                        class="questfile-download"
                        :closable="activeIndex <= statusToNumber(Status.DEALING)"
                        :title="item.voiceFile"
                        @close="item.voiceFile = ''"
                        @click="downloadFile(item.voiceFile, '附件', 'file')"
                      >
                        {{ item.voiceFile }}
                      </el-tag>
                    </div>
                  </el-form-item>
                </el-form>

                <!-- 物料 -->
                <div
                  v-if="
                    workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN
                  "
                  class="use-sources"
                >
                  <span class="use-sources-left">使用物料</span>
                  <el-button
                    v-if="activeIndex <= statusToNumber(Status.DEALING)"
                    type="primary"
                    class="use-sources-right"
                    size="small"
                    @click="addComponent(item)"
                  >
                    添加
                  </el-button>
                </div>
                <el-table
                  v-if="
                    (workOrder.type === OrderTypes.REPAIRE ||
                      workOrder.type === OrderTypes.MAINTAIN) &&
                      item.componentOptions &&
                      item.componentOptions.length > 0
                  "
                  :data="item.componentOptions"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="orderNumber"
                    width="78"
                    align="center"
                    label="序号"
                  >
                  </el-table-column>
                  <el-table-column label="备件编号" width="160">
                    <template #default="scope">
                      <el-select
                        v-if="!readonly"
                        v-model="scope.row.componentId"
                        placeholder="请选择"
                        filterable
                        clearable
                        style="width: 100%"
                        @change="() => componentChange(scope.row)"
                      >
                        <el-option label="请选择" value=""></el-option>
                        <el-option
                          v-for="(storage, j) in storages"
                          :key="j"
                          :label="storage.code"
                          :value="storage.id"
                        ></el-option>
                      </el-select>
                      <div v-else class="selectText">
                        {{ scope.row.code }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="备件名称">
                    <template #default="scope">
                      <div class="selectText">
                        {{ scope.row.name }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="类别">
                    <template #default="scope">
                      <div class="selectText">
                        {{ scope.row.type }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="型号">
                    <template #default="scope">
                      <div class="selectText">
                        {{ scope.row.specification }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="单位">
                    <template #default="scope">
                      <div class="selectText">
                        {{ scope.row.unit }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="库存">
                    <template #default="scope">
                      <div class="selectText">
                        {{ scope.row.storeNumber }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" width="210">
                    <template #default="scope">
                      <el-input-number
                        v-model="scope.row.number"
                        :min="0"
                        :max="scope.row.storeNumber"
                        controls-position="right"
                        placeholder="请输入"
                      >
                      </el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template #default="scope">
                      <el-button
                        style="border: none"
                        :disabled="readonly"
                        type="text"
                        class="iconfont icon-shanchu1"
                        size="small"
                        :style="{
                          color: '#4195F0'
                        }"
                        @click="removeComponent(item, scope.row)"
                      >
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <template v-else>
                  <div class="no-content">暂无物料信息</div>
                </template>
              </el-card>
            </template>
            <template v-else>
              <div class="no-content">暂无内容</div>
            </template>
          </template>
        </template>

        <!-- 验收确认 -->
        <template v-if="activeIndex >= Status.ACCEPTING">
          <DescriptionHeader>确认验收</DescriptionHeader>
          <el-form
            label-position="top"
            class="flex-form"
            :model="workOrder"
          >
            <el-form-item label="是否解决">
              <el-radio-group v-model="workOrder.isEnd">
                <el-radio
                  v-for="EndOption in isEndOptions"
                  :key="EndOption.value"
                  :disabled="activeIndex > 3"
                  style="margin-bottom: 0"
                  :label="EndOption.value"
                >
                  {{ EndOption.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="activeIndex <= Status.ACCEPTING ? '实际完成时间' : '验收时间'">
              <TextItem v-if="activeIndex <= Status.ACCEPTING">
                {{ formatDate(workOrder.realEndTime) }}
              </TextItem>
              <TextItem v-else class="selectText">
                {{
                  formatDate(workOrder.acceptanceTime)
                }}
              </TextItem>
            </el-form-item>
            <div></div>
            <div></div>
            <el-form-item class="colspan2" label="验收描述">
              <el-input
                v-model="workOrder.acceptanceRemark"
                :disabled="activeIndex > Status.ACCEPTING"
                :rows="4"
                type="textarea"
                placeholder="请输入验收描述"
              />
            </el-form-item>
            <el-form-item label="上传图片">
              <SlUploader
                v-model="workOrder.acceptanceImgs"
                :disabled="activeIndex > statusToNumber(Status.ACCEPTING)"
              />
            </el-form-item>
            <el-form-item label="上传音频">
              <el-upload
                class="upload-demo"
                :disabled="activeIndex > Status.ACCEPTING"
                :action="fileActionUrl"
                :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                :show-file-list="false"
                :on-success="
                  (res, file) => handleUploadSuccess(res, file, null, 'acceptanceVoiceFile')
                "
                :before-upload="beforeFileUpload"
              >
                <el-button
                  size="small"
                  type="primary"
                  :disabled="activeIndex > Status.ACCEPTING"
                >
                  点击上传
                </el-button>
              </el-upload>
              <div
                v-if="workOrder.acceptanceVoiceFile && workOrder.acceptanceVoiceFile !== ''"
                class="fileBox"
              >
                <el-tag
                  v-if="workOrder.acceptanceVoiceFile"
                  class="questfile-download"
                  :title="workOrder.acceptanceVoiceFile"
                  :closable="activeIndex < statusToNumber(Status.ACCEPTED)"
                  @close="workOrder.acceptanceVoiceFile = ''"
                  @click="downloadFile(workOrder.acceptanceVoiceFile, '附件', 'file')"
                >
                  {{ workOrder.acceptanceVoiceFile }}
                </el-tag>
              </div>
            </el-form-item>
          </el-form>
        </template>
        <div v-if="workOrder.status > Status.ACCEPTED" class="devider"></div>
        <div class="form-footer">
          <el-button
            v-if="workOrder.status === Status.DISCOMFIRMED"
            size="small"
            type="danger"
          >
            已拒单
          </el-button>
          <el-button
            v-if="workOrder.status === Status.TIMEOUTED"
            size="small"
            type="danger"
          >
            已超时
          </el-button>
          <el-button
            v-if="workOrder.status === Status.COMFIRMING"
            size="small"
            type="danger"
            @click="handleConfirm(false)"
          >
            退 单
          </el-button>
          <el-button
            v-if="workOrder.status === Status.COMFIRMING"
            size="small"
            type="primary"
            @click="handleConfirm(true)"
          >
            确认接单
          </el-button>

          <el-button
            v-if="workOrder.status === Status.DEALING"
            size="small"
            type="primary"
            @click="submitOrder"
          >
            提交验证
          </el-button>
          <el-button
            v-if="workOrder.status === Status.ACCEPTING"
            size="small"
            type="danger"
            @click="handleAccess(false)"
          >
            驳 回
          </el-button>
          <el-button
            v-if="workOrder.status === Status.ACCEPTING"
            size="small"
            type="primary"
            @click="handleAccess(true)"
          >
            验 收
          </el-button>
        </div>
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts">
import DescriptionHeader from '@/components/SLDescriptionHeader/index.vue'
import TextItem from '@/components/SLTextItem/index.vue'
import OrderDetailBase from './orderDetailBase.vue'
import SlUploader from '@/components/SLUploader/index.vue'
import SLSteps from '@/components/SLSteps/index.vue'
import { reactive, toRefs, ref, computed, defineComponent, onMounted } from 'vue'
import { IElForm } from '@/common/types/element-plus'
import { ExtraQueryParam } from '@/common/types/common'
import { getAllStorages } from '@/api/component'
import { useStore } from 'vuex'
import { downloadFile } from '@/utils/helper'
import {
  IWorkOrder,
  IWorkOrderAcceptanceParams,
  IWorkOrderComfirmParams,
  IWorkOrderConotentDetail,
  IWorkOrderDetail,
  IWorkOrderJobList
} from '@/common/types/workorder'
import {
  devStatusOptions,
  formatDate,
  formateDevStatus,
  formateRowIsOutsider,
  formateRowOrderType,
  formateRowPriority,
  formateRowStatus,
  formateStatus,
  statusToNumber,
  isEndOptions,
  Status,
  OrderTypes,
  formateSteps
} from '../index'
import { acceptanceOrder, confirmOrder, follow, orderDetail, processOrder } from '@/api/workorder'
import {
  ISaveOptionDetail,
  ITableItem as IComponentTableItem
} from '@/common/types/component/storage'
import { useRoute, useRouter } from 'vue-router'
import { SLStepsConfig } from '@/components/SLSteps/type'
import { SLConfirm, SLMessage } from '@/utils/global'
export default defineComponent({
  components: { DescriptionHeader, TextItem, OrderDetailBase, SlUploader, SLSteps },
  emits: ['refreshData'],
  setup (props, ctx) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const title = route.query.title || '工单详情'
    // 定义状态
    const state = reactive<{
      workOrder: IWorkOrderDetail
      storages: IComponentTableItem[]
      imgActionUrl: string
      fileActionUrl: string
    }>({
      workOrder: {
        contentDetail: {
          id: ''
        }
      },
      storages: [],
      imgActionUrl: store.state.app.actionUrl + '/file/api/upload/image',
      fileActionUrl: store.state.app.actionUrl + '/file/api/upload/file'
    })
    const activeIndex = computed(() => statusToNumber(state.workOrder.status))
    const slStepsConfig = reactive<SLStepsConfig>({
      steps: formateSteps()
    })

    /**
     * 获取任务详情
     */
    const getOrderDetail = async () => {
      if (!route.query.id) {
        SLMessage.error('获取详情失败')
        return
      }
      const res = await orderDetail(route.query.id.toString())
      if (!res) {
        SLMessage.error('获取任务详情失败')
        return
      }
      console.log(res.data)
      state.workOrder = res.data
      state.workOrder.contentDetail = res.data.contentDetail as IWorkOrderConotentDetail
    }

    const ruleForm = ref<IElForm>()
    const handleConfirm = (confirm: boolean) => {
      const mes = confirm ? '确认接单？' : '确定退单？'
      SLConfirm(mes, '确认提示')
        .then(async () => {
          const Params: IWorkOrderComfirmParams = {
            id: state.workOrder.id || '',
            confirm
          }
          const res = await confirmOrder(Params)
          if (res.data.code === 200) {
            state.workOrder.status = Params.confirm ? Status.DEALING : Status.DISCOMFIRMED
            Params.confirm === false && SLMessage.success('退单成功！')
            Params.confirm === false && routerBack()
          } else {
            SLMessage.error(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
          //
        })
    }
    const routerBack = () => {
      router.go(-1)
    }
    const submitOrder = () => {
      SLConfirm('确定提交验证？', '确认提示')
        .then(async () => {
          if (state.workOrder.type !== OrderTypes.OTHER) {
            state.workOrder.contentDetail && (state.workOrder.contentDetail.jobList = state.workOrder.contentDetail.jobList || [])
            state.workOrder.contentDetail?.jobList?.map(item => {
              if (!item.componentOptions) { item.componentOptions = [] }
            })
            // state.workOrder.contentDetail
            //   ? state.workOrder.contentDetail.jobList
            //     ? state.workOrder.contentDetail.jobList.map(item => {
            //       if (!item.componentOptions) {
            //         item.componentOptions = []
            //       }
            //     })
            //     : (state.workOrder.contentDetail.jobList = [])
            //   : null
          }
          const res = await processOrder(state.workOrder as IWorkOrder)
          if (res.data.code === 200) {
            state.workOrder.status = Status.ACCEPTING
            SLMessage.success('提交成功！')
            ctx.emit('refreshData')
          } else {
            SLMessage.error(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
    /**
     * 处理验收/驳回
     */
    const handleAccess = async (acceptance: boolean) => {
      const msg = acceptance ? '确定验收？' : '确定驳回？'
      SLConfirm(msg, '确认提示')
        .then(async () => {
          // 驳回的话要清空验收内容
          if (acceptance === false) {
            state.workOrder.isEnd = undefined
            state.workOrder.acceptanceRemark = ''
            state.workOrder.acceptanceVoiceFile = ''
            state.workOrder.acceptanceImgs = ''
          }
          const Params: IWorkOrderAcceptanceParams = {
            id: state.workOrder.id || '',
            acceptance: acceptance,
            realEndTime: state.workOrder.realEndTime as Date | undefined,
            isEnd: state.workOrder.isEnd,
            acceptanceRemark: state.workOrder.acceptanceRemark,
            acceptanceImgs: state.workOrder.acceptanceImgs,
            acceptanceVoiceFile: state.workOrder.acceptanceVoiceFile
          }
          const res = await acceptanceOrder(Params)
          if (res.data.code === 200) {
            state.workOrder.status = Params.acceptance ? Status.ACCEPTED : Status.DEALING
            // routerBack()
          } else {
            SLMessage.error(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

    const componentChange = (row: ISaveOptionDetail) => {
      const item = state.storages.find(item => item.id === row.componentId)
      if (item) {
        row.name = item.name
        row.specification = item.specification
        row.type = item.type
        row.storeNumber = item.number
        row.unit = item.unit
      } else {
        row.name = ''
        row.specification = ''
        row.type = ''
        row.storeNumber = 0
        row.unit = ''
      }
    }

    const GetAllStorages = async () => {
      const params = {
        name: '',
        code: ''
      } as ExtraQueryParam
      const res = await getAllStorages(params)
      state.storages = res.data
    }
    const addComponent = (joblistItem: IWorkOrderJobList) => {
      if (!joblistItem.componentOptions) joblistItem.componentOptions = []
      joblistItem.componentOptions.push({
        orderNumber: joblistItem.componentOptions.length + 1,
        componentId: '',
        number: 0
      } as ISaveOptionDetail)
    }
    const removeComponent = (joblistItem: IWorkOrderJobList, step: ISaveOptionDetail) => {
      SLConfirm('确定要删除吗?', '删除提示').then(() => {
        joblistItem.componentOptions && joblistItem.componentOptions.splice(step.orderNumber - 1, 1)
        joblistItem.componentOptions &&
          joblistItem.componentOptions.forEach(item => {
            if (item.orderNumber > step.orderNumber) {
              item.orderNumber--
            }
          })
      })
    }
    const beforeAvatarUpload = (file: any) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        SLMessage.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        SLMessage.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
    // 图片上传成功，保存图片url
    const handleUploadSuccess = (
      res: string,
      file: any,
      item?: IWorkOrderJobList,
      key?: string
    ) => {
      if (key === 'voiceFile') item && (item.voiceFile = res)
      if (key === 'acceptanceVoiceFile') state.workOrder.acceptanceVoiceFile = res
      if (key === 'processVoiceFile') state.workOrder.processVoiceFile = res
      // dataForm重新赋值 刷新图片
      // state.dataForm = { ...state.dataForm }
    }
    // 暂存文件名
    const beforeFileUpload = (file: any) => {
      // state.uploadFileName = file.name
      console.log(file)
      return true
    }
    const followOrder = async () => {
      if (!state.workOrder.id) {
        SLMessage.warning('参数错误！')
        return
      }
      const res = await follow(state.workOrder.id)
      if (res.status === 200) {
        state.workOrder.follow = res.data.result
        SLMessage.success(res.data.result ? '关注成功！' : '已取消关注！')
      } else {
        SLMessage.error('关注失败，请稍候再试！')
        ctx.emit('refreshData')
      }
    }
    const handleImgChange = (imgs: string | undefined) => {
      state.workOrder.processImgs = imgs
    }
    onMounted(() => {
      GetAllStorages()
      getOrderDetail()
    })
    return {
      ...toRefs(state),
      statusToNumber,
      ruleForm,
      activeIndex,
      devStatusOptions,
      isEndOptions,
      Status,
      OrderTypes,
      title,
      slStepsConfig,
      formateStatus,
      handleConfirm,
      submitOrder,
      handleAccess,
      componentChange,
      addComponent,
      removeComponent,
      beforeAvatarUpload,
      handleUploadSuccess,
      beforeFileUpload,
      formatDate,
      formateRowPriority,
      formateRowOrderType,
      formateRowStatus,
      formateRowIsOutsider,
      formateDevStatus,
      followOrder,
      routerBack,
      downloadFile,
      handleImgChange
    }
  }
})
</script>

<style lang="scss" scoped>
.order-card {
  width: 100%;
  height: 100%;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.5);
}
.el-card {
  border-radius: 0;
  &.deal-card {
    .el-card__header {
      background-color: #282b40;
    }
    .el-card__body {
      background-color: #282b40 !important;
    }
  }
}
:deep(.el-card__header) {
  border: none;
}
:deep(.el-card__body) {
  height: calc(100% - 56px);
}
:deep(.el-upload) {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .avatar-uploader-icon {
    border: 1px dashed #adb0c4;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 256px;
    height: 156px;
    line-height: 156px;
    text-align: center;
    &:hover {
      border-color: #3d4050;
      background-color: var(--el-text-color-regular);
    }
  }
}

.avatar {
  width: 256px;
  height: 156px;
  display: block;
}
.searchInput {
  z-index: 1000;
  position: relative;
}
.location-label {
  color: #409eff;
}
.location-input {
  width: 170px;
}
.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.get-location-box {
  width: 100%;
  height: 250px;
}

.fileUpload {
  display: flex;
  .upload-demo {
    margin-right: 16px;
  }
  .fileBox {
    padding: 0 16px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    max-width: 240px;
    height: 40px;
    line-height: 40px;
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
    position: relative;
    > span {
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
.el-descriptions {
  .el-descriptions__header {
    margin-bottom: 0;
    margin-top: 15px;
    height: 32px;
    margin-bottom: 15px;

    .el-descriptions__title {
      width: 100%;
      height: 100%;
      .el-descriptions__title_box {
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #33374d;
        .el-descriptions__title_h4 {
          line-height: 25px;
          position: relative;
          margin: 0 0 0 15px;
          color: #95c3f1;
          font-size: 14px;
          &::before {
            content: ' ';
            position: absolute;
            height: 100%;
            width: 6px;
            background-color: #3d95ec;
            top: 0;
            left: -15px;
          }
        }
      }
    }
  }

  .el-descriptions__body {
    margin-bottom: 15px;
    background-color: #343947;
    .el-descriptions__label.is-bordered-label {
      background-color: #2b303f;
    }
    .el-tag {
      background-color: #59616a;
      border-color: #5d666f;
    }
  }
}
.el-table-title_h4 {
  font-size: 14px;
  height: 40px;
  margin-bottom: 10px;
  color: #ffffff;
  background-color: #2c3258;
  line-height: 20px;
  padding: 10px 10px;
  margin: 15px 0 15px 0;
}
.el-descriptions__title_h5 {
  line-height: 20px;
  font-size: 14px;
  position: relative;
  margin: 0;
  color: #4aa9d8;
}
:deep(.el-table) {
  &.el-table--border,
  &.el-table--group {
    border: none;
    &::after {
      width: 0;
    }
  }
}
.other-order-content {
  display: flex;
  justify-content: center;
  align-content: center;
}
.questfile-download {
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: #59616a;
  border-color: #5d666f;
  -o-text-overflow: ellipsis;
}
.use-sources {
  width: 100%;
  height: 40px;
  background-color: #2c3258;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  margin: 15px 0 10px 0;
  font-size: 14px;
  .use-sources-left {
    line-height: 40px;
    color: #fff;
  }
}
.app-custom .app-wrapper .main-container .app-main .el-button.el-button--mini {
  &.use-sources-right {
    font-size: 14px;
    padding: 0 10px;
    height: 28px;
    margin: 5px;
  }
}

.no-content {
  color: #8c939d;
  padding: 14px;
}
.dialog-title-text {
  line-height: 20px;
}
.app-custom .app-wrapper .main-container .app-main .el-button.el-button--mini {
  &.dialog-title-extra {
    height: 30px;
    float: right;
    margin-top: -25px;
    margin-right: 40px;
    border: 1px solid #4aa9d8;
    color: #4aa9d8;
  }
}
.flex-form {
  display: grid;
  grid-column: 4;
  grid-template-columns: 25% 25% 25% 25%;

  :deep(.el-form-item) {
    .el-form-item__label {
      font-size: 14px;
      line-height: 20px;
      padding: 15px 0 5px 0;
    }
    margin: 0;
    padding: 0 15px 0 0;
    width: 100%;
    &:nth-child(4n) {
      padding-right: 0;
    }
    &.colspan2 {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
}
.devider {
  width: 100%;
  border: none;
  margin: 15px 0;
  border-bottom: 1px solid #33374d;
}
.form-footer {
  text-align: right;
  margin: 15px;
}
.back-btn {
  cursor: pointer;
}
.dialog-title {
  cursor: pointer;
}
.order-content{
  padding-right: 15px;
}
</style>
