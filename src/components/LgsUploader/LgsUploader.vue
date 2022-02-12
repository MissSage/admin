<template>
  <div class="upload-container">
    <div>
      <div class="input-btns" style="margin-bottom: 10px">
        <input
          ref="refInput"
          type="file"
          style="display: none"
          @change="handleChange"
          :multiple="multiple"
        />
        <div v-if="img" class="upload-img">
          <!-- v-for="(file,index) in fileInfo.length>0?fileInfo: files" -->
          <div
            v-for="(file, index) in files"
            :key="index"
            class="img-item"
          >
            <div class="operation">
              <div class="action">
                <i class="el-icon-view view" @click="previewImg(index)" />
                <i class="el-icon-delete remove" @click="removeFile(index)" />
              </div>
              <div class="mask" />
            </div>

            <img :src="getImgSrc(file, index)" :onerror="require('@/assets/imgs/error-img.png')" />
          </div>
          <div
            v-show="!autoUpload || (autoUpload && files.length < maxFile)"
            class="img-selector"
            :class="getSelector()"
          >
            <div class="selector" @click="handleClick">
              <i class="el-icon-camera-solid" />
            </div>
            <div
              v-if="!autoUpload"
              class="s-btn"
              :class="{ readonly: changed }"
              @click="upload(true)"
            >
              <div>{{ loadText }}</div>
            </div>
          </div>
        </div>
        <el-button v-else @click="handleClick">选择{{ img ? "图片" : "文件" }}</el-button>

        <el-button
          v-if="!autoUpload && !img"
          type="info"
          :disabled="changed"
          @click="upload(true)"
          :loading="loadingStatus"
        >
          上传文件
        </el-button>
      </div>
      <slot />
      <div v-if="desc">
        <el-alert
          :title="getText() + '文件大小不超过' + (maxSize || 3) + 'M'"
          type="info"
          show-icon
        />
      </div>
      <slot name="content" />
      <div v-if="!img">
        <ul class="upload-list" v-show="fileList">
          <li
            class="list-file"
            v-for="(file, index) in files"
            :key="index"
          >
            <a>
              <span @click="fileOnClick(index, file)">
                <i :class="format(file)" />
                {{ file.name }}
              </span>
            </a>
            <span @click="removeFile(index)" class="file-remove">
              <i class="el-icon-close" />
            </span>
          </li>
        </ul>
      </div>
      <slot name="tip" />
    </div>
  </div>
