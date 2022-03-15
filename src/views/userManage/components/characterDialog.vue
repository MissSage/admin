<template>
  <el-dialog
    v-model="visible"
    title="角色赋予"
    width="30%"
    class="alarm-design"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="选择要赋予的角色">
        <el-select v-model="roleId" placeholder="请选择角色" class="item-input-select">
          <el-option
            v-for="item in roleList"
            :key="item.id.id"
            :label="item.name"
            :value="item.id.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clickSave">保存</el-button>
        <el-button @click="tableConfig.close()">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getRoles, assignRoleToUser, getRoleIdByUserId } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
// import { parse } from 'semver' // , saveRole
export default {
  name: 'CharacterDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableConfig'],
  data() {
    return {
      roleId: '',
      roleList: []
    }
  },
  computed: {
    visible() {
      return this.tableConfig.visible
    }
  },
  created() {
    // 获取当前租户角色列表
    getRoles().then(res => {
      console.log(res.data)
      this.roleList = res.data
      // 获取当前用户的角色
      getRoleIdByUserId(this.tableConfig.userId).then(res => {
        this.roleId = res.data
      })
    })
  },
  methods: {
    clickSave() {
      const params = {}
      params.userId = this.tableConfig.userId
      params.roleId = this.roleId
      assignRoleToUser(params).then(() => {
        $message({
          type: 'success',
          message: '操作成功'
        })
        this.$emit('refreshData')
        this.tableConfig.close()
      })
    }
  }
}
</script>
