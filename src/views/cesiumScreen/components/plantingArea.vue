<template>
  <div class="infoBoxContainer baseInfoBox">
    <div class="title">种植面积统计</div>
    <div class="tableContainer">
      <div class="tableHeader">
        <div v-for="column in columns" :key="column.label" class="label">{{column.label}}</div>
      </div>
      <div style="overflow:hidden">
        <div ref="tableBody" class="tableBody" :style="'top:'+tableTop+'px'">
          <div v-for="(item,index) in dataList" :key="index" class="item">
            <div v-for="column in columns" :key="column.label" class="label">{{item[column.key]}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableTop: 0,
      columns: [
        { key: 'region', label: '地区' },
        { key: 'corp', label: '农作物' },
        { key: 'area', label: '种植面积' }
      ],
      dataList: [
        { region: '地区一', corp: '茶叶', area: '1242.4' },
        { region: '地区二', corp: '蔬菜', area: '1242.4' },
        { region: '地区三', corp: '烟草', area: '1242.4' },
        { region: '地区四', corp: '食用菌', area: '1242.4' },
        { region: '地区五', corp: '水产品', area: '1242.4' },
        { region: '地区六', corp: '茶叶', area: '1242.4' },
        { region: '地区七', corp: '蔬菜', area: '1242.4' },
        { region: '地区八', corp: '茶叶', area: '1242.4' },
        { region: '地区九', corp: '食用菌', area: '1242.4' },
        { region: '地区十', corp: '水产品', area: '1242.4' }
      ],

      scrollInterval: null
    }
  },
  mounted() {
    this.scrollInterval = setInterval(() => {
      this.tableTop--
      if (this.tableTop <= -30) {
        this.$refs.tableBody.appendChild(this.$refs.tableBody.children[0])
        this.tableTop = 0
      }
    }, 100)
  },
  beforeDestroy() {
    clearInterval(this.scrollInterval)
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 32%;
  top: calc(57% + 90px);
  right: 16px;
  .tableContainer {
    padding-left: 15px;
  }
  .title {
    color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    margin-bottom: 12px;
  }
  .label {
    width: 90px;
    font-size: 12px;
    line-height: 30px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  .item {
    display: flex;
    justify-content: space-between;
  }
  .tableHeader {
    border-bottom: 1px solid #4c525d;
    display: flex;
    justify-content: space-between;
  }
  .tableBody {
    position: relative;
  }
}
</style>
