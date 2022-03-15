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
    <BaseForm ref="baseForm" :is-readonly="readonly" :default-value="dataForm" />

    <div class="tableContainer">
      <el-table ref="singleTable" class="stepTable" :data="dataForm.details" style="width: 100%">
        <el-table-column prop="orderNumber" width="78" align="center" label="序号">
        </el-table-column>
        <el-table-column label="备件编号" width="240">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.component.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备件名称" min-width="150">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.component.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="100">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.component.type }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规格型号" min-width="100">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.component.specification }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="100">
          <template #default="scope">
            <div class="selectText">
              {{ scope.row.component.unit }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="100">
          <template #default="scope">
            <input
              v-if="!readonly"
              v-model="scope.row.number"
              type="text"
              :min="0"
              class="workContentInput"
              placeholder="请输入"
            />
            <div class="selectText">
              {{ scope.row.number }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button size="mini" @click="close">取 消</el-button>
    </template>
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import BaseForm from './baseForm.vue'
import { ref, defineComponent, PropType, onMounted, watch } from 'vue'
import { ITableDetail, ItableDetailItem } from '@/common/types/component/record'
import { getInOutRecord } from '@/api/component'
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
    close: {
      type: Function as PropType<() => void>,
      default: () => {
        // DO STH
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: '入库详情',
      visible: props.visible,
      scrollbar: true,
      cancel: {
        handler: async() => await props.close()
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
    const dataForm = ref<ITableDetail>({
      id: '',
      type: '',
      code: '',
      username: '',
      time: '',
      remark: '',
      createTime: '',
      creator: '',
      tenantId: '',
      nameList: '',
      details: [] as ItableDetailItem[]
    })
    const title = ref<string>('')
    const SetDefaultData = async (id: string) => {
      const res = await getInOutRecord(id)
      console.log(res)
      title.value = res.data.type == '1' ? '入库详情' : '出库详情'
      dataForm.value = res.data
    }
    onMounted(async () => {
      if (props.currentId && props.currentId != '') {
        SetDefaultData(props.currentId)
      }
    })
    const baseForm = ref<InstanceType<typeof BaseForm>>()

    const dialogvisible = ref<boolean>(props.visible)

    return {
      title,
      dialogvisible,
      baseForm,
      dataForm,
      slDialogConfig,
      SetDefaultData
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
  border-bottom: 1px solid #444040;
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
