<template>
  <div :class="flex ? 'ls-flex-box' : 'ls-disflex-box'" :style="flex ? styles : ''">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SLFlexGroup',
  props: {
    direction: {
      type: String as PropType<'row' | 'colum' | 'row-reverse' | 'column-reverse'>,
      default: 'row'
    },
    justifyContent: {
      type: String as PropType<
        'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
      >,
      default: 'flex-start'
    },
    alignContent: {
      type: String as PropType<
        'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch'
      >,
      default: 'flex-start'
    },
    wrap: {
      type: String as PropType<'nowrap' | 'wrap' | 'wrap-reverse'>,
      default: 'wrap'
    },
    flex: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    // codes here
    const styles = computed(() => {
      return `flex-direction:${props.direction};justify-content:${props.justifyContent};align-content:${props.alignContent};flex-wrap:${props.wrap}`
    })
    return {
      styles
    }
  }
})
</script>

<style lang="scss" scoped>
.ls-flex-box {
  display: flex;
}
</style>
