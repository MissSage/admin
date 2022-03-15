<template>
  <!-- 菜单授权 -->
  <el-dialog
    v-if="visible"
    v-model="visible"
    title="应用授权管理"
    width="600px"
    :close-on-click-modal="false"
    @close="config.close"
  >
    <div class="roles-tree-conent">
      <div class="tree-info">
        <el-tree
          ref="tree"
          class="roles-tree"
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div class="tree-footer">
        <el-button type="primary" size="medium" @click="saveMenuAssign">保 存</el-button>
        <el-button plain size="medium" @click="resetChecked">清 空</el-button>
        <el-button size="medium" @click="config.close">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getSelectableTree } from '@/api/menu'
import { getAppMenu, setAppMenu } from '@/api/application'
// import { saveEntityAttributesV1, getAttributes } from '@/api/telemetry'
import { idRemoveSlash } from '@/utils/removeIdSlash'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageSuccess } = useGlobal()

export default {
  name: 'MenuAssign',
  // eslint-disable-next-line vue/require-prop-types
  props: ['config'],
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      appTypeId: ''
    }
  },
  computed: {
    visible() {
      return this.config.visible
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.appTypeId = this.config.currentId
      getSelectableTree().then(val => {
        idRemoveSlash(val.data, 'id')
        this.treeData = val.data
        this.getCheckItemMenu()
      })
    },
    // set 该选择项已选信息
    getCheckItemMenu() {
      getAppMenu(this.appTypeId).then(val => {
        const chackId = val.data
        if (chackId.length > 0) {
          this.$refs.tree.setCheckedKeys(chackId)
        }
      })
    },
    saveMenuAssign() {
      // 把选中的节点信息保存在数组内提交
      // this.roles 的id要一并提交
      const checkMenu = this.$refs.tree.getCheckedKeys()
      const saveMenu = {
        data: checkMenu,
        appTypeId: this.config.currentId
      }
      setAppMenu(saveMenu).then(() => {
        this.messageInfo()
      })
      this.config.close()
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    messageInfo() {
      $messageSuccess('操作成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.roles-tree-conent {
  overflow-y: auto;
  height: 85%;
  font-size: 18px;
  width: 400px;
  margin: 0 auto;
  .warm-prompt {
    margin-top: 60px;
    text-align: center;
  }
  .tree-info {
    width: 100%;
    .roles-tree {
      margin: 0 1rem;
    }
  }
  .tree-footer {
    margin: 1rem;
  }
}
// .menu-assign-dialog {
//   .el-dialog__footer {
//     text-align: center;
//   }
// }

.el-input-number {
  width: 150px;
}
.msg {
  color: #1571a9;
  margin: 0 10px;
}
</style>
