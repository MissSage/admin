<template>
  <el-dialog
    v-model="visible"
    title="授权角色的菜单"
    width="30%"
    class="alarm-design"
    :close-on-click-modal="false"
    @open="_getTreeByRoleId"
  >
    <el-tree
      ref="menuTree"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expand-all="true"
      @check="change"
    >
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="mini" type="primary" @click="clickSaveMenuToRole">保存</el-button>
        <el-button size="mini" @click="clearMenuTree">清空</el-button>
        <el-button size="mini" @click="tableConfig.close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getTree, getTreeByRoleId, assignMenuToRole } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
export default {
  name: 'Cataloge',
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableConfig'],
  data() {
    return {
      data: [],
      selectNodes: []
    }
  },
  computed: {
    visible() {
      return this.tableConfig.visible
    }
  },
  created() {
    // 获取默认树
    getTree().then(res => {
      this.data = res.data
      // 获取当前角色拥有的菜单
    })
  },
  methods: {
    change() {
      //node
      console.log(this.$refs['menuTree'].getCheckedKeys())
    },
    _getTreeByRoleId() {
      console.log(this.tableConfig)
      getTreeByRoleId(this.tableConfig.roleId).then(res => {
        this.selectNodes = res.data
        this.$refs['menuTree'].setCheckedKeys(this.selectNodes)
      })
    },
    clickSaveMenuToRole() {
      this.tableConfig.close()
      const params = {}
      params.roleId = this.tableConfig.roleId
      params.menuIds = this.$refs['menuTree'].getCheckedKeys()
      assignMenuToRole(params).then(() => {
        $message({
          type: 'success',
          message: '操作成功'
        })
      })
    },
    // 清空选择的节点
    clearMenuTree() {
      this.$refs['menuTree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss">
.alarm-design {
  .el-tree-node__content {
    &:hover {
      background: #373b4e 100% !important;
    }
  }
  .el-tree-node.is-current {
    > .el-tree-node__content {
      background: #373b4e 100% !important;
    }

    .el-tree-node__content {
      &:hover {
        background: #373b4e 100% !important;
      }
    }

    .el-tree-node__children {
      .el-tree-node__content {
        &:hover {
          background: #373b4e 100% !important;
        }
      }
    }
  }
}
</style>
