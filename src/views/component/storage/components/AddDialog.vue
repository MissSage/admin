<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="dialogvisible"
    :width="width"
    custom-class="patrolDialog"
    :lock-scroll="false"
    :title="title || ''"
    @close="close"
  > -->
    <BaseForm
      ref="baseForm"
      :is-readonly="readonly"
      :default-value="dataForm"
      @setBaseParams="setBaseParams"
    />

    <div class="tableContainer">
      <el-button
        v-if="!readonly"
        icon="iconfont icon--tainjia"
        :disabled="readonly"
        size="mini"
        type="primary"
        @click="addStep"
        >添加备件</el-button
      >
      <el-table ref="singleTable" class="stepTable" :data="dataForm.details" style="width: 100%">
        <el-table-column prop="orderNumber" width="78" align="center" label="序号">
        </el-table-column>
        <el-table-column label="备件编号" width="160">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.componentId"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
              @change="id => storagesChange(scope.row)"
            >
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="(item, i) in storages"
                :key="i"
                :label="item.code"
                :value="item.id"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备件名称" min-width="160">
          <template #default="scope">
            <el-tooltip :content="scope.row.name || '备件名称'">
              <div class="selectText">
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="100">
          <template #default="scope">
            <el-tooltip :content="scope.row.type || '类别'">
              <div class="selectText">
                {{ scope.row.type }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="型号" min-width="100">
          <template #default="scope">
            <el-tooltip :content="scope.row.specification || '型号'">
              <div class="selectText">
                {{ scope.row.specification }}
              </div>
            </el-tooltip>
            
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="100">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.unit }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="100">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.storeNumber }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="160">
          <template #default="scope">
            <el-input-number
              v-if="!readonly"
              v-model="scope.row.number"
              :min="0"
              :max="optType === OptionType.IN ? 999999 : scope.row.storeNumber"
              placeholder="请输入"
              class="workContentInput"
            >
            </el-input-number>
            <div v-else class="selectText">
              {{ scope.row.number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :fixed="'right'" label="操作" width="80">
          <template #default="scope">
            <el-button
              style="border: none"
              :disabled="readonly"
              type="text"
              class="iconfont icon-shanchu1"
              size="small"
              :style="{
                color: '#4195F0'
              }"
              @click="setStep(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <template #footer>
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button v-if="!readonly" size="mini" type="primary" @click="submit">保 存</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import _ from 'lodash'
import SLDialog from '@/components/SLDialog/index.vue'

import BaseForm from './baseForm.vue'
import { ref, defineComponent, PropType, onMounted, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ISaveOption, ISaveOptionDetail, ITableItem } from '@/common/types/component/storage'
import { getAllStorages, outOrInStorage } from '@/api/component'
import { ExtraQueryParam } from '@/common/types/common'
import { OptionType } from '../index'
import { ISLDialogConfig } from '@/components/SLDialog/type'
export default defineComponent({
  components: { BaseForm, SLDialog },
  props: {
    width: {
      type: [String, Number],
      default: '60%'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Function as PropType<() => void>,
      default: () => {
        // DO STH
      }
    },
    optType: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refreshData'],
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.title,
      visible: props.visible,
      scrollbar: true,
      cancel: {
        handler: async() => await props.close()
      },
      confirm: {
        text: '确 定',
        handler: () => submit()
      }
    })
    watch(
      () => props.visible,
      () => {
        slDialogConfig.value.visible = props.visible
        slDialogConfig.value.cancel = {
          handler: async() => await props.close()
        }
        slDialogConfig.value.width = props.width
      },
      {
        deep: true,
        immediate: true
      }
    )
    const { $messageWarning, $messageSuccess, $messageError, $confirm } = useGlobal()
    const dataForm = ref<ISaveOption>({
      type: '',
      username: '',
      time: null,
      remark: '',
      details: [] as ISaveOptionDetail[]
    })

    const storages = ref<ITableItem[]>([])
    const storagesChange = (row: ISaveOptionDetail) => {
      const item = storages.value.find(item => item.id == row.componentId)
      console.log(item)
      if (item) {
        row.name = item.name
        row.specification = item.specification
        row.type = item.type
        row.unit = item.unit
        row.storeNumber = item.number
      } else {
        row.name = ''
        row.specification = ''
        row.type = ''
        row.storeNumber = 0
        row.unit = ''
      }
    }
    const addStep = () => {
      dataForm.value.details.push({
        orderNumber: dataForm.value.details.length + 1,
        componentId: '',
        number: 0
      } as ISaveOptionDetail)
    }

    const setStep = (step: ISaveOptionDetail) => {
      $confirm('确定要删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dataForm.value.details.splice(step.orderNumber - 1, 1)
        dataForm.value.details.forEach(item => {
          if (item.orderNumber > step.orderNumber) {
            item.orderNumber--
          }
        })
      })
    }
    const GetAllStorages = async () => {
      const params = {
        name: '',
        code: ''
      } as ExtraQueryParam
      const res = await getAllStorages(params)
      console.log(res.data)
      storages.value = res.data
    }
    onMounted(async () => {
      GetAllStorages()
      addStep()
    })

    const baseForm = ref<InstanceType<typeof BaseForm>>()

    const setBaseParams = (params: ISaveOption) => {
      dataForm.value.username = params.username
      dataForm.value.time = params.time
      dataForm.value.remark = params.remark
    }

    const submit = async () => {
      if (!baseForm.value?.checkRule()) {
        return
      }
      const data = _.cloneDeep(dataForm.value)

      if (data.details.length == 0) {
        $messageWarning('请添加备件')
        return
      } else if (!data.details[0].componentId) {
        $messageWarning('请选择备件')
        return
      } else if (!data.details[0].number) {
        $messageWarning('数量不能为空')
        return
      }
      try {
        data.type = props.optType
        console.log(data)
        const res = await outOrInStorage(data as ISaveOption)
        if (res.status === 200) {
          $messageSuccess('操作成功')
          props.close()
          ctx.emit('refreshData')
        } else {
          $messageError('请求失败')
        }
      } catch (err: any) {
        $messageError(err.data.message)
      }
    }
    const dialogvisible = ref<boolean>(props.visible)

    return {
      dialogvisible,
      baseForm,
      dataForm,
      storages,
      OptionType,
      slDialogConfig,
      submit,
      setStep,
      addStep,
      setBaseParams,
      storagesChange,
      GetAllStorages
    }
  }
})
</script>

<style lang="scss">
.patrolDialog {
  .el-dialog__body {
    padding: 0 !important;
  }
  .iconfont::before {
    margin-right: 5px;
  }
}
</style>
>

<style lang="scss" scoped>
.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.flexFromItem {
  display: flex;
  justify-content: space-between;
}
.baseForm {
  border-bottom: 1px solid #444040;
  padding: 16px 32px;
}
.tableContainer {
  // border-bottom: 1px solid #444040;
  padding: 16px 32px;
  .stepTable {
    margin-top: 16px;
    .selectText {
      background: #222536;
      border: 1px solid #3c3f54;
      border-radius: 4px;
      line-height: 40px;
      width: 100%;
      height: 40px;
      // border: 1px solid #dcdfe6;
      padding: 0 12px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }
  .workContentInput {
    height: 40px;
    line-height: 40px;
    border: none;
    outline: none;
    width: 100%;
  }
}
</style>
