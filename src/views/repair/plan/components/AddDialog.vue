<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="dialogvisible"
    :width="width"
    custom-class="patrolDialog"
    :lock-scroll="false"
    :title="title || ''"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    @close="close"
  > -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        v-if="currentId == '' || (currentId != '' && activeName == GUDINGRIQIJIHUA)"
        label="固定日期计划"
        :name="GUDINGRIQIJIHUA"
      >
        <BaseForm
          v-if="activeName == GUDINGRIQIJIHUA"
          ref="baseForm"
          :form-type="GUDINGRIQIJIHUA"
          :is-readonly="readonly"
          :default-value="dataForm"
          @setBaseParams="setBaseParams"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="currentId == '' || (currentId != '' && activeName == YUFANGXINGJIHUA)"
        label="预防性计划"
        :name="YUFANGXINGJIHUA"
      >
        <BaseForm
          v-if="activeName == YUFANGXINGJIHUA"
          ref="baseForm"
          :form-type="YUFANGXINGJIHUA"
          :is-readonly="readonly"
          :default-value="dataForm"
          @setBaseParams="setBaseParams"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="currentId == '' || (currentId != '' && activeName == CHUFAXINGJIHUA)"
        label="触发性计划"
        :name="CHUFAXINGJIHUA"
      >
        <BaseForm
          v-if="activeName == CHUFAXINGJIHUA"
          ref="baseForm"
          :form-type="CHUFAXINGJIHUA"
          :area-tree="areaTree"
          :is-readonly="readonly"
          :default-value="dataForm"
          @setBaseParams="setBaseParams"
          @deviceChange="initAttr"
        />
      </el-tab-pane>
    </el-tabs>

    <div
      v-if="activeName == GUDINGRIQIJIHUA || activeName == YUFANGXINGJIHUA"
      class="tableContainer"
    >
      <el-button
        v-if="!readonly"
        icon="iconfont icon--tainjia"
        :disabled="readonly"
        size="mini"
        type="primary"
        @click="addStep"
        >添加设备</el-button
      >
      <el-table ref="singleTable" class="stepTable" :data="dataForm.jobList" style="width: 100%">
        <el-table-column
          prop="orderNumber"
          width="78"
          align="center"
          label="序号"
        ></el-table-column>
        <el-table-column label="项目">
          <template #default="scope">
            <el-cascader
              v-if="!readonly"
              v-model="scope.row.projectId"
              style="width: 100%"
              :options="areaTree"
              filterable
              :props="cascaderProps"
              @change="(id:any) => projectIdChange(id, scope.row)"
            ></el-cascader>

            <div v-else class="selectText">{{ scope.row.projectName || scope.row.projectId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备">
          <template #default="scope">
            <el-cascader
              v-if="!readonly"
              v-model="scope.row.deviceId"
              :disabled="readonly"
              style="width: 100%"
              filterable
              :options="scope.row.devices"
              @change="(ids:any) => deviceChange(ids, scope.row)"
            ></el-cascader>

            <div v-else class="selectText">{{ scope.row.deviceName || scope.row.deviceId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="保养项目">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.standardId"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in scope.row.standards"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ scope.row.standardName || scope.row.standardId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="scope">
            <el-input
              v-if="!readonly"
              v-model="scope.row.remark"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            ></el-input>
            <div v-else class="selectText">{{ scope.row.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="currentId == ''" fixed="right" label="操作" width="220">
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
    <div v-if="activeName == CHUFAXINGJIHUA" class="tableContainer">
      <el-button
        v-if="!readonly"
        icon="iconfont icon--tainjia"
        size="mini"
        type="primary"
        @click="addStep"
        >添加条件</el-button
      >
      <el-table
        ref="singleTable"
        class="stepTable"
        :data="dataForm.trigger ? dataForm.trigger.triggerList : []"
        style="width: 100%"
      >
        <el-table-column
          prop="orderNumber"
          width="78"
          align="center"
          label="序号"
        ></el-table-column>

        <el-table-column label="属性">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.attr"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
              @change="(id:any) => handleAttrChange(id, scope.row)"
            >
              <el-option
                v-for="(item, i) in AttrList"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-else class="selectText">{{ scope.row.attr }}</div>
          </template>
        </el-table-column>
        <el-table-column label="判断">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.condition"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in conditions"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-else class="selectText">{{ formateCondition(scope.row.condition) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template #default="scope">
            <el-input
              v-if="!readonly"
              v-model="scope.row.value"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            >
              <!-- <template v-if="scope.row.unit" #append>{{ scope.row.unit }}</template> -->
            </el-input>
            <div v-else class="selectText">{{ scope.row.value }}</div>
          </template>
        </el-table-column>
        <el-table-column label="条件关系">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.relation"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in relations"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div v-else class="selectText">{{ formateRelation(scope.row.relation) }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
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
import _ from 'lodash'
import SLDialog from '@/components/SLDialog/index.vue'
import { v4 as uuidv4 } from 'uuid'
import BaseForm from './baseForm.vue'
import { ref, reactive, toRefs, defineComponent, PropType, onMounted, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import useProject from '@/hooks/project/useProject'
import { GUDINGRIQIJIHUA, YUFANGXINGJIHUA, CHUFAXINGJIHUA } from '@/common/constans/repair'
import { IPlan, IPlanJob, IPlanTrigger, IPlanTriggerListItem } from '@/common/types/repair/plan'
import { IStandard } from '@/common/types/repair/standard'
import { addRepairePlan, getRepairePlanDetail } from '@/api/repair/plan'
import { getAllRepairStandards } from '@/api/repair/standard'
import { removeSlash } from '@/utils/removeIdSlash'
import useDevice from '@/hooks/device/useDevice'
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
      width: props.width,
      cancel: {
        handler: async() => await props.close()
      },
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
    const { $messageWarning } = useGlobal()
    const cascaderProps = {
      checkStrictly: true
    }
    const { DeviceTree, getDeviceTree, AttrList, getAttrList } = useDevice()
    const activeName = ref<string>(GUDINGRIQIJIHUA)
    const { $message, $confirm } = useGlobal()
    const dataForm = ref<IPlan>({
      id: '',
      name: '',
      type: '',
      executeTime: null,
      periodTime: 0,
      status: '',
      creator: '',
      createTime: null,
      deviceNameList: '',
      trigger: {
        id: '',
        mainId: '',
        detail: '',
        createTime: null,
        projectId: '',
        deviceId: '',
        triggerList: [] as IPlanTriggerListItem[],
        tenantId: ''
      } as IPlanTrigger,
      jobList: [] as IPlanJob[]
    })

    const state = reactive<{
      standardList: IStandard[]
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
    }>({
      standardList: [],
      areaTree: [],
      projectId: '',
      dialogVisible: false
    })
    const addStep = () => {
      if (activeName.value == GUDINGRIQIJIHUA || activeName.value == YUFANGXINGJIHUA) {
        dataForm.value.jobList.push({
          orderNumber: dataForm.value.jobList.length + 1,
          projectId: '',
          deviceId: '',
          standardId: '',
          remark: ''
        } as IPlanJob)
      } else if (activeName.value == CHUFAXINGJIHUA) {
        dataForm.value.trigger?.triggerList.push({
          orderNumber: dataForm.value.trigger.triggerList.length + 1,
          attr: '',
          unit: '',
          condition: '',
          value: '',
          relation: ''
        } as IPlanTriggerListItem)
      }
    }
    const handleTabClick = (tab: any) => {
      DeviceTree.value = []
      dataForm.value.type = tab.props.name
      if (tab.props.name == GUDINGRIQIJIHUA || tab.props.name == YUFANGXINGJIHUA) {
        if (dataForm.value.jobList.length == 0) {
          addStep()
          dataForm.value.trigger && (dataForm.value.trigger.triggerList.length = 0)
        }
      } else if (tab.props.name == CHUFAXINGJIHUA) {
        if (dataForm.value.trigger?.triggerList.length == 0) {
          addStep()
          dataForm.value.jobList.length = 0
        }
      }
    }

    const setStep = (step: IPlanJob, option: string) => {
      if (option === 'up') {
        // orderNumber     >0
        if (~~step.orderNumber === 1) return
        dataForm.value.jobList[step.orderNumber - 2].orderNumber++
        dataForm.value.jobList[step.orderNumber - 1].orderNumber--
        dataForm.value.jobList.sort((a, b) => a.orderNumber - b.orderNumber)
      } else if (option === 'down') {
        if (~~step.orderNumber === dataForm.value.jobList.length) return
        dataForm.value.jobList[step.orderNumber].orderNumber--
        dataForm.value.jobList[step.orderNumber - 1].orderNumber++
        dataForm.value.jobList.sort((a, b) => a.orderNumber - b.orderNumber)
      } else if (option === 'del') {
        $confirm('确定要删除该任务吗?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dataForm.value.jobList.splice(step.orderNumber - 1, 1)
          dataForm.value.jobList.forEach(item => {
            if (item.orderNumber > step.orderNumber) {
              item.orderNumber--
            }
          })
        })
      }
    }

    const projectIdChange = async (ids: string | string[], row: IPlanJob) => {
      console.log(ids, row)
      const id = ids instanceof Array ? ids[ids.length - 1] : ids
      getDeviceTree(id).then(() => {
        row.devices = DeviceTree.value
      })
    }
    const deviceChange = (ids: string[], row: IPlanJob) => {
      console.log(ids, row)
      const type = ids[0]
      row.standards = state.standardList.filter(item => item.deviceType === type)
      row.standardId = ''
    }
    const initAttr = async (device?: any) => {
      await getAttrList(device.data.deviceId).then(() => {
        if (AttrList.value.length === 0) $messageWarning('此设备不能生成触发性计划！')
      })
    }
    const handleAttrChange = (id: string, row: IPlanTriggerListItem) => {
      console.log(id)

      const item = AttrList.value.find(a => a.value === id)
      item && (row.unit = item.data)
    }
    const { getAreaTreeData } = useProject()

    const setDefaultData = () => {
      getRepairePlanDetail(props.currentId)
        .then(res => {
          console.log(res)
          if (res.status == 200) {
            activeName.value = res.data.type
          }
          return Promise.resolve(res)
        })
        .then(res => {
          dataForm.value = res.data
        })
        .catch(() => {
          $message.warning('获取计划信息失败')
        })
    }

    const baseForm = ref<InstanceType<typeof BaseForm>>()

    const setBaseParams = (params: IPlan) => {
      dataForm.value.name = params.name
      dataForm.value.status = params.status
      if (activeName.value == GUDINGRIQIJIHUA) {
        dataForm.value.executeTime = params.executeTime
        dataForm.value.status = params.status
      } else if (activeName.value == YUFANGXINGJIHUA) {
        dataForm.value.executeTime = params.executeTime
        dataForm.value.periodTime = params.periodTime
      } else if (activeName.value == CHUFAXINGJIHUA) {
        if (dataForm.value.trigger) {
          dataForm.value.trigger.deviceId = params.trigger?.deviceId || ''
          dataForm.value.trigger.projectId = params.trigger?.projectId || ''
        }
      }
      // delete params.jobList
      // Object.assign(dataForm.value, params)
    }

    const submit = async () => {
      if (!baseForm.value?.checkRule()) {
        return
      }
      const data = _.cloneDeep(dataForm.value)
      data.type = activeName.value
      if (activeName.value == GUDINGRIQIJIHUA || activeName.value == YUFANGXINGJIHUA) {
        data.jobList.map(item => {
          if (typeof item.projectId === 'object' && item.projectId.length > 0) {
            item.projectId = item.projectId.pop() || item.projectId
          } else {
            item.projectId = item.projectId.toString()
          }
          if (typeof item.deviceId === 'object' && item.deviceId.length > 0) {
            item.deviceId = item.deviceId.pop() || item.deviceId
          } else {
            item.projectId = item.projectId.toString()
          }
        })
        if (data.jobList.length == 0) {
          $message.warning('请添加设备')
          return
        } else if (!data.jobList[0].projectId) {
          $message.warning('项目不能为空')
          return
        } else if (!data.jobList[0].deviceId) {
          $message.warning('设备不能为空')
          return
        } else if (!data.jobList[0].standardId) {
          $message.warning('保养项目不能为空')
          return
        }
      } else if (activeName.value == CHUFAXINGJIHUA) {
        if (data.trigger) {
          const projectId = data.trigger.projectId
          if (typeof projectId === 'object' && projectId.length > 0) {
            data.trigger.projectId = projectId.pop() || projectId
          } else {
            data.trigger.projectId = projectId.toString()
          }
          if (typeof data.trigger.deviceId === 'object' && data.trigger.deviceId.length > 0) {
            data.trigger.deviceId = data.trigger.deviceId.pop() || data.trigger.deviceId
          } else {
            data.trigger.projectId = data.trigger.projectId.toString()
          }
          if (data.trigger.triggerList.length == 0) {
            $message.warning('请添加条件')
            return
          } else if (!data.trigger.triggerList[0].attr) {
            $message.warning('属性不能为空')
            return
          } else if (!data.trigger.triggerList[0].condition) {
            $message.warning('判断不能为空')
            return
          } else if (!data.trigger.triggerList[0].value) {
            $message.warning('值不能为空')
            return
          } else if (!data.trigger.triggerList[0].relation) {
            $message.warning('条件关系不能为空')
            return
          }
        } else {
          $message.warning('数据异常')
          return
        }
      }
      try {
        const res = await addRepairePlan(data as IPlan)
        if (res.status === 200) {
          $message.success('操作成功')
          props.close()
          ctx.emit('refreshData')
        } else {
          $message.error('请求失败')
        }
      } catch (err: any) {
        $message.error(err.data.message)
      }
    }
    const relations = ref([
      { label: '且and', value: '&&' },
      { label: '或or', value: '||' }
    ])
    const formateRelation = (value: string) => {
      const relation = relations.value.find(item => item.value === value)
      return relation ? relation.label : value
    }
    const conditions = ref([
      { label: '小于=', value: '<' },
      { label: '等于=', value: '=' },
      { label: '大于=', value: '>' }
    ])
    const formateCondition = (value: string) => {
      const condition1 = conditions.value.find(item => item.value === value)
      return condition1 ? condition1.label : value
    }
    const dialogvisible = ref<boolean>(props.visible)
    onMounted(async () => {
      const res = await getAllRepairStandards('')
      if (res.status == 200) {
        state.standardList = res.data
      }
      if (props.currentId.trim() == '') {
        addStep()
        dataForm.value.trigger && (dataForm.value.trigger.id = removeSlash(uuidv4()))
      } else {
        setDefaultData()
      }
      state.areaTree = await getAreaTreeData()
    })
    return {
      ...toRefs(state),
      cascaderProps,
      dialogvisible,
      baseForm,
      activeName,
      dataForm,
      GUDINGRIQIJIHUA,
      YUFANGXINGJIHUA,
      CHUFAXINGJIHUA,
      AttrList,
      getAttrList,
      DeviceTree,
      deviceChange,
      initAttr,
      getDeviceTree,
      handleAttrChange,
      submit,
      projectIdChange,
      setStep,
      addStep,
      handleTabClick,
      setBaseParams,
      setDefaultData,
      conditions,
      formateCondition,
      relations,
      formateRelation,
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
      background-color: #232635;
      border-radius: 4px;
      line-height: 40px;
      width: 100%;
      height: 40px;
      border: 1px solid #333333;
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
