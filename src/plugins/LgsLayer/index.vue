<template>
  <div
    ref="elRef"
    v-if="opened"
    class="lgs-drag__layer"
    :style="'z-index:'+zindex"
    :id="id"
  >
    <!-- //蒙版 -->
    <div
      v-if="config.shade"
      class="lgs-drag__overlay"
      @click="shadeClicked"
      :style="'opacity:'+config.opacity"
    ></div>
    <transition

      @before-leave="config.beforeClose"
      @after-leave="$emit('destroy')"
    >
      <div
        ref="lgsLayer"
        class="lgs-drag__wrap"
        :class="['anim-'+config.anim, 'popui__'+config.type, tipArrow, config.theme]"
        :style="[config.layerStyle?config.layerStyle:'']"
        @mousedown="Active"
      >
        <!-- header -->
        <div
          v-if="config.header"
          :id="id+'_header'"
          class="lgs-drag__wrap-header"
          :class="[config.theme+'-drag--header',activeClass]"
          @mousedown="moveStart"
          :style="{'cursor': cursor}"
        >
          <div class="lgs-drag-header-box">
            <slot name="header">
              <component v-if="config.header.component" :is="config.header.component">{{ config.header.text }}</component>
              <span
                v-else
                :title="config.header.text"
                class="lgs-drag-header-text"
              >
                {{ config.header.text }}
              </span>
            </slot>
            <div v-if="!isMinimized" class="lgs-drag-header-extrabtns">
              <button
                v-for="(btn,i) in config.header.extrabtns"
                :key="i"
                class="header-extrabtn"
                :class="[btn.class,'extrabtn_'+btn.type]"
                :disabled="btn.disabled"
                :style="btn.style"
                @click="btn.click"
              >
                {{ btn.text }}
              </button>
            </div>
            <div class="lgs-drag-header-fixedbtns">
              <div
                v-if="config.header.showMinimize&&!isFullScreen"
                class="header-btns"
                @click.stop="toggleMinimize"
              >
                <i
                  class="icon iconfont"
                  :class="[isMinimized?'icon-retweet':'icon-minus']"
                >
                </i>
              </div>
              <div
                v-if="config.header.showMaximize&&!isMinimized"
                class="header-btns"
                @click.stop="toggleFullScreen"
              >
                <i
                  class="icon iconfont"
                  :class="[isFullScreen ? 'icon-compress' : 'icon-expend']"
                >
                </i>
              </div>
              <div
                v-if="config.header.showClose"
                class="header-btns"
                @click.stop="close"
              >
                <i
                  class="icon iconfont icon-close"
                >
                </i>
              </div>
            </div>
          </div>
        </div>
        <!-- toast -->
        <div
          v-if="config.type=='toast'&&config.icon"
          class="lgs-drag__toast-icon"
          :class="['lgs-drag__toast-'+config.icon]"
          v-html="toastIcon[config.icon]"
        ></div>
        <template v-else>
          <div
            v-if="!isMinimized"
            class="lgs-drag__wrap-cntbox"
            :class="config.theme+'-drag--main'"
          >
            <slot>
              <template v-if="config.content">
                <!-- <div
                  v-if="config.type==='component'"
                  ref="refLgsLayerContainer"
                  :id="id"
                ></div> -->
                <component
                  v-if="config.type==='component'"
                  :is="config.content"
                  @close="close"
                >
                  传入的组件将替换这里的信息
                </component>
                <iframe
                  v-else-if="config.type=='iframe'"
                  scrolling="auto"
                  allowtransparency="true"
                  frameborder="0"
                  :src="config.content"
                ></iframe>
                <!-- message|notify|popover -->
                <div
                  v-else-if="config.type=='message' || config.type=='notify' || config.type=='popover'"
                  class="lgs-drag__wrap-cnt"
                >
                  <i
                    v-if="config.icon"
                    class="lgs-drag-msg__icon"
                    :class="config.icon"
                    v-html="messageIcon[config.icon]"
                  ></i>
                  <div class="lgs-drag-msg__group">
                    <div v-html="config.content"></div>
                  </div>
                </div>
                <div
                  v-else
                  class="lgs-drag__wrap-cnt"
                  v-html="config.content"
                >
                </div>
              </template>
            </slot>
          </div>
        </template>

        <div
          v-if="config.btns&&!isMinimized"
          class="lgs-drag__wrap-footer"
          :class="[config.theme+'-drag--footer']"

          :style="'text-align:'+config.btnAlign"
        >
          <div class="lgs-drag_footer-btns">
            <button
              v-for="(btn,index) in config.btns"
              :key="index"
              class="footer-btn"
              :style="btn.style"
              @click="btnClicked($event,index)"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
        <span v-if="config.resize" class="lgs-drag__resize"></span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, toRefs, nextTick, defineComponent, PropType, createVNode, render } from 'vue'
