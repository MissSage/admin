<template>
  <CardTable :config="cardTableConfig"></CardTable>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, toRefs, watch } from 'vue'
import CardTable from '@/components/cardTable/index.vue'
import useAlarm from '../hooks/useAlarm'
import { IControlAlarmDetail } from '../..'
import useGlobal from '@/hooks/global/useGlobal'
export default defineComponent({
  name: 'AlarmDetail',
  components: { CardTable },
  props: {
    list: {
      type: Array as PropType<IControlAlarmDetail[]>,
      default: () => {
        return []
      }
    }
  },
  setup(props) {
    const { $format } = useGlobal()
    const state = reactive<{
      cardTableConfig: CTCardTable
    }>({
      cardTableConfig: {
        loading: false,
        dataList: props.list,
        selectList: [],
        columns: [
          {
            prop: 'ts',
            label: '触发时间',
            formatter: (row: IControlAlarmDetail) => (row.ts ? $format(new Date(row.ts)) : '')
          },
          {
            prop: 'status',
            label: '触发状态',
            formatter: (row: IControlAlarmDetail) =>row.status.toUpperCase() === 'ALARM' ? '触发报警' : '恢复'
          },
          {
            prop: 'info',
            label: '报警内容'
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: props.list.length,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            state.cardTableConfig.pagination.limit = val
            state.cardTableConfig.dataList = props.list.slice(0, parseInt(val.toString()))
            // refreshData()
          },
          pageHandle: val => {
            state.cardTableConfig.pagination.page = val
            val <= 1 && (val = 1)
            state.cardTableConfig.dataList = props.list.slice(
              parseInt(state.cardTableConfig.pagination.limit.toString()) *
                (parseInt(val.toString()) - 1),
              parseInt(state.cardTableConfig.pagination.limit.toString()) * parseInt(val.toString())
            )

            // refreshData()
          }
        }
      }
    })
    watch(
      () => props.list,
      newVal => {
        state.cardTableConfig.dataList = newVal
      }
    )
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped></style>
