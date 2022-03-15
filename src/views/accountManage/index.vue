<template>
  <div class="account-manage-warpper">
    <el-card>
      <template #header>
        <span class="custom-bottom-box-shadow title">账户信息</span>
      </template>
      <el-form
        ref="rulesForm"
        :model="userInfo"
        :label-position="labelPosition"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="电子邮件">
          <el-input v-model="userInfo.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="userInfo.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-if="alarmItem" label="邮箱接收告警">
          <el-switch
            v-model="userInfo.additionalInfo.alarmFromEmail"
            active-color="#3E8EF7"
          ></el-switch>
        </el-form-item>
        <el-form-item label="联系手机" prop="phone">
          <el-input v-model="userInfo.phone" :disabled="readOnly"></el-input>
        </el-form-item>
        <el-form-item v-if="alarmItem" label="手机接收告警">
          <el-switch
            v-model="userInfo.additionalInfo.alarmFromSms"
            active-color="#3E8EF7"
            @change="alarmSwitch"
          ></el-switch>
        </el-form-item>
        <el-form-item label="昵称" prop="lastName">
          <el-input v-model="userInfo.lastName" :disabled="readOnly"></el-input>
        </el-form-item>
        <el-form-item>
          <changePassword />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="allowSave" @click="submitSaveUser">保存</el-button>
          <el-button class="copyButton" @click="copyToken">复制API Token</el-button>
        </el-form-item>
      </el-form>
      <input id="tokenTarget" style="display: none" type="text" :value="token" />
    </el-card>
    <!-- <div class="a-m-box custom-main-bg-box-shadow1"></div> -->
  </div>
</template>

<script>
import changePassword from './changePassword'
import { getUser, saveUser } from '@/api/user'
import _ from 'lodash'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageSuccess, $messageError } = useGlobal()

export default {
  name: 'AccountManage',
  components: {
    changePassword
  },
  inject: ['reload'],
  data() {
    const validatePhone = (rule, value, callback) => {
      // const valid = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g
      const valid = /^1\d{10}$/
      if (valid.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确手机号'))
      }
    }
    return {
      dialogVisible: false,
      labelPosition: 'right',
      token: this.$store.state.user.token,
      phone: '',
      userInfo: {},
      OldUserInfo: {},
      modedUserInfo: {},
      readOnly: false,
      alarmItem: false,
      rules: {
        lastName: [
          // { validator: validateName, trigger: 'blur' },
          { max: 16, message: '昵称输入不可超过16位', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系手机', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    allowSave: function () {
      if (_.isEqual(this.userInfo, this.OldUserInfo)) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    getUser(this.$store.state.user.id).then(val => {
      console.log(val, 'getUser')
      this.userInfo = Object.assign({}, val.data)
      this.OldUserInfo = Object.assign({}, val.data)
      if (this.userInfo.authority === 'SYS_ADMIN') {
        this.readOnly = true
      }
      this.userInfo.additionalInfo = JSON.parse(this.userInfo.additionalInfo || '{}')
      if (this.userInfo.authority === 'TENANT_ADMIN') {
        this.alarmItem = true
      }
      console.log(this.userInfo, '-------11')
    })
  },
  methods: {
    alarmSwitch() {
      if (this.userInfo.alarmFromSms) {
        if (this.userInfo.phone === '') {
          $messageError('打开手机接收告警，必须先填写手机号')
          this.userInfo.alarmFromSms = false
        }
      }
    },
    copyToken() {
      this.$copyText('Bearer ' + this.token).then(e => {
        console.log(e)
        $messageSuccess('复制 API Token 成功')
      })
    },
    submitSaveUser() {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          this.userInfo.additionalInfo = JSON.stringify(this.userInfo.additionalInfo)
          this.userInfo.lastName = this.userInfo.lastName.trim()
          console.log(this.userInfo, '----submit')
          saveUser(this.userInfo)
            .then(() => {
              $messageSuccess('修改成功')
              this.reload()
            })
            .catch(err => console.log(err))
        } else {
          $messageError('请填写符合提示的信息')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.account-manage-warpper {
  background-color: #000;
  width: 100%;
  height: 100%;
  padding: 15px;
  :deep(.el-card) {
    background: $bg-color;
    height: 100%;
    .el-card__header {
      padding: 0 20px;
      border-bottom: 1px solid $border-color;
    }
    // width: 660px;
    .title {
      margin: 0;
      height: 50px;
      padding: 0 20px;
      color: #00c6ff;
      line-height: 50px;
    }
  }
  .el-form {
    max-width: 600px;
    margin: 30px;
  }
}
.el-form-item {
  h2,
  h5 {
    margin: 0;
    color: #4b4c50;
  }
  h2 {
    line-height: 35px;
  }
  h5 {
    font-size: 16px;
    line-height: 18px;
    font-weight: 300;
  }
}
</style>