</template>
<script lang="ts">
import { store } from '@/store'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
export default defineComponent({
  name: 'LgsUploader',
  props: {
    desc: {
      // 是否显示默认介绍
      // 是否多选
      type: Boolean,
      default: false
    },
    fileInfo: {
      // 用于接收上传的文件，也可以加以默认值，显示已上传的文件，用户上传后会覆盖默认值
      type: Array,
      default: () => {
        return []
      } // 格式[{name:'1.jpg',path:'127.0.01/1.jpg'}]
    },
    downLoad: {
      // 是否可以点击文件下载
      type: Boolean,
      default: true
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    maxFile: {
      // 最多可选文件数量，必须multiple=true，才会生效
      type: Number,
      default: 5
    },
    maxSize: {
      // 文件限制大小3M
      type: Number,
      default: 3
    },

    autoUpload: {
      // 选择文件后是否自动上传
      type: Boolean,
      default: true
    },
    img: {
      // 图片类型  img>excel>fileTypes三种文件类型优先级
      type: Boolean,
      default: false
    },
    excel: {
      // excel文件
      type: Boolean,
      default: false
    },
    fileTypes: {
      // 指定上传文件的类型
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      // 上传的url
      type: String,
      default: ''
    },
    uploadBefore: {
      // 返回false会中止执行
      // 上传前
      type: Function,
      default: (files: any) => {
        return true
      }
    },
    uploadAfter: {
      // 返回false会中止执行
      // 上传后
      type: Function,
      default: (result: any, files: any) => {
        return true
      }
    },
    onChange: {
      // 选择文件时  //返回false会中止执行
      type: Function,
      default: (files: any) => {
        return true
      }
    },
    // clear: {
    //   //上传完成后是否清空文件列表
    //   type: Boolean,
    //   default: true
    // },
    fileList: {
      // 是否显示选择的文件列表
      type: Boolean,
      default: true
    },
    fileClick: {
      // 点击文件事件
      type: Function,
      default: (index: number, file: any, files: any[]) => {
        return true
      }
    },
    removeBefore: {
      // 移除文件事件
      type: Function,
      default: (index: number, file: any, files: any[]) => {
        return true
      }
    },
    append: {
      // 此属性已废弃，多文件上传，默认追加文件
      type: Boolean,
      default: false
    },
    compress: {
      // 开启图片压缩,后面根据需要再完善
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const state = reactive<{
      changed: boolean // 手动上传成功后禁止重复上传，必须重新选择
      model: boolean
      files: any[]
      bigImg: string
      loadingStatus: boolean
      loadText: string
      base: any
      idAdress: string
    }>({
      changed: false, // 手动上传成功后禁止重复上传，必须重新选择
      model: true,
      files: [],
      bigImg: '',
      loadingStatus: false,
      loadText: '上传文件',
      base: {},
      idAdress: ''
    })
    const refInput = ref<HTMLInputElement>()
    const cloneFile = (files: any) => {
      state.files = files.map((x: any) => {
        return {
          name: x.name || getFileName(x.path),
          path: x.path
        }
      })
    }
    const getFileName = (path: any) => {
      if (!path) {
        return '未定义文件名'
      }
      const _index = path.lastIndexOf('/')
      return path.substring(_index + 1)
    }
    const previewImg = (index: number) => {
      // 查看大图预览模式待完
      state.base.previewImg(getImgSrc(state.files[index]))
      //  window.open(this.getImgSrc((this.files.length>0?this.files:this.fileInfo)[index]));
    }
    const getSelector = () => {
      if (props.autoUpload) {
        return 'auto-selector'
      }
      return 'submit-selector'
    }
    const getImgSrc = (file: any, index?: number) => {
      // if (file.hasOwnProperty('path')) {
      //   if (this.base.isUrl(file.path)) {
      //     return file.path
      //   }
      //   // 2020.12.27增加base64图片操作
      //   if (file.path.indexOf('/9j/') !== -1) {
      //     return 'data:image/jpeg;base64,' + file.path
      //   }
      //   if (file.path.substr(0, 1) === '/') {
      //     file.path = file.path.substr(1)
      //   }
      //   return this.http.ipAddress + file.path
      // }
      return window.URL.createObjectURL(file)
    }
    const fileOnClick = (index: number, file: any) => {
      if (!props.fileClick(index, file, state.files)) {
        return
      }
      // 点击不下载
      if (!props.downLoad) {
        return
      }
      if (!file.path) {
        ElMessage.error('请先上传文件')
        return
      }
      state.base.dowloadFile(
        file.path,
        file.name,
        {
          Authorization: store.getters.getToken()
        },
        state.idAdress
      )
    }
    const getText = () => {
      if (props.img) {
        return '只能上传图片,'
      } else if (props.excel) {
        return '只能上传excel文件,'
      }
    }
    const handleClick = () => {
      refInput.value && refInput.value.click()
    }
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (!target || !target.files) return
      // this.compress开启图片压缩,后面根据需要再完善
      // this.clearFiles();
      const result = checkFile(target.files)
      if (!result) {
        return
      }

      state.changed = false
      // 如果传入了FileInfo需要自行处理移除FileInfo
      if (!props.onChange(target.files)) {
        return
      }
      for (let index = 0; index < target.files.length; index++) {
        const element: any = target.files[index]
        element.input = true
      }
      if (!props.multiple) {
        state.files.splice(0)
      }
      for (let i = 0; i < target.files.length; i++) {
        state.files.push(target.files[i])
      }
      // state.files.push(...target.files)

      refInput.value && (refInput.value.value = '')
      if (props.autoUpload && result) {
        upload(false)
      }
    }
    const removeFile = (index: number) => {
      // 如果传入了FileInfo需要自行处理移除FileInfo
      // t移除文件
      const removeFile = state.files[index]
      // 删除的还没上传的文件
      if (removeFile.input) {
        state.files.splice(index, 1)
      } else {
        props.fileInfo.splice(index, 1)
      }
      if (!props.removeBefore(index, removeFile, props.fileInfo)) {
        //
      }
    }
    const clearFiles = () => {
      state.files.splice(0)
    }
    const getFiles = () => {
      return state.files
    }
    const upload = (vail: boolean) => {
      if (vail && !checkFile()) return false
      if (!props.url) {
        return ElMessage.error('没有配置好Url')
      }
      if (!state.files || state.files.length === 0) {
        return ElMessage.error('请选择文件')
      }
      if (!props.uploadBefore(state.files)) {
        return
      }
      const forms = new FormData()
      state.files.forEach(function (file) {
        if (file.input) {
          forms.append('fileInput', file, file.name)
        }
      })
      // forms.append("fileInput", state.files);
      state.loadingStatus = true
      state.loadText = '上传中..'
      axios
        .post(props.url, forms
          // props.autoUpload ? '正在上传文件' : ''
        )
        .then(
          (x: any) => {
            // this.$refs.uploadFile.clearFiles();
            state.loadingStatus = false
            state.loadText = '上传文件'
            if (!props.uploadAfter(x, state.files)) {
              state.changed = false
              return
            } else {
              state.changed = true
            }
            ElMessage.success(x.message)
            state.changed = x.status
            if (!x.status) {
              // state.files = null;
              return
            }
            // 单选清除以前的数据
            //  if (!state.multiple) {
            props.fileInfo.splice(0)
            // }
            const _files = state.files.map((file) => {
              return {
                name: file.name,
                path: file.path || x.data + file.name
              }
            })
            props.fileInfo.push(..._files)
            // 2021.09.25修复文件上传后不能同时下载的问题
            state.files = _files
          },
          error => {
            ElMessage.error(error.message)
            state.loadText = '上传文件'
            state.loadingStatus = false
          }
        )
    }
    const format = (file: any, checkFileType?: any) => {
      const format = file.name.split('.').pop().toLocaleLowerCase() || ''
      let fileIcon = 'el-icon-document'
      if (props.fileTypes.length > 0 && checkFileType !== undefined) {
        if (props.fileTypes.indexOf(format) !== -1) {
          return true
        }
        return false
      }
      if (
        checkFileType &&
        !(checkFileType instanceof Array) &&
        checkFileType !== 'img' &&
        checkFileType !== 'excel'
      ) {
        if (checkFileType.indexOf(format) > -1) {
          return true
        } else {
          return false
        }
      }

      if (
        checkFileType === 'img' ||
        [
          'gif',
          'jpg',
          'jpeg',
          'png',
          'bmp',
          'webp'
        ].indexOf(format) > -1
      ) {
        if (checkFileType === 'img') {
          if (
            [
              'gif',
              'jpg',
              'jpeg',
              'png',
              'bmp',
              'webp'
            ].indexOf(format) > -1
          ) {
            return true
          } else {
            return false
          }
        }
        fileIcon = 'el-icon-picture-outline'
      }
      if (
        [
          'mp4',
          'm3u8',
          'rmvb',
          'avi',
          'swf',
          '3gp',
          'mkv',
          'flv'
        ].indexOf(
          format
        ) > -1
      ) {
        fileIcon = 'el-icon-document'
      }
      if ([
        'mp3',
        'wav',
        'wma',
        'ogg',
        'aac',
        'flac'
      ].indexOf(format) > -1) {
        fileIcon = 'el-icon-document'
      }
      if ([
        'doc',
        'txt',
        'docx',
        'pages',
        'epub',
        'pdf'
      ].indexOf(format) > -1) {
        fileIcon = 'el-icon-document'
      }
      if (
        checkFileType === 'excel' ||
        [
          'numbers',
          'csv',
          'xls',
          'xlsx'
        ].indexOf(format) > -1
      ) {
        if (checkFileType === 'excel') {
          if ([
            'numbers',
            'csv',
            'xls',
            'xlsx'
          ].indexOf(format) > -1) {
            return true
          } else {
            return false
          }
        }
        fileIcon = 'el-icon-document'
      }
      return fileIcon
    }
    const beforeUpload = () => { }
    const checkFile = (inputFiles?: any) => {
      const files = state.files

      if (
        props.multiple &&
        files.length + (inputFiles || []).length > (props.maxFile || 5)
      ) {
        ElMessage.error(
          '最多只能选【' +
          (props.maxFile || 5) +
          '】' +
          (props.img ? '张图片' : '个文件') +
          ''
        )
        return false
      }
      if (!inputFiles) {
        inputFiles = state.files.filter((x: any) => {
          return x.input
        })
      }
      const names = []
      for (let index = 0; index < inputFiles.length; index++) {
        const file = inputFiles[index]
        if (names.indexOf(file.name) !== -1) {
          file.name = '(' + index + ')' + file.name
        }
        names.push(file.name)
        if (props.img && !format(file, 'img')) {
          ElMessage.error('选择的文件【' + file.name + '】只能是图片格式')
          return false
        }
        if (props.excel && !format(file, 'excel')) {
          ElMessage.error('选择的文件【' + file.name + '】只能是excel文件')
          return false
        }
        if (
          props.fileTypes &&
          props.fileTypes.length > 0 &&
          !format(file, props.fileTypes)
        ) {
          ElMessage.error(
            '选择的文件【' +
            file.name +
            '】只能是【' +
            props.fileTypes.join(',') +
            '】格式'
          )
          return false
        }
        if (file.size > (props.maxSize || 3) * 1024 * 1024) {
          ElMessage.error(
            '选择的文件【' +
            file.name +
            '】不能超过:' +
            (props.maxSize || 3) +
            'M'
          )
          return false
        }
      }
      return true
    }
    watch(() => props.fileInfo,
      (newVal) => {
        cloneFile(state.files)
      },
      { deep: true })
    onMounted(() => {
      if (props.fileInfo) {
        state.changed = true
      }
      cloneFile(props.fileInfo)
    })
    return {
      ...toRefs(state),
      fileOnClick,
      handleChange,
      previewImg,
      removeFile,
      getImgSrc,
      getSelector,
      handleClick,
      upload,
      getText,
      format
    }
  }
})
</script>
<style lang="scss" scoped>
.upload-list {
  padding-left: 0;
  list-style: none;
  .list-file {
    line-height: 20px;
    padding: 4px;
    color: #515a6e;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;
    overflow: hidden;
    position: relative;

    font-size: 13px;
    .file-remove {
      display: none;
      right: 0;
      //  margin-left: 50px;
      color: #0e9286;
    }
  }
  .list-file:hover {
    cursor: pointer;
    .file-remove {
      display: initial;
    }
    color: #2d8cf0;
  }
}
.upload-container {
  display: inline-block;
  width: 100%;
  // padding: 10px;

  // min-height: 250px;
  border-radius: 5px;
  .alert {
    margin-top: 43px;
  }
  .button-group > * {
    float: left;
    margin-right: 10px;
  }
  .file-info > span {
    margin-right: 20px;
  }
}
.upload-img {
  display: inline-block;
  .img-item:hover .operation {
    display: block;
  }
  .img-item,
  .img-selector {
    position: relative;
    cursor: pointer;
    margin: 0 10px 10px 0;
    float: left;
    width: 65px;
    height: 65px;
    border: 1px solid #c7c7c7;
    overflow: hidden;
    border-radius: 5px;
    box-sizing: content-box;
    img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .operation {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .action {
        opacity: 0.6;
        text-align: center;
        background: #151515de;
        font-size: 14px;
        position: absolute;
        z-index: 90;
        width: 100%;
        bottom: 3px;
        bottom: 0;
        color: #ded5d5;
        padding-right: 7px;
        padding-bottom: 3px;
        line-height: 20px;
        .el-icon-view {
          margin: 0 10px;
        }
      }
      .mask {
        opacity: 0.6;
        background: #9e9e9e;
        top: 0;
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
  }
  .img-selector {
    font-size: 50px;
    text-align: center;
    i {
      position: relative;
      font-size: 40px;
      color: #6f6f6f;
    }
  }

  .auto-selector {
    .selector {
      line-height: 64px;
    }
  }
  .selector {
    color: #a0a0a0;
  }
  .submit-selector {
    .s-btn {
      line-height: 22px;
      font-size: 12px;
      top: -6px;
      // padding: 2px;
      position: relative;
      background: #2db7f5;
      color: white;
    }
    .selector {
      line-height: 50px;
    }
    .readonly {
      background: #8c8c8c;
    }
  }
}
.big-model {
  width: 100%;
  height: 100%;
  position: relative;
  .mask {
    position: absolute;
    opacity: 0.6;
    background: #eee;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  }
}

.auto-upload {
  z-index: 9999999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  .j-content {
    text-align: center;
    font-size: 17px;
    top: 40%;
    position: absolute;
    z-index: 999;
    left: 0;
    right: 0;
    width: 240px;
    /* height: 100%; */
    margin: auto;
    background: white;
    /* bottom: 30px; */
    line-height: 50px;
    border-radius: 6px;
    border: 1px solid #d2d2d2;
  }
  .mask {
    cursor: pointer;
    opacity: 0.6;
    width: 100%;
    height: 100%;
    background: #101010;
  }
}
</style>
