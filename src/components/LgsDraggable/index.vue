<template>
  <div
    ref="elRef"
    v-show="opened"
    class="lgs-drag__layer"
    :class="[closeCls&&'lgs-drag__layer-closed']"
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
        @mousemove="move"
        @mouseup="moveEnd"
      >
        <!-- header -->
        <div
          v-if="config.title"
          class="lgs-drag__wrap-header"
          :class="config.theme+'-drag--header'"
          @mousedown="moveStart"
          @mouseup="handleGrab"
        >
          <div class="lgs-drag-header-box" :style="{'cursor': cursor}">
            <slot name="header">
              <component v-if="config.title.component" :is="config.title.component">{{ config.title.text }}</component>
              <span v-else class="lgs-drag-header-text">
                {{ config.title.text }}
              </span>
            </slot>
            <div class="lgs-drag-header-extrabtns">
              <button
                v-for="(btn,i) in config.title.extrabtns"
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
              <div class="header-btns">
                <i
                  v-if="config.title.showMinimize"
                  class="icon iconfont"
                  :class="[isMinimized?'icon-retweet':'icon-minus']"
                  @click.stop="toggleMinimize"
                >
                </i>
              </div>
              <div class="header-btns">
                <i
                  v-if="config.title.showMaximize"
                  class="icon iconfont"
                  :class="[isFullScreen ? 'icon-compress' : 'icon-expend']"
                  @click.stop="toggleFullScreen"
                >
                </i>
              </div>
              <div class="header-btns">
                <i
                  v-if="config.title.showClose"
                  class="icon iconfont icon-close"
                  @click.stop="close"
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
        <div
          v-else
          class="lgs-drag__wrap-cntbox"
          :class="config.theme+'-drag--main'"
        >
          <!-- 判断插槽是否存在 -->
          <template v-if="$slots.content">
            <div class="lgs-drag__wrap-cnt"><slot name="content"></slot></div>
          </template>
          <template v-else>
            <template v-if="config.content">
              <component v-if="config.type==='component'" :is="config.content">传入的组件将替换这里的信息</component>
              <iframe
                v-else-if="config.type=='iframe'"
                scrolling="auto"
                allowtransparency="true"
                frameborder="0"
                :src="config.content"
              ></iframe>
              <!-- message|notify|popover -->
              <div v-else-if="config.type=='message' || config.type=='notify' || config.type=='popover'" class="lgs-drag__wrap-cnt">
                <i
                  v-if="config.icon"
                  class="lgs-drag-msg__icon"
                  :class="config.icon"
                  v-html="messageIcon[config.icon]"
                ></i>
                <div class="lgs-drag-msg__group">
                  <div
                    v-if="config.title"
                    class="lgs-drag-msg__title"
                    v-html="config.title"
                  ></div>
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
          </template>
        </div>
        <div
          v-if="config.btns"
          class="lgs-drag__wrap-btns"
          :class="config.theme+'-drag--footer'"
        >
          <span
            v-for="(btn,index) in config.btns"
            :key="index"
            class="btn"
            :style="btn.style"
            @click="btnClicked($event,index)"
            v-html="btn.text"
          ></span>
        </div>
        <!-- <span
          v-if="config.maximize"
          class="lgs-drag__maximize"
          @click="maximizeClicked($event)"
        ></span> -->
        <span v-if="config.resize" class="lgs-drag__resize"></span>
      </div>
    </transition>

    <!-- 优化拖拽卡顿 -->
    <div class="lgs-drag__dragfix"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, toRefs, nextTick, defineComponent, PropType } from 'vue'
import type { ILgsLayerConfigs } from './type'
import helper from './utils/helper'
// 索引，蒙层控制，定时器
let $index = 0
// let $locknum = 0
const $timer:any = {}
let $closeTimer:any = null

