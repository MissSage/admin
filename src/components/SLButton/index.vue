<template>
  <el-button
    v-if="config.perm && (typeof config.perm === 'boolean' ? config.perm : config.perm(row))"
    :loading="
      config.loading && (typeof config.loading === 'boolean' ? config.loading : config.loading(row))
    "
    :style="{
      color:
        (config.color && (typeof config.color === 'string' ? config.color : config.color(row))) ||
        '#ffffff'
    }"
    :type="
      config.type &&(typeof config.type === 'string' ? config.type as any : config.type(row)) || 'primary'
    "
    :disabled="
      config.disabled &&
        (typeof config.disabled === 'boolean' ? config.disabled : config.disabled(row))
    "
    @click="config.click && config.click(row)"
  >
    <el-icon v-if="config.icon" :class="config.icon"></el-icon>
    {{ config.text && (typeof config.text === 'string' ? config.text : config.text(row)) }}
  </el-button>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ISLOperation } from '../SLCardSearch/type'

export default defineComponent({
  name: 'SLButton',
  props: {
    row: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => {
        //
      }
    },
    config: {
      type: Object as PropType<ISLOperation>,
      default: () => {
        //
      }
    }
  },
  setup () {
    return {}
  }
})
</script>
<style scoped lang="scss">

</style>
