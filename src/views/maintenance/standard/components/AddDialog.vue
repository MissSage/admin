<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">

  <!-- <el-dialog
    v-model="dialogvisible"
    width="60%"
    custom-class="patrolDialog"
    :lock-scroll="false"
    :title="title || ''"
    @close="close"
  > -->
    <BaseForm
      ref="baseForm"
      form-type="Prev"
      :is-readonly="readonly"
      :default-value="dataForm"
      @setBaseParams="setBaseParams"
    />
    <div class="tableContainer">
      <el-button
        icon="iconfont icon--tainjia"
        :disabled="readonly"
        size="mini"
        type="primary"
        @click="addStep"
        >添加保养项</el-button
      >
      <el-table ref="singleTable" class="stepTable" :data="dataForm.detailList" style="width: 100%">
        <el-table-column prop="orderNumber" width="78" align="center" label="序号">
        </el-table-column>
        <el-table-column label="项目" min-width="200">
          <template #default="scope">
            <el-input
              v-if="!readonly"
              v-model="scope.row.stepName"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
            <div v-else class="readonly-text">{{ scope.row.stepName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="方法及基准" min-width="200">
          <template #default="scope">
            <el-input
              v-if="!readonly"
              v-model="scope.row.method"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
            <div v-else class="readonly-text">{{ scope.row.method }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="!readonly" label="操作" width="244">
          <template #default="scope">
            <el-button
              style="border: none"
              :disabled="readonly"
              type="text"
              class="iconfont icon-shangyi"
              size="small"
              :style="{
                color: '#4195F0'
              }"
              @click="setStep(scope.row, 'up')"
              >上移</el-button
            >
            <el-button
              style="border: none"
              :disabled="readonly"
              type="text"
              class="iconfont icon-xiayi"
              size="small"
              :style="{
                color: '#4195F0'
              }"
              @click="setStep(scope.row, 'down')"
              >下移</el-button
            >
            <el-button
              style="border: none"
              :disabled="readonly"
              type="text"
              class="iconfont icon-shanchu1"
              size="small"
              :style="{
                color: '#4195F0'
              }"
              @click="setStep(scope.row, 'del')"
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
import BaseForm from './baseForm.vue'
import SLDialog from '@/components/SLDialog/index.vue'

import { ref, reactive, toRefs, defineComponent, PropType, onMounted, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import _ from 'lodash'
import { IStandard, IStandardDetail } from '@/common/types/maintenance/standard'
import { addOrUpdateMainStandard, getMaintStandard } from '@/api/maintenance/standard'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  components: { BaseForm,SLDialog },
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
    currentId: {
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
        text: props.readonly ? '关 闭' : '取 消',
        handler: async() => await props.close()
      },
      width:props.width,
      confirm: {
        text: '确 定',
        show: !props.readonly,
        handler: () => submit()
      }
    })
    watch(
      () => props.visible,
      () => {
        slDialogConfig.value.visible = props.visible
      },
      {
        deep: true,
        immediate: true
      }
    )
    const { $messageWarning, $messageSuccess, $messageError, $confirm } = useGlobal()
    const dataForm = ref<IStandard>({
      id: '',
      detail: '',
      name: '',
      deviceType: '',
      remark: '',
      creator: '',
      createTime: '',
      tenantId: '',
      detailList: [] as IStandardDetail[]
    })

    const state = reactive<{
      projectId: string
      dialogVisible: boolean
    }>({
      projectId: '',
      dialogVisible: false
    })
    const addStep = () => {
      dataForm.value.detailList.push({
        orderNumber: dataForm.value.detailList.length + 1,
        stepName: '',
        method: ''
      } as IStandardDetail)
    }
    const setStep = (step: IStandardDetail, option: string) => {
      if (option === 'up') {
        // orderNumber     >0
        if (~~step.orderNumber === 1) return
        dataForm.value.detailList[step.orderNumber - 2].orderNumber++
        dataForm.value.detailList[step.orderNumber - 1].orderNumber--
        dataForm.value.detailList.sort((a, b) => a.orderNumber - b.orderNumber)
      } else if (option === 'down') {
        if (~~step.orderNumber === dataForm.value.detailList.length) return
        dataForm.value.detailList[step.orderNumber].orderNumber--
        dataForm.value.detailList[step.orderNumber - 1].orderNumber++
        dataForm.value.detailList.sort((a, b) => a.orderNumber - b.orderNumber)
      } else if (option === 'del') {
        $confirm('确定要删除该检修项吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dataForm.value.detailList.splice(step.orderNumber - 1, 1)
          dataForm.value.detailList.forEach(item => {
            if (item.orderNumber > step.orderNumber) {
              item.orderNumber--
            }
          })
        })
      }
    }
    onMounted(async () => {
      if (dataForm.value.detailList.length == 0) {
        addStep()
      }
      if (props.currentId) {
        setDefaultData()
      }
    })
    const setDefaultData = async () => {
      try {
        const res = await getMaintStandard(props.currentId)
        dataForm.value = res.data
      } catch (error) {
        $messageWarning('获取信息失败')
      }
    }
    const baseForm = ref<any>()

    const setBaseParams = (params: IStandard) => {
      const { name, remark, deviceType } = params
      dataForm.value.name = name
      dataForm.value.remark = remark
      dataForm.value.deviceType = deviceType
    }

    const submit = async () => {
      if (!baseForm.value.checkRule()) {
        return
      }
      if (!dataForm.value.detailList[0].stepName) {
        $messageWarning('请输入项目')
        return
      } else if (!dataForm.value.detailList[0].method) {
        $messageWarning('请输入方法及基准')
        return
      }
      try {
        const data = _.cloneDeep(dataForm.value)
        const res = await addOrUpdateMainStandard(data)
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
      ...toRefs(state),
      dataForm,
      dialogvisible,
      submit,
      setStep,
      addStep,
      baseForm,
      setBaseParams,
      slDialogConfig,
      deviceTypes: ref<string[]>(['其他', '管道', '物联网水表', 'PLC', '压力计'])
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
  margin-top: 15px;
  .stepTable {
    margin-top: 16px;
    .selectText {
      background-color: #eeeeee;
      border-radius: 4px;
      line-height: 40px;
      width: 100%;
      height: 40px;
      border: 1px solid #dcdfe6;
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
