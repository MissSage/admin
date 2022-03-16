<template>
  <el-upload
    class="file-uploader"
    :class="isDisabled ? 'is-disabled' : ''"
    :action="imgActionUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="limit || 3"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :file-list="fileList"
    :disabled="isDisabled"
    :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
  >
    <el-button v-if="!isDisabled" type="primary">点击上传</el-button>
    <!-- <template #trigger>
    </template> -->
    <!-- <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </template> -->
    <el-dialog
      v-if="previewVisible"
      v-model="previewVisible"
      width="40%"
      :title="previewTitle"
    >
      <div class="previewBox">
        <embed
          style="width: 100%; height: 560px"
          width="100%"
          height="100%"
          :src="iframeUrl"
          type="application/pdf"
        />
      </div>
    </el-dialog>
  </el-upload>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox, UploadFile } from 'element-plus'
import { useStore } from 'vuex'
import { formateFiles } from '../SLUploader'
import { FileItem } from '@/common/types/common'
// import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'

import { downloadFile } from '@/utils/helper'
import { SLMessage } from '@/utils/global'
export default defineComponent({
  name: 'SLFileUploader',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 3
    },
    multiple: {
      type: Boolean,
      default: false
    },
    returnType: {
      type: String as PropType<'arrStr' | 'comma'>,
      default: 'arrStr'
    }
  },
  emits: ['update:modelValue', 'handleSuccess'],
  setup (props, ctx) {
    interface RawFile {
      name: string
      url: string
    }
    const store = useStore()
    const state = reactive<{
      iframeUrl: string
      previewVisible: boolean
      previewTitle: string
    }>({
      iframeUrl: '',
      previewVisible: false,
      previewTitle: ' 文件预览'
    })
    const imgActionUrl =
      props.url && props.url !== '' ? props.url : store.state.app.actionUrl + 'file/api/upload/image'
    const isDisabled = computed(() => props.disabled)
    const fileList = ref<RawFile[]>(formateFiles(props.modelValue))

    const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
      const list = fileList
        ? fileList.map(item => {
          const obj = {
            url: item.response || item.url,
            name: item.name
          }
          return obj
        })
        : []
      emitValue(list)
    }
    const getUrlFromFile = (url: any) => {
      if (typeof url === 'object') {
        return url.url
      } else if (typeof url === 'string') {
        return url.split(',')[0]
      } else {
        return url
      }
    }
    const handlePreview = (file: UploadFile) => {
      console.log(file)
      const url: any = getUrlFromFile(file.url || file.response)
      const perviewableArr = ['png', 'jpg', 'gif', 'pdf', 'jpeg']
      // (file.url as any).url || file.url || (file.response as any).url || file.response
      const urlItems: string[] = (url && url.split('.')) || []
      const fileType = urlItems[urlItems.length - 1]
      const type = fileType?.split('&')[0] || ''
      if (!perviewableArr.includes(type.toLowerCase())) {
        //  return SLMessage.warning('只能预览图片、pdf文件格式')
        url && downloadFile(url, file.name || url)
      } else {
        state.iframeUrl = url
        state.previewTitle = file.name
        state.previewVisible = true
      }
    }
    const handleExceed = () => {
      SLMessage.warning(`最多可添加${props.limit}份文件`)
    }
    const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
      console.log(file, fileList)
      fileList = fileList.filter(item => item.url !== file.url)
      return true
      // return ElMessageBox.confirm(`Cancel the transfert of ${file.name} ?`)
    }
    const handleSuccess = (response: any, file: any, fileList: any[]) => {
      const list = fileList
        ? fileList.map((item: { response: any; url: any; name: any }) => {
          const obj = {
            url: item.response || item.url,
            name: item.name
          }
          return obj
        })
        : []
      emitValue(list)
      ctx.emit('handleSuccess', list)
    }
    const emitValue = (list: any) => {
      ctx.emit(
        'update:modelValue',
        props.returnType === 'arrStr' ? JSON.stringify(list) : list.map((item: { url: any }) => item.url).join(',')
      )
    }
    onMounted(() => {
      if (fileList.value) {
        emitValue(fileList.value)
      }
    })
    return {
      ...toRefs(state),
      ElMessage,
      ElMessageBox,
      fileList,
      imgActionUrl,
      isDisabled,
      handleRemove,
      handlePreview,
      handleExceed,
      beforeRemove,
      handleSuccess
    }
  }
})
</script>
<style scoped lang="scss">
.file-uploader {
  width: calc(100% - 40px);
  margin: 0;
  &.is-disabled {
    :deep(.el-upload.el-upload--text) {
      display: none;
    }
  }
}
.previewBox {
  position: relative;
  width: 100%;
}
</style>
