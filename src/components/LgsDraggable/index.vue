<template>
  <transition
    name="lgs-drag-fade"
    @before-leave="onClose"
    @after-leave="$emit('destroy')"
  >
    <div
      v-show="visible"
      ref="lgsLayer"
      class="lgs-drag"
      :class="theme"
      :id="id"
      :style="getBaseStyle"
      @mousemove="move"
      @mouseup="moveEnd"
    >
      <div
        class="lgs-drag-header"
        :class="theme+'-drag--header'"
        @mousedown="moveStart"
      >
        <slot name="header">
          <span class="lgs-drag-header-text">
            {{ title }}
          </span>
          <div class="lgs-drag-header-right icon iconfont" @click.stop="$emit('destroy')">
            &#xe781;
          </div>
        </slot>
      </div>
      <div
        class="lgs-drag-main"
        :class="theme+'-drag--main'"
      >
        <slot></slot>
      </div>
      <div
        class="lgs-drag-footer"
        :class="theme+'-drag--footer'"
      >
        <slot name="footer">
        </slot>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Helper from './helper'
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { DraggableOptions } from './type'
export default defineComponent({
  props: {
    id: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '弹窗'
    },
    theme: {
      type: String,
      default: ''
    },
    options: {
      type: Object as PropType<DraggableOptions>,
      default: () => {

      }
    },
    type: {
      type: Number,
      default: 2
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {
      //
      }
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  emits: ['destroy'],

  setup (props) {
    const visible = ref(true)
    const state = reactive<{
  evemtStartLeft:number
  eventStartTop:number
  ismove:boolean
  id:string
  offsetX:number
  offsetY:number
  width:number
  height:number
  zindex:number
  resize: {
    isResize: boolean
    oWidth: number
    oHeight: number
    moveLeft: number
    moveTop: number
    tt: any
  }
  addStyle:any
}>({
  evemtStartLeft: 0,
  eventStartTop: 0,
  ismove: false,
  id: props.id,
  offsetX: props.options.offsetX || 500,
  offsetY: props.options.offsetY || 600,
  width: props.options.width || 250,
  height: props.options.height || 200,
  zindex: 500,
  resize: {
    isResize: false,
    oWidth: 0,
    oHeight: 0,
    moveLeft: 0,
    moveTop: 0,
    tt: {}
  },
  addStyle: {}
})
    const moveStart = (event:MouseEvent) => {
      // 保存点击的初始位置
      state.evemtStartLeft = event.clientX
      state.eventStartTop = event.clientY
      state.ismove = true
      if (lgsLayer.value) {
        state.offsetX = lgsLayer.value.offsetLeft
        state.offsetY = lgsLayer.value.offsetTop
      }
    }
    const lgsLayer = ref<HTMLDivElement>()
    const move = (event:MouseEvent) => {
      if (state.ismove) {
        if (!lgsLayer.value) return
        // 计算鼠标运动后弹窗的位置
        let top = state.offsetY + (event.clientY - state.eventStartTop)
        const docOffsetHeight = lgsLayer.value.offsetHeight / 2
        let left = state.offsetX + (event.clientX - state.evemtStartLeft)
        const docOffsetWidth = lgsLayer.value.offsetWidth / 2
        if (top <= docOffsetHeight) {
          // 顶部边界
          top = docOffsetHeight
        }
        if (left <= docOffsetWidth) {
          // 左侧边界
          (!props.options.dragOut) && (left = docOffsetWidth)
        }
        const docHeight = document.documentElement.clientHeight
        const docWidth = document.documentElement.clientWidth
        if (top >= docHeight - docOffsetHeight) {
          // 底部边界
          top = docHeight - docOffsetHeight
        }
        if (left >= docWidth - docOffsetWidth) {
          // 右部边界
          left = docWidth - docOffsetWidth
        }
        lgsLayer.value.style.left = left + 'px'
        lgsLayer.value.style.top = top + 'px'
        resetZIndex()
      }
    }
    const getStyle = (el:any, styleProp:any) => {
      const x = document.getElementById(el)
      let y:string = '0'
      if (document.defaultView && x) {
        y = document.defaultView
          .getComputedStyle(x, null)
          .getPropertyValue(styleProp)
      }
      return y
    }
    const resetZIndex = () => {
      let max = 500
      const doms = document.querySelectorAll('.lgs-drag') // vl-notify-iframe
      let domZindex = 0
      for (let i = 0, len = doms.length; i < len; i++) {
        const value = parseInt(getStyle(doms[i].id, 'z-index'))
        if (state.id === doms[i].id) {
          domZindex = value
        }
        if (max < value) {
          max = value
        }
      }
      if (domZindex === max && max !== 500) {
        return
      }
      // 预留遮罩层z-index
      state.zindex = max + 2
    }
    const moveEnd = () => {
      state.ismove = false
      state.resize.isResize = false
    }
    const getBaseStyle = computed(() => {
      // 获取z-index
      resetZIndex()
      const styleBase = {
        left: state.offsetX + 'px',
        top: state.offsetY + 'px',
        margin: 0,
        zIndex: state.zindex,
        width: Helper.evenNumber(state.width),
        height: Helper.evenNumber(state.height),
        overflow: 'hidden'
      }
      const a = Helper.deepClone(styleBase)
      return Helper.mergeJson(a, state.addStyle)
    })
    onMounted(() => {
      // 解决鼠标超出弹窗后不跟随的问题
      document.addEventListener('mousemove', event => {
        move(event)
      })
      document.addEventListener('mouseup', () => {
        moveEnd()
      })
      resetZIndex()
    })
    return {
      ...toRefs(state),
      ...toRefs(props),
      resetZIndex,
      move,
      moveEnd,
      getBaseStyle,
      getStyle,
      lgsLayer,
      moveStart,
      visible
    }
  }
})
</script>

<style lang="scss" scoped>
@import './css/index.scss';
</style>
