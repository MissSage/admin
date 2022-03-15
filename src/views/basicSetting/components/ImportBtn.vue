<template>
  <el-upload
    class="deviceImportBtn"
    action="action"
    :show-file-list="false"
    :http-request="UploadFile"
    :on-change="handleChange"
  >
    <el-button>{{ operation.text }}</el-button>
  </el-upload>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['operation'],
  data() {
    return {}
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file, fileList)
    },
    UploadFile(res) {
      console.log(res, 'UploadFileUploadFile')
      const file = res.file
      const formData = new window.FormData()
      formData.append('file', file)
      this.operation.handle(formData)
    }
  }
}
</script>
<style lang="scss" scoped>
.deviceImportBtn {
  margin: 0 12px;
  font-size: 16px !important;
  display: inline-block;
}
</style>
