<template>
  <transition
    name="lgs-layer-fade"
    @before-leave="config.beforeClose"
    @after-leave="$emit('destroy',config.type)"
  >
    <div
      v-if="opened"
      ref="elRef"
      class="lgs-drag__layer"
      :class="config.shade?'lgs-drag__layer-shadebox':''"
      :style="'z-index:'+zindex+';'"
      :id="id"
    >
      <!-- //蒙版 -->
      <div
        v-if="config.shade"
        class="lgs-drag__overlay"
        @click="shadeClicked"
      >
      </div>
      <div
        ref="refLgsLayerBefore"
        class="lgs-layer__before"
        :class="[followPosition?'lgs-layer__before-'+followPosition:'',followPosition?'lgs-layer__before-'+followPosition+'-'+theme:'', tipArrow]"
      ></div>
      <div
        ref="refLgsLayer"
        class="lgs-drag__wrap"
        :class="['anim-'+config.anim, 'lgs-layer__'+config.type, theme]"
        :style="[config.layerStyle?config.layerStyle:'']"
        @mousedown="Active"
      >
        <!-- header -->
        <div
          v-if="config.header&&!config.header.hide"
          :id="id+'_header'"
          class="lgs-drag__wrap-header"
          :class="[theme+'-drag--header',activeClass]"
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
                v-if="!config.header.hideMinimize&&!isFullScreen"
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
                v-if="!config.header.hideMaximize&&!isMinimized"
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
                v-if="!config.header.hideClose"
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
          v-if="config.type=='toast'"
          class="lgs-drag__toast-icon"
        >
          <i class="icon iconfont" :class="config.icon"></i>
        </div>
        <template v-else>
          <div
            v-if="!isMinimized"
            class="lgs-drag__wrap-cntbox"
            :class="theme+'-drag--main'"
          >
            <slot>
              <template v-if="config.content">
                <component
                  v-if="config.type==='component'"
                  :is="config.content"
                  @close="close"
                >
                </component>
                <iframe
                  v-else-if="config.type=='iframe'"
                  scrolling="auto"
                  allowtransparency="true"
                  frameborder="0"
                  :src="config.content"
                ></iframe>
                <!-- message|notify|popover -->
                <Message
                  v-else-if="config.type==='message'"
                  :message="config.content"
                  :icon="config.icon"
                  :type="'info'"
                  @close="close"
                ></Message>
                <Popover
                  v-else-if="config.type='popover'"
                  :follow="config.follow"
                  :auto-fit="true"
                  :position="followPosition"
                  :content="config.content"
                  :teleport="config.teleport"
                >
                </Popover>
                <div
                  v-else-if="config.type=='notify'"
                  class="lgs-drag__wrap-cnt"
                >
                  <i
                    v-if="config.icon"
                    class="lgs-drag-msg__icon"
                    :class="config.icon"
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
          :class="[theme+'-drag--footer']"

          :style="'text-align:'+config.btnAlign"
        >
          <div class="lgs-drag_footer-btns">
            <button
              v-for="(btn,index) in config.btns"
              :key="index"
              class="footer-btn"
              :style="btn.style"
              @click="btnClicked($event,btn)"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
        <span
          v-if="config.resize"
          class="lgs-drag__resize icon iconfont icon-caret-right"
          @mousedown="resizeStart"
        ></span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Message from './components/Message.vue'
