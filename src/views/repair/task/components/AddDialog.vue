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
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-if="currentId == '' || (currentId != '' && activeName == GUDINGRIQIJIHUA)"
        label="固定日期任务"
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
        label="预防性任务"
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
        label="触发性任务"
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
        />
      </el-tab-pane>
    </el-tabs>

    <div
      v-if="activeName == GUDINGRIQIJIHUA || activeName == YUFANGXINGJIHUA"
      class="tableContainer"
    >
      <el-table ref="singleTable" class="stepTable" :data="dataForm.jobList" style="width: 100%">
        <el-table-column prop="orderNumber" width="78" align="center" label="序号">
        </el-table-column>
        <el-table-column label="项目" width="240">
          <template #default="scope">
            <el-cascader
              v-if="!readonly"
              v-model="scope.row.projectId"
              style="width: 100%"
              :options="areaTree"
              :multiple="false"
              :show-all-levels="false"
            ></el-cascader>
            <div v-else class="selectText">{{ scope.row.projectName || scope.row.projectId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备" width="240">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.deviceId"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option label="请选择" value=""></el-option>
              <el-option
                v-for="(item, i) in deviceTypes"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ scope.row.deviceName || scope.row.deviceId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="检修项目" width="240">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.standardId"
              clearable
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in standardList"
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
        <el-table-column label="检修描述" min-width="200">
          <template #default="scope">
            <input
              v-if="!readonly"
              v-model="scope.row.remark"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
            <div v-else class="selectText">
              {{ scope.row.remark }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="activeName == CHUFAXINGJIHUA" class="tableContainer">
      <el-table
        ref="singleTable"
        class="stepTable"
        :data="dataForm.trigger ? dataForm.trigger.triggerList : []"
        style="width: 100%"
      >
        <el-table-column prop="orderNumber" width="78" align="center" label="序号">
        </el-table-column>

        <el-table-column label="属性" width="240">
          <template #default="scope">
            <el-select
              v-if="!readonly"
              v-model="scope.row.attr"
              placeholder="请选择"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in attrs"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
            <div v-else class="selectText">
              {{ scope.row.deviceName || scope.row.deviceId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="判断" width="240">
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
            <div v-else class="selectText">
              {{ scope.row.condition }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="值" min-width="200">
          <template #default="scope">
            <input
              v-if="!readonly"
              v-model="scope.row.value"
              type="text"
              class="workContentInput"
              placeholder="请输入"
            />
            <div v-else class="selectText">
              {{ scope.row.value }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="条件关系" width="240">
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
            <div v-else class="selectText">
              {{ scope.row.relation }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <template #footer>
      <el-button size="mini" @click="close">取 消</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import BaseForm from './baseForm.vue'
import { ref, reactive, toRefs, defineComponent, PropType, onMounted, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import useProject from '@/hooks/project/useProject'
import { GUDINGRIQIJIHUA, YUFANGXINGJIHUA, CHUFAXINGJIHUA } from '@/common/constans/repair'
import { IStandard } from '@/common/types/repair/standard'
import { getAllRepairStandards } from '@/api/repair/standard'
import { getRepairTaskDetail } from '@/api/repair/task'
import { ITask, ITaskJobListItem, ITaskTrigger, ITaskTriggerItem } from '@/common/types/repair/task'
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
  setup(props) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.title,
      visible: props.visible,
      scrollbar: true,
      cancel: {
        handler: async () => await props.close()
      }
    })
    watch(
      () => props.visible,
      () => {
        slDialogConfig.value.visible = props.visible
        slDialogConfig.value.cancel = {
          handler: async () => await props.close()
        }
        slDialogConfig.value.width = props.width
      },
      {
        deep: true,
        immediate: true
      }
    )
    const activeName = ref<string>(GUDINGRIQIJIHUA)
    const { $message } = useGlobal()
    const dataForm = ref<ITask>({
      id: '',
      name: '',
      type: '',
      status: '',
      executeTime: null,
      completeTime: null,
      acceptanceTime: null,
      endTime: null,
      createTime: null,
      creator: '',
      tenantId: '',
      deviceNameList: '',
      trigger: {
        id: '',
        mainId: '',
        projectId: '',
        deviceId: '',
        detail: '',
        createTime: null,
        tenantId: '',
        triggerList: [] as ITaskTriggerItem[]
      } as ITaskTrigger,
      jobList: [] as ITaskJobListItem[]
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

    const { getAreaTreeData } = useProject()

    onMounted(async () => {
      const res = await getAllRepairStandards('')
      if (res.status == 200) {
        state.standardList = res.data
      }
      if (props.currentId) {
        setDefaultData()
      }
      state.areaTree = await getAreaTreeData()
    })
    const setDefaultData = () => {
      getRepairTaskDetail(props.currentId)
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
          $message.warning('获取详情失败')
        })
    }

    const baseForm = ref<InstanceType<typeof BaseForm>>()

    const setBaseParams = (params: ITask) => {
      dataForm.value.name = params.name
      dataForm.value.status = params.status
      if (activeName.value == GUDINGRIQIJIHUA) {
        dataForm.value.executeTime = params.executeTime
        dataForm.value.status = params.status
      } else if (activeName.value == YUFANGXINGJIHUA) {
        dataForm.value.executeTime = params.executeTime
      } else if (activeName.value == CHUFAXINGJIHUA) {
        if (dataForm.value.trigger) {
          dataForm.value.trigger.deviceId = params.trigger?.deviceId || ''
          dataForm.value.trigger.projectId = params.trigger?.projectId || ''
        }
      }
    }
    const dialogvisible = ref<boolean>(props.visible)

    return {
      ...toRefs(state),
      dialogvisible,
      baseForm,
      activeName,
      dataForm,
      GUDINGRIQIJIHUA,
      YUFANGXINGJIHUA,
      CHUFAXINGJIHUA,
      slDialogConfig,
      setBaseParams,
      setDefaultData,
      deviceTypes: ref<string[]>(['其他', '管道', '物联网水表', 'PLC', '压力计']),
      attrs: ref<string[]>(['UA', 'IA', '设备运行时长']),
      conditions: ref([
        { label: '小于=', value: '<' },
        { label: '等于=', value: '=' },
        { label: '大于=', value: '>' }
      ]),
      relations: ref([
        { label: '且and', value: '&&' },
        { label: '或or', value: '||' }
      ])
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
