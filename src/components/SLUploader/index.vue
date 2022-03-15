<template>
  <div>
    <el-upload
      class="sl-uploader"
      list-type="picture-card"
      :file-list="slFileList"
      :action="imgActionUrl"
      :disabled="isDisabled"
      :auto-upload="true"
      :limit="limit"
      :multiple="multiple"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :headers="{ 'X-Authorization': 'Bearer ' + $store.getters.token }"
    >
      <template #default>
        <i class="iconfont icon-jia"></i>
      </template>
    </el-upload>
    <el-dialog
      v-model="dialogVisible"
      width="50%"
      :title="dialogTitle"
    >
      <el-image
        style="width: 100%"
        :src="dialogImageUrl"
        :fit="'contain'"
      ></el-image>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { computed, defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import { formateFiles } from './index'
import { FileItem } from '@/common/types/common'
import { SLMessage } from '@/utils/Message'

export default defineComponent({
  name: 'SLUploader',
  // components: {
  //   Plus
  // },
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
    const state = reactive<{
      dialogImageUrl: string
      dialogTitle: string
      dialogVisible: boolean
      slFileList: FileItem[]
    }>({
      dialogImageUrl: '',
      dialogTitle: '',
      dialogVisible: false,
      slFileList: formateFiles(props.modelValue)
    })
    const store = useStore()
    const imgActionUrl =
      props.url && props.url !== '' ? props.url : store.state.app.actionUrl + 'file/api/upload/image'
    const handleExceed = (files: any, FileList: any) => {
      console.log(files, FileList)

      SLMessage.warning(`最多可添加${props.limit}份文件`)
    }
    const handleRemove = (file, fileList) => {
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
    const handlePictureCardPreview = file => {
      console.log(file.url)
      state.dialogImageUrl = file.url
      state.dialogTitle = file.name
      state.dialogVisible = true
    }
    const handleDownload = file => {
      console.log(file)
    }
    const isDisabled = computed(() => props.disabled)
    const handleSuccess = (response, file, fileList) => {
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
      ctx.emit('handleSuccess', list)
    }
    const emitValue = (list: any) => {
      ctx.emit(
        'update:modelValue',
        props.returnType === 'arrStr' ? JSON.stringify(list) : list.map(item => item.url).join(',')
      )
    }
    const beforeUpload = (file: any) => {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/png'

      if (!isJPG) {
        SLMessage.error('只能上传jpeg或png格式的图片！')
      }
      return isJPG
    }
    onMounted(() => {
      if (state.slFileList) {
        emitValue(state.slFileList)
      }
    })

    // watch(
    //   () => props.modelValue,
    //   () => {
    //     state.slFileList = formateFiles(props.modelValue)
    //   }
    // )
    return {
      ...toRefs(state),
      imgActionUrl,
      isDisabled,
      handleDownload,
      formateFiles,
      handlePictureCardPreview,
      handleRemove,
      handleSuccess,
      handleExceed,
      beforeUpload
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-uploader {
  :deep(.el-upload-list--picture-card) {
    &.is-disabled + .el-upload--picture-card {
      display: none;
    }
    .el-upload-list__item {
      width: 96px;
      height: 96px;
    }
  }
  :deep(.el-upload) {
    &.el-upload--picture-card {
      background-color: $form-bg-color;
      width: 96px;
      height: 96px;
      line-height: 96px;
      border: 1px dashed #42455b;
    }
  }
}
.img-box {
  width: 100%;
  .img-full {
    width: 100%;
    height: 100%;
  }
}
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 5px;
    font-size: 14px;
  }
}
.iconfont {
  margin-right: 0;
}
:deep(.el-progress--circle) {
  width: 80px;
  height: 80px;
  // 源码中进度条写到行内的，所以只能限制最大宽度来控制进度条的大小
  .el-progress-circle {
    max-width: 80px;
    max-height: 80px;
  }
}
</style>
