<template>
  <el-card class="device-control">
    <template #header>
      <CardHeader
        :status="config.status"
        :title="config.name"
        :config="config"
        :icon-class="config.status ? 'on' : 'off'"
        :show-btns="true"
        @openDialog="openDialog"
      />
    </template>
    <div class="device-control__main">
      <div v-for="(item, i) in config.propertyDataList" v-show="item.propertyType!==2" :key="i" class="device-control__main-block">
        <div class="info-block">
          <span class="name">{{ item.propertyName }}</span>
          <span class="date">{{ global.$format(item.collectionTime) }}</span>
        </div>
        <div class="info-block">
          <span class="value" :class="item.status ? '' : 'warning'"
            >{{ item.value || '- -' }} {{ item.unit }}</span
          >
          <span class="qushi" @click="openTrendDialog(item)"
            ><i class="icon iconfont icon-chakan"></i> 趋势图</span
          >
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import CardHeader from './cardHeader.vue'
import { defineComponent, PropType } from 'vue'
import { ControlInfo, ControlProperty } from '../..'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  name: 'Card',
  components: { CardHeader },
  props: {
    config: {
      type: Object as PropType<ControlInfo>,
      default: () => {
        //
      }
    },
    projectId: {
      type: String,
      default: ''
    }
  },
  emits: ['openTrend', 'openDialog'],
  setup(props, ctx) {
    const global = useGlobal()
    const openTrendDialog = (item: ControlProperty) => {
      ctx.emit('openTrend', item, props.config)
    }
    const openDialog = (deviceName: string, type: string) => {
      ctx.emit('openDialog', deviceName, type, props.config)
    }
    return {
      openTrendDialog,
      openDialog,
      global
    }
  }
})
</script>

<style lang="scss" scoped>
.device-control {
  border: 1px solid #4c4a4a;
  margin-bottom: 15px;
  margin-right: 15px;
  :deep(.el-card__body) {
    border-top: none;
  }
}
.device-control__header {
  position: relative;
  margin-left: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
  .device-control__header-title {
    flex: 1;
    line-height: 20px;
  }
  .device-control__header-right {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    .btn-right {
      cursor: pointer;
      color: #358fa7;
      height: 20px;
      line-height: 15px;
      font-size: 12px;
      border-radius: 10px;
      border: 1px solid #358fa7;
      padding: 2px 10px 3px 10px;
      text-align: center;
      margin: 0 5px;
    }
  }
  &::before {
    content: ' ';
    position: absolute;
    left: -25px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  &.on {
    &::before {
      background-color: rgb(77, 108, 171);
    }
  }
  &.off {
    &::before {
      background-color: red;
    }
  }
}
.device-control__main {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  .device-control__main-block {
    width: calc(25% - 10px);
    padding: 6px 12px;
    background: #3b3d49;
    display: flex;
    border-radius: 4px;
    flex-direction: column;
    margin: 10px 5px;
    .info-block {
      height: 28px;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      .name {
        font-size: 12px;
      }
      .date {
        font-size: 10px;
      }
      .value {
        font-size: 16px;
        color: lightgreen;
      }
      .qushi {
        color: #358fa7;
        font-size: 12px;
        cursor: pointer;
      }
      .warning {
        color: red;
      }
    }
  }
}
</style>
