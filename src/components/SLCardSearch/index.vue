<template>
  <!-- 搜索条 -->
  <SLCard class="card-search-box tooltip-wrapper">
    <div class="tooltip">
      <el-form
        v-if="config.filters?.length || config.operations?.length || config.moreFilter"
        :label-width="config.labelWidth || '80px'"
        class="filter-form filter-left"
        :inline="true"
        :model="queryParams"
        @keyup.enter="config.handleSearch"
        @submit.prevent
      >
        <template v-for="filter in config.filters">
          <el-form-item
            v-if="!filter.hidden"
            :key="filter.field"
            :prop="filter.field"
            :label="filter.label"
          >
            <SLFormItem
              v-if="filter.field"
              v-model="queryParams[filter.field]"
              :config="filter"
            />
          </el-form-item>
        </template>
        <el-form-item v-if="config.moreFilter || config.operations?.length">
          <div class="operate-group operate-left">
            <el-button
              v-if="config.moreFilter"
              type="primary"
              :icon="'iconfont icon-filter'"
              @click="moreFilterVisiable = !moreFilterVisiable"
            >
              更多选项
            </el-button>
            <template v-for="(btn, i) in config.operations || []" :key="i">
              <el-button
                v-if="
                  btn.perm && (typeof btn.perm === 'boolean' ? btn.perm : btn.perm(queryParams))
                "
                :icon="
                  btn.icon && (typeof btn.icon === 'string' ? btn.icon : btn.icon(queryParams))
                "
                :loading="
                  btn.loading &&
                    (typeof btn.loading === 'boolean' ? btn.loading : btn.loading(queryParams))
                "
                :type="
                  btn.type
                    ? typeof btn.type === 'string'
                      ? btn.type as any
                      : btn.type(queryParams)
                    : 'primary'
                "
                :disabled="
                  btn.disabled &&
                    (typeof btn.disabled === 'boolean' ? btn.disabled : btn.disabled(queryParams))
                "
                @click="btn.click && btn.click(queryParams)"
              >
                {{ btn.text && (typeof btn.text === 'string' ? btn.text : btn.text(queryParams)) }}
              </el-button>
            </template>
          </div>
        </el-form-item>
      </el-form>

      <div v-if="config.midOperations?.length" class="operate-group operate-mid">
        <!-- 中间额外自定义操作按钮 -->
        <template v-for="(btn, i) in config.midOperations || []" :key="i">
          <el-button
            v-if="btn.perm && (typeof btn.perm === 'boolean' ? btn.perm : btn.perm(queryParams))"
            :icon="btn.icon && (typeof btn.icon === 'string' ? btn.icon : btn.icon(queryParams))"
            :loading="
              btn.loading &&
                (typeof btn.loading === 'boolean' ? btn.loading : btn.loading(queryParams))
            "
            :type="
              btn.type
                ? typeof btn.type === 'string'
                  ? btn.type as any
                  : btn.type(queryParams)
                : 'primary'
            "
            :disabled="
              btn.disabled &&
                (typeof btn.disabled === 'boolean' ? btn.disabled : btn.disabled(queryParams))
            "
            @click="btn.click && btn.click(queryParams)"
          >
            {{
              btn.text && (typeof btn.text === 'string' ? btn.text : btn.text(queryParams))
            }}
          </el-button>
        </template>
      </div>
      <el-form
        v-if="config.rightFilter"
        class="filter-form filter-right"
        :label-width="config.labelWidth || '80px'"
        :inline="true"
        :model="queryParams"
        @keyup.enter="config.handleSearch"
        @submit.prevent
      >
        <template v-for="filter in config.rightFilter">
          <el-form-item
            v-if="!filter.hidden"
            :key="filter.field"
            :prop="filter.field"
            :label="filter.label"
          >
            <SLFormItem
              v-if="filter.field"
              v-model="queryParams[filter.field]"
              :config="filter"
            />
          </el-form-item>
        </template>
        <el-form-item>
          <div class="operate-group operate-right">
            <!-- 中间额外自定义操作按钮 -->
            <template v-for="(btn, i) in config.rightOperations || []" :key="i">
              <el-button
                v-if="
                  btn.perm && (typeof btn.perm === 'boolean' ? btn.perm : btn.perm(queryParams))
                "
                :icon="
                  btn.icon && (typeof btn.icon === 'string' ? btn.icon : btn.icon(queryParams))
                "
                :loading="
                  btn.loading &&
                    (typeof btn.loading === 'boolean' ? btn.loading : btn.loading(queryParams))
                "
                :type="
                  btn.type
                    ? typeof btn.type === 'string'
                      ? btn.type as any
                      : btn.type(queryParams)
                    : 'primary'
                "
                :disabled="
                  btn.disabled &&
                    (typeof btn.disabled === 'boolean' ? btn.disabled : btn.disabled(queryParams))
                "
                @click="btn.click && btn.click(queryParams)"
              >
                {{ btn.text && (typeof btn.text === 'string' ? btn.text : btn.text(queryParams)) }}
              </el-button>
            </template>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="config.moreFilter" class="more-info">
      <span class="more-info__item describe">更多筛选项：</span>
      <span
        v-for="(item, i) in moreFilterConditions"
        :key="i"
        class="more-info__item"
      >
        {{ item.label }}{{ (item.formatter ? item.formatter(item.value) : item.value) || '-' }}
      </span>
    </div>
    <transition name="slide-fade">
      <SLMoreFilter
        v-if="moreFilterVisiable"
        :label-width="config.labelWidth"
        :config="config.moreFilter"
        :default-params="queryParams"
        @submit="addtionalSubmit"
        @close="moreFilterVisiable = false"
      />
    </transition>
  </SLCard>
