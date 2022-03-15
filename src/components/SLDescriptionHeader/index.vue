<template>
  <div class="el-descriptions">
    <div class="el-descriptions__header">
      <div class="el-descriptions__title">
        <div class="el-descriptions__title_box">
          <h4 class="el-descriptions__title_h4">
            <slot>
              <span>{{ title }}</span>
            </slot>
            <div class="el-descriptions__title_right">
              <slot name="query"> </slot>
              <slot name="right"> </slot>
            </div>
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SLDescriptionHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup () {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
:deep(.el-descriptions),
.el-descriptions {
  margin: 32px 0 15px 0;
  .el-descriptions__header {
    margin-bottom: 0;
    margin-top: 15px;
    height: 32px;
    margin-bottom: 15px;

    .el-descriptions__title {
      width: 100%;
      height: 100%;
      .el-descriptions__title_box {
        width: 100%;
        height: 100%;
        border-bottom: 1px solid #33374d;
        .el-descriptions__title_h4 {
          line-height: 25px;
          height: 25px;
          position: relative;
          margin: 0 0 0 15px;
          color: #95c3f1;
          font-size: 14px;
          &::before {
            content: ' ';
            position: absolute;
            height: 100%;
            width: 6px;
            background-color: #3d95ec;
            top: 0;
            left: -15px;
          }
          .el-descriptions__title_right {
            position: absolute;
            right: 0;
            top: 0;
            height: 25px;
          }
        }
      }
    }
  }
}
</style>