export default defineComponent({
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
    'destroy'
  ],
  setup (props, context) {
    const elRef = ref<HTMLDivElement>()
    const state = reactive<{
      id: string,
      opened: boolean,
      isFullScreen:boolean
      isMinimized:boolean
      closeCls: boolean,
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
      width:number
      height:number
      evemtStartLeft:number
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
    }>({
      id: props.config.id || '',
      opened: false,
      isFullScreen: false,
      isMinimized: false,
      closeCls: true,
      toastIcon: {
        // ...
      },
      messageIcon: {
        // ...
      },
      layerOpts: {
        left: '0',
        top: '0',
        width: '0',
        height: '0'
      },
      tipArrow: null,
      offsetX: 500,
      offsetY: 600,
      width: 250,
      height: 200,
      evemtStartLeft: 0,
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
      zindex: 2000
    })
    const lgsLayer = ref<HTMLDivElement>()
    const moveStart = (event:MouseEvent) => {
      // 保存点击的初始位置
      handleGrab(event)
      state.evemtStartLeft = event.clientX
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
        let left = state.offsetX + (event.clientX - state.evemtStartLeft)

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
        resetZIndex()
      }
    }
    const moveEnd = () => {
      state.ismove = false
      state.resize.isResize = false
      handleGrab()
    }
    const handleGrab = (event?:MouseEvent) => {
      if (!event) {
        state.cursor = 'grab'
        return
      }
      if (event.type === 'mousedown') {
        state.cursor = 'grabbing'
      } else {
        state.cursor = 'grab'
      }
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
      lgsLayer.value.style.height = '35px'
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
    }
    /**
     * 恢复弹窗
     */
    const restoreRect = () => {
      if (!lgsLayer.value) return
      // if (!state.layerOpts.lockScroll) {
      //   state.layerOpts.isBodyOverflow = false
      //   document.body.style.overflow = 'hidden'
      // }
      // 还原样式
      lgsLayer.value.style.left = parseFloat(state.layerOpts.left) + 'px'
      lgsLayer.value.style.top = parseFloat(state.layerOpts.top) + 'px'
      lgsLayer.value.style.width = parseFloat(state.layerOpts.width) + 'px'
      lgsLayer.value.style.height = parseFloat(state.layerOpts.height) + 'px'
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

      callback()
    }

    // 关闭弹窗
    const close = () => {
      if (!state.opened) return

      state.closeCls = true
      clearTimeout($closeTimer)
      $closeTimer = setTimeout(() => {
        state.opened = false
        state.closeCls = false
        // if (state.layerOpts.lockScroll) {
        //   $locknum--
        //   if (!$locknum) {
        //     //
        //   }
        // }
        if (props.config.time) {
          $index--
        }
        // props.config.beforeClose && props.config.beforeClose().then(() => {
        //   props.config.onClosed && props.config.onClosed()
        context.emit('update:modelValue', false)
        //   context.emit('destroy')
        // }).catch(error => {
        //   console.log(error.message)
        // })
      }, 200)
    }

    // 弹窗位置
    const auto = () => {
      // ...

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
      const lgslayerIns:HTMLDivElement|null = elRef.value.querySelector('.lgs-drag__wrap')
      if (!lgslayerIns) return
      if (!isFixed || props.config.follow) {
        lgslayerIns && (lgslayerIns.style.position = 'absolute')
      }

      const area = [helper.client('width'), helper.client('height'), lgslayerIns.offsetWidth, lgslayerIns.offsetHeight]

      oL = (area[0] - area[2]) / 2
      oT = (area[1] - area[3]) / 2

      if (props.config.follow) {
        offset()
      } else {
        if (pos instanceof Array) {
          oL = pos[0]
          oT = pos[1]
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
              break
          }
        }

        lgslayerIns.style.left = (isFixed ? oL : helper.scroll('left') + oL) + 'px'
        lgslayerIns.style.top = (isFixed ? oT : helper.scroll('top') + oT) + 'px'

        saveLayerRect()
      }
    }

    // 元素跟随定位
    const offset = () => {
      if (!props.config.follow) return
      const dom = elRef.value
      if (!dom) return
      const lgslayerIns:HTMLDivElement|null = dom.querySelector('.lgs-drag__wrap')
      if (!lgslayerIns) return
      const oW = lgslayerIns.offsetWidth
      const oH = lgslayerIns.offsetHeight
      const pS = helper.getFollowRect(props.config.follow, oW, oH)
      state.tipArrow = pS[4]

      lgslayerIns.style.left = pS[0] + 'px'
      lgslayerIns.style.top = pS[1] + 'px'
    }

    // 事件处理
    const callback = () => {
      // 倒计时关闭
      if (props.config.time) {
        $index++
        // 防止重复点击
        if ($timer[$index] !== null) clearTimeout($timer[$index])
        $timer[$index] = setTimeout(() => {
          close()
        }, props.config.time)
      }
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
      })
      resetZIndex()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', autopos, false)
      clearTimeout($closeTimer)
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
      elRef,
      lgsLayer,
      close,
      move,
      moveEnd,
      // maximizeClicked,
      shadeClicked,
      btnClicked,
      moveStart,
      handleGrab,
      toggleFullScreen,
      toggleMinimize
    }
  }
})
</script>
