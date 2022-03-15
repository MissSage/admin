<template>
  <div ref="popup" class="infoBoxContainer baseInfoBox">
    <template v-if="config">
      <div class="title">{{ config.name || '' }}</div>
      <div class="videoContainer"></div>
    </template>
    <div class="closeBtn" @click="() => $emit('close')">×</div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['config'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 250px;
  .title {
    color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    margin-bottom: 12px;
  }
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
}
</style>
