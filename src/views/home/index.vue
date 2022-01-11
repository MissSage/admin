
<template>
  <div class="datavisual-page">
    <!-- <LgsDraggable :theme="theme">sdfadfasdf</LgsDraggable> -->
    <button @click="openLayer">openlayer</button>
    <button @click="closeFirstLayer">closeFirstLayer</button>
  </div>
</template>
<script lang="ts">
import useGlobal from '@/composables/useGlobal'
import { defineComponent, getCurrentInstance, inject } from 'vue'
import Test from './test1.vue'
export default defineComponent({
  setup () {
    const app = getCurrentInstance()
    const theme = inject('theme')
    const { $layer } = useGlobal(app)
    const layerIds:string[] = []
    const openLayer = () => {
      const id = $layer.open({
        title: {
          component: Test

        },
        modelValue: true,
        theme: theme,
        type: 'message',
        position: 'r',
        teleport: 'body',
        content: Test.template,
        xclose: true,
        onEnd: async () => {
          setTimeout(() => {
            console.log('closed')
          }, 1000)
        }
      })
      layerIds.push(id)
    }
    const closeFirstLayer = () => {
      $layer.close(layerIds.shift(), (id:string) => {
        console.log(id)
      })
    }
    return {
      openLayer,
      closeFirstLayer
    }
  }
})
</script>

<style scoped>
</style>