import Popover from './components/Popover.vue'
import { onMounted, onUnmounted, ref, reactive, watch, toRefs, nextTick, defineComponent, PropType, createVNode, render, onBeforeMount } from 'vue'
import type { IBtn, IFollowPosition, ILgsLayerConfigs } from './type'
import helper from './utils/helper'
export default defineComponent({
  name: 'LgsLayer',
  components: { Message, Popover },
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
      teleport: string,
      activeClass:string
      opened: boolean,
      isFullScreen:boolean
      isMinimized:boolean
      messageIcon: any,
      layerOpts:Record<string, string>
      tipArrow: any
      offsetX:number
      offsetY:number
      eventStartLeft:number
      eventStartTop:number
      ismove:boolean
      cursor:'grab'|'grabbing'
      isResize: boolean
      zindex:number
      time:number | undefined
      header: {
        text: string,
        hideClose: boolean,
        hideMaximize: boolean,
        hideMinimize: boolean
      }
      theme: string
      isFixed: boolean
      resetPosNums:number
      followPosition:IFollowPosition
      followPadding:number // popover距target的距离
    }>({
      id: props.config.id || `lgslayer_${new Date().getTime()}`,
      teleport: props.config.teleport || '#app-main',
      activeClass: '',
      opened: false,
      isFullScreen: false,
      isMinimized: false,
      messageIcon: {
        // ...
      },
      layerOpts: {
        left: '0',
        top: '0',
        width: props.config.width || '250',
        height: props.config.height || '150'
      },
      tipArrow: null,
      offsetX: 500,
      offsetY: 600,
      eventStartLeft: 0,
      eventStartTop: 0,
      ismove: false,
      cursor: 'grab',
      isResize: false,
      zindex: 2000,
      time: props.config.time,
      header: {
        text: props.config.header ? props.config.header.text ? props.config.header.text : '' : '',
        hideClose: props.config.header ? props.config.header.hideClose ?? false : false,
        hideMaximize: props.config.header ? props.config.header.hideMaximize ?? false : false,
        hideMinimize: props.config.header ? props.config.header.hideMinimize ?? false : false
      },
      theme: props.config.theme || 'darkblue',
      isFixed: false,
      resetPosNums: 0,
      followPosition: props.config.followPosition || 't',
      followPadding: 16
    })
    /**
     * 弹窗Dom ref实例
     */
    const refLgsLayer = ref<HTMLDivElement>()
    const refLgsLayerBefore = ref<HTMLDivElement>()
    /**
     * 拖拽开始前准备工作
     * @param event Event
     */
    const moveStart = (event:MouseEvent) => {
      handleGrab(true)
      // 保存点击的初始位置
      state.eventStartLeft = event.clientX
      state.eventStartTop = event.clientY
      state.ismove = true
      if (refLgsLayer.value) {
        state.offsetX = refLgsLayer.value.offsetLeft
        state.offsetY = refLgsLayer.value.offsetTop
      }
    }
    /**
     * 缩放开始前准备工作
     * @param event Event
     */
    const resizeStart = (event:MouseEvent) => {
      if (!refLgsLayer.value) return
      _saveLayerRect()
      state.isResize = true
    }
    /**
     * 拖拽或者缩放
     * @param event Event
     */
    const move = (event:MouseEvent) => {
      if (!refLgsLayer.value) return
      if (state.ismove) {
        // 计算鼠标运动后弹窗的位置
        let top = state.offsetY + (event.clientY - state.eventStartTop)

        if (top <= 0) {
          // 顶部边界
          !props.config.dragOut && (top = 0)
        }
        let left = state.offsetX + (event.clientX - state.eventStartLeft)

        if (left <= 0) {
          // 左侧边界
          !props.config.dragOut && (left = 0)
        }
        const docHeight = helper.client('height', state.teleport)
        const docWidth = helper.client('width', state.teleport)
        const layerWidth = refLgsLayer.value.offsetWidth
        const layerHeight = refLgsLayer.value.offsetHeight
        const bottom = docHeight - layerHeight
        if (top >= bottom) {
          // 底部边界
          !props.config.dragOut && (top = bottom)
        }
        const right = docWidth - layerWidth
        if (left >= right) {
          // 右部边界
          !props.config.dragOut && (left = right)
        }
        refLgsLayer.value.style.left = left + 'px'
        refLgsLayer.value.style.top = top + 'px'
      } else if (state.isResize) {
        const height = event.y - (event.currentTarget as HTMLElement).offsetTop - parseFloat(state.layerOpts.top)
        const width = event.x - (event.currentTarget as HTMLElement).offsetLeft - parseFloat(state.layerOpts.left)
        console.log(width, height)
        refLgsLayer.value.style.height = (height < 35 ? 35 : height) + 'px'
        refLgsLayer.value.style.width = (width < 250 ? 250 : width) + 'px'

        _saveLayerRect()
      }
    }
    /**
     * 拖拽结束处理
     */
    const moveEnd = () => {
      state.ismove = false
      state.isResize = false
    }

    /**
     * 控制鼠标小手是否抓住
     * @param isGrabbing 是否抓住
     */
    const handleGrab = (isGrabbing:boolean) => {
      state.cursor = isGrabbing ? 'grabbing' : 'grab'
    }
    /**
     * 切换全屏
     * @param e 事件
     */
    const toggleFullScreen = (e?:MouseEvent) => {
      if (!refLgsLayer.value) return
      // 如果是最小化状态则先恢复
      if (state.isMinimized) {
        toggleMinimize()
      }
      // 保存样式
      _saveLayerRect()
      state.isFullScreen = helper.toggleFullScreen(refLgsLayer.value)
      if (!state.isFullScreen) _restoreRect()
      return state.isFullScreen
    }
    /**
     * 切换最小化
     * @param event 事件
     */
    const toggleMinimize = (event?:MouseEvent) => {
      if (!refLgsLayer.value) return
      state.isMinimized ? _restoreRect() : _setForMinimize()
      state.isMinimized = !state.isMinimized
      return state.isMinimized
    }
    /**
     * 设置最小化后的状态
     */
    const _setForMinimize = () => {
      if (!refLgsLayer.value) return
      // 先保存弹窗样式
      _saveLayerRect()
      refLgsLayer.value.style.width = '250px'
      refLgsLayer.value.style.height = '35px'
      refLgsLayer.value.style.left = (helper.client('width', state.teleport) - 250) + 'px'
      refLgsLayer.value.style.top = '20px'
    }

    /**
     * 重置z-index到当前最大
     */
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
      state.activeClass = state.theme + '-drag--header-active'
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
      // 弹层挂载位置
      if (state.teleport) {
        nextTick(() => {
          const teleportNode = state.teleport && document.querySelector(state.teleport)
          teleportNode && elRef.value && teleportNode.appendChild(elRef.value)

          auto()
        })
      }
      props.config.onSuccess && props.config.onSuccess()
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
      _restoreRect()
      autopos()
    }
    /**
     * 保存当前弹窗的矩形数据
     */
    const _saveLayerRect = () => {
      if (!refLgsLayer.value) return
      state.layerOpts.left = refLgsLayer.value.style.left
      state.layerOpts.top = refLgsLayer.value.style.top
      state.layerOpts.width = refLgsLayer.value.style.width
      state.layerOpts.height = refLgsLayer.value.style.height
      return state.layerOpts
    }
    /**
     * 恢复弹窗
     * @param opts 恢复到的位置和大小配置，可选，不传时恢复到state.layerOpts设置的状态
     */
    const _restoreRect = () => {
      if (!refLgsLayer.value) return
      for (const key in state.layerOpts) {
        if (state.layerOpts[key].indexOf('%') !== -1) {
          const replaceKey:'width'|'height' = key === 'width' || key === 'left' ? 'width' : 'height'
          const withPercent = key === 'width' || 'height'
          state.layerOpts[key] = helper.client(replaceKey, state.teleport, withPercent && parseFloat(props.config.width || '0')) + ''
        }
      }
      // 还原样式
      refLgsLayer.value.style.left = parseFloat(state.layerOpts.left) + 'px'
      refLgsLayer.value.style.top = parseFloat(state.layerOpts.top) + 'px'
      refLgsLayer.value.style.width = parseFloat(state.layerOpts.width) + 'px'
      refLgsLayer.value.style.height = parseFloat(state.layerOpts.height) + 'px'
    }
    /**
     * 根据配置信息自动定位
     */
    const autopos = () => {
      if (!state.opened) return
      let oL, oT
      const pos = props.config.position
      if (!elRef.value) return
      if (!refLgsLayer.value) return

      const area = [helper.client('width', state.teleport), helper.client('height', state.teleport), refLgsLayer.value.offsetWidth, refLgsLayer.value.offsetHeight]

      oL = (area[0] - area[2]) / 2
      oT = (area[1] - area[3]) / 2

      if (props.config.follow) {
        offset()
      } else {
        if (pos instanceof Array) {
          oL = pos[0].toString()
          oT = pos[1].toString()
          if (oL.indexOf('%') !== -1) {
            oL = helper.client('width', state.teleport, parseFloat(oL))
          }
          if (oT.indexOf('%') !== -1) {
            oT = helper.client('height', state.teleport, parseFloat(oT))
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

        refLgsLayer.value.style.left = oL + 'px'
        refLgsLayer.value.style.top = oT + 'px'

        _saveLayerRect()
      }
    }

    // 元素跟随定位
    const offset = () => {
      if (!props.config.follow) return
      if (!refLgsLayer.value) return
      resetPos()
      refLgsLayer.value.style.left = state.offsetX + 'px'
      refLgsLayer.value.style.top = state.offsetY + 'px'
      resetArrow()
    }
    /**
     * 设置弹窗箭头样式
     */
    const resetArrow = () => {
      if (!refLgsLayerBefore.value) return
      if (!refLgsLayer.value) return
      const { offsetWidth, offsetHeight } = refLgsLayer.value
      const pS = helper.getFollowRect(props.config.follow, state.teleport)
      let left = 0
      let top = 0
      switch (state.followPosition) {
        case 'l':
          left = state.offsetX + offsetWidth
          top = state.offsetY + (offsetHeight - refLgsLayerBefore.value.offsetWidth) / 2

          if (props.config.autoFit) {
            top = top < pS[1] ? pS[1] : top > pS[3] - state.followPadding ? pS[3] - state.followPadding : top
          }
          break
        case 'r':
          left = state.offsetX - state.followPadding
          top = state.offsetY + (offsetHeight - refLgsLayerBefore.value.offsetWidth) / 2
          if (props.config.autoFit) {
            top = top < pS[1] ? pS[1] : top > pS[3] - state.followPadding ? pS[3] - state.followPadding : top
          }
          break
        case 't':
          left = state.offsetX + (offsetWidth - refLgsLayerBefore.value.offsetWidth) / 2
          top = state.offsetY + offsetHeight
          if (props.config.autoFit) {
            left = left < pS[0] ? pS[0] : left > pS[2] ? pS[2] : left
          }
          break
        case 'b':
          left = state.offsetX + (offsetWidth - refLgsLayerBefore.value.offsetWidth) / 2
          top = state.offsetY - state.followPadding
          if (props.config.autoFit) {
            left = left < pS[0] ? pS[0] : left > pS[2] ? pS[2] : left
          }
          break
        default:
          break
      }
      refLgsLayerBefore.value.style.left = left + 'px'
      refLgsLayerBefore.value.style.top = top + 'px'
    }
    /**
     * 设置弹窗位置
     */
    const resetPos = ():any => {
      console.log('resetpos')
      if (!refLgsLayer.value) return
      const tWidth = helper.client('width', state.teleport)
      const tHeight = helper.client('height', state.teleport)
      const { offsetWidth, offsetHeight } = refLgsLayer.value
      const pS = helper.getFollowRect(props.config.follow, state.teleport)
      state.offsetX = pS[0]
      state.offsetY = pS[1]
      state.tipArrow = pS[6]

      if (state.resetPosNums > 3) state.followPosition = 'c'
      switch (state.followPosition) {
        case 'l':
          state.offsetX = pS[0] - offsetWidth - state.followPadding
          state.offsetY = pS[1] - (offsetHeight - pS[5]) / 2
          state.offsetY = state.offsetY < 0 ? 0 : state.offsetY > tHeight - offsetHeight ? tHeight - offsetHeight : state.offsetY
          // 当左则空间不够``存储元素时，调整到右侧
          if (props.config.autoFit && state.offsetX < 0) {
            state.followPosition = 't'
            state.resetPosNums++
            resetPos()
            break
          }
          break
        case 'r':
          state.offsetX = pS[2] + state.followPadding
          state.offsetY = pS[1] - (offsetHeight - pS[5]) / 2
          state.offsetY = state.offsetY < 0 ? 0 : state.offsetY > tHeight - offsetHeight ? tHeight - offsetHeight : state.offsetY
          if (props.config.autoFit && tWidth - state.offsetX < offsetWidth) {
            state.followPosition = 'b'
            state.resetPosNums++
            resetPos()
            break
          }

          break
        case 't':
          state.offsetX = pS[0] - (offsetWidth - pS[4]) / 2
          state.offsetX = state.offsetX < 0 ? 0 : state.offsetX > tWidth - offsetWidth ? tWidth - offsetWidth : state.offsetX
          state.offsetY = pS[1] - offsetHeight - state.followPadding
          if (props.config.autoFit && state.offsetY < 0) {
            state.followPosition = 'r'
            state.resetPosNums++
            resetPos()
            break
          }
          break
        case 'b':
          state.offsetX = pS[0] - (offsetWidth - pS[4]) / 2
          state.offsetX = state.offsetX < 0 ? 0 : state.offsetX > tWidth - offsetWidth ? tWidth - offsetWidth : state.offsetX
          state.offsetY = pS[3] + state.followPadding
          if (props.config.autoFit && tHeight - state.offsetY < offsetHeight) {
            state.followPosition = 'l'
            state.resetPosNums++
            resetPos()
            break
          }

          break
        case 'c':
          state.offsetX = pS[0] - (offsetWidth - pS[4]) / 2
          state.offsetY = pS[1] - (offsetHeight - pS[5]) / 2
          state.offsetY = state.offsetY < 0 ? 0 : state.offsetY > tHeight - offsetHeight ? tHeight - offsetHeight : state.offsetY
          state.offsetX = state.offsetX < 0 ? 0 : state.offsetX > tWidth - offsetWidth ? tWidth - offsetWidth : state.offsetX
          break
        default:
          state.followPosition = 'r'
          resetPos()
          break
      }
    }

    /**
     * 自动关闭
     */
    const autoClose = () => {
      if (!props.config.time) return
      helper.sleep(props.config.time).then(close)
    }

    /**
     * 点击遮罩层
     */
    const shadeClicked = () => {
      if (props.config.shadeClose) {
        close()
      }
    }
    /**
     * 按钮点击
     * @param e
     * @param index
     */
    const btnClicked = (e:MouseEvent, btn:IBtn) => {
      !btn.disabled && btn.click && btn.click(e)
    }
    const resetTop = (top:number) => {
      state.layerOpts.top = top + ''
      _restoreRect()
    }
    onMounted(() => {
      if (props.modelValue) {
        open()
      }
      window.addEventListener('resize', autopos, false)
      const telePort:HTMLElement|null = document.querySelector(props.config.teleport || 'body')
      telePort && telePort.addEventListener('mousemove', event => {
        move(event)
      })
      // document.addEventListener('mousemove', event => {
      //   move(event)
      // })
      document.addEventListener('mouseup', () => {
        moveEnd()
        handleGrab(false)
      })
      Active()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', autopos)
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
      refLgsLayer,
      refLgsLayerBefore,
      close,
      resetZIndex,
      move,
      moveEnd,
      shadeClicked,
      btnClicked,
      moveStart,
      toggleFullScreen,
      toggleMinimize,
      deActive,
      Active,
      resetTop,
      resizeStart
    }
  }
})
</script>
<style lang="scss" scoped>
@import './css/index.scss';
</style>
