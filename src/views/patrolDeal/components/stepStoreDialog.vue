<template>
  <SLDialog v-if="visible" :config="slDialogConfig">
    <el-form
      ref="ruleForm"
      :rules="rules"
      :label-width="config.labelWidth || '110px'"
      :model="dataForm"
      class="stepStore"
    >
      <el-form-item label="标准名称：" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>
      <div class="flexFromItem">
        <el-form-item label="要求：" prop="remark">
          <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="设备类型：" prop="deviceType">
          <el-select
            v-model="dataForm.deviceType"
            style="width: 100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in deviceTypeTree"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="tableContainer">
      <el-button icon="iconfont icon--tainjia" size="mini" type="primary" @click="addStep"
        >添加步骤</el-button
      >
      <el-table ref="singleTable" class="stepTable" :data="dataForm.dataList" style="width: 100%">
        <el-table-column prop="no" width="78" align="center" label="序号"> </el-table-column>
        <el-table-column label="项目" width="300">
          <template #default="scope">
            <el-input
              v-model="scope.row.projectName"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column label="方法及基准">
          <template #default="scope">
            <el-input
              v-model="scope.row.method"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="264">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              class="iconfont icon-shangyi"
              :style="{ color: '#4195F0', border: 'none' }"
              @click="setStep(scope.row, 'up')"
              >上移</el-button
            >
            <el-button
              type="text"
              class="iconfont icon-xiayi"
              size="small"
              :style="{ color: '#4195F0', border: 'none' }"
              @click="setStep(scope.row, 'down')"
              >下移</el-button
            >
            <el-button
              type="text"
              class="iconfont icon-shanchu1"
              size="small"
              :style="{ color: '#4195F0', border: 'none' }"
              @click="setStep(scope.row, 'del')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <template #footer>
      <el-button size="mini" @click="config.close">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit">保 存</el-button>
    </template> -->
  </SLDialog>
  <!-- <el-dialog
    v-model="visible"
    width="70%"
    custom-class="patrolDialog"
    :title="config.title || ''"
    :lock-scroll="false"
    @close="config.close"
  >
    
  </el-dialog> -->
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'
import { getDeviceType } from '@/api/ledger/ledger2'
import { saveStep, getStepDetail } from '@/api/patrol'
import { IElForm } from '@/common/types/element-plus'
import useGlobal from '@/hooks/global/useGlobal'
import { defineComponent, PropType, computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ISLDialogConfig } from '@/components/SLDialog/type'
const { $messageSuccess, $messageError, $confirm } = useGlobal()

export default defineComponent({
  components: { SLDialog },
  props: {
    config: {
      type: Object as PropType<IStepStoreDialog>,
      default: () => {
        return {
          //
        }
      }
    }
  },
  emits: ['refreshData'],
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.config.title,
      visible: props.config.visible,
      cancel: {
        handler: async () => await props.config.close()
      },
      confirm: {
        show: true,
        handler: () => submit()
      }
    })
    watch(
      () => props.config,
      () => {
        slDialogConfig.value.title = props.config.title
        slDialogConfig.value.visible = props.config.visible
        slDialogConfig.value.cancel = {
          handler: async () => await props.config.close()
        }
        slDialogConfig.value.width = '70%'
        slDialogConfig.value.confirm = {
          show: true,
          handler: () => {
            return submit()
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    const state = reactive<{
      dataForm: any
      rules: any
      deviceTypeTree: NormalOption[]
    }>({
      dataForm: { id: null, dataList: [] },
      rules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入任务要求', trigger: 'change' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
      },
      deviceTypeTree: []
    })
    const visible = computed(() => {
      return props.config.visible
    })
    const init = async () => {
      state.dataForm.id = props.config.currentId
      if (state.dataForm.id) {
        getDetail()
      } else {
        addStep()
      }
    }
    const initDeviceTypeTree = async () => {
      const res: any = await getDeviceType().catch((err: Error) => {
        console.log(err.message)
      })
      res.data.map(item => {
        const obj: NormalOption = {
          label: item,
          value: item
        }
        state.deviceTypeTree.push(obj)
      })
    }
    const getDetail = async () => {
      try {
        const res = await getStepDetail(state.dataForm.id)
        state.dataForm = res.data
      } catch (err: any) {
        $messageError(err.data.message)
      }
    }

    const addStep = () => {
      state.dataForm.dataList.push({
        no: state.dataForm.dataList.length + 1,
        projectName: '',
        method: ''
      })
    }

    const setStep = (step: any, option: any) => {
      if (option === 'up') {
        // no     >0
        if (~~step.no === 1) return
        state.dataForm.dataList[step.no - 2].no++
        state.dataForm.dataList[step.no - 1].no--
        state.dataForm.dataList.sort((a, b) => a.no - b.no)
      } else if (option === 'down') {
        if (~~step.no === state.dataForm.dataList.length) return
        state.dataForm.dataList[step.no].no--
        state.dataForm.dataList[step.no - 1].no++
        state.dataForm.dataList.sort((a, b) => a.no - b.no)
      } else if (option === 'del') {
        $confirm('确定要删除该步骤吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          state.dataForm.dataList.splice(step.no - 1, 1)
          state.dataForm.dataList.forEach(item => {
            if (item.no > step.no) {
              item.no--
            }
          })
        })
      }
    }
    const ruleForm = ref<IElForm>()
    const submit = async () => {
      console.log(state.dataForm)
      ruleForm.value &&
        ruleForm.value.validate(async valid => {
          if (!valid) {
            return false
          }

          try {
            const res = await saveStep(state.dataForm)
            if (res.status === 200) {
              $messageSuccess('操作成功')
              ctx.emit('refreshData')
              props.config.close()
            } else {
              $messageError('请求失败')
            }
          } catch (err: any) {
            $messageError(err.data.message)
          }
        })
    }
    onMounted(() => {
      init()
      initDeviceTypeTree()
    })
    return {
      ...toRefs(state),
      visible,
      ruleForm,
      init,
      initDeviceTypeTree,
      getDetail,
      addStep,
      setStep,
      submit,
      slDialogConfig
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
  .el-input__inner {
    height: 40px !important;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item__label {
    line-height: 40px;
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.flexFromItem {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    flex-basis: 48%;
    min-width: 300px;
  }
}
.stepStore {
  border-bottom: 1px solid #444040;
  padding: 32px;
}
.tableContainer {
  border-bottom: 1px solid #444040;
  padding: 16px 32px 24px;
  .stepTable {
    margin-top: 16px;
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
