<template>
  <el-form ref="ruleForm" :rules="rules" label-width="150px" :model="dataForm">
    <SLFlexGroup>
      <el-form-item label="操作人员" prop="username" class="ls-flex-item--2">
        <el-input v-model="dataForm.username" placeholder="请输入" :disabled="isReadonly">
        </el-input>
      </el-form-item>
      <el-form-item label="操作时间" prop="time" class="ls-flex-item--2">
        <el-date-picker
          v-model="dataForm.time"
          :disabled="isReadonly"
          style="width: 100%"
          type="datetime"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="说明" prop="remark" class="ls-flex-item--1">
        <el-input v-model="dataForm.remark" placeholder="请输入" :disabled="isReadonly"> </el-input>
      </el-form-item>
    </SLFlexGroup>
  </el-form>
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import { IElForm } from '@/common/types/element-plus'
import { ref, defineComponent, PropType, watch } from 'vue'
import { ISaveOption, ISaveOptionDetail } from '@/common/types/component/storage'
export default defineComponent({
  components: { SLFlexGroup },
  props: {
    areaTree: {
      type: Array as PropType<NormalOption[]>,
      default: () => {
        return []
      }
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object as PropType<ISaveOption>,
      default() {
        return {
          // do sth
        }
      }
    }
  },
  setup(props: any, ctx) {
    const rules = {
      username: [{ required: true, message: '请输入操作人', trigger: 'blur' }],
      time: [{ required: true, message: '请选择日期', trigger: 'change' }]
    }
    const dataForm = ref<ISaveOption>({
      type: '',
      username: '',
      time: null,
      remark: '',
      details: [
        {
          componentId: '',
          orderNumber: 0,
          number: 0
        }
      ] as ISaveOptionDetail[]
    })
    const ruleForm = ref<IElForm>()

    watch(
      () => props.defaultValue,
      newValue => {
        dataForm.value.type = newValue.type
        dataForm.value.username = newValue.username
        dataForm.value.time = newValue.time
        dataForm.value.remark = newValue.remark
        dataForm.value.details = newValue.details
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
      rules,
      dataForm,
      ruleForm,
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
