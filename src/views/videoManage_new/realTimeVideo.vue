<template>
  <div class="real-time-video-container" :class="{ 'real-time-video-full-screen': fullScreen }">
    <div class="left-video-list">
      <p class="list-title">设备列表</p>
      <div class="list-box tree-list-box">
        <el-tree
          ref="dcTree"
          class="data-source-s-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          default-expand-all
          :default-checked-keys="[1]"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="getProjectData"
        >
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <p class="c-t-label">
                <i
                  v-if="data.serialNumber"
                  class="iconfont icon-shexiangtou"
                  :class="{ 'shexiangtou-active': data.online }"
                ></i>
                <span class="c-t-name"> {{ node.label }}</span>
              </p>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="video-control" :class="{ 'hidden-panel': !panelOpen }">
        <p class="v-c-title">云台控制</p>
        <div class="control-box">
          <!-- <i class="el-icon-minus c-btn" @click="changeZoom()"></i> -->
          <div class="direction-box">
            <p class="c-d-btn d-btn-center" @click="chengeControl()">
              <i class="iconfont icon-zantingtingzhi"></i>
            </p>
            <p class="c-d-btn" @click="chengeControl(1)">
              <i class="el-icon-arrow-up cd-btn-t"></i>
            </p>
            <p class="c-d-btn" @click="chengeControl(4)">
              <i class="el-icon-arrow-up cd-btn-r"></i>
            </p>
            <p class="c-d-btn" @click="chengeControl(3)">
              <i class="el-icon-arrow-up cd-btn-l"></i>
            </p>
            <p class="c-d-btn" @click="chengeControl(2)">
              <i class="el-icon-arrow-up cd-btn-b"></i>
            </p>
          </div>
          <!-- <i class="el-icon-plus c-btn" @click="changeZoom()"></i> -->
          <div class="zoom-aperture">
            <div class="zoom-box">
              <p class="z-a-title">变焦：</p>
              <i class="el-icon-minus c-btn c-btn-lh" @click="changeZoom()"></i>
              <i class="iconfont icon-zantingtingzhi c-btn" @click="changeZoom(0)"></i>
              <i class="el-icon-plus c-btn c-btn-lh" @click="changeZoom()"></i>
            </div>
            <div class="aperture-box">
              <p class="z-a-title">光圈：</p>
              <i class="el-icon-minus c-btn c-btn-lh" @click="changeAperture(2)"></i>
              <i class="iconfont icon-zantingtingzhi c-btn" @click="changeAperture(0)"></i>
              <i class="el-icon-plus c-btn c-btn-lh" @click="changeAperture(1)"></i>
            </div>
          </div>
          <p class="panel-control" @click="panelOpenChange()">
            <i
              class="iconfont"
              :class="{ 'icon-arrowleft': panelOpen, 'icon-arrowright': !panelOpen }"
            ></i>
          </p>
          <span class="hidden-text">{{ hiddenText }}</span>
        </div>
        <!-- <div></div> -->
      </div>
    </div>
    <div class="right-video-show">
      <div class="top-btn-control">
        <div>
          <span class="t-b-label">分屏：</span>
          <i
            class="iconfont icon-yiping size-btn"
            :class="{ 'current-size': currentSize === 1 }"
            @click="changeShowSize(1)"
          ></i>
          <i
            class="iconfont icon-siping size-btn"
            :class="{ 'current-size': currentSize === 4 }"
            @click="changeShowSize(4)"
          ></i>
          <i
            class="iconfont icon-iconjiuping size-btn"
            :class="{ 'current-size': currentSize === 9 }"
            @click="changeShowSize(9)"
          ></i>
        </div>
        <p class="full-screen" @click="changeFullScreen"><i class="iconfont icon-quanping"></i></p>
      </div>
      <div id="full-box" class="video-container">
        <div
          v-for="(item, index) of showVideo"
          :key="index"
          class="video-box"
          :class="{
            'item-1-size': currentSize === 1,
            'item-4-size': currentSize === 4,
            'item-9-size': currentSize === 9,
            'current-select': currentSelect === index
          }"
          @click="selcetVideoBox(index)"
        >
          <i
            class="el-icon-close"
            :class="{ 'show-close': item.videoUrl }"
            @click="closeVideo(index, '关闭')"
          ></i>
          <!-- <VideojsPlayer v-else :src="item.videoUrl.m3u8uri" type="application/x-mpegURL"/> -->
          <DPlayer v-if="item.videoUrl" :video-info="item"></DPlayer>

          <p v-else class="video-msg">{{ item.msg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VideojsPlayer from '@/components/videoPlayer/VideojsPlayer.vue'
// import videoPlayer from '@/components/screenVideoPlayer/index.vue'
import DPlayer from '@/components/videoPlayer/DPlayer.vue'
// import videoPlayer from '@/components/videoPlayer/LivePlayer.vue'
import { getProjectRoot } from '@/api/project'
import {
  getVideoNLSign,
  findByProjectAndType,
  ctrlChangePtz,
  ctrlChangeZoom,
  ctrlChangeAperture,
  // SuYuan_SignVideo,
  // SuYuan_GetVideoLive,
  // SuYuan_GetVideoSources,
  getvideourl
} from '@/api/video'
import useGlobal from '@/hooks/global/useGlobal'
import { MENBERKEY } from '@/common/constants/videos'
import { getTreeItem, getInnerFirstChild } from './index'
const { $message } = useGlobal()
export default {
  name: 'RealTimeVideo',
  components: {
    DPlayer
  },
  data() {
    return {
      videoSources: [],
      treeData: [],
      showVideo: [],
      dataSourceData: [],
      currentProject: {},
      currentSize: 4,
      currentSelect: 0,
      // showVideoId: [],
      videoInfoMap: {},
      panelOpen: true,
      fullScreen: false,
      hiddenText: '隐藏',
      defaultProps: {
        label: 'name'
      }
    }
  },
  created() {
    for (let i = 0; i < this.currentSize; i++) {
      this.showVideo.push({ id: i, projectId: '', msg: '无信号' })
    }

    // this.getVideoSources()
    // .finally(() => {
    getProjectRoot()
      .then(res => {
        if (res.data) {
          this.treeData = res.data
          const fTData = this.treeData.filter(v => !v.disabled)
          const queryid = this.$route.query.projectId
          const deeppro = queryid ? getTreeItem(fTData, queryid) : getInnerFirstChild(fTData[0])
          this.$nextTick(() => {
            if (this.$refs.dcTree) {
              this.$refs.dcTree.setChecked(deeppro.id)
              this.$refs.dcTree.setCurrentKey(deeppro.id)
              this.getProjectData(deeppro)
            } else {
              this.getProjectData(fTData[0])
            }
          })
          this.currentProject = deeppro
          this.currentProId = deeppro.id
        } else {
          $message('暂无项目 不可操作，请创建项目')
        }
      })
      .catch(err => {
        console.log(err)
        $message('暂无项目 不可操作，请创建项目')
      })
    // })
  },
  // mounted(){
  // },
  methods: {
    getProjectData(data) {
      // 点击项为 视频 || 项目
      if (data.serialNumber) {
        if (this.showVideo[this.currentSelect].videoUrl) {
          this.closeVideo(this.currentSelect, '获取中')
          this.getVideo(data, this.currentSelect)
        } else {
          this.showVideo[this.currentSelect].msg = '视频获取中...'
          this.getVideo(data, this.currentSelect)
        }
      } else {
        this.currentProject = data
        findByProjectAndType(this.currentProject.id).then(res => {
          if (res.data.length === 0) {
            $message('该项目下无视频')
            return
          }
          const children = res.data.map(item => {
            item.name = item.videoName
            const source = this.videoSources.find(a => a.deviceid == item.serialNumber)
            item.status = source && source.status
            item.online = source && source.online
            return item
          })
          if (!data.children) {
            this.$set(data, 'children', children)
          } else {
            data.children = data.children
              .filter(item => item.nodeType == 'Project')
              .concat(children)
          }
        })
      }
    },
    // async getVideoSources() {
    //   //
    // },
    // 获取视频
    getVideo(data, currentSelect) {
      if (this.videoInfoMap[data.serialNumber]) {
        this.showVideo[currentSelect] = this.videoInfoMap[data.serialNumber]
        this.selcetVideoBox(currentSelect + 1)
        return
      }
      // 获取视频地址
      getvideourl(data.serialNumber)
        .then(itemSign => {
          const itemRData = itemSign.data
          if (itemRData) {
            data.videoUrl = {
              m3u8uri: itemRData
            }
            this.videoInfoMap[data.serialNumber] = data
            this.showVideo[currentSelect] = data
            this.selcetVideoBox(this.currentSelect + 1)
          } else {
            $message('获取播放地址失败')
          }
        })
        .catch(error => {
          $message.error(error.message)
        })
    },
    // 分屏显示数量切换
    changeShowSize(size) {
      this.currentSize = size
      this.showVideo = []
      this.currentSelect = 0
      for (let i = 0; i < this.currentSize; i++) {
        this.showVideo.push({ id: i, projectId: '', msg: '无信号' })
      }
    },
    // 选中播放框
    selcetVideoBox(index) {
      this.currentSelect = index
    },
    // 关闭选中播放
    closeVideo(index, text) {
      this.showVideo[index] = {
        id: index,
        projectId: '',
        msg: text === '获取中' ? '视频获取中...' : '无信号'
      }
      this.hiddenText = text + ' 当前：' + index
    },
    // 云台控制  方向
    async chengeControl(direction) {
      if (!this.showVideo[this.currentSelect].serialNumber) {
        $message('请选择播放成功的窗口，进行控制')
        return
      }
      const params = {
        memberkey: MENBERKEY,
        deviceid: this.showVideo[this.currentSelect].serialNumber,
        // 指令(0:停止; 1:上;2:下;3:左;4:右;5:左上;6:左下;7:右上;8:右下)
        operator: direction,
        speed: 10 // 速度范围 10-255
      }
      const cSign = await getVideoNLSign({ param: JSON.stringify(params) })
      const paramInfo = {
        parmdata: params,
        sign: cSign.data.sign
      }
      ctrlChangePtz(paramInfo).then(res => {
        if (res.data.code === '0' && res.data.msg === '设备不在线') {
          $message('设备不在线 不可控制')
          return
        }
      })
    },
    // 变焦
    async changeZoom(zoom) {
      if (!this.showVideo[this.currentSelect].serialNumber) {
        $message('请选择播放成功的窗口，进行控制')
        return
      }
      const params = {
        memberkey: MENBERKEY,
        deviceid: this.showVideo[this.currentSelect].serialNumber,
        operator: zoom, // 0：停止  1：缩小  2：放大
        speed: zoom === 0 ? 0 : 10 // 速度范围0-255
      }
      const cSign = await getVideoNLSign({ param: JSON.stringify(params) })
      const paramInfo = {
        parmdata: params,
        sign: cSign.data.sign
      }
      ctrlChangeZoom(paramInfo).then(res => {
        console.log(res)
      })
    },
    // 光圈
    async changeAperture(aperture) {
      if (!this.showVideo[this.currentSelect].serialNumber) {
        $message('请选择播放成功的窗口，进行控制')
        return
      }
      const params = {
        memberkey: MENBERKEY,
        deviceid: this.showVideo[this.currentSelect].serialNumber,
        operator: aperture, // 0：停止  1：缩小  2：放大
        speed: aperture === 0 ? 0 : 10 // 速度范围0-255
      }
      const cSign = await getVideoNLSign({ param: JSON.stringify(params) })
      const paramInfo = {
        parmdata: params,
        sign: cSign.data.sign
      }
      ctrlChangeAperture(paramInfo).then(res => {
        console.log(res)
      })
    },
    panelOpenChange() {
      this.panelOpen = !this.panelOpen
    },
    changeFullScreen() {
      const fullarea = document.getElementById('full-box')
      const isFullscreen =
        document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
      if (isFullscreen) {
        // 退出全屏,三目运算符
        document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : ''
        this.fullScreen = false
      } else {
        // 进入全屏,多重短路表达式
        ;(fullarea.requestFullscreen && fullarea.requestFullscreen()) ||
          (fullarea.mozRequestFullScreen && fullarea.mozRequestFullScreen()) ||
          (fullarea.webkitRequestFullscreen && fullarea.webkitRequestFullscreen()) ||
          (fullarea.msRequestFullscreen && fullarea.msRequestFullscreen())
        this.fullScreen = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bg_color: #272a3e;
$border: 1px solid rgba(110, 107, 107, 0.9);
$color_light: rgba(255, 255, 255, 0.6);
$video_control_bgcolor: #3e3d3d;
.real-time-video-container {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  background-color: $bg_color;
  justify-content: space-between;
  .left-video-list {
    width: 22%;
    height: 100%;
    position: relative;
    .list-title {
      text-align: center;
      color: #3e8ef7;
      font-size: 18px;
      line-height: 40px;
    }
    .list-box {
      padding: 10px 0 0 0;
      height: calc(100% - 40px);
      border-top: $border;
      .data-source-s-tree {
        height: 100%;
        overflow-y: auto;
        overflow-x: auto;
        background-color: $bg_color;
        .el-tree-node.is-current {
          .c-t-name {
            color: $color_light;
          }
        }
      }
    }
    // ------------ 控制板 -------------
    .video-control {
      background: $video_control_bgcolor;
      height: 180px;
      width: calc(100%);
      min-width: 290px;
      position: absolute;
      bottom: 2px;
      left: 1px;
      z-index: 10;
      margin-left: -1px;
      border: $border;
      transition: margin-left 1s ease;
      box-shadow: 0 2px 3px #a3bddbb2;
      .v-c-title {
        height: 32px;
        color: $color_light;
        line-height: 30px;
        padding-left: 15px;
        border-top: $border;
        border-bottom: $border;
      }
      .control-box {
        height: 148px;
        display: flex;
        color: $color_light;
        padding: 0 10px;
        position: relative;
        align-items: center;
        justify-content: space-evenly;
        .c-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #5a8cce;
          text-align: center;
          line-height: 34px;
          font-weight: bold;
        }
        .direction-box {
          width: 103px;
          height: 103px;
          // width: 110px;
          // height: 110px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          transform: rotate(45deg);
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid $color_light;
          .c-d-btn {
            width: 50%;
            height: 50%;
            margin: 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #5a8cce;
            border: 1px solid $color_light;
            cursor: pointer;
            i {
              font-size: 20px;
              font-weight: bold;
            }
            &:hover {
              background: #39a0ff;
            }
          }
          .cd-btn-t {
            transform: rotate(-45deg);
          }
          .cd-btn-r {
            transform: rotate(45deg);
          }
          .cd-btn-l {
            transform: rotate(-135deg);
          }
          .cd-btn-b {
            transform: rotate(135deg);
          }
          .d-btn-center {
            top: 25%;
            left: 24%;
            z-index: 15;
            width: 50px;
            height: 50px;
            border: none;
            // line-height: 50px;
            border-radius: 50%;
            position: absolute;
            transform: rotate(-45deg);
            border: 2px solid $color_light;
            .icon-zantingtingzhi {
              font-size: 20px;
              margin: 0 0 3px 0;
            }
          }
        }
        .zoom-aperture {
          width: calc(100% - 120px);
          height: 65%;
          .c-btn {
            border: 2px solid $color_light;
            line-height: 30px;
            cursor: pointer;
            &:hover {
              // background: #5de1ff;
              background: #39a0ff;
            }
          }
          .c-btn-lh {
            font-weight: 800;
            font-size: 18px;
          }
          .aperture-box,
          .zoom-box {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            .icon-zantingtingzhi {
              margin-right: 0;
            }
          }
          .aperture-box {
            margin-top: 15px;
          }
          .z-a-title {
            color: $color_light;
            font-size: 12px;
            height: 20px;
          }
        }
        .panel-control {
          position: absolute;
          right: -16px;
          top: 20%;
          width: 15px;
          height: 80px;
          cursor: pointer;
          color: $color_light;
          line-height: 80px;
          border-radius: 0 25px 25px 0;
          border: 1px solid $video_control_bgcolor;
          border-left: #a3bddbb2;
          background: $video_control_bgcolor;
          .iconfont {
            font-size: 12px;
            font-weight: 100;
          }
        }
        .hidden-text {
          position: absolute;
          bottom: -20px;
          color: $bg_color;
        }
      }
    }
    .hidden-panel {
      margin-left: -100%;
    }
  }
  // 右侧
  .right-video-show {
    width: 78%;
    height: 100%;
    .top-btn-control {
      height: 40px;
      color: rgba(255, 255, 255, 0.6);
      border-left: $border;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // border-bottom: 1px solid #647EAF;
      // .iconfont {
      //   color: $color_light;
      // }
      .t-b-label {
        margin-left: 10px;
      }
      .size-btn {
        margin: 0 10px;
        cursor: pointer;
      }
      .current-size {
        color: #39a0ff;
      }
      .full-screen {
        height: 30px;
        width: 30px;
        cursor: pointer;
        margin: 7px 10px;
        text-align: center;
        .icon-quanping {
          line-height: 30px;
        }
      }
    }
    .video-container {
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      flex-wrap: wrap;
      .video-box {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        border: $border;
        position: relative;
        .el-icon-close {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 999;
          padding: 5px;
          color: $color_light;
          visibility: hidden;
          border-radius: 50%;
          background: $bg_color;
          cursor: pointer;
        }
        .video-msg {
          color: $color_light;
          line-height: 100%;
          margin: auto auto;
        }
        &:hover > .show-close {
          visibility: visible;
        }
      }
      .current-select {
        border-color: #ff4d23;
      }
      .item-1-size {
        width: 100%;
        // width: calc(100% - 2px);
        height: calc(100% - 2px);
      }
      .item-4-size {
        width: 50%;
        // width: calc(50% - 2px);
        height: calc(50% - 2px);
      }
      .item-9-size {
        width: 33.3%;
        // width: calc(33.3% - 2px);
        height: calc(33.3% - 2px);
      }
    }
  }
}
// .real-time-video-full-screen {
//   z-index: 9999999;
//   position: fixed;
//   height: 100vh;
//   width: 100vw;
//   top: 0;
//   left: 0;
// }

// 树图标颜色
.icon-shexiangtou {
  color: $color_light;
}
:deep(.shexiangtou-active) {
  color: rgb(4 142 239);
}
</style>
