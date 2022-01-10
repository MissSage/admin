<template>
  <div ref="elRef" v-show="opened" class="vui__layer" :class="[closeCls&&'vui__layer-closed']" :id="id">
    <!-- //蒙版 -->
    <div v-if="config.shade" class="vlayer__overlay" @click="shadeClicked" :style="'opacity:'+config.opacity"></div>
    <div class="vlayer__wrap" :class="['anim-'+config.anim, 'popui__'+config.type, tipArrow, config.theme]" :style="[config.layerStyle?config.layerStyle:'']">
      <div v-if="config.title" class="vlayer__wrap-tit" v-html="config.title"></div>
      <div v-if="config.type=='toast'&&config.icon" class="vlayer__toast-icon" :class="['vlayer__toast-'+config.icon]" v-html="toastIcon[config.icon]"></div>
      <div class="vlayer__wrap-cntbox">
        <!-- 判断插槽是否存在 -->
        <template v-if="$slots.content">
          <div class="vlayer__wrap-cnt"><slot name="content" /></div>
        </template>
        <template v-else>
          <template v-if="config.content">
            <iframe v-if="config.type=='iframe'" scrolling="auto" allowtransparency="true" frameborder="0" :src="config.content"></iframe>
            <!-- message|notify|popover -->
            <div v-else-if="config.type=='message' || config.type=='notify' || config.type=='popover'" class="vlayer__wrap-cnt">
              <i v-if="config.icon" class="vlayer-msg__icon" :class="config.icon" v-html="messageIcon[config.icon]"></i>
              <div class="vlayer-msg__group">
                <div v-if="config.title" class="vlayer-msg__title" v-html="config.title"></div>
                <div v-html="config.content"></div>
              </div>
            </div>
            <div v-else class="vlayer__wrap-cnt" v-html="config.content"></div>
          </template>
        </template>
        <slot />
      </div>
      <div v-if="config.btns" class="vlayer__wrap-btns">
        <span v-for="(btn,index) in config.btns" :key="index" class="btn" :style="btn.style" @click="btnClicked($event,index)" v-html="btn.text"></span>
      </div>
      <span v-if="config.xclose" class="vlayer__xclose" :class="!config.maximize&&config.xposition" :style="{'color': config.xcolor}" @click="close"></span>
      <span v-if="config.maximize" class="vlayer__maximize" @click="maximizeClicked($event)"></span>
      <span v-if="config.resize" class="vlayer__resize"></span>
    </div>
    <!-- 优化拖拽卡顿 -->
    <div class="vlayer__dragfix"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, toRefs, nextTick, defineComponent, PropType } from 'vue'
import type { ILgsLayerConfigs } from './type'
import helper from './utils/helper'
// 索引，蒙层控制，定时器
let $index = 0
let $locknum = 0
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
    const data = reactive<{
      id: string,
      opened: boolean,
      closeCls: boolean,
      toastIcon: Record<string, string>,
      messageIcon: any,
      vlayerOpts: any,
      tipArrow: any
    }>({
      id: props.config.id || '',
      opened: false,
      closeCls: true,
      toastIcon: {
        // ...
      },
      messageIcon: {
        // ...
      },
      vlayerOpts: {},
      tipArrow: null
    })

    onMounted(() => {
      if (props.modelValue) {
        open()
      }
      window.addEventListener('resize', autopos, false)
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

    // 打开弹窗
    const open = () => {
      if (data.opened) return
      data.opened = true
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
      if (!data.opened) return

      data.closeCls = true
      clearTimeout($closeTimer)
      $closeTimer = setTimeout(() => {
        data.opened = false
        data.closeCls = false
        if (data.vlayerOpts.lockScroll) {
          $locknum--
          if (!$locknum) {
            //
          }
        }
        if (props.config.time) {
          $index--
        }

        context.emit('update:modelValue', false)
        context.emit('destroy')
        props.config.onEnd && props.config.onEnd()
      }, 200)
    }

    // 弹窗位置
    const auto = () => {
      // ...

      autopos()

      // 全屏弹窗
      if (props.config.fullscreen) {
        full()
      }

      // 弹窗拖动|缩放
      move()
    }

    const autopos = () => {
      if (!data.opened) return
      let oL, oT
      const pos = props.config.position
      const isFixed = props.config.fixed
      if (!elRef.value) return
      const vlayero:HTMLDivElement|null = elRef.value.querySelector('.vlayer__wrap')
      if (!vlayero) return
      if (!isFixed || props.config.follow) {
        vlayero && (vlayero.style.position = 'absolute')
      }

      const area = [helper.client('width'), helper.client('height'), vlayero.offsetWidth, vlayero.offsetHeight]

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

        vlayero.style.left = (isFixed ? oL : helper.scroll('left') + oL) + 'px'
        vlayero.style.top = (isFixed ? oT : helper.scroll('top') + oT) + 'px'
      }
    }

    // 元素跟随定位
    const offset = () => {
      if (!props.config.follow) return
      const dom = elRef.value
      if (!dom) return
      const vlayero:HTMLDivElement|null = dom.querySelector('.vlayer__wrap')
      if (!vlayero) return
      const oW = vlayero.offsetWidth
      const oH = vlayero.offsetHeight
      const pS = helper.getFollowRect(props.config.follow, oW, oH)
      data.tipArrow = pS[4]

      vlayero.style.left = pS[0] + 'px'
      vlayero.style.top = pS[1] + 'px'
    }

    // 最大化弹窗
    const full = () => {
      // ...
    }

    // 恢复弹窗
    const restore = () => {
      const dom = elRef.value
      if (!dom) return
      const vlayero:HTMLElement|null = dom.querySelector('.vlayer__wrap')
      if (!vlayero) return
      // const otit:HTMLElement|null = dom.querySelector('.vlayer__wrap-tit')
      // const ocnt:HTMLElement|null = dom.querySelector('.vlayer__wrap-cntbox')
      // const obtn:HTMLElement|null = dom.querySelector('.vlayer__wrap-btns')
      const omax:HTMLElement|null = dom.querySelector('.vlayer__maximize')

      // const t = otit ? otit.offsetHeight : 0
      // const b = obtn ? obtn.offsetHeight : 0

      if (!data.vlayerOpts.lockScroll) {
        data.vlayerOpts.isBodyOverflow = false
        document.body.style.overflow = ''
      }

      props.config.maximize && omax && omax.classList.remove('maximized')

      vlayero.style.left = parseFloat(data.vlayerOpts.rect[0]) + 'px'
      vlayero.style.top = parseFloat(data.vlayerOpts.rect[1]) + 'px'
      vlayero.style.width = parseFloat(data.vlayerOpts.rect[2]) + 'px'
      vlayero.style.height = parseFloat(data.vlayerOpts.rect[3]) + 'px'
    }

    // 拖动|缩放弹窗
    const move = () => {
      // ...
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
    const maximizeClicked = (e:MouseEvent) => {
      const o = e.target as HTMLElement
      if (o && o.classList.contains('maximized')) {
        // 恢复
        restore()
      } else {
        // 最大化
        full()
      }
    }
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

    return {
      ...toRefs(data),
      ...toRefs(props),
      elRef,
      close,
      maximizeClicked,
      shadeClicked,
      btnClicked
    }
  }
})
</script>
