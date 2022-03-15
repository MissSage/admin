<template>
  <SLDialog
    v-if="config.dialogConfig.visible"
    :config="config.dialogConfig"
    @height-change-complete="$emit('heightChangeComplete')"
    @close="$emit('close')"
  >
    <div class="form-container">
      <SLForm
        v-if="config.showForm"
        ref="refSLForm"
        :config="config.formConfig"
      ></SLForm>
      <slot></slot>
    </div>
    <template #footer><slot name="footer"></slot></template>
  </SLDialog>
</template>

<script lang="ts">
import SLForm from '../SLForm/index.vue'
import SLDialog from '@/components/SLDialog/index.vue'
import { defineComponent, PropType, ref, watch } from 'vue'
import { ISLDialogFormConfig } from './type'
export default defineComponent({
  components: { SLDialog, SLForm },
  props: {
    config: {
      type: Object as PropType<ISLDialogFormConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['close', 'heightChangeComplete'],
  setup (props) {
    const refSLForm = ref<InstanceType<typeof SLForm>>()
    const visible = ref<boolean>(false)
    watch(
      () => props.config.dialogConfig.visible,
      (newVal: any) => {
        visible.value = newVal
      }
    )
    return {
      refSLForm
    }
  }
})
</script>

<style lang="scss">
.addDialog {
  .el-dialog__body {
    padding: 0 !important;
  }
  .iconfont::before {
    margin-right: 5px;
  }
}
</style>
>

<style lang="scss" scoped>
.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.flexFromItem {
  display: flex;
  justify-content: space-between;
}
.baseForm {
  border-bottom: 1px solid #444040;
  padding: 16px 32px;
}
.tableContainer {
  margin-top: 15px;
  .stepTable {
    margin-top: 16px;
  }
  .workContentInput {
    height: 40px;
    line-height: 40px;
    border: none;
    outline: none;
    width: 100%;
  }
}
.form-container{
  height: 100%;
}
</style>
