<template>
  <el-popover trigger="click" placement="left" width="100px">
    <div :id="row.deviceId" ref="qrCodeUrl" class="qrcode"></div>
    <template #reference>
      <el-button
        class="operation-btn"
        type="text"
        :style="{ color: '#4195F0', border: 'none' }"
        icon="iconfont icon-erweima1"
        @click="getQRCode"
        >二维码</el-button
      >
    </template>
  </el-popover>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['row'],

  data() {
    return {}
  },

  methods: {
    getQRCode() {
      this.$refs.qrCodeUrl.innerHTML = ''
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.row.deviceCode,
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-btn {
  margin-right: 12px;
  font-size: 16px !important;
}
</style>
