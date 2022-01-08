<template>
  <div
    class="vl-notify vl-notify-main vl-notify-alert"
    :class="cls"
    @mousemove="move"
    @mouseup="moveEnd"
    @focus="resetZIndex"
    tabindex="1"
    :id="id"
    :style="getBaseStyle"
    :minindex="minindex"
  >
    <h2 class="vl-notice-title" @mousedown="moveStart">
      <span v-html="options.title" class="lv-title" />
      <template v-if="options.maxmin == true">
        <span class="lv-icon-maxmini">
          <template v-if="maxMiniState === 0">
            <i class="vlayer vlicon-mini lv-icon-mini" @click="mini" />
            <i class="vlayer vlicon-max lv-icon-max" @click="max" />
          </template>
          <template v-else-if="maxMiniState === 1">
            <i class="vlayer vlicon-huanyuan lv-icon-max" @click="maxmini" />
          </template>
          <template v-else-if="maxMiniState === 2">
            <i class="vlayer vlicon-huanyuan lv-icon-min" @click="maxmini" />
          </template>
        </span>
      </template>
      <i class="icon-remove" @click="close" />
    </h2>
    <slot />
    <span
      class="vl-drag-resize"
      @mousedown="resizeHand"
      @mouseup="resizeHandMoveEnd"
      v-if="options.resize"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import helper from '../utils/LgsLayerHelper'
