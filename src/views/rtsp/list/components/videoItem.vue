<template>
  <div class="videoBox">
    <video ref="videoPlayer" class="videoPlayer" vtype="hls" controls muted playsinline></video>
    <div class="footer">
      <span class="title" :title="videoName">{{ videoName }}</span>
      <div class="opreation" @click="play">
        <el-dropdown>
          <span><i style="color: #1f7ad5" class="iconfont icon-shezhi1"></i>设置</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleEdit">编辑摄像头</el-dropdown-item>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除？"
                @confirm="confirmEvent"
              >
                <template #reference>
                  <el-dropdown-item>删除摄像头</el-dropdown-item>
                </template>
              </el-popconfirm>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <span>{{isDebug?'调试模式':''}}</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, PropType } from 'vue'
import type { IChannelModel, INegotiatModel } from '@/common/types/rtsp'
import { handleNegotiation } from '@/api/rtsp'

export default defineComponent({
  props: {
    uuid: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    channels: {
      type: Array as PropType<IChannelModel[]>,
      default: () => {
        return []
      }
    }
  },

  setup(props, ctx) {
    const isDebug = ref(props.channels[0].debug)
    const videoName = ref(props.name)
    const videoPlayer = ref<HTMLVideoElement>()
    let webrtc, webrtcSendChannel

    const init = () => {
      webrtc = new RTCPeerConnection({
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302']
          }
        ]
      })
      webrtc.onnegotiationneeded = handleNegotiationNeeded
      webrtc.ontrack = function (event) {
        console.log(event.streams.length + ' track is delivered')
        videoPlayer.value && (videoPlayer.value.srcObject = event.streams[0])
        videoPlayer.value?.play()
      }
      webrtc.addTransceiver('video', {
        direction: 'sendrecv'
      })
      webrtcSendChannel = webrtc.createDataChannel('foo')
      webrtcSendChannel.onclose = () => {
        init()
        console.log('sendChannel has closed')
      }
      webrtcSendChannel.onopen = () => {
        console.log('sendChannel has opened')
        webrtcSendChannel.send('ping')
        setInterval(() => {
          webrtcSendChannel.send('ping')
        }, 1000)
      }

      webrtcSendChannel.onmessage = e => console.log(e.data)
    }
    async function handleNegotiationNeeded() {
      let uuid = props.uuid
      let channel = props.channels[0]
      let url =
        '/stream/' +
        uuid +
        '/channel/' +
        channel.chanId +
        '/webrtc?uuid=' +
        uuid +
        '&channel=' +
        channel.chanId
      let offer = await webrtc.createOffer()

      await webrtc.setLocalDescription(offer)
      let negotiateParam = {
        url,
        data: btoa(webrtc.localDescription.sdp)
      } as INegotiatModel
      handleNegotiation(negotiateParam).then(data => {
        try {
          webrtc.setRemoteDescription(
            new RTCSessionDescription({
              type: 'answer',
              sdp: atob(data.data)
            })
          )
        } catch (e) {
          console.warn(e)
        }
      })
    }
    const play = () => {
      videoPlayer.value?.play()
    }
    const handleEdit = () => {
      if (props.channels.length > 1) {
        const params = {
          uuid: props.uuid,
          streamName: props.name,
          'stream-url': props.channels[0].url,
          'stream-ondemand': props.channels[0].on_demand,
          debug: props.channels[0].debug
        }
        ctx.emit('Edit', params)
      }
    }
    const confirmEvent = () => {
      ctx.emit('Delete', props.uuid)
    }
    onMounted(() => {
      init()
      // videoPlayer.value?.addEventListener('loadeddata', () => {
      //   // play()
      // })
      // videoPlayer.value?.addEventListener('error', () => {
      //   console.log('video_error')
      // })
    })
    return {
      videoPlayer,
      videoName,
      isDebug,
      play,
      handleNegotiationNeeded,
      init,
      handleEdit,
      confirmEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.videoBox {
  padding: 0;
  &:hover {
    box-shadow: 0 0 8px #036ced;
  }
  position: relative;
  width: 400px;
  height: 300px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  &:nth-of-type(3n) {
    margin-right: 0;
  }
  .videoPlayer {
    border-radius: 3px;
    width: 100%;
    height: 85%;
    background: #333;
  }
  p {
    padding: 0 12px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    margin-bottom: 8px;
  }
  .footer {
    width: 100%;
    height: 35px;
    background: #f5f7fa;
    line-height: 35px;
    font-size: 12px;
    text-align: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    cursor: pointer;
    display: flex;
    .title {
      flex: 1;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      text-align: left;
      margin: 6px 15px;
    }
    .opreation {
      position: relative;
      width: 25%;
      .break {
        position: absolute;
        right: 0;
        // top: 10px;
        font-size: 16px;
        color: #e6e6e6;
        font-style: normal;
      }
    }
  }
}
</style>
