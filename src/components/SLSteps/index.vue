<template>
  <div class="sl-steps-container">
    <el-steps
      class="sl-steps"
      simple
      finish-status="success"
      align-center
      :active="activeIndex"
    >
      <el-step
        v-for="(item, i) in config.steps"
        :key="i"
        :class="
          activeIndex > item.index ? 'success' : activeIndex == item.index ? 'dealing' : 'waiting'
        "
        :title="activeIndex > item.index ? item.completeTitle || item.title : item.title"
      ></el-step>
    </el-steps>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { SLStepsConfig } from './type'

export default defineComponent({
  name: 'SLSteps',
  props: {
    config: {
      type: Object as PropType<SLStepsConfig>,
      default: () => {
        return {
          //
        }
      }
    },
    currentIndex: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    // codes here
    const activeIndex = ref<number>(1)
    watch(
      () => props.currentIndex,
      val => {
        activeIndex.value = val
      }
    )
    return {
      activeIndex
    }
  }
})
</script>

<style lang="scss" scoped>
$sl-steps-height: 50px;
$sl-steps-height-sqrt: calc($sl-steps-height / 1.414);
$sl-steps-height-sqrt-half: calc($sl-steps-height-sqrt / 2);
$sl-steps-height-half: calc($sl-steps-height / 2);
$sl-steps-height-quart: calc($sl-steps-height / 4);
.sl-steps-container {
  :deep(.el-steps.sl-steps.el-steps--simple) {
    box-sizing: border-box;
    padding: 0;
    background-color: #31354c;
    border-radius: $sl-steps-height-half;
    position: relative;
    margin: 24px 15px 32px 15px;
    .el-step {
      justify-content: center;
      &.is-simple {
        font-size: 16px;
        height: $sl-steps-height;
        line-height: $sl-steps-height-half;
        padding: $sl-steps-height-quart $sl-steps-height-half;
        display: flex;
        margin: 0 $sl-steps-height-quart;
        justify-content: center;
        position: relative;
        &::before,
        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          background-color: inherit;
        }
        &::before {
          width: 0;
          height: 0;
          border: $sl-steps-height-half solid;
          left: -$sl-steps-height-quart;
          border-color: transparent transparent transparent #31354c;
        }
        &:not(:last-child)::after {
          width: $sl-steps-height-sqrt;
          height: $sl-steps-height-sqrt;
          right: 0;
          transform-origin: 0 0;
          transform: translateX($sl-steps-height-sqrt) rotate(45deg);
          z-index: calc(var(--el-index-top) + 1);
        }
        &:nth-child(1)::before {
          width: $sl-steps-height;
          height: $sl-steps-height;
          left: -$sl-steps-height-half;
          border: none;
          border-radius: $sl-steps-height-half 0 0 $sl-steps-height-half;
        }
        &:nth-last-child(1)::after {
          width: $sl-steps-height;
          height: $sl-steps-height;
          right: -$sl-steps-height-half;
          border-radius: 0 $sl-steps-height-half $sl-steps-height-half 0;
        }
      }
      &.waiting {
        background-color: #31354c;
        color: #fff;
      }
      &.dealing {
        background-color: #4aa9d8;
      }
      &.success {
        background-color: #1dad57;
      }
      .el-step__head {
        flex: 1;
        display: flex;
        align-content: center;
        justify-content: flex-end;
        box-sizing: border-box;
        text-align: right;
        &.is-process {
          border-color: #8ec1ff;
        }
        .el-step__line {
          display: none;
        }
      }
      .el-step__main {
        flex: 1;
        flex-grow: 1.3;
        .el-step__title {
          &.is-process {
            color: #8ec1ff;
          }
          max-width: 100%;
        }
        .el-step__arrow {
          display: none;
        }
      }
      .el-step__head,
      .el-step__title {
        &.is-success {
          color: white;
          border-color: white;
        }
      }
    }
  }
}
.el-steps {
  .el-step__head.is-process {
    color: #8ec1ff;
    border-color: #8ec1ff;
  }

  .el-step__main {
    .el-step__title.is-process {
      color: #c0c4cc;
    }
  }

  .el-step__description.is-process {
    color: #8ec1ff;
  }

  // .el-step__icon.is-text {
  //   top: -8px;
  // }
}
</style>
