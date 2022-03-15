<template>
  <div class="dispatch-center_header">
    <img class="dispatch-center_header-logo" :src="$store.state.app.logo" alt="" />
    <div class="dispatch-center_header__title-box">
      <div class="dispatch-center_header__title-gifbox">
        <img
          class="dispatch-center_header__title-gif"
          src="~@/assets/dispatchCenterImages/1.gif"
          alt=""
        />
      </div>
      <span class="dispatch-center_header-title">安徽省宜秀区农饮水大数据调度中心</span>
      <div class="dispatch-center_header__title-gifbox">
        <img
          class="dispatch-center_header__title-gif"
          src="~@/assets/dispatchCenterImages/1.gif"
          alt=""
        />
      </div>
    </div>
    <div class="dispatch-center_header-extra">
      <div class="extra-fullscreen" @click="handleFullScreen">
        <img class="extra-fullscreen__img" src="~@/assets/dispatchCenterImages/全屏_o.png" alt="" />
        <span class="extra-fullscreen__label">全屏</span>
      </div>
      <div class="extra-time">
        <span>{{ Now }}</span>
        <span>{{weekDay}}</span>
      </div>
      <div class="extra-weather">
        <img src="~@/assets/dispatchCenterImages/太阳.png" alt="" />
        <span>睛</span>
        <span>26℃</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { toggleFullscreen } from '@/utils/requestFullScreen'
import { defineComponent, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
export default defineComponent({
  name: 'CardHeader',
  emits: ['click'],
  setup() {
    const weekDays:string[]=['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
    const { $format } = useGlobal()
    const state = reactive<{
      Now: string
      weekDay:string
    }>({
      Now: $format(new Date()),
      weekDay: weekDays[new Date().getDay()]
    })
    const handleFullScreen = (e: any) => {
      console.log(e)
      toggleFullscreen(document.getElementById('dispatchBox'))
    }

    return {
      ...toRefs(state),
      handleFullScreen
    }
  }
})
</script>

<style lang="scss" scoped>
$header-height: 80px;
.dispatch-center_header {
  height: $header-height;
  text-align: center;
  position: relative;
  background: url('~@/assets/dispatchCenterImages/导航背景.png') no-repeat;
  .dispatch-center_header-logo {
    // margin: 8px 28px;
    position: absolute;
    height: calc($header-height - 10px);
    left: 0;
  }
  .dispatch-center_header__title-box {
    width: 800px;
    height: 80px;
    position: absolute;
    left: 1855px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: center;
    .dispatch-center_header__title-gifbox {
      width: 80px;
      height: 80px;
      .dispatch-center_header__title-gif {
        width: 80px;
        height: 80px;
      }
    }
    .dispatch-center_header-title {
      line-height: $header-height;
      color: rgba(159, 253, 253, 1);
      font-size: 32px;
      letter-spacing: 8px;
      font-family: PingFangSC-Semibold;
      white-space: nowrap;
      text-shadow: 0px 0px 10px rgba(159, 253, 253, 0.6);
    }
  }

  .dispatch-center_header-extra {
    position: absolute;
    left: 3925px;
    width: 580px;
    top: 24px;
    height: 20px;
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #9ffdfd;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    .extra-fullscreen {
      cursor: pointer;
    }
    .extra-fullscreen,
    .extra-time,
    .extra-weather {
      display: flex;
      margin-right: 20px;
      img,
      span {
        height: 20px;
        margin-right: 15px;
        line-height: 20px;
      }
    }
  }
}
</style>
