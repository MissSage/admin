<template>
  <div v-if="!item.hidden && item.children && item.children.length" class="menu-wrapper">
    <router-link
      v-if="hasOneShowingChild(item.children) && !onlyOneChild.children && !item.alwaysShow"
      :to="resolvePath(onlyOneChild.path)"
    >
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <!-- <svg-icon v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon"></svg-icon> -->
        <!-- <i v-if="onlyOneChild.meta&&onlyOneChild.meta.icon" :class="onlyOneChild.meta.icon"></i> -->
        <template v-if="onlyOneChild.meta && onlyOneChild.meta.title" #title>
          <span :class="'title-text' + ' ' + onlyOneChild.meta.icon"
            >{{ onlyOneChild.meta.title }}
            <!-- <i style="color:inherit" class="el-icon-arrow-down"></i> -->
          </span>
        </template>
      </el-menu-item>
    </router-link>

    <el-submenu v-else :index="item.name || item.path">
      <template v-if="item.meta && item.meta.title" #title>
        <!-- <svg-icon v-if="item.meta&&item.meta.icon" :class="item.meta.icon"></svg-icon> -->
        <!-- <i style="color:#fff" v-if="item.meta&&item.meta.icon" :class="'iconfont' +' '+ item.meta.icon"></i> -->
        <span :class="'title-text' + ' ' + item.meta.icon"
          >{{ item.meta.title }}
          <!-- <i style="color:inherit" class="el-icon-arrow-down"></i> -->
        </span>
      </template>

      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <sidebar-item
            v-if="child.children && child.children.length > 0"
            :key="child.path"
            :is-nest="true"
            class="nest-menu"
            :item="child"
            :base-path="resolvePath(child.path)"
          ></sidebar-item>
          <router-link v-else :key="child.name" :to="resolvePath(child.path)">
            <el-menu-item :index="resolvePath(child.path)" style="padding-left: 30px">
              <template v-if="child.meta && child.meta.title" #title>
                <span :class="'title-text' + ' ' + item.meta.icon">{{ child.meta.title }}</span>
              </template>
            </el-menu-item>
          </router-link>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'

export default {
  name: 'SidebarItem',
  props: {
    // route配置json
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild(children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    resolvePath(...paths) {
      return path.resolve(this.basePath, ...paths)
    }
  }
}
</script>

<style lang="scss">
.menu-wrapper {
  .title-text.iconfont::before {
    margin-right: 4px !important;
  }
}
</style>
