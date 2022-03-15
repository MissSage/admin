<template>
  <div class="infoBoxContainer baseInfoBox">
    <div class="title">作物产量统计</div>
    <div class="countContainer">
      <div v-for="item in crops" :key="item.label" class="item">
        <div class="countBox">
          <span class="text">{{item.label}}</span>
          <span class="count">{{item.val}}</span>
        </div>
        <div class="progress">
          <div :style="'width:'+getPercent(item.val)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crops: [
        { label: '茶叶', val: 1800 },
        { label: '蔬菜', val: 3100 },
        { label: '烟草', val: 2400 },
        { label: '药材', val: 2400 },
        { label: '食用菌', val: 4000 },
        { label: '牲畜', val: 2350 },
        { label: '水产品', val: 1500 },
        { label: '粮油作物', val: 2600 },
        { label: '林业产品', val: 2500 },
        { label: '水果', val: 2900 }
      ],
      maxVal: 4000
    }
  },
  methods: {
    getPercent(count) {
      return (count * 100) / this.maxVal + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 25%;
  top: calc(36% + 90px);
  left: 16px;
  .title {
    color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    margin-bottom: 12px;
  }
  .countContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 47%;
      margin-bottom: 10px;
      .countBox {
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        .count {
          color: #56cfc6;
        }
      }
      .progress {
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background-color: #2d3433;
        > div {
          background-color: #58d3ca;
          height: 100%;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