import type { ILgsLayerConfigs } from './type'
import helper from './utils/helper'
export default defineComponent({
  name: 'LgsLayer',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object as PropType<ILgsLayerConfigs>,
      default: () => {

      }
    }
  },
  emits: [
    'update:modelValue',
    'destroy',
    'active'
  ],
  setup (props, context) {
    const elRef = ref<HTMLDivElement>()
    const state = reactive<{
      id: string,
      activeClass:string
      opened: boolean,
      isFullScreen:boolean
      isMinimized:boolean
      toastIcon: Record<string, string>,
      messageIcon: any,
      layerOpts: {
        left:string,
        top:string,
        width:string,
        height:string
      },
      tipArrow: any
      offsetX:number
      offsetY:number
      eventStartLeft:number
      eventStartTop:number
      ismove:boolean
      cursor:'grab'|'grabbing'
      resize: {
        isResize: boolean
        oWidth: number
        oHeight: number
        moveLeft: number
        moveTop: number
        tt: any
      }
      zindex:number
      timer:any
    }>({
      id: props.config.id || `lgslayer_${new Date().getTime()}`,
      activeClass: '',
      opened: false,
      isFullScreen: false,
      isMinimized: false,
      toastIcon: {
        // ...
      },
      messageIcon: {
        // ...
      },
      layerOpts: {
        left: '0',
        top: '0',
        width: props.config.width || '250',
        height: props.config.height || '50'
      },
      tipArrow: null,
      offsetX: 500,
      offsetY: 600,
      eventStartLeft: 0,
      eventStartTop: 0,
      ismove: false,
      cursor: 'grab',
      resize: {
        isResize: false,
        oWidth: 0,
        oHeight: 0,
        moveLeft: 0,
        moveTop: 0,
        tt: {}
      },
      zindex: 2000,
      timer: null
    })
    const lgsLayer = ref<HTMLDivElement>()
    const moveStart = (event:MouseEvent) => {
      // 保存点击的初始位置
      handleGrab(true)
      state.eventStartLeft = event.clientX
      state.eventStartTop = event.clientY
      state.ismove = true
      if (lgsLayer.value) {
        state.offsetX = lgsLayer.value.offsetLeft
        state.offsetY = lgsLayer.value.offsetTop
      }
    }
    const move = (event:MouseEvent) => {
      if (state.ismove) {
        if (!lgsLayer.value) return
        // 计算鼠标运动后弹窗的位置
        let top = state.offsetY + (event.clientY - state.eventStartTop)

        if (top <= 0) {
          // 顶部边界
          !props.config.dragOut && (top = 0)
        }
        // const docOffsetHeight = 0
        let left = state.offsetX + (event.clientX - state.eventStartLeft)

        // const docOffsetWidth = 0
        if (left <= 0) {
          // 左侧边界
          !props.config.dragOut && (left = 0)
        }
        const docHeight = document.documentElement.clientHeight
        const docWidth = document.documentElement.clientWidth
        const docOffsetWidth = lgsLayer.value.offsetWidth
        const docOffsetHeight = lgsLayer.value.offsetHeight
        const bottom = docHeight - docOffsetHeight
        if (top >= bottom) {
          // 底部边界
          !props.config.dragOut && (top = bottom)
        }
        const right = docWidth - docOffsetWidth
        if (left >= right) {
          // 右部边界
          !props.config.dragOut && (left = right)
        }
        lgsLayer.value.style.left = left + 'px'
        lgsLayer.value.style.top = top + 'px'
      }
    }
    const moveEnd = () => {
      state.ismove = false
      state.resize.isResize = false
    }
    const handleGrab = (isGrabbing:boolean) => {
      state.cursor = isGrabbing ? 'grabbing' : 'grab'
    }
    const toggleFullScreen = (e:MouseEvent) => {
      // 先保存样式
      saveLayerRect()
      state.isFullScreen = helper.toggleFullScreen(lgsLayer.value)
      if (!state.isFullScreen) restoreRect()
    }
    const toggleMinimize = (event:MouseEvent) => {
      if (!lgsLayer.value) return
      state.isMinimized ? restoreRect() : setForMinimize()
      state.isMinimized = !state.isMinimized
    }
    /**
     * 设置最小化后的状态
     */
    const setForMinimize = () => {
      if (!lgsLayer.value) return
      // 先保存弹窗样式
      saveLayerRect()
      lgsLayer.value.style.width = '250px'
      lgsLayer.value.style.height = '35px'
      lgsLayer.value.style.left = 'auto'
      lgsLayer.value.style.right = '20px'
      lgsLayer.value.style.top = '20px'
    }
    /**
     * 保存当前弹窗的矩形数据
     */
    const saveLayerRect = () => {
      if (!lgsLayer.value) return
      state.layerOpts.left = lgsLayer.value.style.left
      state.layerOpts.top = lgsLayer.value.style.top
      state.layerOpts.width = lgsLayer.value.style.width
      state.layerOpts.height = lgsLayer.value.style.height
      return state.layerOpts
    }
    /**
     * 恢复弹窗
     */
    const restoreRect = (opts?:{
      left:string
      top:string
      width:string
      height:string
    }) => {
      if (!lgsLayer.value) return
      if (opts) {
        // 根据传入的样式设置弹窗的样式
        state.layerOpts.left = lgsLayer.value.style.left = parseFloat(opts.left) + 'px'
        state.layerOpts.top = lgsLayer.value.style.top = parseFloat(opts.top) + 'px'
        state.layerOpts.width = lgsLayer.value.style.width = parseFloat(opts.width) + 'px'
        state.layerOpts.height = lgsLayer.value.style.height = parseFloat(opts.height) + 'px'
      } else {
        // 还原样式
        lgsLayer.value.style.left = parseFloat(state.layerOpts.left) + 'px'
        lgsLayer.value.style.top = parseFloat(state.layerOpts.top) + 'px'
        lgsLayer.value.style.width = parseFloat(state.layerOpts.width) + 'px'
        lgsLayer.value.style.height = parseFloat(state.layerOpts.height) + 'px'
      }
    }

    const resetZIndex = () => {
      let max = 2000
      const doms = document.querySelectorAll('.lgs-drag__layer') // vl-notify-iframe
      let domZindex = 0
      for (let i = 0, len = doms.length; i < len; i++) {
        const index = helper.getStyle(doms[i].id, 'z-index')

        if (state.id === doms[i].id) {
          domZindex = index === 'auto' ? max : parseInt(index)
        }
        if (max < domZindex) {
          max = domZindex
        }
      }
      if (domZindex === max && max !== 2000) {
        return
      }
      // 预留遮罩层z-index
      state.zindex = max + 2
      console.log(state.zindex)
    }
    const Active = () => {
      state.activeClass = props.config.theme + '-drag--header-active'
      resetZIndex()
      context.emit('active')
    }
    const deActive = () => {
      state.activeClass = ''
    }
    const refLgsLayerContainer = ref<HTMLElement>()
    // 打开弹窗
    const open = () => {
      if (state.opened) return

      state.opened = true

      props.config.onSuccess && props.config.onSuccess()
      // 弹层挂载位置
      if (props.config.teleport) {
        nextTick(() => {
          const teleportNode = props.config.teleport && document.querySelector(props.config.teleport)
          teleportNode && elRef.value && teleportNode.appendChild(elRef.value)

          auto()
        })
      }

      autoClose()
    }

    // 关闭弹窗
    const close = () => {
      if (!state.opened) return

      state.opened = false

      context.emit('update:modelValue', false)
    }

    // 弹窗位置
    const auto = () => {
      // ...
      restoreRect(state.layerOpts)
      autopos()

      // 全屏弹窗
      // if (props.config.maximize) {
      //   full()
      // }

      // 弹窗拖动|缩放
      // move()
    }

    const autopos = () => {
      if (!state.opened) return
      let oL, oT
      const pos = props.config.position
      const isFixed = props.config.fixed
      if (!elRef.value) return
      if (!lgsLayer.value) return

      // const lgslayerIns:HTMLDivElement|null = elRef.value.querySelector('.lgs-drag__wrap')
      // if (!lgslayerIns) return
      // if (!isFixed || props.config.follow) {
      //   lgslayerIns && (lgslayerIns.style.position = 'absolute')
      // }

      const area = [helper.client('width'), helper.client('height'), lgsLayer.value.offsetWidth, lgsLayer.value.offsetHeight]

      oL = (area[0] - area[2]) / 2
      oT = (area[1] - area[3]) / 2

      if (props.config.follow) {
        offset()
      } else {
        if (pos instanceof Array) {
          oL = pos[0].toString()
          oT = pos[1].toString()
          let container:HTMLElement | null = null
          if (oL.indexOf('%') !== -1) {
            const olN = parseFloat(oL)
            container = container || document.querySelector(props.config.teleport || 'body')
            oL = container ? (container as HTMLElement).clientWidth * olN / 100 : 500
          }
          if (oT.indexOf('%') !== -1) {
            container = container || document.querySelector(props.config.teleport || 'body')
            oT = container ? (container as HTMLElement).clientHeight * parseFloat(oT) / 100 : 500
          }
        } else {
          switch (pos) {
            case 't':
              oT = 0
              break
            case 'r':
              oL = area[0] - area[2]
              break
            case 'b':
              oT = area[1] - area[3]
              break
            case 'l':
              oL = 0
              break
            case 'lt':
              oL = 0
              oT = 0
              break
            case 'rt':
              oL = area[0] - area[2]
              oT = 0
              break
            case 'lb':
              oL = 0
              oT = area[1] - area[3]
              break
            case 'rb':
              oL = area[0] - area[2]
              oT = area[1] - area[3]
              break
            default:
              oL = (area[0] - area[2]) / 2
              oT = (area[1] - area[3]) / 2
              break
          }
        }

        lgsLayer.value.style.left = (isFixed ? oL : helper.scroll('left') + oL.toString()) + 'px'
        lgsLayer.value.style.top = (isFixed ? oT : helper.scroll('top') + oT.toString()) + 'px'

        saveLayerRect()
      }
    }

    // 元素跟随定位
    const offset = () => {
      if (!props.config.follow) return
      const dom = elRef.value
      if (!dom) return
      if (!lgsLayer.value) return
      // const lgslayerIns:HTMLDivElement|null = dom.querySelector('.lgs-drag__wrap')
      // if (!lgslayerIns) return
      const oW = lgsLayer.value.offsetWidth
      const oH = lgsLayer.value.offsetHeight
      const pS = helper.getFollowRect(props.config.follow, oW, oH)
      state.tipArrow = pS[4]

      lgsLayer.value.style.left = pS[0] + 'px'
      lgsLayer.value.style.top = pS[1] + 'px'
    }

    // 事件处理
    const autoClose = () => {
      if (!props.config.time) return
      state.timer && clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        close()
      }, props.config.time)
    }

    // 点击最大化按钮
    // const maximizeClicked =
    // 点击遮罩层
    const shadeClicked = () => {
      if (props.config.shadeClose) {
        close()
      }
    }
    // 按钮事件
    const btnClicked = (e:MouseEvent, index:number) => {
      const btn = props.config.btns && props.config.btns[index]
      if (btn && !btn.disabled) {
        btn.click && btn.click(e)
      }
    }
    onMounted(() => {
      if (props.modelValue) {
        open()
      }
      window.addEventListener('resize', autopos, false)
      // 解决鼠标超出弹窗后不跟随的问题
      document.addEventListener('mousemove', event => {
        move(event)
      })
      document.addEventListener('mouseup', () => {
        moveEnd()
        handleGrab(false)
      })
      Active()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', autopos)
      state.timer && clearTimeout(state.timer)
    })

    // 监听弹层v-model
    watch(() => props.modelValue, (val) => {
      // console.log('V3Layer is now [%s]', val ? 'show' : 'hide')
      if (val) {
        open()
      } else {
        close()
      }
    })
    return {
      ...toRefs(state),
      ...toRefs(props),
      refLgsLayerContainer,
      elRef,
      lgsLayer,
      close,
      resetZIndex,
      move,
      moveEnd,
      // maximizeClicked,
      shadeClicked,
      btnClicked,
      moveStart,
      toggleFullScreen,
      toggleMinimize,
      deActive,
      Active
    }
  }
})
</script>
<style lang="scss" scoped>
@import './css/index.scss';
</style>
