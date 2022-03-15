<template>
  <div class="energyBoard-container">
    <iframe
      ref="iframe"
      :src="url"
      scrolling="auto"
      seamless
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
      class="iframe-container"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
export default defineComponent({
  name: 'SysPage',
  setup() {
    const url = ref<string>('https://www.baidu.com/')

    const route = useRoute()
    const initPath = () => {
      const path = route.path.split('/extendPage/sysPage/')
      console.log(path, path[path.length - 1], '---------p')
      const tPath = path[path.length - 1]
      url.value = decodeURIComponent(atob(tPath))
      console.log(url.value, '解出的链接')
    }
    onBeforeRouteUpdate((to, from) => {
      console.log(to, from)
    })
    onMounted(() => {
      initPath()
    })
    watch(
      () => route.params,
      () => {
        initPath()
      }
    )
    return {
      url
    }
  }
})
// data() {
//   return {
//     url: 'https://www.baidu.com/' // 'http://datav.aliyuncs.com/share/3e9a2c66e41c6de1fce348517070dd93'
//   }
// },
// created() {
//   const path = this.$route.path.split('/extendPage/sysPage/')
//   console.log(path, path[path.length - 1], '---------p')
//   const tPath = path[path.length - 1]
//   this.url = decodeURIComponent(atob(tPath))
//   console.log(this.url, '解出的链接')
// }
// }
</script>

<style lang="scss" scoped>
.energyBoard-container {
  width: 100%;
  height: 100%;
  // padding: 20px;
}
</style>
