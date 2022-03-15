<template>
  <el-form ref="ruleForm" :rules="rules" label-width="150px" :model="dataForm" class="baseForm">
    <el-form-item label="计划名称：" prop="name">
      <el-input v-model="dataForm.name" :disabled="isReadonly" placeholder="请输入"></el-input>
    </el-form-item>
    <div class="flexFromItem">
      <el-form-item v-if="formType == YUFANGXINGJIHUA" label="循环周期：" prop="periodTime">
        <el-input
          v-model="dataForm.periodTime"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入"
          :disabled="isReadonly"
          on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
        >
          <template #suffix>
            <i style="font-style: normal; margin-right: 10px">天</i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="formType == YUFANGXINGJIHUA || formType == GUDINGRIQIJIHUA"
        label="下次维修时间："
        prop="executeTime"
      >
        <el-date-picker
          v-model="dataForm.executeTime"
          :disabled="isReadonly"
          style="width: 100%"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        v-if="formType == CHUFAXINGJIHUA && dataForm.trigger"
        label="选择项目："
        prop="trigger.projectId"
      >
        <el-cascader
          v-model="dataForm.trigger.projectId"
          style="width: 100%"
          filterable
          :disabled="isReadonly"
          :options="areaTree"
          :props="cascaderProps"
          @change="ids => projectIdChange(ids)"
        ></el-cascader>
      </el-form-item>

      <el-form-item
        v-if="formType == CHUFAXINGJIHUA && dataForm.trigger"
        label="选择设备："
        prop="trigger.deviceId"
      >
        <el-cascader
          v-if="!isReadonly"
          v-model="dataForm.trigger.deviceId"
          style="width: 100%"
          filterable
          :options="DeviceTree"
          @change="deviceChange"
        ></el-cascader>
        <el-input v-else v-model="dataForm.trigger.deviceName" :disabled="isReadonly"></el-input>
      </el-form-item>
      <el-form-item
        v-if="formType == CHUFAXINGJIHUA && dataForm.trigger"
        label="选择标准："
        prop="trigger.standardId"
      >
        <el-select
          v-if="!isReadonly"
          v-model="dataForm.trigger.standardId"
          placeholder="请选择"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="(item, i) in standards"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input v-else v-model="dataForm.trigger.standardName" :disabled="isReadonly"></el-input>
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
import { IPlan, IPlanJob, IPlanTrigger, IPlanTriggerListItem } from '@/common/types/repair/plan'
import { ref, defineComponent, PropType, watch, reactive, toRefs } from 'vue'
import { GUDINGRIQIJIHUA, YUFANGXINGJIHUA, CHUFAXINGJIHUA } from '@/common/constans/repair'
import useDevice from '@/hooks/device/useDevice'
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
      type: Object as PropType<IPlan>,
      default: () => {
        return {
          // do sth
        }
      }
    }
  },
  emits: ['setBaseParams', 'deviceChange'],
  setup(props, ctx) {
    const {
      getDeviceTree,
      DeviceTree,
      getDeviceFromTree,
      RepaireStandardTree,
      getRepaireStandardTree
    } = useDevice()
    const state = reactive<{
      cascaderProps: any
      standards: any[]
    }>({
      cascaderProps: {
        checkStrictly: true
      },
      standards: []
    })
    const rules = {
      name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
      executeTime: [{ required: true, message: '请选择下次保养时间', trigger: 'change' }],
      periodTime: [{ required: true, message: '请输入循环周期', trigger: 'blur' }],
      status: [{ required: true, message: '请选择启用状态', trigger: 'blur' }],
      'trigger.projectId': [{ required: true, message: '请选择项目', trigger: 'change' }],
      'trigger.deviceId': [{ required: true, message: '请选择设备', trigger: 'change' }]
    }
    const dataForm = ref<IPlan>({
      id: '',
      name: '',
      type: '',
      executeTime: null,
      periodTime: 0,
      status: '1',
      creator: '',
      createTime: null,
      trigger: {
        id: '',
        mainId: '',
        projectId: '',
        deviceId: '',
        detail: '',
        createTime: null,
        tenantId: '',
        triggerList: [] as IPlanTriggerListItem[]
      } as IPlanTrigger,
      deviceNameList: '',
      jobList: [] as IPlanJob[]
    })
    const ruleForm = ref<IElForm>()
    const projectIdChange = async (ids: string | string[]) => {
      console.log(ids)
      const id = ids instanceof Array ? ids[ids.length - 1] : ids
      getDeviceTree(id)
      getRepaireStandardTree()
    }
    watch(
      () => props.defaultValue,
      newValue => {
        dataForm.value.name = newValue.name
        dataForm.value.executeTime = newValue.executeTime ? new Date(newValue.executeTime) : null
        dataForm.value.periodTime = newValue.periodTime
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
    const deviceChange = async (id: string[]) => {
      if (dataForm.value && dataForm.value.trigger) {
        const device = getDeviceFromTree(id[0], id[1])
        state.standards = []
        state.standards = RepaireStandardTree.value.filter(
          item => item.data.deviceType === id[0]
        )
        ctx.emit('deviceChange', device)
      } else {
        console.log('没有获取到项目信息')
      }
    }
    return {
      ...toRefs(state),
      rules,
      dataForm,
      ruleForm,
      GUDINGRIQIJIHUA,
      YUFANGXINGJIHUA,
      CHUFAXINGJIHUA,
      checkRule,
      DeviceTree,
      getDeviceTree,
      projectIdChange,
      deviceChange,
      getDeviceFromTree,
      RepaireStandardTree,
      getRepaireStandardTree
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
