// import ILayerBox from './type'
import {
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode, defineComponent,
  h,
  isVNode, normalizeClass, normalizeStyle,
  onMounted, openBlock, PropType, reactive, ref, render, renderSlot,
  toDisplayString, toRefs,
  Transition, vShow, withCtx, withDirectives, withModifiers
} from 'vue'
import Helper from './helper'
import { DraggableOptions, ILayerInsArr } from '../type'

// import LgsLayerConstructor from './index.vue'
const script = defineComponent({
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
        width: Helper.evenNumber(state.width) + 'px',
        height: Helper.evenNumber(state.height) + 'px',
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

function render1 (_ctx:any, _cache:any, $props:any, $setup:any, $data:any, $options:any) {
  return (openBlock(), createBlock(Transition, {
    name: 'lgs-drag-fade',
    onBeforeLeave: _ctx.onClose,
    onAfterLeave: _cache[3] || (_cache[3] = ($event:any) => _ctx.$emit('destroy'))
  }, {
    default: withCtx(() => [
      withDirectives(createElementVNode('div', {
        id: _ctx.id,
        ref: 'lgsLayer',
        class: normalizeClass([
          'lgs-drag',
          _ctx.theme
        ]),
        style: normalizeStyle(_ctx.getBaseStyle),
        onMousemove: _cache[1] || (_cache[1] = (...args:any[]) => _ctx.move && _ctx.move(...args)),
        onMouseleave: _cache[2] || (_cache[2] = (...args:any[]) => _ctx.moveEnd && _ctx.moveEnd(...args))
      }, [
        createElementVNode('div', {
          class: normalizeClass([
            'lgs-drag-header',
            _ctx.theme + '-drag--header'
          ]),
          onMousedown: _cache[4] || (_cache[4] = (...args:any[]) => _ctx.moveStart && _ctx.moveStart(...args))
        }, [
          renderSlot(_ctx.$slots, 'header', {}, () => [
            (openBlock(), createElementBlock('span', {
              class: normalizeClass([
                'lgs-drag-header-text'
              ])
            }, toDisplayString(_ctx.title), 1))]
          ),
          _ctx.showClose
            ? (openBlock(), createElementBlock('div', {
                key: 1,
                class: 'lgs-drag-header-right icon iconfont icon-close',
                onClick: _cache[0] || (_cache[0] = withModifiers((...args:any[]) => _ctx.$emit('destroy'), ['stop']))
              }))
            : createCommentVNode('v-if', true)
        ]),
        createElementVNode('div', {
          class: normalizeClass([
            'lgs-drag-main',
            _ctx.theme + '-drag--main'
          ])
        },
        [
          renderSlot(_ctx.$slots, 'default', {}, () => [
            createElementVNode('div', {}
              , [
                h(_ctx.options.content)
              ]
            )
          ])
        ], 1)

      ], 46, ['id']), [
        [vShow, _ctx.visible]
      ])
    ]),
    _: 3
  }, 8, ['onBeforeLeave']))
}
script.render = render1
script.__file = './index.vue'
class LgsLayerBox {
  constructor () {
    this.currentId = ''
    this.layers = []
    this.defOptions = {
      type: 0, // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）,5msg,6prompt
      title: '信息',
      content: '',
      icon: -1,
      btn: '确定',
      time: 0,
      maxmin: false, // 最大最小化
      shade: true,
      yes: '',
      cancel: '',
      tips: [0, {}], // 支持上右下左四个方向，通过1-4进行方向设定,可以设定tips: [1, '#c00']
      tipsMore: false, // 是否允许多个tips
      shadeClose: true,
      scrollbar: true, // 是否允许浏览器出现滚动条:默认是允许
      resize: false, // 是否允许拉伸，默认是不允许
      offsetX: 500,
      offsetY: 500,
      width: 250,
      height: 200
    }
  }

  defOptions:DraggableOptions
  currentId:string
  layers:ILayerInsArr[]
  open (options:any) {
    options = Helper.mergeJson(options, this.defOptions)
    let maxSeed = Helper.getMaxSeed(this.layers)
    if (maxSeed === undefined) maxSeed = 0
    const id = `lgslayer_${new Date().getTime()}_${maxSeed++}`
    options.id = id
    const container = document.createElement('div')
    container.className = `${id}_container`
    const child = options.options.content
    // 创建虚拟节点
    const vm = createVNode(
      script,
      options,
      isVNode(child) ? { default: () => child } : child
    )
    vm.props && (vm.props.onDestroy = () => {
      render(null, container)
    })
    render(vm, container)
    this.layers.push({ id: id, layer: vm })
    container.firstElementChild && document.body.appendChild(container.firstElementChild)
  }

  close (id:string, userCallback:()=>void) {
    const idx = this.layers.findIndex(item => item.id === id)
    this.layers.splice(idx, 1)
  }

  closeAll () {
    let _a
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const instance:any = this.layers[i].layer.vm.component
      _a = instance && instance.proxy
      _a && _a.close()
    }
  }
}
export default LgsLayerBox
