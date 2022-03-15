<template>
  <el-dialog
    v-model="scadaDetailVisible"
    width="1600px"
    :title="scadaInfo.title"
    @close="scadaInfo.close"
  >
    <iframe
      ref="iframe"
      style="height: 560px; width: 100%"
      frameborder="0"
      scrolling="auto"
      :src="scadaInfo.url"
    ></iframe>
    <template #footer>
      <el-button size="mini" type="primary" @click="scadaInfo.close">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'

export default defineComponent({
  props: {
    scadaInfo: {
      type: Object as PropType<ChangzhanDialog>,
      default() {
        return {
          visible: false,
          title: '组态详情',
          close: () => {
            // do
          },
          url: ''
        }
      }
    }
  },
  setup(props: any) {
    const scadaDetailVisible = computed(() => props.scadaInfo.visible)
    return { scadaDetailVisible }
  }
})
</script>
