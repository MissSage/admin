<template>
  <!--信息弹框页-->
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="dialogvisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="width"
    custom-class="addDialog"
    :lock-scroll="false"
    title="设备详情"
    @close="close"
  > -->
    <!--添加标签页-->

    <el-row class="content-row">
      <el-col class="content-col" :span="3" style="position: relative">
        <el-tabs
          v-model="activeName"
          tab-position="left"
          style="background-color: rgb(34, 37, 54); opacity: 1"
          @tab-click="handleClick"
        >
          <el-tab-pane label="设备信息" name="deviceinfo"
            ><img :src="RCode.url" class="code-s"
          /></el-tab-pane>
          <el-tab-pane label="维修信息" name="repairinfo"
            ><img :src="RCode.url" class="code-s"
          /></el-tab-pane>
          <el-tab-pane label="保养信息" name="maintenanceinfo"
            ><img :src="RCode.url" class="code-s"
          /></el-tab-pane>
          <el-tab-pane label="巡检信息" name="patrolinfo"
            ><img :src="RCode.url" class="code-s"
          /></el-tab-pane>
          <el-tab-pane label="转移记录" name="transferinfo"
            ><img :src="RCode.url" class="code-s"
          /></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class="content-col" :span="21" style="background-color: rgb(34, 37, 54)">
        <el-scrollbar height="100%">
          <DeviceInfo
            v-if="activeName === 'deviceinfo'"
            :current-id="RCode.currentId"
            @changeCurrentId="changeCurrentId"
          />
          <RepairInfo v-if="activeName === 'repairinfo'" :current-id="RCode.currentId" />
          <MaintenanceInfo v-if="activeName === 'maintenanceinfo'" :current-id="RCode.currentId" />
          <PatrolInfo v-if="activeName === 'patrolinfo'" :current-id="RCode.currentId" />
          <TransferInfo v-if="activeName === 'transferinfo'" :current-id="RCode.currentId" />
        </el-scrollbar>
      </el-col>
    </el-row>
    <!-- <template #footer>
      <el-divider style="background-color: rgb(124, 130, 166)"></el-divider>
      <el-button size="mini" @click="close">关闭</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import { ref, defineComponent, PropType, onMounted, watch } from 'vue'
import DeviceInfo from './deviceInfo.vue'
import RepairInfo from './repairinfo.vue'
import MaintenanceInfo from './maintenanceinfo.vue'
import PatrolInfo from './patrolinfo.vue'
import TransferInfo from './transferinfo.vue'
import QrcodeVue from 'qrcode'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  name: 'ChoiseDevice',
  components: {
    DeviceInfo,
    RepairInfo,
    MaintenanceInfo,
    PatrolInfo,
    TransferInfo,
    SLDialog
  },

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
        //
      }
    },
    currentId: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }, //    编号
    deviceNo: {
      type: String,
      default: ''
    }
  },
  emits: ['sendMsgIds', 'sendMsgList'],
  setup(props) {
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.title || '设备详情',
      visible: props.visible,
      scrollbar: false,
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
    const activeName = ref('deviceinfo')
    //1.定义变量
    //2.方法
    // 挂载后再加载数据
    onMounted(async () => {
      init()
      initCode()
    })
    let RCode = ref<any>({
      currentId: '',
      url: ''
    })
    const init = async () => {
      RCode.value.currentId = props.currentId
    }
    //修改当前的设备id
    const changeCurrentId = (deviceid: string) => {
      RCode.value.currentId = deviceid
    }
    const initCode = async () => {
      if (props.deviceNo) {
        QrcodeVue.toDataURL(
          props.deviceNo,
          {
            errorCorrectionLevel: 'L',
            version: 2,
            color: {
              dark: '#4B91E2FF', //前景色
              light: '#222536FF'
            }
          },
          function f(err, url) {
            if (!err) {
              RCode.value.url = url
            }
          }
        )
      }
    }
    const dialogvisible = ref<boolean>(props.visible)
    const clcikRow = async row => {
      let m = JSON.parse(JSON.stringify(row))
      console.log(m)
    }
    const handleClick = (tab: any) => {
      console.log('tab ', tab)
    }
    //返回
    return {
      dialogvisible,
      clcikRow,
      activeName,
      handleClick,
      RCode,
      initCode,
      changeCurrentId,
      slDialogConfig
    }
  }
})
</script>

<style lang="scss" scoped>
.content-row {
  max-height: inherit;
  height: inherit;
  .content-col {
    height: inherit;
    max-height: inherit;
  }
  :deep(.el-tabs) {
    height: 100%;
    width:100%;
    .el-tabs__content {
      height: 110px;
      width: 110px;
      margin: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      .el-tab-pane {
        width: 110px;
        height: 100px;
        .code-s {
          width: 110px;
          height: 110px;
        }
      }
    }
  }
}

.tableHeight {
  height: 400px;
}

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
  border-bottom: 1px solid #ebebeb;
  padding: 0 32px 12px;
}

.tableContainer {
  border-bottom: 1px solid #ebebeb;
  padding: 16px 32px 24px;

  .stepTable {
    margin-top: 16px;

    .selectText {
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
:deep(.el-tabs__nav-wrap) {
  &.is-left {
    padding: 0;
  }
}
</style>
