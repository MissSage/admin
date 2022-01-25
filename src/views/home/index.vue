
<template>
  <div class="datavisual-page">
    <!-- <LgsDraggable :theme="theme">sdfadfasdf</LgsDraggable> -->
    <button @click="openLayer">openlayer</button>
    <button @click="closeFirstLayer">closeFirstLayer</button>
    <button @click="closeLastLayer">closeLastLayer</button>
    <button @click="closeAll">closeAll</button>
    <button @click="toggleMinLayer">toggleMinLayer</button>
    <button @click="toggleFullScreen">toggleFullScreen</button>
    <button @click="message">message</button>
    <button @click="toast">toast</button>
  </div>
</template>
<script lang="ts">
import { ILgsLayerConfigs } from '@/plugins/LgsLayer/type'
import useGlobal from '@/composables/useGlobal'
import { defineComponent, inject } from 'vue'
import Test1 from './test1.vue'
export default defineComponent({
  setup () {
    const theme:string = inject('theme') || ''
    const { $layer } = useGlobal()
    const layerIds:string[] = []
    const openLayer = () => {
      const options:Partial<ILgsLayerConfigs&{modelValue:boolean}> = {
        width: '600',
        height: '800',
        position: ['50%', '10%'],
        header: {
          // component: Test1,
          text: '弹窗测试弹窗测试弹窗测试'
        },
        // btns: [
        //   {
        //     text: '提交',
        //     click: () =>
        //   },
        //   {
        //     text: '按钮2',
        //     click: () => Promise.resolve(alert('2'))
        //   }, {
        //     text: '按钮3',
        //     click: () => Promise.resolve(alert('3'))
        //   }
        // ],
        // dragOut: false,
        modelValue: true,
        theme: theme,
        type: 'component',
        content: Test1
      }
      const id = $layer.open(options)
      layerIds.push(id)
    }
    const closeAll = () => $layer.closeAll()
    const closeFirstLayer = () => {
      $layer.close(layerIds.shift())
    }
    const closeLastLayer = () => {
      $layer.close(layerIds.pop())
    }
    const toggleMinLayer = () => {
      layerIds.length > 0 && $layer.toggleMin(layerIds[0])
    }
    const toggleFullScreen = () => {
      layerIds.length > 0 && $layer.toggleFullScreen(layerIds[0])
    }
    const message = () => {
      $layer.message({ message: 'mesage1', icon: 'icon-check' })
    }
    const toast = () => {
      $layer.toast()
    }
    return {
      openLayer,
      closeAll,
      closeFirstLayer,
      closeLastLayer,
      toggleMinLayer,
      toggleFullScreen,
      message,
      toast
    }
  }
})
</script>

<style scoped>
</style>
