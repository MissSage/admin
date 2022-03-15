<template>
  <div ref="popup" class="infoBoxContainer baseInfoBox">
    <template v-if="config">
      <div class="title">
        <span>{{ config.name || '' }}</span
        ><span></span>
      </div>
      <div class="infoContainer">
        <div>
          <img class="imgBox itemBox" :src="config.imageUrl" />
          <div
            v-for="(info, index) in infoList"
            :key="info.label"
            class="itemBox"
            :class="{ minWidth: isLast(index) }"
          >
            <p class="label">{{ info.label }}</p>
            <p class="value">{{ info.value }}</p>
          </div>
        </div>
      </div>
    </template>
    <div class="closeBtn" @click="() => $emit('close')">×</div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['config'],
  data() {
    return {
      infoSort: [
        '空气温度',
        '空气湿度',
        '光照度',
        '当前雨量',
        'PM2.5',
        'PM10',
        'CO2',
        '风速',
        '风向',
        '负氧离子',
        '大气压力',
        '一层土壤温度',
        '二层土壤温度',
        '三层土壤温度',
        '空气温度',
        '空气温度',
        '空气温度',
        '五层土壤温度',
        '一层土壤湿度',
        '二层土壤湿度',
        '三层土壤湿度',
        '四层土壤湿度',
        '五层土壤湿度',
        '上一日雨量',
        '瞬时雨量',
        '当前雨量'
      ],
      infoList: [
        // { label: '空气温度', value: '1.6℃' },
        // { label: '空气湿度', value: '2.2%' },
      ]
    }
  },
  watch: {},
  methods: {
    isLast(index) {
      if (index === 0) return
      if (index === 2 || index % 5 === 0) {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  // height: 300px;
  overflow: hidden;
  .closeBtn {
    display: block;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    top: 8px;
    right: 12px;
    cursor: pointer;
  }
  .title {
    color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    padding-bottom: 8px;
    border-bottom: 1px solid #4c525d;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }
  .infoContainer {
    .itemBox {
      float: left;
      margin: 0 0 12px 0;
      width: 90px;
      font-size: 12px;
      &.minWidth {
        width: 75px;
      }
      .label {
        color: #fff;
        margin-bottom: 5px;
      }
      .value {
        color: #7d9988;
      }
    }
    .imgBox {
      width: 160px;
      margin-right: 20px;
      height: 90px;
    }
  }
}
</style>
