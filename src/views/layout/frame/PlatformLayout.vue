<template>
  <div class="platform-app-wrapper">
    <section class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </section>
  </div>
</template>

<script>
import { useResize } from '@/hooks/resizeSetup'

export default {
  name: 'PlatformLayout',
  setup() {
    useResize()
  }
}
</script>

<style lang="scss" scoped>
.platform-app-wrapper {
  height: 100%;
  width: 100%;
}
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 60px);
  position: relative;
  overflow: hidden;
}
</style>
