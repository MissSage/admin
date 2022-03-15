<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <template #title>
      <CardHeader :status="config.status" :icon-class="config.iconClass" :title="config.title" />
    </template>
    <template #default>
      <el-form label-position="left">
        <el-form-item label="自定义时间">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            range-separator="到"
            start-placeholder="起始时间"
            end-placeholder="终止时间"
            @change="refreshData"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="chartBox">
        <VChart :option="chartOption" style="width: 100%; height: 100%"></VChart>
      </div>
    </template>
  </SLDialog>
</template>

<script lang="ts">
import CardHeader from './cardHeader.vue'
import SLDialog from '@/components/SLDialog/index.vue'
import * as echarts from 'echarts'
import { hexToRgba } from '@/utils/chartUtils'
import { defineComponent, nextTick, onMounted, PropType, reactive, toRefs, watch } from 'vue'
import { IDialogConfig, QueryTrendListParam } from '../..'
import useHistory from '../hooks/useHistory'
import moment from 'moment'
import { removeSlash } from '@/utils/removeIdSlash'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  name: 'TrendDialog',
  components: {
    SLDialog,
    CardHeader
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object as PropType<IDialogConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['update:model-value'],
  setup(props, ctx) {
    const { getTrendList, TrendList } = useHistory()
    const getData = (data?: any[], isRandom?: boolean) => {
      if (!data) data = []
      for (let i = 0; i < 30; i++) {
        if (isRandom) {
          data.push(Math.random() * 100)
        } else {
          data.push('10.' + i)
        }
      }
      return data
    }
    // codes here
    const state = reactive<{
      date: any[]
      slDialogConfig: ISLDialogConfig
      chartOption: any
    }>({
      date: [moment().valueOf() - 86400000, new Date()],
      slDialogConfig: {
        title: props.config.title,
        visible: props.modelValue,
        scrollbar: true,
        cancel: {
          handler: async() => await ctx.emit('update:model-value', false),
          text: '关 闭'
        },
        width: '60%'
      },
      chartOption: null
    })
    const initconstBJQST_options = () => {
      const data: any[] = []
      const xData: string[] = []
      TrendList.value.map(item => {
        data.push(item.value)
        xData.push(item.label)
      })
      const options = {
        backgroundColor: '#1A1D2D',
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          name: '%',
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#40424D'
            }
          }
        },
        series: [
          {
            data: data,
            name:'百分比值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            color: '#4EE5A8',
            lineStyle: {
              color: '#4EE5A8',
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: hexToRgba('#4EE5A8', 0.4)
                },
                {
                  offset: 1,
                  color: hexToRgba('#4EE5A8', 0)
                }
              ])
            }
          }
        ]
      }
      state.chartOption = options
    }
    const refreshData = async () => {
      if (!props.config.deviceId || !props.config.propId) {
        TrendList.value = []
        return
      }
      const [start, end] =
        state.date && state.date.length === 2
          ? [moment(state.date[0]).valueOf(), moment(state.date[1]).valueOf()]
          : [moment().valueOf() - 86400000, moment().valueOf()]
      const params: QueryTrendListParam = {
        start: start,
        end: end,
        type: '15m',
        attributes: [removeSlash(props.config.deviceId || '') + '.' + props.config.propId]
      }
      await getTrendList(params)
      nextTick(() => {
        initconstBJQST_options()
      })
    }
    watch(
      () => props.config.visible,
      newVal => {
        state.slDialogConfig.visible = newVal
      },
      {
        immediate: true
      }
    )
    onMounted(async () => {
      await refreshData()
    })
    return {
      ...toRefs(state),
      refreshData,
      getData
    }
  }
})
</script>

<style lang="scss" scoped>
.device-control__header {
  position: relative;
  margin-left: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
  .device-control__header-title {
    flex: 1;
    line-height: 20px;
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
      background-color: lightgreen;
    }
  }
  &.off {
    &::before {
      background-color: red;
    }
  }
}
.chartBox {
  height: 500px;
  width: 100%;
  min-height: 500px;
}
:deep(.el-range-separator) {
  line-height: 32px !important;
}
</style>
