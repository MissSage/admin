<template>
  <div class="wrapper">
    <LgsFormItem v-model="appIndex" :config="config"></LgsFormItem>
    <div class="container">
      <canvas
        ref="canvas"
        width="800"
        height="600"
        style="background: lightgray;"
      ></canvas>
      <div id="overlay">
        <div>
          FPS:
          <span>{{ fps }}</span>
        </div>
        <div>
          Tris:
          <span>{{ tris }}</span>
        </div>
        <div>
          Verts:
          <span>{{ verts }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { Application } from '@/lib/webgl/common/Application'
import { runApplication, EAPPName } from '@/lib/webgl/Main'
import LgsFormItem from '@/components/LgsFormItem/index.vue'
import { ILgsFormItem } from '@/components/LgsFormItem/type'
export default defineComponent({
  name: 'WebGLApp',
  setup () {
    const state = reactive<{
      fps: number
      tris: number
      verts: number
      appIndex:number
      config:ILgsFormItem
    }>({
      fps: 0,
      tris: 0,
      verts: 0,
      appIndex: EAPPName.BASICWEBGL,
      config: {
        label: '请选择应用',
        field: 'appname',
        type: 'select',
        options: [
          { value: EAPPName.ROTATINGCUBE, label: '第3章：RotatingCubeApplication' },
          { value: EAPPName.ASYNCLOAD, label: '第3章：AsyncLoadTestApplication' },
          { value: EAPPName.BASICWEBGL, label: '第4章：BasicWebGLApplication' },
          { value: EAPPName.MESHBUILDER, label: '第7章：MeshBuilderApplication' },
          { value: EAPPName.COORDSYSTEM, label: '第7章：CoordSystemApplication' },
          { value: EAPPName.Q3BSP, label: '第8章：Q3BspApplication' },
          { value: EAPPName.DOOM3PROC, label: '第9章：Doom3Application' },
          { value: EAPPName.DOOM3MD5, label: '第10章：MD5SkinedMeshApplication' }
        ],
        onChange: (val:number) => {
          console.log('app:' + val)

          canvas.value && runApplication(val, canvas.value, frameCallback)
        }
      }
    })
    const canvas = ref<HTMLCanvasElement>()
    function frameCallback (app: Application): void {
      state.fps = parseInt(app.fps.toString())
      state.tris = 0
      state.verts = 0
    }
    onMounted(() => {
      canvas.value &&
      runApplication(state.appIndex, canvas.value, frameCallback)
    })
    return {
      ...toRefs(state),
      canvas
    }
  },
  components: { LgsFormItem }
})

</script>
<style scoped lang='scss'>
.wrapper {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
.container {
  position: relative;
}

#overlay {
  position: absolute;
  /*相对左上角*/
  left: 0px;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-family: monospace;
  padding: 1em;
}

#canvas2d {
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>
