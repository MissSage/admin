<template>
  <div class="device-control__header" :class="iconClass">
    <span class="device-control__header-title">{{ title }}</span>
    <div v-if="showBtns" class="device-control__header-right">
      <div
        v-for="(item, i) in btns"
        v-show="!item.hide"
        :key="i"
        class="btn-right"
        @click="openDialog(item)"
      >
        <i v-if="item.icon" class="icon iconfont" :class="item.icon"></i> {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ControlInfo, IControlHeaderBtn } from '../..'
export default defineComponent({
  name: 'CardHeader',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    iconClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    showBtns: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object as PropType<ControlInfo>,
      default: () => {
        //
      }
    }
  },
  emits: ['openDialog'],
  setup(props, ctx) {
    const btns: IControlHeaderBtn[] = [
      {
        text: '远程控制',
        icon: 'icon-buzhou',
        type: 'yckz',
        hide: !props.config?.control
      },
      {
        text: '历史数据',
        icon: 'icon-baobiaoguanli',
        type: 'lssj'
      },
      {
        text: '报警记录',
        icon: 'icon-baojingguanli',
        type: 'bjjl'
      }
    ]
    const openDialog = (item: IControlHeaderBtn) => {
      ctx.emit('openDialog', props.title, item.type)
    }
    return {
      openDialog,
      btns
    }
  }
})
</script>

<style lang="scss" scoped>
.device-control__header {
  color: #ffffff;
  position: relative;
  margin-left: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
  .device-control__header-title {
    flex: 1;
    line-height: 20px;
  }
  .device-control__header-right {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    .btn-right {
      cursor: pointer;
      color: #358fa7;
      height: 20px;
      line-height: 15px;
      font-size: 12px;
      border-radius: 10px;
      border: 1px solid #358fa7;
      padding: 2px 10px 3px 10px;
      text-align: center;
      margin: 0 5px;
    }
  }
  &::before {
    content: ' ';
    position: absolute;
    left: -25px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  &.on {
    &::before {
      background-color: rgb(77, 108, 171);
    }
  }
  &.off {
    &::before {
      background-color: red;
    }
  }
  &.warning {
    &::before {
      background-color: red;
    }
  }
  &.normal {
    &::before {
      background-color: lightgreen;
    }
  }
}
</style>
