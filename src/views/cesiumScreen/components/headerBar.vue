<template>
  <div class="headerBar">
    <div class='titleBox'>
      <h1 class="cnTitle">重庆智慧农业大数据可视化</h1>
      <h2 class="enTitle">Chongqing smart aguriculture big data visualization<span class="aside"></span></h2>
    </div>
    <div class="rightBar">
      <p class="dateText"><i class="iconfont icon-shijian2"></i>{{dateTime}}</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      timeInterval: null
    }
  },
  created() {
    this.timeInterval = setInterval(() => {
      this.dateTime = moment().format('YYYY-MM-DD HH:mm:ss')
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timeInterval)
  }
}
</script>

<style lang="scss" scoped>
.headerBar {
  position: fixed;
  width: 100%;
  top: 0;
  display: flex;
  .rightBar {
    padding-right: 30px;
    flex: 1;
    background-color: rgba(0, 0, 0, 0.6);
    height: 50px;
    .dateText {
      color: #fff;
      text-align: right;
      font-size: 16px;
      margin: 0;
      line-height: 50px;
      .iconfont::before {
        font-size: 18px;
      }
    }
  }
  .titleBox {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0 24px;
    // min-width: 790px;
  }
  .cnTitle {
    color: #fff;
    letter-spacing: 18px;
    padding-top: 12px;
    height: 50px;
    line-height: 38px;
    vertical-align: bottom;
    font-weight: 500;
    margin: 0;
    font-size: 26px;
  }
  .enTitle {
    height: 30px;
    margin: 0;
    // line-height: 36px;
    position: relative;
    color: #666f6f;
    font-size: 14px;
    letter-spacing: 3px;
    word-spacing: 8px;
    font-weight: normal;
    .aside {
      display: block;
      // width: 62.35px;
      // height: 72px;
      // transform-origin: right top;
      // background-color: rgba(0, 0, 0, 0.4);
      border: 15px solid rgba(0, 0, 0, 0.4);
      border-right-width: 26px;
      border-bottom-color: transparent;
      border-right-color: transparent;
      position: absolute;
      right: -65px;
      top: 0;
    }
  }
}
</style>
