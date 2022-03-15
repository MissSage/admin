<template>
  <iframe
    ref="iframe"
    frameborder="0"
    scrolling="auto"
    :src="url"
    width="100%"
    height="100%"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const url = ref<string>('')
    onMounted(()=>{
      // url.value='http://112.54.93.58:8093/webroot/decision/link/i8KE'
      // url.value='http://112.54.93.58:8093/webroot/decision/link/l8BX'
      url.value='http://112.54.93.58:8087/webroot/decision/link/i8KE'
    })
    return {
      url
    }
  }
})
</script>

<style lang="scss" scoped></style>
