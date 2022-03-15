<template>
  <div class="table-wrapper">
    <div class="table-container" :class="config.pagination.hide ? 'table-full' : ''">
      <el-table
        ref="elTable"
        :border="true"
        :loadding="config.loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
        :data="config.dataList"
        :height="config.height === 'none' ? undefined : config.height || '100%'"
        :max-height="config.maxHeight === 'none' ? undefined : config.maxHeight || '100%'"
        :header-row-class-name="'color-header'"
        style="width: 100%"
        :show-summary="config.showSummary"
        :summary-method="(getSummaries as any)"
        :highlight-current-row="true"
        @row-dblclick="(row:any)=>config.handleRowDbClick&&config.handleRowDbClick(row)"
        @row-click="(row:any)=>config.handleRowClick&&config.handleRowClick(row)"
        @selection-change="(val:any)=>config.handleSelectChange&&config.handleSelectChange(val)"
      >
        <!-- checkbox 根据是否配置了 selectChange 选项来控制显隐 -->
        <el-table-column
          v-if="config.handleSelectChange"
          :align="'center'"
          type="selection"
          width="55px"
        ></el-table-column>
        <!-- 序号列 根据 indexVisible 判断是否有序号列 -->

        <el-table-column
          v-if="config.indexVisible"
          :label="
            typeof config.indexVisible === 'boolean' ? '序号' : config.indexVisible?.label || '序号'
          "
          type="index"
          :align="
            typeof config.indexVisible === 'boolean'
              ? 'center'
              : config.indexVisible.align || 'center'
          "
          :width="
            typeof config.indexVisible === 'boolean' ? '55px' : config.indexVisible.width || '55px'
          "
          :fixed="
            typeof config.indexVisible === 'boolean' ? 'left' : config.indexVisible.fixed || 'left'
          "
        ></el-table-column>
        <el-table-column v-if="config.sort" :prop="config.sort.prop">
          <template #default="scope">
            <span v-if="scope.$index + 1 === 1" :class="{ 'sort-1': config.sort?.showBackground }">
              {{ scope.$index + 1 }}
            </span>
            <span
              v-else-if="scope.$index + 1 === 2"
              :class="{ 'sort-2': config.sort?.showBackground }"
            >{{ scope.$index + 1 }}</span>
            <span
              v-else-if="scope.$index + 1 === 3"
              :class="{ 'sort-3': config.sort?.showBackground }"
            >{{ scope.$index + 1 }}</span>
            <span v-else>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <!-- 遍历列配置 -->
        <el-table-column
          v-for="item in config.columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'left'"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template #default="scope">
            <SLFormItem
              v-if="item.slFormItemConfig"
              v-model="scope.row[item.prop]"
              :config="item.slFormItemConfig"
              @change="val => item.handleChange && item.handleChange(scope.row, val)"
            ></SLFormItem>
            <template v-else>
              <!-- 表格项 图标 -->
              <i v-if="item.icon" :class="item.icon"></i>
              <el-image
                v-else-if="item.image"
                style="width: 100px; height: 100px; margin-top: 5px"
                :style="item.cellStyle"
                :src="pic(scope.row[item.prop], false)"
                :preview-src-list="pic(scope.row[item.prop], true)"
              />
              <span
                v-else
                class="table-cell"
                :style="item.cellStyle"
                :class="item.className"
                @click="item.handleClick && item.handleClick(scope.row)"
              >
                {{
                  item.formatter
                    ? item.formatter(scope.row, scope.row[item.prop], item.prop)
                    : scope.row[item.prop]
                }}
              </span>
            </template>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          v-if="config.operations && operationVisible"
          label="操作"
          :fixed="config.operationFixed || 'right'"
          :header-align="'left'"
          :align="'center'"
          :width="config.operationWidth || '120px'"
        >
          <template #default="scope">
            <div class="operation-btn-box">
              <SLButton
                v-for="(btn, i) in config.operations"
                :key="i"
                :config="btn"
                :row="scope.row"
              ></SLButton>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SLPagination v-if="!config.pagination?.hide" :config="config.pagination"></SLPagination>
  </div>
</template>

<script lang="ts">
import { IElTable } from '@/common/types/element-plus'
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { fileStrToArr } from '../SLUploader'
import { ISLTableConfig } from './type'
import SLPagination from '../SLPagination/index.vue'
import SLFormItem from '@/components/SLFormItem/index.vue'
import SLButton from '@/components/SLButton/index.vue'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
export default defineComponent({
  name: 'SLTable',
  components: { SLPagination, SLFormItem, SLButton },
  props: {
    config: {
      type: Object as PropType<ISLTableConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['change'],
  setup (props, ctx) {
    // el-table组件实例
    const elTable = ref<IElTable>()
    // 是否有有效的operation
    const operationVisible = computed(() => props.config.operations?.some(item => item.perm))
    const pic = (image?: any, preview?: boolean) => {
      if (!image) return preview ? [] : ''
      const images = image instanceof Array ? image : fileStrToArr(image)
      return preview ? images : images[0]
    }
    /**
     * 设置选中项
     */
    const toggleRowSelection = () => {
      props.config.selectList?.forEach((item: any) => {
        elTable.value?.toggleRowSelection(item, true)
      })
    }

    interface SummaryMethodProps<T> {
      columns: TableColumnCtx<T>[]
      data: T[]
    }

    const getSummaries = (param: SummaryMethodProps<any>) => {
      if (props.config.summaryMethod) {
        return props.config.summaryMethod(param)
      } else {
        const { columns, data } = param
        const sums: string[] = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => Number.isNaN(value))) {
            sums[index] = `${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)}`
          } else {
            sums[index] = '-'
          }
        })

        return sums
      }
    }
    watch(
      () => props.config.selectList,
      () => toggleRowSelection()
    )
    watch(
      () => props.config.dataList,
      (newVal: any) => {
        if (!newVal) newVal = []
        ctx.emit('change', newVal)
        const currentId = props.config.currentRow && props.config.currentRow[0]?.id
        const dataObj = currentId && props.config.dataList.find(item => item.id === currentId)
        dataObj && elTable.value?.setCurrentRow(dataObj)
      }
    )
    onMounted(() => {
      toggleRowSelection()
    })
    return {
      operationVisible,
      elTable,
      pic,
      getSummaries
    }
  }
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  height: 100%;
  width: 100%;
}
.table-container {
  height: calc(100% - 40px);
  padding-bottom: 5px;
  width: 100%;
  &.table-full {
    height: 100%;
  }
  // border: none;
}
.operation-btn-box {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.sort-1,
.sort-2,
.sort-3 {
  display: block;
  border-radius: 12px;
}
.sort-1 {
  background: #ff5a5a;
}
.sort-2 {
  background: #ff955a;
}
.sort-3 {
  background: #fed75a;
}
</style>
