<template>
  <el-form ref="ruleForm" label-width="150px" :model="dataForm" class="baseForm">
    <el-form-item label="任务名称：" prop="name">
      <el-input v-model="dataForm.name" :disabled="isReadonly" placeholder="请输入"></el-input>
    </el-form-item>
    <div class="flexFromItem">
      <el-form-item
        v-if="formType == YUFANGXINGJIHUA || formType == GUDINGRIQIJIHUA"
        label="任务开始时间："
        prop="executeTime"
      >
        <el-date-picker
          v-model="dataForm.executeTime"
          :disabled="isReadonly"
          style="width: 100%"
          type="datetime"
          placeholder=""
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="formType == CHUFAXINGJIHUA&&dataForm.trigger" label="选择项目：" prop="trigger.projectId">
        <el-cascader
          v-model="dataForm.trigger.projectId"
          :disabled="isReadonly"
          style="width: 100%"
          :options="areaTree"
          :multiple="false"
          :show-all-levels="false"
        ></el-cascader>
        <!-- <el-select
          v-model="dataForm.trigger.projectId"
          :disabled="isReadonly"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="请选择" value=""></el-option>
          <el-option label="项目1" value="1"></el-option>
          <el-option label="项目2" value="2"></el-option>
        </el-select> -->
      </el-form-item>

      <el-form-item v-if="formType == CHUFAXINGJIHUA&&dataForm.trigger" label="选择设备：" prop="trigger.deviceId">
        <el-select
          v-model="dataForm.trigger.deviceId"
          :disabled="isReadonly"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="请选择" value=""></el-option>
          <el-option
            v-for="(item, i) in deviceTypes"
            :key="i"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态：" prop="status">
        <el-select
          v-model="dataForm.status"
          :disabled="isReadonly"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import { IElForm } from '@/common/types/element-plus'
import { ref, defineComponent, PropType, watch } from 'vue'
import { GUDINGRIQIJIHUA, YUFANGXINGJIHUA, CHUFAXINGJIHUA } from '@/common/constans/maintenance'
import { ITask, ITaskJobListItem, ITaskTrigger, ITaskTriggerItem } from '@/common/types/maintenance/task'
export default defineComponent({
  props: {
    areaTree: {
      type: Array as PropType<NormalOption[]>,
      default: () => {
        return []
      }
    },
    formType: {
      type: String,
      default: GUDINGRIQIJIHUA
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object as PropType<ITask>,
      default:() => {
        return {
          // do sth
        }
      }
    }
  },
  setup(props, ctx) {
    const dataForm = ref<ITask>({
      id: '',
      name: '',
      type: '',
      status: '',
      executeTime: null,
      completeTime: null,
      acceptanceTime: null,
      endTime: null,
      createTime: null,
      creator: '',
      tenantId: '',
      deviceNameList: '',
      trigger: {
        id: '',
        mainId: '',
        projectId: '',
        deviceId: '',
        detail: '',
        createTime: null,
        tenantId: '',
        triggerList: [] as ITaskTriggerItem[]
      } as ITaskTrigger,
      jobList: [] as ITaskJobListItem[]
    })
    const ruleForm = ref<IElForm>()

    watch(
      () => props.defaultValue,
      newValue => {
        dataForm.value.name = newValue.name
        dataForm.value.executeTime=newValue.executeTime?new Date(newValue.executeTime):null
        dataForm.value.status = newValue.status
        dataForm.value.jobList = newValue.jobList
        newValue.trigger ? (dataForm.value.trigger = newValue.trigger) : ''
      }
    )
    const checkRule = () => {
      ctx.emit('setBaseParams', dataForm.value)
      let validate: boolean | undefined = false
      ruleForm.value?.validate(async valid => {
        validate = valid
      })
      return validate
    }

    return {
      dataForm,
      ruleForm,
      deviceTypes: ref<string[]>(['其他', '管道', '物联网水表', 'PLC', '压力计']),
      GUDINGRIQIJIHUA,
      YUFANGXINGJIHUA,
      CHUFAXINGJIHUA,
      checkRule
    }
  }
})
</script>

<style lang="scss">
.patrolDialog {
  .el-dialog__body {
    padding: 0 !important;
  }
  .el-input__inner {
    height: 40px !important;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item__label {
    line-height: 40px;
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
.flexFromItem {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .userText {
    background-color: #eeeeee;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 12px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
}
</style>
