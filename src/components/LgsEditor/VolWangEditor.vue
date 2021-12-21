<template>
  <div class="hello" ref="refEditor" />
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { PropType } from 'vue-demi'
import E from 'wangeditor'
const props = defineProps({
  url: {
    // 上传图片的url
    type: String,
    default: ''
  },
  upload: {
    // 上传方法
    type: Function as PropType<() => Promise<void>>,
    default: (file:any) => {
      //
      console.log(file)
    }
  },
  uploadCount: {
    // 最多可以上传(图片)的数量
    type: Number,
    default: 3
  },
  modelValue: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: Number,
    default: 250
  },
  minWidth: {
    type: Number,
    default: 650
  },
  minHeight: {
    type: Number,
    default: 100
  }
})

interface EmitsType {
  (e: 'update:model-value', value: string): void
}
const emit = defineEmits<EmitsType>()
const refEditor = ref<Element>()
const editor = ref<InstanceType<typeof E> | null>(null)
const initEditor = () => {
  editor.value = new E(refEditor.value)

  editor.value.config.height = props.height
  // 配置 onchange 回调函数
  editor.value.config.onchange = function (newHtml: string) {
    emit('update:model-value', newHtml)
  }
  editor.value.config.zIndex = 500

  // editor.config.uploadFileName = "fileInput";
  // //设置header
  // editor.config.uploadImgHeaders = {
  //   Accept: "application/json",
  //   Authorization: this.$store.getters.getToken(),
  // };
  // 上传地址
  editor.value.config.uploadImgServer = import.meta.env.VITE_API_BASEURL + props.url
  // console.log(editor.config.uploadImgServer);
  editor.value.config.customUploadImg = function (resultFiles:any, insertImgFn:any) {
    const formData = new FormData()
    const nameArr:any[] = []
    resultFiles.forEach(function (file:any) {
      formData.append('fileInput', file, file.name)
      nameArr.push(file.name)
    })
    if (props.url) {
      ElMessage.error('未配置url')
      return
    }
    axios.post(props.url, formData).then((x:any) => {
      if (!x.status) {
        return ElMessage.error(x.message)
      }
      const imgs = nameArr
        .map((m) => {
          return import.meta.env.VITE_API_BASEURL + x.data + m
        })
        .join(',')
      insertImgFn(imgs)
    })
  }
  editor.value.create()
  editor.value.txt.html(props.modelValue)
  // editor.value.txt.html(props.modelValue) // 注意：必须在 create 之后
}
const unWatchModelValue = watch(
  () => props.modelValue,
  (newVal:string) => {
    editor.value?.txt.html(newVal)
    // if (!state.change) {
    //   state.outChange = true
    //   state.editor && state.editor.txt.html(newVal)
    // }
    // state.change = false
    unWatchModelValue() // 取消监听
  }
)
onMounted(() => {
  initEditor()
})
onUnmounted(() => {
  editor.value = null
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
