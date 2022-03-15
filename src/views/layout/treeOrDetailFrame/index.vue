<template>
  <div class="layout-tree-detail-container">
    <div class="left-project-tree-list" :class="{ 'tree-hidden': treeState }">
      <slot name="tree"></slot>
      <p class="control-fold-btn" @click="changeTreeState">
        <i class="fold-icon" :class="stateClass"></i>
      </p>
    </div>
    <div class="right-detail-box" :class="{ 'fill-width': treeState }">
      <slot name="detailBody"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeBox',
  data() {
    return {
      treeState: false,
      stateClass: 'el-icon-caret-left' // el-icon-s-fold
    }
  },
  methods: {
    changeTreeState() {
      if (!this.treeState) {
        this.stateClass = 'el-icon-caret-right'
      } else {
        this.stateClass = 'el-icon-caret-left'
      }
      this.treeState = !this.treeState
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-tree-detail-container {
  height: 100%;
  width: 100%;
  display: flex;
  .left-project-tree-list {
    width: 300px;
    // width: 260px;
    height: 100%;
    // overflow-y: auto;
    border-radius: 5px;
    position: relative;
    // margin-right: 20px;
    box-shadow: 0 0 5px #a3bddbb2;
    transition: margin-left ease .5s;
    &:hover {
      box-shadow: 0 0 5px #a3bddb;
    }
    .control-fold-btn {
      position: absolute;
      right: -15px;
      top: 42%;
      z-index: 50;
      margin: 0 0;
      width: 14px;
      height: 100px;
      cursor: pointer;
      padding: 40px 0;
      color: #888888;
      vertical-align: middle;
      // border: 1px solid #13679A;
      border-left: none;
      background: #ffffff;
      border-radius: 0px 50px 50px 0px;
      .fold-icon {
        font-size: 16px;
        margin-left: -1px;
      }
    }
  }
  .tree-hidden {
    margin-left: -300px;
    // margin-left: -260px;
  }
  .right-detail-box {
    // width: calc(100% - 320px);
    width: calc(100% - 300px);
    height: 100%;
    // margin-left: 20px;
    transition: width ease .5s;
    padding: 0px 0px 0px 0px;
  }
  .fill-width {
    width: 100%;
    // width: calc(100% - 20px);
  }
}
</style>
