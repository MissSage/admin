<template>
  <div class="alarmBox">
    <i class="iconfont icon-laba"></i>
    <div ref="alarmScrollBox" class="alarmTextBox"></div>
  </div>
</template>

<script>
// import { getRealTimeAlarmList } from '@/api/alarmManage'
import { getBaiduTTSToken, getBaiduTTS } from '@/api/application'
import useGlobal from '@/hooks/global/useGlobal'
const { $format, $confirm } = useGlobal()
export default {
  data() {
    return {
      topAlarmList: [],
      baiduTTStoken: '24.13b592de03feb4dd730f9e14583f3566.2592000.1628919383.282335-24413152',
      alarmCount: 0
    }
  },
  async mounted() {
    $confirm('是否允许播放报警音频?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => (this.audioMute = false))
    this.getAlarmList()
    const ttsRes = await getBaiduTTSToken({
      grant_type: 'client_credentials',
      client_id: 'sNIj3ILHO3b7bQINQbrx0HMo',
      client_secret: 'kwkWaEOcbLPQuCceCs2mZYhkMIBFIjsU'
    })
    console.log(ttsRes, 'getBaiduTTSToken')
    this.baiduTTStoken = ttsRes.data.access_token
  },
  beforeUnmount() {
    clearInterval(this.alarmInterval)
    // clearInterval(this.scrollAlarmInterval)
  },
  methods: {
    async getAlarmList() {
      this.$refs.alarmScrollBox.style.transition = ''
      this.$refs.alarmScrollBox.innerHTML = ''
      this.$refs.alarmScrollBox.style.marginTop = '0px'
      // this.alarmCount = 0
      // const res = await getRealTimeAlarmList({
      //   type: '1',
      //   page: 1,
      //   size: 10
      // })
      // if (res.status === 200) {
      //   this.topAlarmList = res.data.data
      // }
      const setInterval = this.topAlarmList.length
      this.$refs.alarmScrollBox.style.transition = 'linear all 1s'
      for (const alarm of this.topAlarmList) {
        const text = `${$format(alarm.time)} ${alarm.rangeName} ${alarm.projectName} ${
          alarm.deviceName
        } ${alarm.alarmRemark || '故障'}`
        this.$refs.alarmScrollBox.innerHTML += `<span style="margin-right:60px;display:block" data-id='${alarm.id}' class="alarmText">${text}</span>`
      }
      if (setInterval && this.topAlarmList.length) this.setAlarmInterval()
    },

    setAlarmInterval() {
      console.log('setAlarmIntervalsetAlarmIntervalsetAlarmIntervalsetAlarmInterval')
      const alarm = this.topAlarmList[0]
      const text = `${$format(alarm.time)} ${alarm.rangeName} ${alarm.projectName} ${
        alarm.deviceName
      } ${alarm.alarmRemark || '故障'}`
      setTimeout(
        () =>
          this.playAudio({
            text: text,
            id: alarm.id
          }),
        3000
      )
    },

    playNext() {
      console.log(this.alarmCount, 'this.alarmCount++')
      if (~~this.alarmCount >= this.topAlarmList.length - 1) {
        // clearInterval(this.scrollAlarmInterval)
        this.getAlarmList()
        return
      }
      this.alarmCount++
      this.$refs.alarmScrollBox.style.marginTop = this.alarmCount * -36 + 'px'
      const alarm = this.topAlarmList[this.alarmCount]
      const text = `${$format(alarm.time)} ${alarm.rangeName} ${alarm.projectName} ${
        alarm.deviceName
      } ${alarm.alarmRemark || '故障'}`
      this.playAudio({
        text: text,
        id: alarm.id
      })
    },

    async playAudio({ text, id }) {
      if (this.$store.state.user.playedAlarmList.some(item => item === id) || this.audioMute) {
        setTimeout(() => this.playNext(), 5000)
        return
      }
      this.$store.dispatch('user/addPlayedAlarm', id)
      // 以下参数参考api文档，token和人的声音音色之类的参数
      var param = {
        tex: encodeURI(encodeURI(text.replace('#', ''))),
        tok: this.baiduTTStoken, // 这个token要换成百度平台提供接口获取的token
        cuid: 'asdasda', // 必填
        ctp: 1,
        lan: 'zh',
        spd: 5,
        pit: 5,
        vol: 15,
        per: 4
      }

      const res = await getBaiduTTS(param)
      console.log(res, 'getBaiduTTS')
      const audio = new Audio()
      audio.setAttribute('src', window.URL.createObjectURL(res.data))
      audio.addEventListener(
        'ended',
        () => {
          setTimeout(() => this.playNext(), 5000)
        },
        false
      )
      audio.muted = this.audioMute
      audio.play()
    }
  }
}
</script>

<style lang="scss" scoped>
.alarmBox {
  width: 100%;
  height: 36px;
  background: #72a9f3;
  border-radius: 18px;
  margin-top: 12px;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  .iconfont {
    display: block;
    width: 48px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .alarmTextBox {
    flex: 1;
    line-height: 36px;
    color: #f7292bff;
    overflow: hidden;
    text-align: left;
    transition: linear all 1s;
  }
}
</style>
