
<template>
  <div class="datavisual-page">
    <!-- <LgsDraggable :theme="theme">sdfadfasdf</LgsDraggable> -->
    <button @click="openLayer">openlayer</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, inject } from 'vue'
import Test from './test1.vue'
export default defineComponent({
  setup () {
    const app = getCurrentInstance()
    const theme = inject('theme')
    const openLayer = () => {
      app && app.appContext.config.globalProperties.$layer.open({
        title: 'test',
        theme: theme,
        options: {
          content: Test

        },
        showClose: true,
        onClose: () => {
          console.log('closed')
        }
      })
    }
    return {
      openLayer
    }
  }
})
</script>

<style scoped>
</style>
