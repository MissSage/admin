<template>
  <div class="container">
    <div class="controlContainer">
      <div v-for="(type, key) in layerTypes" :key="key" class="layerType">
        <span class="title">{{ type.label }}</span>
        <div
          v-for="(item, childKey) in type.children"
          :key="childKey"
          class="layerTypesItem"
          :class="{ checked: item.visible }"
          @click="setLayer(key, childKey, item.visible)"
        >
          <i :class="'iconfont' + ' ' + item.icon"></i>
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="legend">
      <span class="title">图例</span>
      <div v-for="(item, idx) in legend" :key="idx" class="item">
        <div :style="{ 'background-color': item.color }" class="icon"></div>
        <div class="text">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  props: ['layerTypes', 'legend'],
  setup(props, ctx) {
    const setLayer = (typeKey, childKey, visible) => {
      // this.layerTypes[typeKey].children[childKey].visible = !visible
      ctx.emit('setLayer', typeKey, childKey, !visible)
    }

    return {
      setLayer
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 104px;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
  max-height: calc(72% - 48px);
  overflow-y: auto;
}
.title {
  font-size: 14px;
  line-height: 24px;
  color: #808184;
}
.controlContainer {
  padding: 8px;
  background-color: #25262d;
  margin-bottom: 16px;

  .layerTypesItem {
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    width: 100%;
    height: 24px;
    border-radius: 4px;
    margin-bottom: 1px;
    // border: 1px solid #f4f3f3;
    padding: 0 5px;
    color: #808184;
    line-height: 24px;
    font-size: 12px;
    &.checked {
      color: #fff;
      // border-color: #fff;
      background-color: #598dff;
    }
  }
}
.legend {
  width: 104px;
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  opacity: 0.9;
  padding: 8px;
  background-color: #25262d;
  color: #69778a;
  .item {
    display: flex;
    align-items: center;
    height: 24px;
    .icon {
      width: 14px;
      height: 3px;
      border-radius: 2px;
      opacity: 0.8;
      margin-right: 3px;
    }
    .text {
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aeaeae;
      line-height: 17px;
    }
  }
}
</style>
