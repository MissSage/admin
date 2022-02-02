<template>
  <div
    class="lgs-popver"
    ref="refLgsPopover"
  >
    <slot>
      {{ content }}
    </slot>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onBeforeMount, onMounted, onUnmounted, PropType, reactive, ref, toRefs } from 'vue'
import helper from '../utils/helper'

export default defineComponent({
  name: 'Popver',
  props: {
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String as PropType<'l'|'r'|'t'|'b'|'c'>,
      default: 't'
    },
    follow: {
      type: [String, Array],
      default: ''
    },
    autoFit: {
      type: Boolean,
      default: true
    },
    teleport: {
      type: String,
      default: 'body'
    }
  },
  emits: ['close'],
  setup (props, ctx) {
    const refLgsPopover = ref<HTMLElement>()
    // codes here
    const close = (event:MouseEvent) => {
      if (event.target !== refLgsPopover.value) {
        ctx.emit('close')
      }
    }

    onMounted(() => {
      document.addEventListener('click', close)
    })
    onUnmounted(() => {
      document.removeEventListener('click', close)
    })
    return {
      refLgsPopover
    }
  }
})
</script>

<style lang='scss' scoped>
.lgs-popver{
  width: 100%;
  height: 100%;
}
</style>
