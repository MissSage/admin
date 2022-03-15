<template>
  <div class="location-map">
    <div class="location-search-box">
      <div class="location-input-box">
        <span class="location-label">经度：</span>
        <el-input-number
          v-model="x"
          :disabled="disabled"
          :precision="4"
          size="small"
          class="location-input"
          @change="handleLocation"
        ></el-input-number>
        <span class="location-label margin-l-10">纬度：</span>
        <el-input-number
          v-model="y"
          :disabled="disabled"
          :precision="4"
          size="small"
          class="location-input"
          @change="handleLocation"
        ></el-input-number>
      </div>
      <p v-if="!disabled" class="message-text">提示：请拖动地图 设置位置信息</p>
    </div>
    <div class="get-location-box amap-container">
      <div id="innerAmap" style="height: 100%; width: 100%"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  PropType,
  reactive,
  toRefs
} from 'vue'
import useAmap from '@/hooks/useAmap'
import { IPolyline } from './type'
export default defineComponent({
  name: 'SLAmap',
  props: {
    modelValue: {
      type: String,
      default: null
    },
    polylines: {
      type: Array as PropType<IPolyline[]>,
      default: () => {
        return []
      }
    },
    resultType: {
      type: String as PropType<'arrStr' | 'str'>,
      default: 'arrStr'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, ctx) {
    const defaultCenter = [116, 39]
    const state = reactive<{
      x: number | undefined
      y: number | undefined
      centerMarker: any
      amap: any
    }>({
      x: undefined,
      y: undefined,
      centerMarker: null,
      amap: null
    })
    // amap封装，可以自定义修改接口  hooks/amap
    const { setMarker, setCenter, initAMap, setPolylines } = useAmap()
    const setMark = () => {
      if (state.x !== undefined && state.y !== undefined) {
        state.centerMarker = setMarker([state.x, state.y], {
          icon: require('@/assets/icons/map-location.png')
        })
      } else {
        state.centerMarker = setMarker(defaultCenter, {
          icon: require('@/assets/icons/map-location.png')
        })
      }
    }
    const positionValid = computed(() => {
      if (state.x !== undefined && state.y !== undefined) {
        return [state.x, state.y]
      } else {
        return null
      }
    })
    const initMap = async () => {
      const mapConfig = {
        // 地图要绑定的事件
        events: {
          mapmove: (map: any) => {
            const center = map.getCenter()
            if (!props.disabled) {
              state.x = center.lng
              state.y = center.lat
              handleLocation()
              // 如果disabled，则移动地图不更新表单
              !props.disabled && updateValue()
            }
          }
        },
        search: {
          input: 'innerAmapSearch',
          select: (center: number[]) => {
            setCenter(center)
          }
        },

        mapStyle: 'amap://styles/darkblue'
      }

      state.amap = await initAMap('innerAmap', mapConfig)
      if (positionValid.value) {
        setMark()
        // 画线
        initPolylines(mapConfig)
        handleLocation()
        props.required && updateValue()
      } else {
        if (props.required) {
          updateValue()
          setMark()
          initPolylines(mapConfig)
          handleLocation()
        } else {
          // handleLocation()
        }
      }
    }
    /**
     * 画多条线
     */
    const initPolylines = (config: any) => {
      setPolylines(props.polylines, config)
    }
    const handleLocation = () => {
      const cener = positionValid.value ? [state.x, state.y] : defaultCenter
      state.amap && state.amap.setCenter(cener)
      if (!state.centerMarker) setMark()
      state.centerMarker && state.centerMarker.setPosition(cener)
    }
    const updateValue = () => {
      let result = ''
      if (props.resultType === 'arrStr') {
        result = positionValid.value
          ? JSON.stringify([state.x, state.y])
          : JSON.stringify(defaultCenter)
      } else {
        result = positionValid.value ? [state.x, state.y].join(',') : defaultCenter.join()
      }
      ctx.emit('update:modelValue', result)
    }

    const formateModelValue = () => {
      if ((props.modelValue as any) instanceof Array && props.modelValue.length === 2) {
        state.x = parseFloat(props.modelValue[0])
        state.y = parseFloat(props.modelValue[1])
        return
      }
      try {
        const lonlat = JSON.parse(props.modelValue)
        if (lonlat instanceof Array) {
          if (lonlat.length === 2) {
            state.x = parseFloat(lonlat[0])
            state.y = parseFloat(lonlat[1])
          }
        }
      } catch (error) {
        // 传入的是以','分隔的字符串
        const lonlat = props.modelValue.trim().split(',')
        if (lonlat.length === 2) {
          state.x = parseFloat(lonlat[0])
          state.y = parseFloat(lonlat[1])
        }
      }
    }
    onBeforeMount(() => {
      formateModelValue()
    })
    // codes here
    onMounted(async () => {
      initMap()
    })
    return {
      ...toRefs(state),
      formateModelValue,
      handleLocation,
      initMap,
      positionValid,
      updateValue
    }
  }
})
</script>

<style lang="scss" scoped>
@import 'src/assets/css/amapSearchStyle.scss';

.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.get-location-box {
  width: 100%;
  height: 250px;
}
</style>
