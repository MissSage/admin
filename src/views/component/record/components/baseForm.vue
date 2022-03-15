<template>
  <el-form ref="ruleForm" :rules="rules" label-width="150px" :model="dataForm" class="baseForm">
    <el-form-item label="单号" prop="code">
      <el-input v-model="dataForm.code" :disabled="isReadonly"> </el-input>
    </el-form-item>
    <div class="flexFromItem">
      <el-form-item label="操作人员：" prop="username">
        <el-input v-model="dataForm.username" :disabled="isReadonly">
        </el-input>
      </el-form-item>
      <el-form-item label="操作时间：" prop="time">
        <el-date-picker
          v-model="dataForm.time"
          :disabled="isReadonly"
          style="width: 100%"
          type="datetime"
        >
        </el-date-picker>
      </el-form-item>
    </div>
    <el-form-item label="说明" prop="remark">
      <el-input v-model="dataForm.remark" :disabled="isReadonly"> </el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { IElForm } from '@/common/types/element-plus'
import { ref, defineComponent, PropType, watch } from 'vue'
import { ITableDetail, ItableDetailItem } from '@/common/types/component/record'
export default defineComponent({
  props: {
    isReadonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object as PropType<ITableDetail>,
      default:() => {
        return {
          // do sth
        }
      }
    }
  },
  setup(props, ctx) {
    const rules = {
      username: [{ required: true, message: '请输入操作人', trigger: 'blur' }],
      time: [{ required: true, message: '请选择日期', trigger: 'change' }]
    }
    const dataForm = ref<ITableDetail>({
      id: '',
      type: '',
      code: '',
      username: '',
      time: '',
      remark: '',
      createTime: '',
      creator: '',
      tenantId: '',
      nameList: '',
      details: [] as ItableDetailItem[]
    })
    const ruleForm = ref<IElForm>()

    watch(
      () => props.defaultValue,
      newValue => {
        dataForm.value.type = newValue.type
        dataForm.value.username = newValue.username
        dataForm.value.time = new Date(newValue.time).toString()
        dataForm.value.remark = newValue.remark
        dataForm.value.details = newValue.details
        dataForm.value.code=newValue.code
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
// .patrolDialog {
//   .el-dialog__body {
//     padding: 0 !important;
//   }
//   .el-input__inner {
//     height: 40px !important;
//   }
//   .el-form-item {
//     margin-bottom: 20px;
//   }
//   .el-form-item__label {
//     line-height: 40px;
//     font-size: 16px;
//   }
// }
</style>

<style lang="scss" scoped>
.flexFromItem {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>
