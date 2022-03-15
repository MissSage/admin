<template>
  <div class="app-wrapper" :class="classObj">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div>
    <sidebar class="sidebar-container" :class="{ collapse: isCollapse }"></sidebar>
    <div class="main-container" :class="{ autowidth: isMoveAlarm }">
      <navbar></navbar>
      <!-- <app-main></app-main> -->
      <section id="app-main" class="app-main">
        <!-- <router-view></router-view> -->
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </section>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar } from './components'
import { useResize } from '@/hooks/resizeSetup'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar
  },
  setup() {
    const { sidebar, device } = useResize()
    return { sidebar, device }
  },
  data() {
    return {
      isMoveAlarm: false
    }
  },
  computed: {
    isCollapse() {
      return !this.sidebar.opened
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.isMoveAlarm =
      this.$route.path === '/moverealTimeAlarm' || this.$route.path === '/movehistoryAlarm'

    const role = this.$store.getters.roles[0]
    let path = '/app'
    if (role === 'SYS_ADMIN') path = '/tenant/sysTenant'
    // if (role === 'SYS_ADMIN') {
    //   this.$router.replace('/tenant/sysTenant')
    // } else if (role === 'TENANT_ADMIN' || role === 'CUSTOMER_USER') {
    //   this.$router.replace('/home/index')
    // }
    const t = this.$router.resolve(path)
    console.log(t, this.$router.currentRoute.value, path, 't, this.$router.currentRoute')
    if (this.$router.currentRoute.value.path === '/') {
      if (t.path !== '/404') {
        this.$router.replace(t.path)
      } else {
        this.$router.replace('/tenant/sysTenant')
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 60px);
  position: relative;
  overflow: hidden;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .main-container {
    min-width: 1245px;
    // flex: 1;
    overflow-x: auto;
  }
  .autowidth {
    min-width: auto;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
