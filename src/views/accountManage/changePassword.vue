<template>
  <div>
    <el-button type="text" @click="dialogVisible = true">修改密码</el-button>
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      title="修改密码"
      :close-on-click-modal="false"
      class="alarm-design"
      width="40%"
      @close="dialogClose"
    >
      <el-form ref="form" :model="password" label-width="100px" :rules="pwdForm" class="change-pwd">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="password.currentPassword"
            type="password"
            placeholder="请输入当前密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="password.newPassword"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="verifyPassword">
          <el-input
            v-model="password.verifyPassword"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="pwd-operation">
          <el-button type="primary" @click="onSubmit">修改密码</el-button>
          <el-button type="primary" @click="onReturn">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { changePassword } from '@/api/auth'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageError, $messageSuccess } = useGlobal()
// TODO: add validatePassword Method
// import { validatePassword } from '@/utils/validate';

export default {
  name: 'ChangePassword',
  data() {
    var validateNewPwd = (rule, value, callback) => {
      // const intensity4 = /^[0-9]{1,20}$/
      if (value) {
        // if (intensity4.test(value)) {
        //   callback(new Error('纯数字密码过于简单，请重新输入'))
        // }
        if (this.password.verifyPassword !== '') {
          this.$refs.form.validateField('verifyPassword')
        }
        callback()
      } else {
        callback(new Error('请输入新密码'))
      }
    }
    var validateVerifyPwd = (rule, value, callback) => {
      if (value !== this.password.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      password: {
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
      },
      pwdForm: {
        currentPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validateNewPwd, trigger: 'blur' },
          {
            min: 8,
            max: 20,
            message: '密码不能小于8位，大于20位',
            trigger: 'blur'
          }
        ],
        verifyPassword: [
          { required: true, message: '请输入再次新密码', trigger: 'blur' },
          { validator: validateVerifyPwd, trigger: 'blur' },
          {
            min: 8,
            max: 20,
            message: '密码不能小于8位，大于20位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // btoa(this.password.currentPassword).split('').reverse().join(''), btoa(this.password.newPassword).split('').reverse().join(''))
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.password.currentPassword === this.password.newPassword) {
            $messageError('新密码与原密码一致，请重新输入')
            return false
          }
          changePassword(this.password.currentPassword, this.password.newPassword)
            .then(() => {
              $messageSuccess('修改成功')
              this.dialogVisible = false
              this.dialogClose()
            })
            .catch(err => {
              $messageError(err.data.message)
              console.log(err)
            })
        } else {
          $messageError('请按提示输入信息')
          return false
        }
      })
    },
    onReturn() {
      this.dialogVisible = false
      this.password.currentPassword = ''
      this.password.newPassword = ''
      this.password.verifyPassword = ''
    },
    dialogClose() {
      this.password.currentPassword = ''
      this.password.newPassword = ''
      this.password.verifyPassword = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.change-pwd {
  .el-form-item {
    margin-bottom: 20px;
  }
  .pwd-operation {
    margin: 10px 0;
  }
}
:deep(.el-dialog__header) {
  padding: 10px;
}
//  FIXME: element margin bug
</style>
