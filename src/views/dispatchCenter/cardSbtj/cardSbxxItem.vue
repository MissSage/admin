<template>
  <div class="sbtj-sbxx-item">
    <div class="sbtj-sbxx-item__header">
      <img ref="sbxximg" class="sbtj-sbxx-item__header__icon" :src="url" alt="" />
      <span class="sbtj-sbxx-item__header__title">{{ data.name }}</span>
      <span class="sbtj-sbxx-item__header__increase">+{{ data.persentageIncreased }} ↑<i></i></span>
    </div>
    <div class="sbtj-sbxx-item__content">
      <span class="sbtj-sbxx-item__content__increase">新增：{{ data.newAdd }} {{ data.unit }}</span>
      <span class="sbtj-sbxx-item__content__increase">总计：{{ data.total }} {{ data.unit }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
interface ISbxxItem {
  name: string
  icon: string
  newAdd: number
  total: number
  persentageIncreased: string
  unit: string
}
export default defineComponent({
  name: 'CardSbxxItem',
  props: {
    data: {
      type: Object as PropType<ISbxxItem>,
      default: () => {
        return {
          //
        }
      }
    }
  },
  setup(props) {
    // codes here
    const url = require('@/assets/dispatchCenterImages/' + props.data.icon + '.png')
    const sbxximg = ref<HTMLImageElement>()
    onMounted(() => {
      sbxximg.value && (sbxximg.value.src = url)
    })
    return {
      url,
      sbxximg
    }
  }
})
</script>

<style lang="scss" scoped>
.sbtj-sbxx-item {
  width: 160px;
  height: 95px;
  display: flex;
  font-family: PingFangSC-Medium, PingFang SC;
  flex-direction: column;
  .sbtj-sbxx-item__header {
    display: flex;
    flex-direction: row;
    height: 28px;
    justify-content: space-between;
    align-content: center;
    .sbtj-sbxx-item__header__icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-right: 8px;
    }
    .sbtj-sbxx-item__header__title {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: #66f6ed;
      line-height: 16px;
    }
    .sbtj-sbxx-item__header__increase {
      font-size: 12px;
      font-weight: 500;
      color: #ffed41;
      line-height: 16px;
    }
  }
  .sbtj-sbxx-item__content {
    display: flex;
    flex-direction: column;
    span {
      font-size: 12px;
      font-weight: 500;
      color: #718092;
      line-height: 24px;
    }
  }
}
</style>
