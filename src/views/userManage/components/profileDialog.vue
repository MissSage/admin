<template>
  <el-dialog
    v-model="visible"
    title="权限范围"
    width="30%"
    class="alarm-design"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="选择要赋予的项目">
        <!-- <el-cascader
        :options="projects"
        :props="props"
        collapse-tags
        clearable>
      </el-cascader> -->
        <!-- <el-cascader v-model="selectProjects" :options="projects" :props="{ multiple: true }" collapse-tags clearable placeholder="选择项目"></el-cascader> -->
        <treeselect
          ref="treeSelect"
          v-model="selectProjects"
          :options="projects"
          :normalizer="areaNormalizer"
          :multiple="true"
          placeholder="选择项目"
          no-results-text="无匹配数据"
          no-options-text="无数据"
          :clearable="false"
        ></treeselect>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="mini" type="primary" @click="clickAssignProjectsToUsers">保存</el-button>
        <el-button size="mini" @click="tableConfig.close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { getProjectRoot, getProjectRelationByEntityTypeAndEntityId } from '@/api/project'
import { assignProjectsToUsers } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
export default {
  name: 'ProfilerDialog',
  components: {
    Treeselect
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableConfig'],
  data() {
    return {
      props: { multiple: true },
      areaNormalizer(node) {
        return {
          id: node.id,
          label: node.name
        }
      },
      projects: [],
      selectProjects: []
    }
  },
  computed: {
    visible() {
      return this.tableConfig.visible
    }
  },
  created() {
    getProjectRoot().then(res => {
      this.projects = res.data
      this.settree(this.projects)
      if (this.tableConfig.single) {
        getProjectRelationByEntityTypeAndEntityId('USER', this.tableConfig.userIds[0]).then(res => {
          res.data.forEach(item => {
            this.$refs.treeSelect.addValue(item)
          })
        })
      }
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
    getSelectNode() {
      console.log(this.selectProjects)
    },
    clickAssignProjectsToUsers() {
      this.tableConfig.close()
      const params = {}
      params.projectIds = this.selectProjects
      params.userIds = this.tableConfig.userIds
      assignProjectsToUsers(params).then(() => {
        $message({
          type: 'success',
          message: '操作成功'
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .treeselect-main {
    width: 204px;
    line-height: 30px;
    .vue-treeselect__placeholder {
      line-height: 30px;
    }
    .vue-treeselect__control {
      height: 30px;
      background-color: red;
    }
  }
</style>