import { LgsLayerDefOptions } from '@/components/LgsLayer/@types/index'

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<LgsLayerDefOptions>,
      default: () => {
        return {}
      }
    },
    cls: {
      type: Object as PropType<any>,
      default: () => {
        return {
          'vl-notify-alert': true
        }
      }
    }
  },
  setup (props) {
    const state = reactive<{
      moveLeft: number // 左移的距离
      moveTop: number // 上移的距离
      ismove: boolean
      id: string
      zindex: number
      addStyle: any
      minindex: number
      maxMiniState: number // 0normal,1mini,2max
      resize: {
        isResize: boolean
        oWidth: number
        oHeight: number
        moveLeft: number
        moveTop: number
        tt: any
      }
    }>({
      moveLeft: 0, // 左移的距离
      moveTop: 0, // 上移的距离
      ismove: false,
      id: 'vlip' + new Date().getTime(),
      zindex: 1,
      addStyle: {},
      minindex: -2,
      maxMiniState: 0, // 0normal,1mini,2max
      resize: {
        isResize: false,
        oWidth: 0,
        oHeight: 0,
        moveLeft: 0,
        moveTop: 0,
        tt: {}
      }
    })
    onMounted(async () => {
      if (props.options.shade) {
        await helper.sleep(20)
        // 是否显示遮罩
        document
          .getElementsByClassName('vl-notify-mask')[0]
          .addEventListener('mousemove', (event:any) => {
            move(event)
          })
        document
          .getElementsByClassName('vl-notify-mask')[0]
          .addEventListener('mouseup', () => {
            moveEnd()
          })
      } else {
        document.addEventListener('mousemove', event => {
          move(event)
        })
        document.addEventListener('mouseup', () => {
          moveEnd()
        })
      }
      resetZIndex()
    })
    const getBaseStyle = computed(() => {
      // 获取z-index
      resetZIndex()
      const op = props.options
      const offset = (!op.offset || op.offset === 'auto') ? [500, 500, 0] : op.offset
      const area = (!op.area || op.area === 'auto') ? ['500', '500'] : op.area
      const styleBase = {
        left: offset[0] + 'px',
        top: offset[1] + 'px',
        margin: offset[2],
        zIndex: state.zindex,
        width: helper.evenNumber(area[0]),
        height: helper.evenNumber(area[1]),
        overflow: 'hidden'
      }
      const a = helper.deepClone(styleBase)
      return mergeJson(a, state.addStyle)
    })
    const mergeJson = (options:any, def:any) => {
      for (const key in def) {
        options[key] = def[key]
      }
      return options
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
      const keys = Object.keys(props.cls)
      const doms = document.querySelectorAll('.' + keys[0]) // vl-notify-iframe
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

    const close = async (event:MouseEvent) => {
      await helper.btncancel(event, props.options)
      state.id && helper.maskClose(event, props.options.layer, state.id)
    }
    const mini = () => {
      // 最小化窗口
      const dom = state.id && document.getElementById(state.id)
      const miniindex = dom && dom.getAttribute('minindex')
      let domMinIndex = (miniindex && parseInt(miniindex)) || -1
      if (domMinIndex < 0) {
        const iframeMinList = props.options.layer.iframeMinList
        for (let i = 0, len = iframeMinList.length; i < len; i++) {
          if (iframeMinList[i] === -1) {
            state.minindex = i
            domMinIndex = i
            iframeMinList[i] = 1
            break
          }
        }
        if (state.minindex === -2) {
          iframeMinList.push(1)
          state.minindex = iframeMinList.length - 1
          domMinIndex = iframeMinList.length - 1
        }
      }
      state.addStyle = {
        overflow: 'hidden',
        bottom: 0,
        left: 250 * domMinIndex + 135 + 'px',
        width: '100px',
        height: '42px',
        minHeight: '42px',
        top: 'auto'
      }
      state.maxMiniState = 1
    }
    const max = () => {
      // 最大化窗口
      let height = document.documentElement.clientHeight
      if (height % 2 === 1) {
        height += 1
      }
      state.addStyle = {
        overflow: 'hidden',
        left: '50%',
        width: '100%',
        height: height + 'px',
        minHeight: '42px'
      }
      state.maxMiniState = 2
    }
    const maxmini = () => { // 还原
      const dom = state.id && document.getElementById(state.id)
      dom && dom.removeAttribute('style')
      state.addStyle = {
        left: 'tpx',
        top: 'tpx',
        margin: 't'
      }
      state.maxMiniState = 0
    }
    const moveStart = (event:MouseEvent) => {
      helper.moveStart(event, props.options)
      state.moveLeft = event.clientX
      state.moveTop = event.clientY
      state.ismove = true
    }

    const move = (event:MouseEvent) => {
      if (state.ismove) {
        const o = document.getElementById(state.id + '')
        if (!o) return
        const offset = ((!props.options.offset) || props.options.offset === 'auto' || props.options.offset.length < 2) ? [500, 500, 0] : props.options.offset

        let top = offset[1] + (event.clientY - state.moveTop)
        const docOffsetHeight = o.offsetHeight / 2
        let left = offset[0] + (event.clientX - state.moveLeft)
        const docOffsetWidth = o.offsetWidth / 2
        if (top <= docOffsetHeight) {
          // 顶部边界
          top = docOffsetHeight
        }
        if (left <= docOffsetWidth) {
          // 左侧边界
          left = docOffsetWidth
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
        o.style.left = left + 'px'
        o.style.top = top + 'px'
        resetZIndex()
      }
    }
    const moveEnd = () => {
      state.ismove = false
      state.resize.isResize = false
    }
    const resizeHand = (event:MouseEvent) => {
      // 拉伸操作
      const o = document.getElementById(state.id + '')
      if (!o) return
      state.resize.oWidth = o.offsetWidth
      state.resize.oHeight = o.offsetHeight
      state.resize.moveTop = event.clientY
      state.resize.moveLeft = event.clientX
      state.resize.isResize = true
      document.body.addEventListener('mousemove', e => {
        resizeHandMove(e)
      })
    }

    const resizeHandMove = (event:MouseEvent) => {
      if (state.resize.isResize) {
        const o = document.getElementById(state.id + '')
        const top = event.clientY
        const left = event.clientX

        let oWidth = state.resize.oWidth + (left - state.resize.moveLeft) * 2
        const oHeight = state.resize.oHeight + (top - state.resize.moveTop) * 2

        // console.log('top', o.offsetHeight / 2, o.getBoundingClientRect().top);

        if (oWidth < 200 || oHeight < 200) {
          return
        }
        if (!o) return
        // 控制边界
        const clientRect = o.getBoundingClientRect()

        // 右边界
        const docWidth = document.documentElement.clientWidth
        if (clientRect.right > docWidth) {
          oWidth = docWidth - 20
        }
        // 底边界
        // let docHeight = document.documentElement.clientHeight;
        // console.log('clientRect', clientRect, docHeight);
        // if (clientRect.right > docHeight) {
        //   oHeight = docHeight - 20;
        // }
        o.style.width = oWidth + 'px'
        o.style.height = oHeight + 'px'

        // 上边界
        if (clientRect.top < 0) {
          o.style.top = (o.getBoundingClientRect().height / 2) + 'px'
        }
        // 左边界
        if (clientRect.left < 0) {
          o.style.left = (o.getBoundingClientRect().width / 2) + 'px'
        }
        // 下边界
        if (clientRect.left < 0) {
          o.style.left = (o.getBoundingClientRect().width / 2) + 'px'
        }
      }
    }
    const resizeHandMoveEnd = () => {
      setTimeout(() => {
        state.resize.isResize = false
        document.body.removeEventListener('mousemove', e => {
          resizeHandMove(e)
        })
      }, 50)
    }
    return {
      ...toRefs(props),
      ...toRefs(state),
      getBaseStyle,
      mergeJson,
      getStyle,
      resetZIndex,
      close,
      mini,
      max,
      maxmini,
      move,
      moveStart,
      moveEnd,
      resizeHand,
      resizeHandMove,
      resizeHandMoveEnd
    }
  }
})

</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>
