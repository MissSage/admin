<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <!-- <el-dialog
    v-model="visible"
    width="70%"
    custom-class="patrolDialog"
    :title="config.title || ''"
    :lock-scroll="false"
    @close="config.close"
  > -->
    <BaseForm ref="baseForm" :is-readonly="true" :default-value="dataForm" />
    <div class="tabContainer">
      <el-tabs v-model="curJob">
        <el-tab-pane
          v-for="job in dataForm.jobList"
          :key="job.id"
          :label="job.deviceName"
          :name="job.id"
        >
          <div class="tabBox">
            <div class="iconfont icon-tubiao iconBox" style="color: #3e8ef7"></div>
            <div>
              <h1 class="tabContentTitle">任务状态</h1>
              <div class="dealStatus">
                <p><span>完成状态：</span>{{ jobStatus[job.status] }}</p>
                <p><span>任务人：</span>{{ job.userName || '-' }}</p>
                <p><span>完工时间：</span>{{ getTime(job.endTime) }}</p>
                <p><span>工作用时：</span>{{ job.duration || '-' + '小时' }}</p>
                <p><span>所属区域：</span>{{ job.rangeName || '-' }}</p>
                <p><span>所在项目：</span>{{ job.projectName || '-' }}</p>
              </div>
            </div>
          </div>
          <div class="tabBox">
            <div class="iconfont icon-tubiao iconBox" style="color: #3e8ef7"></div>
            <div class="dealInfo">
              <h1 class="tabContentTitle">任务详情</h1>
              <div>
                <p v-for="step in job.criterionDetail" :key="step.no">
                  <span>{{ step.no }}</span>
                  {{ job.deviceName }}， 方法及基准：{{ step.method }}
                  {{ getTime(step.startTime, 'Y-M-D H:m') }}
                </p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <template #footer>
      <el-button type="primary" size="mini" @click="config.close">关 闭</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import { getCurrentPatrolDetail } from '@/api/patrol'
import BaseForm from './baseForm.vue'
import { computed, defineComponent, onBeforeMount, PropType, ref, watch } from 'vue'
// import useDetail from '@/hooks/patrolDeal/useDetail'
import useGlobal from '@/hooks/global/useGlobal'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  components: { BaseForm, SLDialog },
  props: {
    config: {
      type: Object as PropType<DialogConfig>,
      default: () => {
        //
      }
    }
  },
  setup(props) {
    const dataForm = ref<any>({ id: null, jobList: [], users: [] })
    const curJob = ref<string>('')
    const { $format, $messageError } = useGlobal()

    const visible = computed(() => props.config.visible)
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.config.title,
      visible: props.config.visible,
      scrollbar: true,
      width: '70%',
      cancel: {
        handler: async() => await props.config.close()
      }
    })
    watch(
      () => props.config.visible,
      () => {
        slDialogConfig.value.visible = props.config.visible
      },
      {
        immediate: true
      }
    )
    const getDetail = async () => {
      try {
        const res = await getCurrentPatrolDetail(dataForm.value.id)
        console.log(res.data, '_getDetail_getDetail')

        const detail = res.data
        detail.jobList.forEach(item => {
          item.criterionDetail = JSON.parse(item.criterionDetail)
        })

        dataForm.value = detail
        if (dataForm.value.jobList[0]) {
          curJob.value = dataForm.value.jobList[0].id
        }
        if (dataForm.value.users) {
          dataForm.value.users = dataForm.value.users.split(',')
        } else {
          dataForm.value.users = []
        }
      } catch (err: any) {
        $messageError(err.data.message)
      }
    }

    const getTime = (val: string | Date, format?: string) => $format(val, format)

    onBeforeMount(() => {
      dataForm.value.id = props.config.currentId
      if (dataForm.value.id) getDetail()
    })

    const jobStatus = ref<string[]>(['未完成', '已完成', '处理中', '记录故障'])

    return {
      dataForm,
      curJob,
      jobStatus,
      getTime,
      visible,
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
}
</style>
>

<style lang="scss" scoped>
$text-color: rgb(182, 179, 179);
$text-color-light: #fff;
$border-color: #3c3f54;
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
  padding: 16px 32px;
}
.tabContainer {
  // border-bottom: 1px solid $border-color;
  padding: 0px 32px 24px;
  h1 {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $text-color-light;
    line-height: 22px;
    margin: 0;
    margin-bottom: 12px;
  }
  .tabBox {
    display: flex;
    .iconBox {
      margin-right: 12px;
      font-size: 16px;
    }
  }
  .dealStatus {
    display: flex;
    margin-bottom: 20px;

    p {
      margin-right: 80px;
      max-width: 300px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      color: $text-color;
      span {
        color: $text-color;
      }
    }
  }
  .dealInfo {
    p {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $text-color;
      line-height: 20px;
      margin-bottom: 16px;
      span {
        color: $text-color;
        display: inline-block;
        margin-right: 34px;
      }
    }
  }
}
</style>
