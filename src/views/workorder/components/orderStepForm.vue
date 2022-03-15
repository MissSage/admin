<template>
  <el-dialog
    v-model="visible"
    :width="config.dialogWidth || '460px'"
    :lock-scroll="false"
    @close="config.close"
  >
    <template #title>
      <span class="dialog-title-text">{{ config.title || '' }}</span>
      <el-button v-if="workOrder.follow" class="dialog-title-extra" type="default" size="mini">
        已关注
      </el-button>
      <el-button v-else class="dialog-title-extra" type="default" size="mini" @click="followOrder">
        <span class="icon iconfont icon-jia"></span>
        关注
      </el-button>
    </template>

    <el-steps
      v-if="
        activeIndex >= statusToNumber(Status.COMFIRMING) &&
        activeIndex <= statusToNumber(Status.ACCEPTED)
      "
      :active="activeIndex"
      align-center
    >
      <el-step :title="formateStatus(Status.COMFIRMING)"></el-step>
      <el-step :title="formateStatus(Status.DEALING)"></el-step>
      <el-step :title="formateStatus(Status.ACCEPTING)"></el-step>
      <el-step :title="formateStatus(Status.ACCEPTED)"></el-step>
    </el-steps>
    <el-form
      ref="ruleForm"
      :label-width="'120px'"
      label-position="top"
      :model="workOrder"
      class="dialogform addOrUpdateDialog"
    >
      <!-- 工单信息 -->
      <el-descriptions direction="vertical" :column="4" border>
        <template #title>
          <div class="el-descriptions__title_box">
            <h4 class="el-descriptions__title_h4">工单信息</h4>
          </div>
        </template>
        <el-descriptions-item label="工单编号">{{ workOrder.code }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ workOrder.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(workOrder.createTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="优先级">{{
          formateRowPriority(workOrder)
        }}</el-descriptions-item>
        <el-descriptions-item label="工单类型">{{
          formateRowOrderType(workOrder)
        }}</el-descriptions-item>
        <el-descriptions-item label="是否外委">{{
          formateRowIsOutsider(workOrder)
        }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ workOrder.executorName }}</el-descriptions-item>
        <el-descriptions-item label="截止时间">{{
          formatDate(workOrder.deadlineTime)
        }}</el-descriptions-item>
      </el-descriptions>

      <h4 class="el-table-title_h4">工单内容</h4>
      <template
        v-if="workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN"
      >
        <el-table
          v-if="workOrder.contentDetail"
          :data="workOrder.contentDetail.jobList"
          style="width: 100%"
        >
          <el-table-column prop="orderNumber" width="78" align="center" label="序号">
          </el-table-column>
          <el-table-column label="项目" width="240">
            <template #default="scope">
              <div class="selectText">{{ scope.row.projectName || scope.row.projectId }}</div>
            </template>
          </el-table-column>
          <el-table-column label="设备" width="240">
            <template #default="scope">
              <div class="selectText">
                {{ scope.row.deviceName || scope.row.deviceId }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="检修项目" width="240">
            <template #default="scope">
              <div class="selectText">
                {{ scope.row.standardName || scope.row.standardId }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200">
            <template #default="scope">
              <div class="selectText">
                {{ scope.row.remark }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <template v-else>
          <span>没有工单内容</span>
        </template>
      </template>
      <template v-else-if="workOrder.type === OrderTypes.OTHER">
        <el-descriptions direction="vertical" :column="2" border>
          <el-descriptions-item label="问题描述">{{
            workOrder.questionRemark
          }}</el-descriptions-item>
          <el-descriptions-item label="问题附件">
            <el-tag v-if="workOrder.questionFile">
              <span
                class="questfile-download"
                @click="downloadResource(workOrder.questionFile, '问题附件', 'file')"
              >
                {{ workOrder.questionFile }}
              </span>
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template v-else>
        <span>没有工单内容</span>
      </template>

      <!-- 处理内容 -->
      <template v-if="activeIndex >= statusToNumber(Status.DEALING)">
        <div class="el-descriptions">
          <div class="el-descriptions__header">
            <div class="el-descriptions__title">
              <div class="el-descriptions__title_box">
                <h4 class="el-descriptions__title_h4">处理内容</h4>
              </div>
            </div>
          </div>
        </div>
        <template v-if="workOrder.type === OrderTypes.OTHER">
          <el-descriptions direction="vertical" :column="2" border>
            <el-descriptions-item label="实际开始时间">
              <el-date-picker
                v-if="activeIndex === statusToNumber(Status.DEALING)"
                v-model="workOrder.realStartTime"
                type="datetime"
                placeholder="请选择时间"
              >
              </el-date-picker>
              <div v-else class="selectText">
                {{ formatDate(workOrder.realStartTime) }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="实际结束时间">
              <el-date-picker
                v-if="activeIndex === statusToNumber(Status.DEALING)"
                v-model="workOrder.realEndTime"
                type="datetime"
                placeholder="请选择时间"
              >
              </el-date-picker>
              <div v-else class="selectText">
                {{ formatDate(workOrder.realEndTime) }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="处理反馈">
              <el-input
                v-model="workOrder.remark"
                :disabled="activeIndex > statusToNumber(Status.DEALING)"
                :rows="7"
                type="textarea"
                placeholder="请输入反馈内容"
              />
            </el-descriptions-item>
            <el-descriptions-item label="上传图片">
              <el-upload
                class="avatar-uploader"
                :disabled="activeIndex > statusToNumber(Status.DEALING)"
                :action="imgActionUrl"
                :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                :show-file-list="false"
                :on-success="(res, file) => handleUploadSuccess(res, file, null, 'processImgs')"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="workOrder.processImgs" :src="workOrder.processImgs" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-descriptions-item>
            <el-descriptions-item label="上传音频">
              <el-upload
                class="upload-demo"
                :disabled="activeIndex > statusToNumber(Status.DEALING)"
                :action="fileActionUrl"
                :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                :show-file-list="false"
                :on-success="
                  (res, file) => handleUploadSuccess(res, file, null, 'processVoiceFile')
                "
                :before-upload="beforeFileUpload"
              >
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="activeIndex > statusToNumber(Status.DEALING)"
                  >点击上传</el-button
                >
              </el-upload>
              <div
                v-if="workOrder.processVoiceFile && workOrder.processVoiceFile !== ''"
                class="fileBox"
              >
                <el-tag
                  v-if="workOrder.processVoiceFile"
                  :closable="activeIndex <= statusToNumber(Status.DEALING)"
                  @close="workOrder.processVoiceFile = ''"
                >
                  <span
                    class="questfile-download"
                    @click="downloadResource(workOrder.processVoiceFile, '附件', 'file')"
                  >
                    {{ workOrder.processVoiceFile }}
                  </span>
                </el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </template>
        <template v-else>
          <template v-if="activeIndex >= statusToNumber(Status.DEALING) && workOrder.contentDetail">
            <el-card v-for="(item, i) in workOrder.contentDetail.jobList" :key="i">
              <el-descriptions direction="vertical" :column="3" border>
                <template
                  v-if="
                    workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN
                  "
                  #title
                >
                  <div class="el-descriptions__title_box_light">
                    <h5 class="el-descriptions__title_h5">
                      {{ item.projectName + ' / ' + item.deviceName }}
                    </h5>
                  </div>
                </template>
                <el-descriptions-item
                  v-if="
                    workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN
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
                  <div v-else class="selectText">
                    {{ formateDevStatus(item.status) }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="实际开始时间">
                  <el-date-picker
                    v-if="activeIndex === statusToNumber(Status.DEALING)"
                    v-model="item.startTime"
                    type="datetime"
                    placeholder="请选择时间"
                  >
                  </el-date-picker>
                  <div v-else class="selectText">
                    {{ formatDate(item.startTime) }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="实际结束时间">
                  <el-date-picker
                    v-if="activeIndex === statusToNumber(Status.DEALING)"
                    v-model="item.endTime"
                    type="datetime"
                    placeholder="请选择时间"
                  >
                  </el-date-picker>
                  <div v-else class="selectText">
                    {{ formatDate(item.endTime) }}
                  </div>
                </el-descriptions-item>
                <el-descriptions-item label="处理反馈" :span="2">
                  <el-input
                    v-model="item.processRemark"
                    :disabled="activeIndex > statusToNumber(Status.DEALING)"
                    :rows="7"
                    type="textarea"
                    placeholder="请输入反馈内容"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="上传图片">
                  <el-upload
                    class="avatar-uploader"
                    :disabled="activeIndex > statusToNumber(Status.DEALING)"
                    :action="imgActionUrl"
                    :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
                    :show-file-list="false"
                    :on-success="(res, file) => handleUploadSuccess(res, file, item, 'imgs')"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="item.imgs" :src="item.imgs" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-descriptions-item>
                <el-descriptions-item label="上传音频">
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
                      size="mini"
                      type="primary"
                      :disabled="activeIndex > statusToNumber(Status.DEALING)"
                      >点击上传</el-button
                    >
                  </el-upload>
                  <div v-if="item.voiceFile && item.voiceFile !== ''" class="fileBox">
                    <el-tag
                      v-if="item.voiceFile"
                      :closable="activeIndex <= statusToNumber(Status.DEALING)"
                      @close="item.voiceFile = ''"
                    >
                      <span
                        class="questfile-download"
                        @click="downloadResource(item.voiceFile, '附件', 'file')"
                      >
                        {{ item.voiceFile }}
                      </span>
                    </el-tag>
                  </div>
                </el-descriptions-item>
              </el-descriptions>
              <!-- 物料 -->
              <div
                v-if="
                  workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN
                "
                class="use-sources"
              >
                <span class="use-sources-left">使用物料</span>
                <span
                  v-if="activeIndex <= statusToNumber(Status.DEALING)"
                  class="use-sources-right"
                  @click="addComponent(item)"
                  >添加</span
                >
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
                <el-table-column prop="orderNumber" width="78" align="center" label="序号">
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
                <el-table-column label="备件名称" min-width="160">
                  <template #default="scope">
                    <div class="selectText">
                      {{ scope.row.name }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="类别" min-width="100">
                  <template #default="scope">
                    <div class="selectText">
                      {{ scope.row.type }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="型号" min-width="100">
                  <template #default="scope">
                    <div class="selectText">
                      {{ scope.row.specification }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单位" min-width="100">
                  <template #default="scope">
                    <div class="selectText">
                      {{ scope.row.unit }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="库存" min-width="80">
                  <template #default="scope">
                    <div class="selectText">
                      {{ scope.row.storeNumber }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="数量" min-width="200">
                  <template #default="scope">
                    <el-input-number
                      v-model="scope.row.number"
                      :min="0"
                      :max="scope.row.storeNumber"
                      placeholder="请输入"
                      class="workContentInput"
                    >
                    </el-input-number>
                    <!-- <div class="selectText">
                  {{ scope.row.number }}
                </div> -->
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
                      >删除</el-button
                    >
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
      <el-descriptions
        v-if="activeIndex >= Status.ACCEPTING"
        direction="vertical"
        :column="2"
        border
      >
        <template #title>
          <div class="el-descriptions__title_box">
            <h4 class="el-descriptions__title_h4">确认验收</h4>
          </div>
        </template>
        <el-descriptions-item label="是否解决">
          <el-radio-group v-model="workOrder.isEnd">
            <el-radio
              v-for="EndOption in isEndOptions"
              :key="EndOption.value"
              :disabled="activeIndex > 3"
              style="margin-bottom: 0"
              :label="EndOption.value"
              >{{ EndOption.label }}</el-radio
            >
          </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item
          :label="activeIndex <= Status.ACCEPTING ? '实际完成时间' : '验收时间'"
        >
          <!-- <el-date-picker
            v-if="activeIndex <= Status.ACCEPTING"
            v-model="workOrder.realEndTime"
            type="datetime"
            placeholder="请选择验收时间"
          >
          </el-date-picker> -->
          <div v-if="activeIndex <= Status.ACCEPTING">
            {{ formatDate(workOrder.realEndTime) }}
          </div>
          <div v-else class="selectText">
            {{ formatDate(workOrder.acceptanceTime) }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="验收描述">
          <el-input
            v-model="workOrder.acceptanceRemark"
            :disabled="activeIndex > Status.ACCEPTING"
            :rows="7"
            type="textarea"
            placeholder="请输入验收描述"
          />
        </el-descriptions-item>
        <el-descriptions-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            :disabled="activeIndex > Status.ACCEPTING"
            :action="imgActionUrl"
            :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
            :show-file-list="false"
            :on-success="(res, file) => handleUploadSuccess(res, file, null, 'acceptanceImgs')"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="workOrder.acceptanceImgs" :src="workOrder.acceptanceImgs" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-descriptions-item>
        <el-descriptions-item label="上传音频">
          <el-upload
            class="upload-demo"
            :disabled="activeIndex > Status.ACCEPTING"
            :action="fileActionUrl"
            :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
            :show-file-list="false"
            :on-success="(res, file) => handleUploadSuccess(res, file, null, 'acceptanceVoiceFile')"
            :before-upload="beforeFileUpload"
          >
            <el-button size="mini" type="primary" :disabled="activeIndex > Status.ACCEPTING"
              >点击上传</el-button
            >
          </el-upload>
          <div
            v-if="workOrder.acceptanceVoiceFile && workOrder.acceptanceVoiceFile !== ''"
            class="fileBox"
          >
            <el-tag
              v-if="workOrder.acceptanceVoiceFile"
              :closable="activeIndex < statusToNumber(Status.ACCEPTED)"
              @close="workOrder.acceptanceVoiceFile = ''"
            >
              <span
                class="questfile-download"
                @click="downloadResource(workOrder.acceptanceVoiceFile, '附件', 'file')"
              >
                {{ workOrder.acceptanceVoiceFile }}
              </span>
            </el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-form>
    <template #footer>
      <el-button
        v-if="workOrder.status === Status.DISCOMFIRMED"
        size="mini"
        type="danger"
        :disabled="true"
        >已拒单</el-button
      >
      <el-button
        v-if="workOrder.status === Status.TIMEOUTED"
        size="mini"
        type="danger"
        :disabled="true"
        >已超时</el-button
      >
      <el-button
        v-if="workOrder.status === Status.COMFIRMING"
        size="mini"
        type="danger"
        @click="handleConfirm(false)"
        >退 单</el-button
      >
      <el-button
        v-if="workOrder.status === Status.COMFIRMING"
        size="mini"
        type="primary"
        @click="handleConfirm(true)"
        >确认接单</el-button
      >

      <el-button
        v-if="workOrder.status === Status.DEALING"
        size="mini"
        type="primary"
        @click="submitOrder"
        >提交验证</el-button
      >
      <el-button
        v-if="workOrder.status === Status.ACCEPTING"
        size="mini"
        type="danger"
        @click="handleAccess(false)"
        >驳 回</el-button
      >
      <el-button
        v-if="workOrder.status === Status.ACCEPTING"
        size="mini"
        type="primary"
        @click="handleAccess(true)"
        >验 收</el-button
      >
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, ref, computed, defineComponent, PropType, onMounted } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { IElForm } from '@/common/types/element-plus'
import { ExtraQueryParam } from '@/common/types/common'
import { getAllStorages } from '@/api/component'
import { useStore } from 'vuex'
import {
  ISetpOrderConfig,
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
  OrderTypes
} from '../index'
import { acceptanceOrder, confirmOrder, follow, orderDetail, processOrder } from '@/api/workorder'
import {
  ISaveOptionDetail,
  ITableItem as IComponentTableItem
} from '@/common/types/component/storage'
export default defineComponent({
  props: {
    config: {
      type: Object as PropType<ISetpOrderConfig>,
      default: () => {
        //
      }
    }
  },
  setup(props, ctx) {
    const store = useStore()
    const activeIndex = computed(() => statusToNumber(state.workOrder.status))
    const visible = computed(() => props.config.visible)
    const { $messageWarning, $messageSuccess, $messageError, $confirm } = useGlobal()

    // 定义状态
    const state = reactive<{
      workOrder: IWorkOrderDetail
      storages: IComponentTableItem[]
      imgActionUrl: string
      fileActionUrl: string
    }>({
      workOrder: {
        ...props.config.order,
        contentDetail: {
          id: ''
        }
      },
      storages: [],
      imgActionUrl: store.state.app.actionUrl + '/file/api/upload/image',
      fileActionUrl: store.state.app.actionUrl + '/file/api/upload/file'
    })
    /**
     * 获取任务详情
     */
    const getOrderDetail = async () => {
      if (!props.config.order || !props.config.order.id) {
        $messageWarning('获取详情失败')
        return
      }
      const res = await orderDetail(props.config.order.id)
      if (!res) {
        $messageError('获取任务详情失败')
        return
      }
      console.log(res.data)
      state.workOrder = res.data
      state.workOrder.contentDetail = res.data.contentDetail as IWorkOrderConotentDetail
    }

    const ruleForm = ref<IElForm>()
    const handleConfirm = (confirm: boolean) => {
      const mes = confirm ? '确认接单？' : '确定退单？'
      $confirm(mes, '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const Params: IWorkOrderComfirmParams = {
            id: state.workOrder.id || '',
            confirm
          }
          const res = await confirmOrder(Params)
          if (res.data.code === 200) {
            state.workOrder.status = Params.confirm ? Status.DEALING : Status.DISCOMFIRMED
            Params.confirm === false && $messageWarning('退单成功！')
            Params.confirm === false && props.config.close && props.config.close()
            ctx.emit('refreshData')
          } else {
            $messageError(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
          //
        })
    }
    const submitOrder = () => {
      $confirm('确定提交验证？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (state.workOrder.type !== OrderTypes.OTHER) {
            state.workOrder.contentDetail.jobList
              ? state.workOrder.contentDetail.jobList.map(item => {
                  if (!item.componentOptions) {
                    item.componentOptions = []
                  }
                })
              : (state.workOrder.contentDetail.jobList = [])
          }
          const res = await processOrder(state.workOrder as IWorkOrder)
          if (res.data.code === 200) {
            state.workOrder.status = Status.ACCEPTING
            $messageSuccess('提交成功！')
            ctx.emit('refreshData')
          } else {
            $messageError(res.data.message)
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
      $confirm(msg, '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
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
            acceptance,
            realEndTime: state.workOrder.realEndTime as (Date|undefined),
            isEnd: state.workOrder.isEnd,
            acceptanceRemark: state.workOrder.acceptanceRemark,
            acceptanceImgs: state.workOrder.acceptanceImgs,
            acceptanceVoiceFile: state.workOrder.acceptanceVoiceFile
          }
          const res = await acceptanceOrder(Params)
          if (res.data.code === 200) {
            state.workOrder.status = Params.acceptance ? Status.ACCEPTED : Status.DEALING
            ctx.emit('refreshData')
            Params.acceptance && props.config.close && props.config.close()
          } else {
            $messageError(res.data.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
    const downloadResource = (url: string, name: string, type: string) => {
      if (type === 'img') return window.open(url)
      const a = document.createElement('a')
      a.setAttribute('href', url) // a.href='文件链接'
      a.setAttribute('target', '_blank') // a.href='文件链接'
      a.setAttribute('download', name) // a.download='文件名'
      a.click()
    }
    const componentChange = (row: ISaveOptionDetail) => {
      const item = state.storages.find(item => item.id == row.componentId)
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
      $confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
        $messageError('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        $messageError('上传图片大小不能超过 2MB!')
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
      console.log(file)
      if (key === 'imgs') item && (item.imgs = res)
      if (key === 'voiceFile') item && (item.voiceFile = res)
      if (key === 'acceptanceImgs') state.workOrder.acceptanceImgs = res
      if (key === 'acceptanceVoiceFile') state.workOrder.acceptanceVoiceFile = res
      if (key === 'processImgs') state.workOrder.processImgs = res
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
        $messageWarning('参数错误！')
        return
      }
      const res = await follow(state.workOrder.id)
      res.status === 200 ? (state.workOrder.follow = true) : ''
      res.status === 200 ? $messageSuccess(res.data.message) : $messageError(res.data.message)
      ctx.emit('refreshData')
    }
    onMounted(() => {
      GetAllStorages()
      getOrderDetail()
    })
    return {
      ...toRefs(state),
      statusToNumber,
      visible,
      ruleForm,
      activeIndex,
      devStatusOptions,
      isEndOptions,
      Status,
      OrderTypes,
      formateStatus,
      handleConfirm,
      submitOrder,
      handleAccess,
      downloadResource,
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
      followOrder
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'src/assets/css/amapSearchStyle.scss';
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
:deep(.el-descriptions),
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
        border-bottom: 1px solid rgb(146, 168, 216);
        .el-descriptions__title_h4 {
          line-height: 24px;
          position: relative;
          margin: 0 0 0 15px;
          color: #95c3f1;
          &::before {
            content: ' ';
            position: absolute;
            height: 100%;
            width: 10px;
            background-color: #3d95ec;
            top: 0;
            left: -15px;
          }
        }
      }
      .el-descriptions__title_box_light {
        width: 100%;
        height: 100%;
        border-bottom: 1px solid rgb(115, 116, 117);
        .el-descriptions__title_h5 {
          line-height: 18px;
          font-size: 13px;
          position: relative;
          margin: 0;
          color: #95c3f1;
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
  margin-bottom: 10px;
  color: #333;
  background-color: #878b8f;
  line-height: 28px;
  padding: 0 15px;
  margin: 15px 0 5px 0;
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
}
.use-sources {
  width: 100%;
  height: 28px;
  margin: 15px 0 5px 0;
  background-color: #6a7177;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  .use-sources-right,
  .use-sources-left {
    line-height: 28px;
  }
  .use-sources-right {
    color: #85b9ec;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      font-size: 15px;
    }
  }
}
.workContentInput {
  height: 48px;
  line-height: 48px;
  border: none;
  outline: none;
  width: 100%;
}
.no-content {
  color: #8c939d;
  padding: 15px;
}
.dialog-title-text {
  line-height: 20px;
}
.app-custom .app-wrapper .main-container .app-main .el-button.el-button--mini {
  &.dialog-title-extra {
    height: 30px;
    float: right;
    margin-top: -8px;
    margin-right: 40px;
    border: 1px solid #545d77;
    color: #a9bcda;
  }
}
</style>
