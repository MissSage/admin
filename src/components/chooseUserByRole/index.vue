<template>
  <div>
    <div :style="{ width: width, height: height, 'line-height': height }" class="userContainer">
      <el-tooltip
        class="item"
        :disabled="!userNames"
        :content="userNames"
        placement="top"
      >
        <div class="usersText">{{ userNames }}</div>
      </el-tooltip>
      <div
        class="selectBtn"
        :disabled="disabledStu"
        @click="getUserRoles"
      >
        选择用户
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      title="用户选择"
    >
      <div class="userDialog">
        <div class="roleList">
          <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllRole">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="selectRoles" @change="roleChange">
            <el-checkbox style="display:block" v-for="role in roleList" :label="role" :key="role">{{role}}</el-checkbox>
          </el-checkbox-group> -->
          <div
            v-for="(role, index) in roleList"
            :key="index"
            class="roleItem"
            :class="{ checked: role.id.id === roleId }"
            @click="checkRole(role.id.id)"
          >
            {{ role.name }}
          </div>
        </div>
        <div class="userList">
          <template v-if="userList.length">
            <el-checkbox
              v-if="multiple"
              v-model="checkAll"
              :indeterminate="userIsIndeterminate"
              @change="checkAllUsers"
            >
              全选
            </el-checkbox>
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-if="multiple"
              v-model="userObjs"
              @change="(val:any)=>usersChange(val)"
            >
              <el-checkbox
                v-for="(user, index) in userList"
                :key="index"
                :label="user"
                style="display: block"
              >
                {{ user.firstName }}
              </el-checkbox>
            </el-checkbox-group>
            <el-radio-group
              v-if="!multiple"
              v-model="user"
              @change="(val:any)=>userChange(val)"
            >
              <el-radio
                v-for="(item, index) in userList"
                :key="index"
                :label="item"
                style="display: block"
              >
                {{ item.firstName }}
              </el-radio>
            </el-radio-group>
          </template>
          <div v-else class="noData">暂无数据</div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkUsers">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { removeSlash } from '@/utils/removeIdSlash'
import { getRoles, getUserListByRole } from '@/api/menu'
import { reactive, toRefs, computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    users: {
      type: Array as PropType<string[]>,
      default: () => {
        return []
      }
    },
    disabledStu: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  setup (props, ctx) {
    const state = reactive<{
      dialogVisible: boolean
      roleList: any[]
      // selectRoles: [],
      userIsIndeterminate: boolean
      roleId: string
      checkAll: boolean
      userList: any[]
      userObjs: any[]
      disabledStu: boolean
      user:any
    }>({
      user: props.users[0],
      dialogVisible: false,
      roleList: [],
      // selectRoles: [],
      userIsIndeterminate: false,
      roleId: '',
      checkAll: false,
      userList: [],
      userObjs: props.users,
      disabledStu: props.disabledStu
    })

    // 获取角色
    const getUserRoles = async () => {
      const res = await getRoles()
      console.log(res)
      state.roleList = res.data
      state.dialogVisible = true
    }

    // 获取角色下的用户
    const getUser = async () => {
      state.userList = []
      // state.userObjs = []
      const res = await getUserListByRole(removeSlash(state.roleId))
      state.userList = res.data.data.map((user:any) => ({
        firstName: user.firstName || user.name,
        id: removeSlash(user.id.id)
      }))
    }

    // 选择角色
    const checkRole = (roleId: string) => {
      state.roleId = roleId
      getUser()
    }

    // 全选
    const checkAllUsers = (val: any) => {
      state.userObjs = val ? state.userList : []
      console.log(val, state.userObjs)
      state.userIsIndeterminate = false
    }

    const usersChange = (value: string[]) => {
      const checkedCount = value.length
      state.checkAll = checkedCount === state.userList.length
      // state.isIndeterminate = checkedCount > 0 && checkedCount < state.userList.length
    }
    const userChange = (value: string) => {
      state.userObjs = []
      state.userObjs.push(value)
    }
    // 确认选项，讲users传递给父组件
    const checkUsers = () => {
      ctx.emit('checkUsers', state.userObjs)
      state.dialogVisible = false
    }

    // 根据已选用户渲染userNames
    const userNames = computed(() => {
      let userNames = state.userObjs.map(user => user.firstName)
      userNames = [...new Set(userNames)]
      return userNames.join(',')
    })

    return {
      ...toRefs(state),
      getUserRoles,
      getUser,
      checkRole,
      checkAllUsers,
      usersChange,
      checkUsers,
      userNames,
      userChange
    }
  }
})
</script>

<style lang="scss" scoped>
.userContainer {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  min-width: 220px;
  .usersText {
    border: 1px solid #3c3f54;
    border-right: none;
    padding: 0 12px;
    flex: 1;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  .selectBtn {
    width: 80px;
    text-align: center;
    padding: 0 12px;
    background-color: #3e8ef7;
    color: #fff;
    cursor: pointer;
  }
}
.userDialog {
  width: 100%;
  display: flex;
  height: 500px;
  .roleList {
    padding: 0 12px;
    width: 50%;
    overflow-y: auto;
    box-sizing: border-box;
    border-radius: 1px solid #dcdfe6;
    .roleItem {
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
      padding: 0 12px;
      cursor: pointer;
      &.checked {
        background-color: #3e8ef7;
        color: #fff;
      }
    }
  }
  .userList {
    padding: 0 12px;
    width: 50%;
    .noData {
      height: 300px;
      line-height: 300px;
      text-align: center;
      color: #999;
      width: 100%;
    }
  }
}
.el-radio{
  margin: 12px;
}
</style>
