<template>
  <div>
    <div class="logo-warpper">
      <div v-if="showLogo" class="menu-logo unified-theme-bg-color">
        <img v-if="!isCollapse" :src="imageUrl" alt="" />
      </div>
    </div>
    <el-scrollbar class="side-menu-scrollbar" wrap-class="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        :unique-opened="true"
        text-color="#ffffff"
        background-color="#1D1F2E"
        active-text-color="#6BD2F8"
      >
        <sidebar-item
          v-for="(route, index) in permission_routers"
          :key="index"
          :item="route"
          :base-path="route.path"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getLogo } from '@/api/tenant'

export default {
  components: { SidebarItem },
  data() {
    return {
      showLogo: false,
      imageUrl: this.$store.state.app.logo
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar', 'logo']),
    // logoUrl() {
    //   return this.$store.state.app.logo
    // },
    // bgColor() {
    //   return this.$store.state.app.theme === '252C47' ? '#252C47' : '#304156'
    // },
    isCollapse() {
      // const sidebar =
      return !this.sidebar.opened
    }
  },
  watch: {
    logo: {
      handler: function (newVal) {
        this.imageUrl = newVal
      }
    }
  },
  created() {
    getLogo().then(res => {
      this.$store.dispatch('app/ToggleLogo', res.data)
      this.imageUrl = res.data
      this.showLogo = true
    })
  }
}
</script>

<style lang="scss" scoped>
.logo-warpper {
  position: relative;
  background: #2e303e;
  width: 100%;
  // padding-top: 100%;
  padding-top: 60px;
  .menu-logo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 8px 8px;
    img {
      width: 100%;
      height: 50px;
      // height: 100%;
    }
  }
}
.side-menu-scrollbar {
  &.el-scrollbar {
    height: calc(100% - 60px);
  }
}
</style>
