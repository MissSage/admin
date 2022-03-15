<template>
  <div class="energyBoard-container">
    <iframe
      ref="iframe"
      :src="url"
      scrolling="auto"
      seamless
      height="100%"
      width="100%"
      frameborder="0"
      allowfullscreen
      class="iframe-container"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'TenantPage',
  data() {
    return {
      url: 'http://datav.aliyuncs.com/share/554162202cf249bd396fe3b75fab8237'
    }
  }
}
</script>

<style lang="scss" scoped>
.energyBoard-container {
  width: 100%;
  height: 100%;
  // padding: 20px;
}
</style>
