
<template>
  <div class="datavisual-page">
    <!-- <LgsDraggable :theme="theme">sdfadfasdf</LgsDraggable> -->
    <button @click="openLayer">openlayer</button>
    <button @click="closeFirstLayer">closeFirstLayer</button>
  </div>
</template>
<script lang="ts">
import { ILgsLayerConfigs } from '@/components/LgsDraggable/type'
import useGlobal from '@/composables/useGlobal'
import { defineComponent, getCurrentInstance, inject } from 'vue'
import Test1 from './test1.vue'
// import Test from './test.vue'
export default defineComponent({
  setup () {
    const app = getCurrentInstance()
    const theme:string = inject('theme') || ''
    const { $layer } = useGlobal(app)
    const layerIds:string[] = []
    const openLayer = () => {
      const options:Partial<ILgsLayerConfigs&{modelValue:boolean}> = {
        title: {
          component: Test1,
          text: '',
          extrabtns: [{
            type: 'primary',
            text: '导出',
            icon: '',
            click: () => Promise.resolve(
              $layer.open({
                content: 'message',
                type: 'message'
              })
            )
          }, {
            type: 'primary',
            text: '导出',
            icon: '',
            click: () => Promise.resolve(
              $layer.open({
                content: 'message',
                type: 'message'
              })
            )
          }, {
            type: 'primary',
            text: '导出',
            icon: '',
            click: () => Promise.resolve(
              $layer.open({
                content: 'message',
                type: 'message'
              })
            )
          }, {
            type: 'primary',
            text: '导出',
            icon: '',
            click: () => Promise.resolve(
              $layer.open({
                content: 'message',
                type: 'message'
              })
            )
          }]
        },
        // dragOut: false,
        modelValue: true,
        theme: theme,
        type: 'component',
        content: Test1
      }
      const id = $layer.open(options)
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
