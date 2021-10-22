<template>
  <div
    class="loading"
    v-show="props.msg.show"
  >
    <div>{{ msg.title }}</div>
  </div>
</template>
<script lang="ts">
import { PropType } from 'vue'

export default {
  name: 'LgsLoading'
}
</script>
<script lang='ts' setup>
const props = defineProps({
  msg: {
    type: Object as PropType<Record<string, boolean>>,
    default: () => {}
  }
})
</script>

<style scoped lang="scss">
.loading {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 6px 15px;
    }
}
</style>
