<template>
  <el-form
    ref="ruleForm"
    :rules="config.rules"
    :label-width="config.labelWidth || '120px'"
    :label-position="config.labelPosition || 'top'"
    :model="dataForm"
  >
    <SLFlexGroup
      v-for="(colums, i) in config.columns"
      :key="i"
      :flex="colums.flexable"
    >
      <div
        v-if="colums.fieldset"
        :class="colums.cols ? 'ls-flex-item--' + colums.cols : 'ls-flex-item--1'"
      >
        <SLDescriptionHeader>
          {{ colums.fieldset.desc }}
          <template v-if="colums.fieldset.query" #query>
            <div
              v-for="(item, j) in colums.fieldset.query"
              :key="j"
              class="query-item"
            >
              <label class="query-label" :for="item.field">{{ item.label }}</label>
              <SLFormItem
                v-if="item.type !== 'table'"
                v-model="queryParams[item.field]"
                :config="item"
                @change="(val:any)=>colums.fieldset?.handleQuery&&colums.fieldset.handleQuery(val,item,colums)"
              ></SLFormItem>
            </div>
          </template>
          <template v-if="colums.fieldset.right" #right>
            <template v-for="(obj, j) in colums.fieldset.right" :key="j">
              <SLButton :config="obj"></SLButton>>
            </template>
          </template>
        </SLDescriptionHeader>
      </div>
      <template v-for="(item, j) in colums.fields" :key="j">
        <SLTable
          v-if="item.type === 'table' && !item.hidden"
          :config="item.config"
          @change="dataList => handleTableChange(dataList, item)"
        />
        <el-form-item
          v-else
          v-show="!item.hidden"
          :label="item.label"
          :prop="item.field"
          :rules="item.rules"
          :class="
            item.cols || colums.cols
              ? 'ls-flex-item--' + (item.cols || colums.cols)
              : 'ls-flex-item--1'
          "
        >
          <SLFormItem
            v-if="item.type !== 'table'"
            v-model="dataForm[item.field]"
            :config="item"
            @change="(val:any)=>handleFormItemChange(val,item,colums)"
          ></SLFormItem>
        </el-form-item>
      </template>
      <slot name="follows"></slot>
    </SLFlexGroup>
  </el-form>
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
  defineComponent,
  PropType,
  nextTick
} from 'vue'
import SLDescriptionHeader from '@/components/SLDescriptionHeader/index.vue'
import SLFormItem from '@/components/SLFormItem/index.vue'
import { cloneDeep } from 'lodash'
import { IElForm } from '@/common/types/element-plus'
import { ISLFormConfig, ISLFormFieldSet } from './index'
import { ISLFormItem, ISLFormTable } from '../SLFormItem/type'
import SLTable from '../SLTable/index.vue'
import SLButton from '../SLButton/index.vue'

export default defineComponent({
  name: 'SLForm',
  components: {
    SLFormItem,
    SLDescriptionHeader,
    SLFlexGroup,
    SLTable,
    SLButton
  },
  props: {
    config: {
      type: Object as PropType<ISLFormConfig>,
      default: () => {
        //
      }
    }
  },
  setup (props) {
    // 定义状态
    const state = reactive<{
      dataForm: any
      queryParams: any
    }>({
      queryParams: {
        ...(props.config.defaultQuerys || {})
      },
      dataForm: { id: null, ...(props.config.defaultValue || {}) }
    })

    // ruleForm组建实例
    const ruleForm = ref<IElForm>()
    const handleTableChange = (data: any, column: ISLFormTable) => {
      if (!data) data = []

      column.field && (state.dataForm[column.field] = data)
      column.config.dataList = data
    }

    const handleFormItemChange = (val: any, item: ISLFormItem, fieldSet: ISLFormFieldSet) => {
      item.onChange && item.onChange(val, item, fieldSet)
    }
    // 保存 save
    const Submit = async () => {
      ruleForm.value?.validate(async (valid: any) => {
        if (!valid) {
          return Promise.reject(new Error('验证失败'))
        }

        // additionalInfo JSON对象字符串初始化
        const aInfo:any = {}

        // 提取提交参数对象 （深克隆 不影响表单正常显示）
        let queryParams = cloneDeep({ ...state.dataForm })
        props.config.columns.map(fieldset => {
          fieldset.fields.map(item => {
            if (item.aInfo && item.field) {
              // 处理aInfo
              aInfo[item.field] = queryParams[item.field]
              delete queryParams[item.field]
            }
            return item
          })
          return fieldset
        })
        // 如果aInfo中有任意值 设置additionalInfo
        if (Object.values(aInfo).length > 0) {
          queryParams.additionalInfo = JSON.stringify(aInfo)
        }
        // 在表单提交前 执行外部最后的参数自定义修改函数
        if (props.config.setBeforeSubmit) {
          queryParams = props.config.setBeforeSubmit(queryParams)
        }
        props.config.submit && props.config.submit(queryParams)
      })
    }

    onMounted(async () => {
      nextTick(() => {
        ruleForm.value?.clearValidate()
        ruleForm.value?.resetFields()
      })
    })

    /**
     * 初始化默认值
     */
    const init = () => {
      state.dataForm = props.config.defaultValue
        ? cloneDeep(props.config.defaultValue)
        : state.dataForm
    }
    onBeforeMount(() => {
      init()
    })
    return {
      ...toRefs(state),
      ruleForm,
      Submit,
      handleTableChange,
      handleFormItemChange,
      init
    }
  }
})
</script>
<style lang="scss" scoped>
.el-descriptions {
  margin-right: 0;
  margin-left: 0;
}

.query-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  .query-label {
    word-break: keep-all;
    margin-right: 8px;
    line-height: 40px;
    font-weight: 500;
  }
}
</style>
