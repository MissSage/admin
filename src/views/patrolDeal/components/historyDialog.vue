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
    <BaseForm ref="baseForm" :default-value="dataForm" :is-readonly="true" :show-map="true" />
    <div class="tabContainer">
      <el-tabs v-model="curJob">
        <el-tab-pane
          v-for="job in dataForm.jobList"
          :key="job.id"
          style="overflow-y: auto; max-height: 300px"
          :label="job.deviceName"
          :name="job.id"
        >
          <div style="overflow-y: auto; max-height: 300px">
            <div class="tabBox">
              <div class="iconfont icon-tubiao iconBox" style="color: #3e8ef7"></div>
              <div>
                <h1>任务状态</h1>
                <div class="dealStatus">
                  <p><span>完成状态：</span>{{ jobStatus[job.status]|| '-' }}</p>
                  <p><span>任务人：</span>{{ job.userName || '-' }}</p>
                  <p><span>完工时间：</span>{{ getTime(job.endTime) }}</p>
                  <p><span>工作用时：</span>{{ job.duration + '' || '-' + '小时' }}</p>
                  <p><span>所属区域：</span>{{ job.rangeName || '-' }}</p>
                  <p><span>所在项目：</span>{{ job.projectName || '-' }}</p>
                </div>
              </div>
            </div>
            <div class="tabBox">
              <div class="iconfont icon-tubiao iconBox" style="color: #3e8ef7"></div>
              <div class="dealInfo">
                <h1>任务详情</h1>
                <el-table :data="job.criterionDetail || []" style="width: 1380px">
                  <!-- <el-table-column prop="orderNum" width="78" align="center" label="序号"> -->
                  <!-- </el-table-column> -->
                  <el-table-column type="index" width="56" align="center" label="序号" />
                  <el-table-column label="工作内容">
                    <template #default="scope">
                      {{ job.deviceName }}， 方法：{{ scope.row.method }} ，开始时间：{{
                        getTime(scope.row.startTime, 'YYYY-MM-DD HH:mm')
                      }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="图片" width="186" prop='img'>
                  <template  #default="scope">
                    <el-button v-if="scope.row.imgs" type="text" @click="downloadResource">{{scope.row.imgs}}</el-button>
                    <span v-else>无</span>
                  </template>
                </el-table-column>
                <el-table-column label="声音" width="186">
                  <template  #default="scope">
                    <el-button v-if="scope.row.voiceFile" type="text" @click="downloadResource">{{scope.row.voiceFile}}</el-button>
                    <span v-else>无</span>
                  </template>
                </el-table-column> -->
                </el-table>
              </div>
            </div>
            <div class="tabBox" style="margin-top: 20px; width: 100%">
              <div class="iconfont icon-tubiao iconBox" style="color: #3e8ef7"></div>
              <div style="flex: 1">
                <h1>任务反馈</h1>
                <div class="dealStatus" style="width: 100%; margin-right: 0">
                  <p class="imgContainer">
                    <span>任务图片：</span>
                    <template v-if="job.imgs">
                      <img
                        v-for="(img, index) in job.imgs.split(',')"
                        :key="index"
                        :src="img"
                        class="imgItem"
                        @click="downloadResource(img, job.name, 'img')"
                      />
                    </template>
                    <template v-else>无</template>
                  </p>
                  <p class="jobVoice">
                    <span>任务声音：</span>
                    <span
                      v-if="job.voiceFile"
                      class="downloadMp3"
                      @click="downloadResource(job.voiceFile, job.name, 'file')"
                      >下载MP3</span
                    >
                    <template v-else>无</template>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <template #footer> -->
    <!-- <el-button type="primary" @click="config.close" size='mini'>打 印</el-button> -->
    <!-- <el-button type="primary" size="mini" @click="downloadReport">下 载</el-button> -->
    <!-- <el-button type="primary" size="mini" @click="config.close">关 闭</el-button>
    </template> -->
    <!-- </el-dialog> -->
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'

import { getCurrentPatrolDetail, downloadReport as _downloadReport } from '@/api/patrol'
import BaseForm from './baseForm.vue'
import { defineComponent, PropType, ref, watch } from 'vue'
import useDetail from '@/hooks/patrolDeal/useDetail'
import { ISLDialogConfig } from '@/components/SLDialog/type'

export default defineComponent({
  components: { BaseForm, SLDialog },
  props: {
    config: {
      type: Object as PropType<{
        visible: boolean
        title: string
        close: () => void
        currentId: string
      }>,
      default: () => {
        return {
          visible: false,
          title: '',
          close: () => {
            //do sth
          },
          currentId: ''
        }
      }
    }
  },
  setup(props, ctx) {
    const { dataForm, curJob, jobStatus, getTime } = useDetail(props, ctx, getCurrentPatrolDetail)

    const downloadResource = (url: string, name: string, type: string) => {
      if (type === 'img') return window.open(url)
      const a = document.createElement('a')
      a.setAttribute('href', url) // a.href='文件链接'
      a.setAttribute('download', name) // a.download='文件名'
      a.click()
    }

    const downloadReport = async () => {
      const res = await _downloadReport(dataForm.value.id)
      const url = window.URL.createObjectURL(res.data)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${dataForm.value.content}.zip`)
      document.body.appendChild(link)
      link.click()
    }
    const slDialogConfig = ref<ISLDialogConfig>({
      title: props.config.title,
      visible: props.config.visible,
      scrollbar: true,
      cancel: {
        handler: async() => await props.config.close()
      }
    })
    watch(
      () => props.config.visible,
      () => {
        slDialogConfig.value.visible = props.config.visible
        slDialogConfig.value.cancel = {
          handler: async() => await props.config.close()
        }
        // slDialogConfig.value.width = props.config.width
      },
      {
        deep: true,
        immediate: true
      }
    )
    const visible = ref<boolean>(props.config.visible)
    // watch(
    //   () => props.config.visible,
    //   (val) => {
    //     visible.value = val
    //   }
    // );
    return {
      dataForm,
      curJob,
      jobStatus,
      getTime,
      downloadResource,
      downloadReport,
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
  border-bottom: 1px solid $border-color;
  padding: 16px 32px;
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
      &.iconfont::before {
        font-size: 16px;
      }
    }
  }
  .dealStatus {
    display: flex;
    margin-bottom: 20px;
    .imgContainer {
      display: flex;
      width: 60%;
    }
    .downloadMp3 {
      color: #3e8ef7;
      cursor: pointer;
    }
    .imgItem {
      cursor: pointer;
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }

    p {
      margin-right: 80px;
      color: $text-color;
      span {
        color: $text-color-light;
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
