<template>
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    width="35%"
    :before-close="dialog.handleClose"
  >
    <!-- 表单 -->
    <el-form :model="form" label-position="top">
      <!-- 应用名称 -->
      <el-form-item label="应用名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!-- 应用介绍 -->
      <el-form-item label="应用介绍">
        <el-input v-model="form.remark" type="textarea"></el-input>
      </el-form-item>
      <!-- 应用序号 -->
      <el-form-item label="应用序号">
        <el-input
          v-model="form.orderNum"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          style="width: 100%"
        ></el-input>
      </el-form-item>
      <!-- 应用图标 -->
      <el-form-item label="应用图标">
        <el-upload
          class="avatar-uploader"
          :action="state.imgActionUrl"
          :headers="state.headers"
          :show-file-list="false"
          :on-success="res => image.handleUploadSuccess(res)"
          :before-upload="image.beforeAvatarUpload"
        >
          <img v-if="form.img" :src="form.img" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 应用类型 -->
      <el-form-item label="应用类型">
        <el-select v-model="form.type" placeholder="please select your zone" style="width: 100%">
          <el-option label="基础应用" value="1"></el-option>
          <el-option label="其他应用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 应用菜单 -->
      <el-form-item v-if="form.type === '1'" label="应用菜单">
        <div class="tree">
          <el-tree
            ref="menuTree"
            :data="state.value"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="returnrouting.defaultProps"
          ></el-tree>
        </div>
      </el-form-item>
      <!-- 应用链接 -->
      <el-form-item v-if="form.type === '2'" label="应用链接">
        <el-input v-model="form.applicationUrl"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, reactive, ref, onBeforeMount, watch } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { getSelectableTree } from '@/api/menu'
import { useStore } from 'vuex'
import { dialogrule } from '../index'
import { addeditapp, getChecklist } from '@/api/portal/'
import { removeSlash, addSlash } from '@/utils/removeIdSlash'

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<dialogrule>,
      default() {
        return {}
      }
    }
  },
  setup(props: any) {
    const { $messageError } = useGlobal()
    const store = useStore()
    let menuTree = ref<any>('')

    // 定义状态
    const state = reactive<any>({
      imgActionUrl: '',
      fileActionUrl: '',
      uploadFileName: '',
      headers: {},
      zoom: 11,
      center: [116.4, 39.91],
      dataForm: { id: null },
      value: []
    })

    const routing = () => {
      getSelectableTree().then(res => {
        if (res.status === 200) {
          state.value = res.data
        }
      })
    }

    onBeforeMount(() => {
      // 初始化图片 文件上传url
      state.imgActionUrl = store.state.app.actionUrl + '/file/api/upload/image'
      state.fileActionUrl = store.state.app.actionUrl + '/file/api/upload/file'
      state.headers['X-Authorization'] = 'Bearer ' + store.getters.token
      routing()
    })

    // 回显的菜单
    const returnrouting = reactive({
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      getreturnrouting: () => {
        getChecklist(props.config.appform.id).then(res => {
          if (res.status === 200) {
            console.log(menuTree.value, res.data)
            const value: string[] = []
            res.data.forEach((element: any) => {
              value.push(addSlash(element))
            })
            if (props.config.type === false) {
              menuTree.value.setCheckedKeys(value)
            } else if (
              props.config.visible === true &&
              menuTree.value.getCheckedKeys().length > 0
            ) {
              menuTree.value.setCheckedKeys([])
            }
          }
        })
      }
    })

    const dialog = reactive({
      visible: computed(() => props.config.visible),
      title: computed(() => props.config.title),
      handleClose: () => {
        const item = {
          name: '', //企业名称
          type: '1', //应用类型
          remark: '', //介绍
          orderNum: 0, //序号
          img: '', //企业图片
          applicationUrl: '', //其他应用
          menuIdList: [], //基础应用
          tenantId: ''
        }
        for (let i in item) {
          form[i] = item[i]
        }
        props.config.close()
      }
    })

    watch(props.config, () => {
      form.tenantId = props.config.value.id.id || ''
      for (let i in props.config.appform) {
        form[i] = props.config.appform[i]
      }
      returnrouting.getreturnrouting()
    })

    let form = reactive<any>({
      name: '', //企业名称
      type: '1', //应用类型
      remark: '', //介绍
      orderNum: 0, //序号
      img: '', //企业图片
      applicationUrl: '', //其他应用
      menuIdList: [], //基础应用
      tenantId: ''
    })

    const image = reactive({
      handleUploadSuccess: (res: string) => {
        console.log(res, 'handleUploadSuccess')
        form.img = res
      },
      beforeAvatarUpload: (file: any) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          $messageError('上传图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          $messageError('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    })

    // 提交
    const submit = () => {
      form.menuIdList = []
      if (form.type === '1') {
        const checkMenu = menuTree.value.getCheckedKeys()
        checkMenu.forEach(element => {
          form.menuIdList.push(removeSlash(element))
        })
      }
      if (props.config.type === true) {
        // 新增
        form.tenantId = removeSlash(form.tenantId)
        addeditapp(form).then(res => {
          console.log(res)
          props.config.close()
        })
      } else {
        // 编辑
        addeditapp(form).then(res => {
          console.log(res)
          props.config.close()
        })
      }
    }

    return {
      dialog,
      form,
      state,
      image,
      submit,
      menuTree,
      returnrouting
    }
  }
})
</script>

<style lang="scss">
.tree {
  width: 100%;
  padding: 10px;
  border: 1px solid #404354;
  overflow: auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #404354 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #3d4050 !important;
  background: #eee;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 256px;
  height: 156px;
  line-height: 156px;
  text-align: center;
}
.avatar {
  width: 256px;
  height: 156px;
  display: block;
}
</style>
