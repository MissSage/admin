<template>
  <treeBox>
    <template #tree>
      <SLTree :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <el-card class="cardbox">
          <el-scrollbar>
            <Card
              v-for="(item, i) in DeviceList"
              :key="i"
              :config="item"
              :project-id="treeData.currentProject.id"
              @openTrend="openTrendDialog"
              @openDialog="openDialog"
            />
            <TrendDialog
              v-if="trendDialogConfig.visible"
              v-model="trendDialogConfig.visible"
              :config="trendDialogConfig"
            />
            <AlarmDialog
              v-if="AlarmDialogConfig.visible"
              v-model="AlarmDialogConfig.visible"
              :config="AlarmDialogConfig"
            />
            <HistoryDialog
              v-if="HistoryDialogConfig.visible"
              v-model="HistoryDialogConfig.visible"
              :config="HistoryDialogConfig"
            />
            <RemoteDialog
              v-if="RemoteDialogConfig.visible"
              v-model="RemoteDialogConfig.visible"
              :config="RemoteDialogConfig"
            />
          </el-scrollbar>
        </el-card>
      </div>
    </template>
  </treeBox>

  <!-- 台账 主页 -->
</template>

<script lang="ts">
import TrendDialog from './components/trendDialog.vue'
import AlarmDialog from './components/AlarmDialog.vue'
import RemoteDialog from './components/RemoteDialog.vue'
import HistoryDialog from './components/HistoryDialog.vue'
import SLTree from '@/components/SLTree/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import Card from './components/card.vue'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import useDevice from '@/hooks/device/useDevice'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import useProject from '@/hooks/project/useProject'
import useDeviceControl from './hooks/useDeivceControl'
import { ControlInfo, ControlProperty, IDialogConfig, QueryControlListParam } from '..'
export default defineComponent({
  name: 'DevControl',
  components: {
    SLTree,
    CardSearch,
    Card,
    TrendDialog,
    AlarmDialog,
    HistoryDialog,
    RemoteDialog
  },
  mixins: [tBaseMixin],
  setup() {
    const cardSearch = ref<InstanceType<typeof CardSearch>>()
    const { DeviceTypes, getDeviceTypeTree } = useDevice()
    const { DeviceList, getDeviceList } = useDeviceControl()
    const { areaTree, getAreaTreeData } = useProject()
    // codes here
    const state = reactive<{
      treeData: SLTreeConfig
      cardSearchConfig: CSSearchConfig
      trendDialogConfig: IDialogConfig
      AlarmDialogConfig: IDialogConfig
      HistoryDialogConfig: IDialogConfig
      RemoteDialogConfig: IDialogConfig
    }>({
      trendDialogConfig: {
        visible: false,
        deviceId: ''
      },
      AlarmDialogConfig: {
        visible: false,
        title: '',
        projectId: '',
        status: false
      },
      HistoryDialogConfig: {
        visible: false,
        title: '',
        projectId: '',
        status: false
      },
      RemoteDialogConfig: {
        visible: false,
        title: '',
        projectId: '',
        status: false
      },
      treeData: {
        title: '项目列表',
        data: areaTree.value,
        loading: false,
        isFilterTree: true,
        currentProject: {},
        expandNodeId: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          state.treeData.currentProject = data.data
          refreshData()
        }
      },
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => refreshData() }
        },
        filters: [
          {
            label: '搜索',
            key: 'deviceName',
            type: 'input',
            width: '360px'
          },
          {
            label: '设备类型',
            key: 'deviceType',
            type: 'select',
            options: DeviceTypes.value,
            width: '360px'
          }
        ]
      }
    })
    const openTrendDialog = (item: ControlProperty, device: ControlInfo) => {
      state.trendDialogConfig.visible = true
      state.trendDialogConfig.title = '趋势图 - ' + device.name + ' - ' + item.propertyName
      state.trendDialogConfig.status = item.status
      state.trendDialogConfig.propId = item.property
      state.trendDialogConfig.deviceId = device.id.id
      state.trendDialogConfig.iconClass = item.status ? 'normal' : 'warning'
    }
    const openDialog = (deviceName: string, type: string, device: ControlInfo) => {
      switch (type) {
        case 'yckz':
          state.RemoteDialogConfig.visible = true
          state.RemoteDialogConfig.title = '远程控制 - ' + deviceName
          state.RemoteDialogConfig.status = device.status
          state.RemoteDialogConfig.iconClass = device.status ? 'on' : 'off'
          state.RemoteDialogConfig.device = device
          state.RemoteDialogConfig.deviceId = device.id.id
          break
        case 'lssj':
          state.HistoryDialogConfig.visible = true
          state.HistoryDialogConfig.title = '历史数据 - ' + deviceName
          state.HistoryDialogConfig.status = device.status
          state.HistoryDialogConfig.iconClass = device.status ? 'on' : 'off'
          state.HistoryDialogConfig.device = device
          break
        case 'bjjl':
          state.AlarmDialogConfig.visible = true
          state.AlarmDialogConfig.title = '报警记录 - ' + deviceName
          state.AlarmDialogConfig.status = device.status
          state.AlarmDialogConfig.iconClass = device.status ? 'on' : 'off'
          state.AlarmDialogConfig.device = device
          state.AlarmDialogConfig.deviceId = device.id.id
          state.AlarmDialogConfig.projectId = state.treeData.currentProject.id
          break
        default:
          break
      }
    }

    const refreshData = async () => {
      const queruParams = cardSearch.value ? cardSearch.value.queryParams : {}
      const paramsObj: QueryControlListParam = {
        projectId: state.treeData.currentProject.id,
        propertyType: '',
        deviceId: queruParams.deviceName
      }
      DeviceList.value = await getDeviceList(paramsObj)
    }
    onMounted(async () => {
      await getAreaTreeData()
      state.treeData.currentProject = areaTree.value[0].data
      await getDeviceTypeTree()
      state.treeData.data = areaTree.value
      const filter = state.cardSearchConfig.filters.find(item => item.key === 'deviceType')
      filter && (filter.options = DeviceTypes.value)
      await refreshData()
    })
    return {
      ...toRefs(state),
      cardSearch,
      DeviceList,
      openTrendDialog,
      openDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.cardbox {
  height: calc(100% - 120px);
  :deep(.el-card__body) {
    height: 100%;
    max-height: 100%;
  }
}
</style>
