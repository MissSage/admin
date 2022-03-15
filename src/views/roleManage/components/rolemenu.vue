<template>
  <el-dialog
    v-model="visible"
    title="授权角色的菜单"
    width="60%"
    class="alarm-design"
    :close-on-click-modal="false"
    @close="tableConfig.close"
  >
    <el-card>
      <div class="app-auth-title">应用授权</div>
      <el-checkbox-group v-model="selectedApps">
        <el-checkbox
          v-for="(item, i) in apps"
          :key="i"
          :label="item.id"
          @change="handleAppChange(item)"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-card>
    <el-tabs
      v-model="app"
      tab-position="left"
      style="height: 500px; margin-top: 20px"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="(item, i) in selectedAppItems"
        :key="i"
        :label="item.name"
        :name="item.id"
      >
        <el-scrollbar v-if="data.length > 0" height="500px">
          <el-tree
            :ref="'menuTree' + item.id"
            :data="data"
            class="menu-tree"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            @check="change"
          ></el-tree>
        </el-scrollbar>
        <el-empty v-else :image-size="150" description="该应用暂不支持菜单授权"></el-empty>
      </el-tab-pane>
    </el-tabs>

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
import { getTreeByRoleId, assignMenuToRole } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
import { removeSlash } from '@/utils/removeIdSlash'
import {
  getapplications,
  getTreeByTenantApplication,
  getCorporateMenu,
  getRoleTenantApplicationList,
  assignTenantApplicationToRole
} from '@/api/portal'
import Cookies from 'js-cookie'
const { $message } = useGlobal()
export default {
  name: 'Cataloge',
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableConfig'],
  data() {
    return {
      userdata: [],
      data: [],
      selectNodes: [],
      enterpriseoptions: [],
      enterprise: '',
      appoptions: [],
      app: '',
      apps: [],
      selectedApps: [],
      selectedAppItems: []
    }
  },

  computed: {
    visible() {
      return this.tableConfig.visible
    }
  },
  created() {
    this.appoptions = []
    this.app = ''
    this.apps = []
    this.selectedApps = []
    this.selectedAppItems = []
    this.getapplication().then(() => {
      this.getCureemtApps()
    })
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
      this.app = tab.props.name
      this.getApplicationTree(this.app)
    },
    async handleAppChange(item) {
      // const tenantId = removeSlash(Cookies.get('tenantId') || '')
      const roleId = removeSlash(this.tableConfig.roleId)
      await assignTenantApplicationToRole({ roleId: roleId, tenantApplicationId: item.id })
      await this.getCureemtApps()
    },
    async getCureemtApps() {
      // const tenantId = removeSlash(Cookies.get('tenantId') || '')
      const roleId = removeSlash(this.tableConfig.roleId)

      const res = await getRoleTenantApplicationList(roleId).catch(e => console.log(e.message))
      console.log(res)
      this.selectedApps = res.data
      this.selectedAppItems = res.data.map(item => this.apps.find(obj => obj.id === item))
      console.log(this.selectedAppItems)
      if (this.selectedAppItems.length > 0) {
        this.app = this.selectedAppItems[0].id
        this.getApplicationTree(this.app)
      }
    },
    change() {
      //node
      console.log(this.$refs['menuTree' + this.app].getCheckedKeys())
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
      const params = {
        roleId: this.tableConfig.roleId,
        menuIds: this.$refs['menuTree' + this.app].getCheckedKeys(),
        tenantApplicationId: this.app
      }
      assignMenuToRole(params).then(() => {
        $message({
          type: 'success',
          message: '操作成功'
        })
        this.tableConfig.close()
      })
    },

    // 获取应用列表
    async getapplication() {
      const tenantId = removeSlash(Cookies.get('tenantId') || '')
      const res = await getapplications(tenantId)
      if (res.status === 200) {
        res.data.forEach(element => {
          this.appoptions.push({ label: element.name, value: element.id })
          this.apps.push(element)
        })
      }
    },

    // 获取当前应用的菜单
    getApplicationTree(appId) {
      if (appId) this.app = appId
      getTreeByTenantApplication(this.app).then(res => {
        console.log(res)
        this.data = res.data
        // 获取当前角色拥有的菜单
        this.getuserTree()
      })
    },

    // 获取用户当前的路由
    getuserTree() {
      getCorporateMenu(removeSlash(this.tableConfig.roleId), this.app).then(res => {
        console.log(res)
        this.$refs['menuTree' + this.app].setCheckedKeys(res.data)
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
<style lang="scss" scoped>
.menu-tree {
  margin-top: 20px;
  width: calc(100% - 20px);
}
:deep(.el-tabs__nav-wrap) {
  &.is-left {
    padding: 0;
  }
  .el-tabs__nav-scroll {
    .el-tabs__nav {
      .el-tabs__item {
        text-align: right;
      }
    }
  }
}
.app-auth-title {
  color: #409eff;
  margin: 5px 0;
}
:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
  .el-checkbox {
    flex-basis: 220px;
  }
}
.el-tabs {
  background-color: #222536 !important;
}
:deep(.el-tabs__content) {
  width: calc(100% - 250px) !important;
  height: 100% !important;
}

:deep(.el-card__body) {
  background: #383d51 !important;
}
</style>
