<template>
  <div ref="elRef" v-show="opened" class="vui__layer" :class="{'vui__layer-closed': closeCls}" :id="id">
    <!-- //蒙版 -->
    <div v-if="shade" class="vlayer__overlay" @click="shadeClicked" :style="'opacity:'+opacity"></div>
    <div class="vlayer__wrap" :class="['anim-'+anim, 'popui__'+type, tipArrow]" :style="[layerStyle]">
      <div v-if="title" class="vlayer__wrap-tit" v-html="title"></div>
      <div v-if="type=='toast'&&icon" class="vlayer__toast-icon" :class="['vlayer__toast-'+icon]" v-html="toastIcon[icon]"></div>
      <div class="vlayer__wrap-cntbox">
        <!-- 判断插槽是否存在 -->
        <template v-if="$slots.content">
          <div class="vlayer__wrap-cnt"><slot name="content" /></div>
        </template>
        <template v-else>
          <template v-if="content">
            <iframe v-if="type=='iframe'" scrolling="auto" allowtransparency="true" frameborder="0" :src="content"></iframe>
            <!-- message|notify|popover -->
            <div v-else-if="type=='message' || type=='notify' || type=='popover'" class="vlayer__wrap-cnt">
              <i v-if="icon" class="vlayer-msg__icon" :class="icon" v-html="messageIcon[icon]"></i>
              <div class="vlayer-msg__group"><div v-if="title" class="vlayer-msg__title" v-html="title"></div><div v-html="content"></div></div>
            </div>
            <div v-else class="vlayer__wrap-cnt" v-html="content"></div>
          </template>
        </template>
        <slot />
      </div>
      <div v-if="btns" class="vlayer__wrap-btns">
        <span v-for="(btn,index) in btns" :key="index" class="btn" :style="btn.style" @click="btnClicked($event,index)" v-html="btn.text"></span>
      </div>
      <span v-if="xclose" class="vlayer__xclose" :class="!maximize&&xposition" :style="{'color': xcolor}" @click="close"></span>
      <span v-if="maximize" class="vlayer__maximize" @click="maximizeClicked($event)"></span>
      <span v-if="resize" class="vlayer__resize"></span>
    </div>
    <!-- 优化拖拽卡顿 -->
    <div class="vlayer__dragfix"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch, toRefs, nextTick, defineComponent, PropType } from 'vue'
import { IBtn, IFollowTarget, IPosition } from './type'
import helper from './utils/helper'
// 索引，蒙层控制，定时器
let $index = 0
let $locknum = 0
const $timer:any = {}
let $closeTimer:any = null

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    // ...
    modelValue: {
      type: Boolean,
      dafault: false
    },
    onSuccess: {
      type: Function as PropType<()=>Promise<void>>,
      default: () => Promise.resolve()
    },
    onEnd: {
      type: Function as PropType<()=>Promise<void>>,
      default: () => Promise.resolve()
    },
    teleport: {
      type: String,
      default: 'body'
    },
    time: {
      type: Number,
      default: null
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object as PropType<IPosition>,
      default: () => {

      }
    },
    fixed: {
      type: Boolean,
      default: true
    },
    follow: {
      type: Object as PropType<IFollowTarget>,
      default: () => {

      }
    },
    // 显示放大按钮
    maximize: {
      type: Boolean,
      default: false
    },
    shade: {
      type: Boolean,
      default: false
    },
    shadeClose: {
      type: Boolean,
      default: false
    },
    btns: {
      type: Array as PropType<IBtn[]>,
      default: () => {
        return []
      }
    },
    opacity: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    },
    // scaleIn | fadeIn | footer | fadeInUp | fadeInDown | fadeInLeft | fadeInRight
    anim: {
      type: String,
      default: 'fadeIn'
    },
    // toast|footer|actionsheet|actionsheetPicker|android|ios|contextmenu|drawer|iframe
    type: {
      type: String,
      default: 'toast'
    },
    layerStyle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: ''
    },
    resize: {
      type: Boolean,
      default: false
    },
    // 是否显示关闭图标
    xclose: {
      type: Boolean,
      default: true
    },
    // 关闭图标位置: left | right | top | bottom
    xposition: {
      type: String,
      default: 'right'
    },
    xcolor: {
      type: String,
      default: 'white'
    },
    theme: {
      type: String,
      default: ''
    }
  },
  emits: [
    'update:modelValue'
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
      id: props.id,
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
      props.onSuccess && props.onSuccess()
      // 弹层挂载位置
      if (props.teleport) {
        nextTick(() => {
          const teleportNode = document.querySelector(props.teleport)
          teleportNode && elRef.value && teleportNode.appendChild(elRef.value)

          auto()
        })
      }

      callback()
    }

    // 关闭弹窗
    const close = () => {
      if (!data.opened) return
      const dom = elRef.value
      if (!dom) return
      const vlayero:HTMLDivElement|null = dom.querySelector('.vlayer__wrap')
      const ocnt:HTMLDivElement|null = dom.querySelector('.vlayer__wrap-cntbox')
      const omax:HTMLDivElement|null = dom.querySelector('.vlayer__maximize')

      data.closeCls = true
      clearTimeout($closeTimer)
      $closeTimer = setTimeout(() => {
        data.opened = false
        data.closeCls = false
        if (data.vlayerOpts.lockScroll) {
          $locknum--
          if (!$locknum) {
            document.body.style.paddingRight = ''
            document.body.classList.remove('vui__body-hidden')
          }
        }
        if (props.time) {
          $index--
        }
        // 清除弹窗样式
        vlayero && (vlayero.style.width = vlayero.style.height = vlayero.style.top = vlayero.style.left = '')
        ocnt && (ocnt.style.height = '')
        omax && omax.classList.contains('maximized') && omax.classList.remove('maximized')

        data.vlayerOpts.isBodyOverflow && (document.body.style.overflow = '')

        context.emit('update:modelValue', false)
        props.onEnd && props.onEnd()
      }, 200)
    }

    // 弹窗位置
    const auto = () => {
      // ...

      autopos()

      // 全屏弹窗
      if (props.fullscreen) {
        full()
      }

      // 弹窗拖动|缩放
      move()
    }

    const autopos = () => {
      if (!data.opened) return
      let oL, oT
      const pos = props.position
      const isFixed = props.fixed
      if (!elRef.value) return
      const vlayero:HTMLDivElement|null = elRef.value.querySelector('.vlayer__wrap')
      if (!vlayero) return
      if (!isFixed || props.follow) {
        vlayero && (vlayero.style.position = 'absolute')
      }

      const area = [helper.client('width'), helper.client('height'), vlayero.offsetWidth, vlayero.offsetHeight]

      oL = (area[0] - area[2]) / 2
      oT = (area[1] - area[3]) / 2

      if (props.follow) {
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
      const dom = elRef.value
      if (!dom) return
      const vlayero:HTMLDivElement|null = dom.querySelector('.vlayer__wrap')
      if (!vlayero) return
      const oW = vlayero.offsetWidth
      const oH = vlayero.offsetHeight
      const pS = helper.getFollowRect(props.follow, oW, oH)
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

      props.maximize && omax && omax.classList.remove('maximized')

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
      if (props.time) {
        $index++
        // 防止重复点击
        if ($timer[$index] !== null) clearTimeout($timer[$index])
        $timer[$index] = setTimeout(() => {
          close()
        }, props.time)
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
      if (props.shadeClose) {
        close()
      }
    }
    // 按钮事件
    const btnClicked = (e:MouseEvent, index:number) => {
      const btn = props.btns[index]
      if (!btn.disabled) {
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
