<template>
  <SLDialog v-if="visible" :config="slDialogConfig">
    <BaseForm
      ref="baseForm"
      :is-readonly="config.readonly"
      :default-value="dataForm"
      @setBaseParams="setBaseParams"
    />
    <div class="tableContainer">
      <el-button
        icon="iconfont icon--tainjia"
        :disabled="config.readonly"
        size="mini"
        type="primary"
        @click="addStep"
        >添加路线</el-button
      >
      <!-- <el-button
        icon="iconfont icon--tainjia"
        :disabled="config.readonly"
        size="mini"
        class="add-purple"
        @click="openDialog"
        >批量添加</el-button
      > -->
      <!-- 批量添加的弹出框 -->
      <el-dialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        title="批量添加的菜单"
        :append-to-body="true"
        width="30%"
        class="alarm-design"
      >
        <el-form :rules="rules" label-position="top">
          <el-form-item prop="areaTree" label="选择区域：">
            <el-cascader v-model="selectArea" :options="areaTree" style="width: 100%">
            </el-cascader>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="addStepByProject">保存</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>

      <el-table ref="singleTable" class="stepTable" :data="dataForm.jobList" style="width: 100%">
        <el-table-column prop="orderNum" width="78" align="center" label="序号"> </el-table-column>
        <el-table-column label="项目">
          <template #default="scope">
            <el-cascader
              v-if="!config.readonly"
              v-model="scope.row.projectId"
              style="width: 100%"
              :options="areaTree"
              :show-all-levels="false"
              :props="cascaderProps"
              @change="(id:any) => projectIdChange(id, scope.row)"
            ></el-cascader>
            <div v-else class="selectText">{{ scope.row.projectName || scope.row.projectId }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="设备类型">
          <template #default="scope">
            <el-select
              v-if="!config.readonly"
              v-model="scope.row.deviceType"
              placeholder="请选择"
              clearable
              style="width: 100%"
              @change="id => deviceTypeChange(id, scope.row)"
            >
              <el-option
                v-for="(item, idx) in deviceTypes"
                :key="idx"
                :label="item"
                :value="idx"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ deviceTypes[scope.row.deviceType] }}
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="设备">
          <template #default="scope">
            <el-cascader
              v-if="!config.readonly"
              v-model="scope.row.deviceId"
              style="width: 100%"
              placeholder="请选择"
              filterable
              :options="scope.row.devices"
              @change="(id:any) => deviceChange(id, scope.row)"
            ></el-cascader>
            <div v-else class="selectText">
              {{ scope.row.deviceName || scope.row.deviceId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="巡检标准">
          <template #default="scope">
            <el-select
              v-if="!config.readonly"
              v-model="scope.row.criterionId"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in scope.row.steps"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ scope.row.criterionName || scope.row.criterionId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="scope">
            <el-input
              v-if="!config.readonly"
              v-model="scope.row.remark"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            ></el-input>
            <div v-else class="selectText">
              {{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              style="border: none"
              :disabled="config.readonly"
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
              :disabled="config.readonly"
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
              :disabled="config.readonly"
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
  </SLDialog>
  <!-- <el-dialog
    v-model="visible"
    width="70%"
    custom-class="patrolDialog"
    :lock-scroll="false"
    :title="config.title || ''"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @close="config.close"
  >
    
    <template #footer>
      <el-button size="mini" @click="config.close">取 消</el-button>
      <el-button v-if="!config.readonly" size="mini" type="primary" @click="submit"
        >保 存</el-button
      >
    </template>
  </el-dialog> -->
</template>

<script lang="ts">
// import { cloneDeep } from 'lodash'
import SLDialog from '@/components/SLDialog/index.vue'
import { savePatrol, getPatrolDetail, getStepList } from '@/api/patrol'
import BaseForm from './baseForm.vue'
import { getDeviceByType } from '@/api/device'
import {
  ref,
  reactive,
  toRefs,
  computed,
  onBeforeMount,
  defineComponent,
  PropType,
  watch
} from 'vue'
import useProject from '@/hooks/project/useProject'
import useGlobal from '@/hooks/global/useGlobal'
import { removeSlash } from '@/utils/removeIdSlash'
import useDevice from '@/hooks/device/useDevice'
import { ISLDialogConfig } from '@/components/SLDialog/type'
export default defineComponent({
  components: { BaseForm, SLDialog },
  props: {
    config: {
      type: Object as PropType<DialogConfig>,
      default: () => {
        return {
          visible: false,
          title: '',
          close: () => {
            //do sth
          },
          currentId: '',
          readonly: false
        }
      }
    }
  },
  emits: ['refreshData'],
  setup(props, ctx) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.config.title,
      visible: props.config.visible,
      scrollbar: true,
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
          show: !props.config.readonly,
          handler: () => {
            return props.config.readonly ? Promise.resolve() : submit()
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    const { getDeviceTree, DeviceTree } = useDevice()

    const { getAreaTreeData } = useProject()

    const { $messageWarning, $messageError, $messageSuccess, $format, $confirm } = useGlobal()
    const dataForm = ref<any>({
      id: null,
      jobList: [],
      users: []
    })

    const state = reactive<{
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
      selectArea: NormalOption[]
      cascaderProps: any
    }>({
      projectId: '',
      dialogVisible: false,
      selectArea: [],
      areaTree: [],
      cascaderProps: {
        checkStrictly: true
      }
    })

    const getDetail = async () => {
      try {
        const res = await getPatrolDetail(dataForm.value.id)
        dataForm.value = res.data
        if (dataForm.value.users) {
          dataForm.value.users = dataForm.value.users.split(',')
        } else {
          dataForm.value.users = []
        }
      } catch (err: any) {
        $messageError(err.message)
      }
    }

    const addStep = ({ projectId, devices, deviceId }: any = {}) => {
      dataForm.value.jobList.push({
        orderNum: dataForm.value.jobList.length + 1,
        projectId: projectId || [],
        deviceId: deviceId || '',
        criterionId: '',
        remark: '',
        devices: devices || [],
        steps: []
      })
    }

    const addMoreStep = async projectId => {
      const res = await getDeviceByType({
        page: 1,
        size: 999999
      })
      const devices = res.data.data.map(item => ({
        name: item.name,
        id: removeSlash(item.id.id)
      }))
      devices.forEach(device =>
        addStep({
          projectId,
          devices,
          deviceId: device.id
        })
      )
    }

    const addStepByProject = () => {
      if (!state.selectArea.length) {
        $messageWarning('请选择区域')
        return
      }
      addMoreStep(state.selectArea)
      state.dialogVisible = false
    }

    const setStep = (step: any, option: string) => {
      if (option === 'up') {
        // orderNum     >0
        if (~~step.orderNum === 1) return
        dataForm.value.jobList[step.orderNum - 2].orderNum++
        dataForm.value.jobList[step.orderNum - 1].orderNum--
        dataForm.value.jobList.sort((a, b) => a.orderNum - b.orderNum)
      } else if (option === 'down') {
        if (~~step.orderNum === dataForm.value.jobList.length) return
        dataForm.value.jobList[step.orderNum].orderNum--
        dataForm.value.jobList[step.orderNum - 1].orderNum++
        dataForm.value.jobList.sort((a, b) => a.orderNum - b.orderNum)
      } else if (option === 'del') {
        $confirm('确定要删除该任务吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dataForm.value.jobList.splice(step.orderNum - 1, 1)
          dataForm.value.jobList.forEach(item => {
            if (item.orderNum > step.orderNum) {
              item.orderNum--
            }
          })
        })
      }
    }

    const projectIdChange = async (id: string[], row: any) => {
      const proid = row.projectId[row.projectId.length - 1]
      row.projectId = proid
      // row.deviceTypes = ['其他', '管道', '物联网水表', 'PLC', '压力计']
      row.deviceType = ''
      row.deviceId = ''
      row.devices = []
      row.steps = []
      row.criterionId = ''
      getDeviceTree(proid).then(() => {
        row.devices = DeviceTree.value
      })
    }

    // const deviceTypeChange = async (id: string, row: any) => {
    //   row.deviceId = ''
    //   row.devices = []
    //   row.steps = []
    //   row.criterionId = ''
    //   const res = await getDeviceByType({ projectId: row.projectId, deviceType: id })
    //   row.devices = res.data.map(item => ({
    //     name: item.nodeName,
    //     id: item.nodeId
    //   }))
    // }

    // const deviceChange = (id: string[], row: any) => {
    //   console.log(id, row)
    //   const idval: string = id.pop() || ''
    //   row.steps = []
    //   row.criterionId = ''
    //   row.devices.forEach(async device => {
    //     if (device.id === idval) {
    //       const res = await getStepList({
    //         page: 1,
    //         size: 9999,
    //         deviceType: row.deviceType
    //       })
    //       row.steps = res.data.data.map(item => ({
    //         name: item.name,
    //         id: item.id
    //       }))
    //       return
    //     }
    //   })
    //   console.log(id, row)
    // }

    const deviceChange = async (id: string[], row: any) => {
      console.log(id, row)
      const devType: string = id[0]
      row.steps = []
      row.criterionId = ''
      const res = await getStepList({
        page: 1,
        size: 9999,
        deviceType: devType
      })
      row.steps = res.data.data.map(item => ({
        name: item.name,
        id: item.id
      }))
    }
    onBeforeMount(async () => {
      dataForm.value.id = props.config.currentId
      if (dataForm.value.id) {
        getDetail()
      } else {
        dataForm.value = { ...dataForm.value, periodTime: 0 }
        addStep()
      }
      state.areaTree = await getAreaTreeData()
    })

    const baseForm = ref<any>()

    const setBaseParams = (params: any) => {
      delete params.jobList
      Object.assign(dataForm.value, params)
    }

    const submit = async () => {
      if (!baseForm.value.checkRule()) {
        return
      }
      console.log(dataForm.value)

      if (!dataForm.value.users || !dataForm.value.users.length) {
        $messageWarning('请选择任务人')
        return
      } else if (!dataForm.value.jobList[0].deviceId || !dataForm.value.jobList[0].criterionId) {
        $messageWarning('请添加任务')
        return
      } else if (dataForm.value.limitTime <= 0) {
        $messageWarning('限制时间必须大于0')
        return
      }
      dataForm.value.users = dataForm.value.users.join(',')
      dataForm.value.jobList.forEach(item => {
        // delete item.devices
        // // delete item.deviceTypes
        // delete item.steps
        if (item.deviceId instanceof Array) {
          const devId = item.deviceId[1]
          const devType = item.deviceId[0]
          item.deviceId = devId
          item.deviceType = devType
        }
      })

      dataForm.value.periodTime = ~~dataForm.value.periodTime
      dataForm.value.limitTime = ~~dataForm.value.limitTime
      dataForm.value.executeTime = $format(dataForm.value.executeTime)
      try {
        const res = await savePatrol(dataForm.value)
        if (res.status === 200) {
          $messageSuccess('操作成功')
          props.config.close()
          ctx.emit('refreshData')
        } else {
          $messageError('请求失败')
        }
      } catch (err: any) {
        $messageError(err.message)
      }
    }

    const rules = ref<FormRules>({
      selectArea: [{ required: true, message: '请选择区域', trigger: 'change' }]
    })

    const openDialog = () => {
      state.selectArea = []
      state.dialogVisible = true
    }

    const visible = computed(() => props.config.visible)

    return {
      ...toRefs(state),
      dataForm,
      rules,
      openDialog,
      submit,
      deviceChange,
      // deviceTypeChange,
      projectIdChange,
      setStep,
      addStepByProject,
      addStep,
      visible,
      baseForm,
      setBaseParams,
      getDeviceTree,
      DeviceTree,
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
}
</style>
>

<style lang="scss" scoped>
$bg-color: #222536;
$border-color: #373858;
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
  border-bottom: 1px solid $border-color;
  padding: 32px;
}
.tableContainer {
  border-bottom: 1px solid $border-color;
  padding: 16px 32px;
  .stepTable {
    margin-top: 16px;
    .selectText {
      background-color: $bg-color;
      border-radius: 4px;
      line-height: 40px;
      width: 100%;
      height: 40px;
      border: 1px solid $bg-color;
      padding: 0 12px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }
  }
  .workContentInput {
    background: $bg-color;
    width: 100%;
    border: none;
  }
}
</style>