</template>

<script lang="ts">
import SLFormItem from '@/components/SLFormItem/index.vue'
import SLMoreFilter from '@/components/SLMoreFilter/index.vue'
import SLCard from '@/components/SLCard/index.vue'
import { defineComponent, PropType, reactive, toRefs, onMounted, watch } from 'vue'
import type { ISLCardSearch } from './type'
export default defineComponent({
  name: 'CardSearch',
  components: { SLMoreFilter, SLFormItem, SLCard },
  props: {
    config: {
      type: Object as PropType<ISLCardSearch>,
      default: () => {
        //
      }
    }
  },
  setup (props) {
    // 初始化参数
    const state = reactive<{
      moreFilterVisiable: boolean
      moreFilterConditions: {
        label?: string
        value?: any
        formatter?: any
      }[]
      queryParams: Record<string, any>
    }>({
      moreFilterVisiable: false,
      moreFilterConditions: [],
      queryParams: {
        ...(props.config.defaultParams || {})
      }
    })

    // 接收AddtionalFilters附加参数
    const addtionalSubmit = (params: Record<string, any>) => {
      Object.assign(state.queryParams, params)
      formateQueryParamsToString(params)
    }
    /**
     * 处理更多选项的提示信息
     * @param params
     */
    const formateQueryParamsToString = (params?: Record<string, any>) => {
      state.moreFilterConditions = []
      props.config.moreFilter?.filters?.map(item => {
        if (!item.field || item.type === 'text') return item
        state.moreFilterConditions.push({
          label: item.label,
          value: (params && params[item.field]) || '-',
          formatter: item.formatter
        })
        return item
      })
    }
    // 监听参数，更新更多筛选提示文本的内容
    watch(
      () => state.queryParams,
      () => {
        state.moreFilterConditions =
          props.config.moreFilter?.filters?.map(item => {
            return {
              label: item.label,
              value: item.field ? state.queryParams[item.field] || '-' : '-'
            }
          }) || []
      }
    )
    onMounted(() => formateQueryParamsToString())
    return {
      ...toRefs(state),

      addtionalSubmit
    }
  }
})
</script>
<style lang="scss" scoped>
.card-search-box {
  margin-bottom: 15px;
}
.tooltip-wrapper {
  overflow: visible;
  position: relative;
}
.tooltip {
  padding: 16px 0 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
}
.filter-right {
  padding-left: 12px;
  margin-left: auto;
}

.operate-group {
  padding-left: 8px;
  margin: 0 0 16px;
}

.el-form-item {
  margin: 4px 0 16px;
  padding: 0 8px 0 0;
}
:deep(.el-form-item__label) {
  line-height: 40px;
}
:deep(.el-form-item__content) {
  line-height: 40px;
  height: 40px;
  .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
:deep(.el-range-separator) {
  line-height: 32px !important;
}

/*****更多选项的过渡动画***** */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-enter-from {
  opacity: 0;
}
.slide-fade-leave-to {
  opacity: 0;
}

.more-info {
  margin-top: -20px;
  font-size: 12px;
  padding-left: 21px;
  line-height: 20px;
  text-align: right;
  .more-info__item,
  .describe {
    margin-right: 15px;
    color: #9097c0;
  }
  .describe {
    color: #9097c0;
  }
}
</style>
