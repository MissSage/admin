<template>
  <el-form
    label-position="top"
    class="flex-form"
    :model="workOrder"
  >
    <el-form-item label="工单编号:">
      <TextItem>{{ workOrder.code }}</TextItem>
    </el-form-item>
    <el-form-item label="优先级:">
      <TextItem>{{ formateRowPriority(workOrder) }}</TextItem>
    </el-form-item>
    <el-form-item label="创建人:">
      <TextItem>{{ workOrder.creatorName }}</TextItem>
    </el-form-item>
    <el-form-item label="创建时间:">
      <TextItem>{{ workOrder.createTime?formatDate(workOrder.createTime):workOrder.createTime }}</TextItem>
    </el-form-item>
    <el-form-item label="工单类型:">
      <TextItem>{{ formateRowOrderType(workOrder) }}</TextItem>
    </el-form-item>
    <el-form-item label="是否外委:">
      <TextItem>{{ formateRowIsOutsider(workOrder) }}</TextItem>
    </el-form-item>
    <el-form-item label="处理人:">
      <TextItem>{{ workOrder.executorName }}</TextItem>
    </el-form-item>
    <el-form-item label="截止时间:">
      <TextItem>{{ formatDate(workOrder.deadlineTime) }}</TextItem>
    </el-form-item>
  </el-form>
  <h4 class="el-table-title_h4">工单内容</h4>
  <template v-if="workOrder.type === OrderTypes.REPAIRE || workOrder.type === OrderTypes.MAINTAIN">
    <el-table
      v-if="workOrder.contentDetail"
      :data="workOrder.contentDetail.jobList"
      style="width: 100%"
    >
      <el-table-column
        prop="orderNumber"
        width="78"
        align="center"
        label="序号"
      >
      </el-table-column>
      <el-table-column label="项目" width="240">
        <template #default="scope">
          <div class="selectText">{{ scope.row.projectName || scope.row.projectId }}</div>
        </template>
      </el-table-column>
      <el-table-column label="设备" width="240">
        <template #default="scope">
          <div class="selectText">
            {{ scope.row.deviceName || scope.row.deviceId }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="检修项目" width="240">
        <template #default="scope">
          <div class="selectText" @click="showStandardDetail(workOrder.type||'', scope.row)">
            <span class="openable-text">{{ scope.row.standardName || scope.row.standardId }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200">
        <template #default="scope">
          <div class="selectText">
            {{ scope.row.remark }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template v-else>
      <span class="no-content">没有工单内容</span>
    </template>
  </template>
  <template v-else-if="workOrder.type === OrderTypes.OTHER">
    <el-descriptions
      direction="vertical"
      :column="2"
      border
    >
      <el-descriptions-item label="问题描述">{{ workOrder.questionRemark }}</el-descriptions-item>
      <el-descriptions-item label="问题附件">
        <el-tag v-if="workOrder.questionFile">
          <span
            class="questfile-download"
            @click="downloadResource(workOrder.questionFile||'', '问题附件', 'file')"
          >
            {{ formatePathName(workOrder.questionFile) }}
          </span>
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </template>
  <template v-else>
    <span class="no-content">没有工单内容</span>
  </template>
  <RepaireAddDialog
    v-if="RepaireAddDialogConfig.visible"
    :visible="RepaireAddDialogConfig.visible"
    :close="RepaireAddDialogConfig.close"
    :current-id="RepaireAddDialogConfig.currentId"
    :readonly="RepaireAddDialogConfig.readonly"
    :title="RepaireAddDialogConfig.title"
    :width="'60%'"
  />
  <MaintenanceAddDialog
    v-if="MaintenanceAddDialogConfig.visible"
    :visible="MaintenanceAddDialogConfig.visible"
    :close="MaintenanceAddDialogConfig.close"
    :current-id="MaintenanceAddDialogConfig.currentId"
    :readonly="MaintenanceAddDialogConfig.readonly"
    :title="MaintenanceAddDialogConfig.title"
    :width="'60%'"
  />
</template>

<script lang="ts">
import TextItem from '@/components/SLTextItem/index.vue'
import RepaireAddDialog from '@/views/repair/standard/components/AddDialog.vue'
import MaintenanceAddDialog from '@/views/maintenance/standard/components/AddDialog.vue'
import {
  formatDate,
  formatePathName,
  formateRowIsOutsider,
  formateRowOrderType,
  formateRowPriority,
  formateRowStatus,
  OrderTypes
} from '../index'
import { IWorkOrderDetail } from '@/common/types/workorder'
import { defineComponent, PropType, ref } from 'vue'
import { ElMessage } from 'element-plus'
interface DialogConfig {
  visible: boolean
  title?: string
  close: () => void
  currentId: string
  dialogWidth?: string
  readonly?: boolean
  deviceNo?: string
}
export default defineComponent({
  name: 'OrderDetailBase',
  components: { TextItem, RepaireAddDialog, MaintenanceAddDialog },
  props: {
    workOrder: {
      type: Object as PropType<IWorkOrderDetail>,
      default: () => {
        return {}
      }
    }
  },
  setup () {
    // codes here
    const downloadResource = (url: string, name: string, type: string) => {
      if (type === 'img') return window.open(url)
      const a = document.createElement('a')
      a.setAttribute('href', url) // a.href='文件链接'
      a.setAttribute('target', '_blank') // a.href='文件链接'
      a.setAttribute('download', name) // a.download='文件名'
      a.click()
    }
    const RepaireAddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '标准明细',
      currentId: '',
      close: () => {
        RepaireAddDialogConfig.value.visible = false
      }
    })
    const showStandardDetail = async (type: string, row: any) => {
      let id = ''
      if (row.standardDetail) {
        try {
          // const standard = JSON.parse(row.standardDetail)
          // id = standard.id
          id = row.standardDetail
        } catch (error) {
          id = ''
        }
      }
      if (id && id !== '') {
        if (type === OrderTypes.REPAIRE) {
          MaintenanceAddDialogConfig.value.visible = false
          RepaireAddDialogConfig.value.currentId = id
          RepaireAddDialogConfig.value.readonly = true
          RepaireAddDialogConfig.value.visible = true
        } else if (type === OrderTypes.MAINTAIN) {
          RepaireAddDialogConfig.value.visible = false
          MaintenanceAddDialogConfig.value.currentId = id
          MaintenanceAddDialogConfig.value.readonly = true
          MaintenanceAddDialogConfig.value.visible = true
        }
      } else {
        ElMessage.warning('未请求到数据！')
      }
    }
    const MaintenanceAddDialogConfig = ref<DialogConfig>({
      visible: false,
      title: '标准明细',
      currentId: '',
      close: () => {
        RepaireAddDialogConfig.value.visible = false
      }
    })
    return {
      OrderTypes,
      RepaireAddDialogConfig,
      MaintenanceAddDialogConfig,
      formatePathName,
      downloadResource,
      showStandardDetail,
      formatDate,
      formateRowPriority,
      formateRowOrderType,
      formateRowStatus,
      formateRowIsOutsider
    }
  }
})
</script>

<style lang="scss" scoped>
.flex-form {
  display: grid;
  grid-column: 4;
  grid-template-columns: 25% 25% 25% 25%;

  :deep(.el-form-item) {
    .el-form-item__label {
      font-size: 14px;
      line-height: 20px;
      padding: 15px 0 5px 0;
    }
    margin: 0;
    padding: 0 15px 0 0;
    width: 100%;
    &:nth-child(4n) {
      padding-right: 0;
    }
  }
}
.el-table-title_h4 {
  font-size: 14px;
  height: 40px;
  margin-bottom: 10px;
  color: #ffffff;
  background-color: #2c3258;
  line-height: 20px;
  padding: 10px 10px;
  margin: 25px 0;
}

:deep(.el-descriptions),
.el-descriptions {
  .el-descriptions__body {
    .is-bordered {
      th,
      td {
        border: 1px solid #373858;
      }
    }
    margin-bottom: 15px;
    background-color: #343947;
    .el-descriptions__label.is-bordered-label {
      background-color: #2b303f;
    }
    .el-tag {
      background-color: #59616a;
      border-color: #5d666f;
    }
  }
}
:deep(.el-descriptions__label) {
  &.is-bordered {
    th,
    td {
      border: 1px solid #373858;
    }
  }
}
.no-content {
  color: #8c939d;
  padding: 15px;
}
.questfile-download {
  cursor: pointer;
}
.openable-text {
  color: #4aa9d8;
  cursor: pointer;
}
</style>
