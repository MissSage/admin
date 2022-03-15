<template>
  <div class="deviceImportBtn">
    <el-button @click="visible = true">{{ operation.text }}</el-button>
    <el-dialog
      v-model="visible"
      title="用户导入"
      width="30%"
      class="alarm-design"
      :close-on-click-modal="false"
    >
      <el-form :rules="rules" label-position="top">
        <el-form-item label="选择角色：">
          <el-select
            v-model="roleId"
            style="width: 100%"
            prop="roleId"
            placeholder="请选择角色"
            class="item-input-select"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id.id"
              :label="item.name"
              :value="item.id.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择要赋予的项目：">
          <Treeselect
            v-model="selectProjects"
            :options="projects"
            :normalizer="areaNormalizer"
            :multiple="true"
            placeholder="选择项目"
            no-options-text="无数据"
            no-results-text="无匹配数据"
            :clearable="false"
          ></Treeselect>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-upload
            class="deviceImportBtn"
            action="action"
            :show-file-list="false"
            :http-request="UploadFile"
            :on-change="handleChange"
          >
            <el-button type="primary">上传文件</el-button>
          </el-upload>
          <el-button @click="visible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectRoot } from '@/api/project'
import { getRoles } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const { $message } = useGlobal()

export default {
  components: { Treeselect },
  // eslint-disable-next-line vue/require-prop-types
  props: ['operation'],
  data() {
    return {
      visible: false,
      roleId: '',
      roleList: [],

      projects: [],
      selectProjects: [],
      areaNormalizer(node) {
        return {
          id: node.id,
          label: node.name
        }
      },
      rules: {
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  created() {
    // 获取当前租户角色列表
    getRoles().then(res => {
      console.log(res.data)
      this.roleList = res.data
    })

    getProjectRoot().then(res => {
      this.projects = res.data
      this.settree(this.projects)
    })
  },
  methods: {
    settree(tree) {
      for (const item of tree) {
        delete item.leaf
        if (!item.children || item.children.length === 0) {
          delete item.children
        } else {
          this.settree(item.children)
        }
      }
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
    },
    UploadFile(res) {
      if (!this.roleId) {
        $message.warning('请选择角色')
        return
      }
      console.log(res, 'UploadFileUploadFile')
      const file = res.file
      const formData = new window.FormData()
      formData.append('file', file)
      this.operation.handle(formData, this.roleId, this.selectProjects.join(','))
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.deviceImportBtn {
  margin: 0 12px;
  font-size: 16px !important;
  display: inline-block;
  text-align: left;
}
</style>
