<template>
  <el-form ref="ruleForm" :rules="rules" label-width="150px" :model="dataForm" class="baseForm">
    <el-form-item label="标准名称" prop="name">
      <el-input v-model="dataForm.name" :disabled="isReadonly" placeholder="请输入"></el-input>
    </el-form-item>
    <div class="flexFromItem">
      <el-form-item label="要求：" class="formitem" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入" :disabled="isReadonly" />
      </el-form-item>

      <el-form-item label="设备类型：" class="formitem" prop="deviceType">
        <el-select
          v-model="dataForm.deviceType"
          :disabled="isReadonly"
          placeholder="请选择"
          style="width: 100%"
        >
              <el-option
                v-for="(item, i) in DeviceTypes"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
import { IElForm } from '@/common/types/element-plus'
import { IStandard, IStandardDetail } from '@/common/types/repair/standard'
import { ref, defineComponent, PropType, watch, onMounted } from 'vue'
import useDevice from '@/hooks/device/useDevice'
export default defineComponent({
  props: {
    isReadonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object as PropType<IStandard>,
      default() {
        return {
          // do sth
        }
      }
    }
  },
  setup(props: any, ctx) {
    const {DeviceTypes, getDeviceTypeTree} = useDevice()
    const rules = {
      name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
      deviceType: [{ required: true, message: '请选择	设备类型', trigger: 'change' }]
      // remark: [{ required: true, message: '请输入循环周期', trigger: 'blur' }],
    }

    const dataForm = ref<IStandard>({
      id: '',
      name: '',
      deviceType: '',
      remark: '',
      creator: '',
      createTime: '',
      tenantId: '',
      detailList: [] as IStandardDetail[]
    })
    const ruleForm = ref<IElForm | null>(null)
    watch(
      () => props.defaultValue,
      newValue => (dataForm.value = { ...newValue })
    )
    const checkRule = () => {
      ctx.emit('setBaseParams', dataForm.value)
      let validate: boolean | undefined = false
      ruleForm.value?.validate(async valid => {
        validate = valid
      })
      console.log(validate)
      return validate
    }
    onMounted(()=>{
      getDeviceTypeTree()
    })
    return {
      rules,
      dataForm,
      ruleForm,
      DeviceTypes, 
      getDeviceTypeTree,
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
  .formitem {
    flex: 1;
  }
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
