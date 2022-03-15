<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="dialogVisible"
    width="40%"
    :title="title || ''"
    :lock-scroll="false"
    @close="close"
  > -->
    <el-form
      ref="ruleForm"
      :rules="rules"
      :label-width="'120px'"
      label-position="top"
      :model="dataForm"
      class="dialogform addOrUpdateDialog"
    >
      <el-form-item label="工单标题" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入工单标题"> </el-input>
      </el-form-item>
      <div class="flex-form-item">
        <el-form-item label="工单类型" prop="type">
          <el-select
            v-model="dataForm.type"
            collapse-tags
            placeholder="请选择工单类型"
            style="width: 100%"
            :disabled="disableType"
            @change="(val:any)=>handleTypeChange(val)"
          >
            <el-option
              v-for="option of orderTypeOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item props="priority" label="优先级">
          <el-select
            v-model="dataForm.priority"
            collapse-tags
            placeholder="请选择工单优先级"
            style="width: 100%"
          >
            <el-option
              v-for="option of priorityOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>

      <el-form-item
        v-if="dataForm.type === '1' || dataForm.type === '2'"
        prop="contentId"
        label="维修任务"
      >
        <el-select
          v-model="dataForm.contentId"
          collapse-tags
          filterable
          placeholder="请选择维修任务"
          style="width: 100%"
          :disabled="disableType"
        >
          <el-option
            v-for="option of TaskOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === '0'" prop="questionRemark" label="问题描述">
        <el-input
          v-model="dataForm.questionRemark"
          type="textarea"
          resize="none"
          :rows="4"
          placeholder="请输入问题描述"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === '0'" prop="questionFile" label="上传附件">
        <div class="fileUpload">
          <el-upload
            class="upload-demo"
            :action="fileActionUrl"
            :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
            :show-file-list="false"
            :on-success="(res, file) => handleUploadSuccess(res, file)"
            :before-upload="beforeFileUpload"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
          </el-upload>
          <div v-if="dataForm.questionFile && dataForm.questionFile !== ''" class="fileBox">
            {{ uploadFileName }}<span @click="dataForm.questionFile = ''">×</span>
          </div>
        </div>
      </el-form-item>
      <div class="flex-form-item">
        <el-form-item label="是否外委" prop="isOutsider">
          <el-radio-group v-model="dataForm.isOutsider" @change="(val:any)=>handleIsOutsiderChange(val)">
            <el-radio
              v-for="option in isOutsiderOptions"
              :key="option.value"
              style="margin-bottom: 0"
              :label="option.value"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="executor" label="处理人">
          <el-select
            v-model="dataForm.executor"
            collapse-tags
            placeholder="请选择处理人"
            style="width: 100%"
          >
            <el-option
              v-for="option of ExcutorOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="截止时间" prop="deadlineTime">
        <el-date-picker
          v-model="dataForm.deadlineTime"
          type="datetime"
          class="date-picker-input"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- <template #footer>
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">保 存</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'
import { getMaintTaskTable } from '@/api/maintenance/task'
import { getRepairTaskTable } from '@/api/repair/task'
import { getTenantUsersByPage } from '@/api/user'
import { saveOrder } from '@/api/workorder'
import { QueryListParam } from '@/common/types/common'
import { IElForm } from '@/common/types/element-plus'
import { IWorkOrderSaveParams } from '@/common/types/workorder'
import useGlobal from '@/hooks/global/useGlobal'
import { removeSlash } from '@/utils/removeIdSlash'
import { watch, computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { initInnerUser, isOutsiderOptions, orderTypeOptions, priorityOptions } from '../index'
import { ISLDialogConfig } from '@/components/SLDialog/type'
const { $messageSuccess, $messageError } = useGlobal()
export default defineComponent({
  name: 'AouForm',
  components: { SLDialog },
  props: {
    close: {
      type: Function as PropType<() => void>,
      default: () => {
        //
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    disableType: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增工单'
    },
    taskId: {
      type: String,
      default: ''
    },
    taskType: {
      type: String,
      default: ''
    }
  },
  emits: ['refreshData'],
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.title,
      visible: props.visible,
      scrollbar: true,
      width: '30%',
      cancel: {
        handler: async() => await props.close()
      },
      confirm: {
        show: true,
        text: '保 存',
        handler: () => Promise.resolve(handleSubmit())
      }
    })
    watch(
      () => props.visible,
      () => {
        slDialogConfig.value.visible = props.visible
      },
      {
        deep: true,
        immediate: true
      }
    )
    const store = useStore()
    const state = reactive<{
      dataForm: IWorkOrderSaveParams
      TaskOptions: SelectOption[]
      ExcutorOptions: SelectOption[]
      fileActionUrl: string
      uploadFileName: string
    }>({
      dataForm: {
        type: props.taskType || '1',
        isOutsider: 'false',
        priority: '1',
        name: '',
        questionRemark: '',
        questionFile: '',
        executor: '',
        deadlineTime: '',
        contentId: props.taskId || ''
      },
      TaskOptions: [],
      ExcutorOptions: [],
      fileActionUrl: store.state.app.actionUrl + '/file/api/upload/file',
      uploadFileName: ''
    })
    const ruleForm = ref<IElForm>()
    const dialogVisible = computed(() => props.visible)
    const rules = {
      type: [{ required: true, message: '请选择工单类型', trigger: 'change' }],
      name: [{ required: true, message: '请输入工单标题' }],
      priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
      contentId: [{ required: true, message: '请选择任务', trigger: 'change' }],
      executor: [{ required: true, message: '请选择处理人', trigger: 'change' }],
      deadlineTime: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
    }
    // codes here
    const handleTypeChange = async (val?: string) => {
      // 这里设置任务下拉框内容
      state.dataForm.contentId = ''
      if (!val) {
        val = '1'
      }
      const params: QueryListParam = {
        code: '',
        size: 999,
        page: 1
      }
      // 初始化任务下拉框
      const res =
        val === '1'
          ? await getRepairTaskTable(params)
          : val === '2'
          ? await getMaintTaskTable(params)
          : null
      res
        ? (state.TaskOptions = res.data.data
            .filter(item => !item.code)
            .map(item => {
              const option = {
                label: item.name,
                value: item.id
              }
              return option
            }))
        : (state.TaskOptions = [])
    }
    const handleIsOutsiderChange = async (isOutsider?: string) => {
      state.dataForm.executor = ''
      // 这里设置处理人
      const params = {
        page: 1,
        size: 999,
        authority: 'CUSTOMER_USER',
        title: ''
      }
      if (!isOutsider) {
        isOutsider = 'false'
      }
      const res =
        isOutsider === 'false'
          ? await getTenantUsersByPage(params)
          : isOutsider === 'true'
          ? // 暂时调用同一接口，后端还没确定? await getOrderContact(params)
            await getTenantUsersByPage(params)
          : null
      res ? (state.ExcutorOptions = initInnerUser(res.data.data)) : (state.ExcutorOptions = [])
    }

    // 暂存文件名
    const beforeFileUpload = (file: any) => {
      state.uploadFileName = file.name
      return true
    }
    // 图片上传成功，保存图片url
    const handleUploadSuccess = (res: string,file:any) => {
      state.dataForm.questionFile = res
    }
    const handleClose = () => {
      if (props.close) {
        props.close()
      }
    }
    const handleSubmit = () => {
      console.log('submit')
      ruleForm.value
        ? ruleForm.value.validate(async (valid: any) => {
            if (!valid) {
              return false
            }
            const res = await saveOrder({
              ...state.dataForm,
              executor: removeSlash(state.dataForm.executor)
            })
            if (res.status === 200) {
              $messageSuccess('保存成功')
              ctx.emit('refreshData')
              if (props.close) props.close()
            }
          })
        : $messageError('系统错误')
    }

    onMounted(() => {
      handleTypeChange(props.taskType)
      props.taskId && (state.dataForm.contentId = props.taskId)
      handleIsOutsiderChange()
    })
    return {
      ...toRefs(state),
      dialogVisible,
      rules,
      orderTypeOptions,
      priorityOptions,
      isOutsiderOptions,
      ruleForm,
      slDialogConfig,
      handleTypeChange,
      handleIsOutsiderChange,
      beforeFileUpload,
      handleUploadSuccess,
      handleClose,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'src/assets/css/amapSearchStyle.scss';
.searchInput {
  z-index: 1000;
  position: relative;
}
.location-label {
  color: #9097c0;
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
.flex-form-item {
  display: flex;
  .el-form-item {
    flex: 1;
  }
}
</style>
