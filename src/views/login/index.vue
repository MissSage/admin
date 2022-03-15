<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :rules="loginRules"
      ref="form"
      :model="state.loginForm"
      @submit.prevent="handleLogin"
    >
      <div class="login-form__header">
        <img
          class="login-logo"
          src="@/assets/logo.png"
          alt="拉勾心选"
        >
      </div>
      <el-form-item prop="account">
        <el-input
          v-model="state.loginForm.username"
          placeholder="请输入用户名"
        >
          <template #prefix>
            <i class="el-input__icon el-icon-user" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          v-model="state.loginForm.password"
          type="password"
          placeholder="请输入密码"
        >
          <template #prefix>
            <i class="el-input__icon el-icon-lock" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="imgcode">
        <div class="imgcode-wrap">
          <el-input
            v-model="state.loginForm.verifyCode"
            placeholder="请输入验证码"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-key" />
            </template>
          </el-input>
          <img
            class="imgcode"
            alt="验证码"
            :src="state.verifyImage"
            @click="setCaptcha"
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          class="submit-button"
          type="primary"
          :loading="state.loading"
          native-type="submit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { IElForm } from '@/types/element-plus'
import { store } from '@/store'
import { login, getVerify, getKey, getInfo } from '@/api/login'
import { loginRules } from '.'
import { ILogin } from './type'
import { cloneDeep } from 'lodash-es'
import { encrypt } from '@/utils/AES'
import { getToken, getUserId, setCurTenant, setTenantId, setToken, setUserId } from '@/utils/cookies'
import { getItem, setItem } from '@/utils/storage'
const router = useRouter()
const route = useRoute()
const form = ref<IElForm>()
const state = reactive<{
  loginForm: ILogin
  loading: boolean
  pwdType: string
  visiblePwd: boolean
  title: string
  verifyImage:string
}>({
  verifyImage: '',
  loginForm: {
    username: '',
    password: '',
    requestId: '',
    verifyCode: ''
  },
  loading: false,
  pwdType: 'password',
  visiblePwd: false,
  title: import.meta.env.VITE_API_BASEURL

})

const handleLogin = async () => {
  // 表单验证
  const valid = await form.value?.validate()
  if (!valid) return false
  state.loading = true

  const loginForm = cloneDeep({ ...state.loginForm })
  const keyRes = await getKey()
  loginForm.username = encrypt(loginForm.username, keyRes.data?.key)
  loginForm.password = encrypt(loginForm.password, keyRes.data?.key)

  const res = await login(loginForm).catch(() => setCaptcha()).finally(() => { state.loading = false })
  if (!res?.data) return
  setItem('TOKEN', res?.data?.token)
  const tokenBody = JSON.parse(
    atob(
      res?.data?.token
        .match(/\.(.*?)\./)[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    )
  )
  setItem('USERID', tokenBody.userId)
  getUserInfo()
  redirect()
}

const setCaptcha = async () => {
  const res = await getVerify()
  state.loginForm = res.data?.data
  state.loginForm.requestId = res.data?.request
}
const getUserInfo = async () => {
  const userId = getItem<string>('USERID')
  if (!userId) return
  const { data } = await getInfo(userId)

  const authority = (data?.authority && [data.authority]) || []
  authority.length > 0 && store.commit('SET_ROLES', authority)
  setUserId(data.id.id)
  setTenantId(data.tenantId.id)
  const current_cookie = getToken()
  const changed = () => {
    location.href = '/'
  }
  setInterval(() => {
    if (current_cookie !== getToken()) {
      changed()
    }
  }, 500)
}
const redirect = () => {
  let redirect = route.query.redirect || '/'
  if (typeof redirect !== 'string') {
    redirect = '/'
  }
  router.replace(redirect)
}
onMounted(() => {
  setCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  min-width: 400px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;
}

.login-form {
  padding: 30px;
  border-radius: 6px;
  background: #fff;
  min-width: 350px;
  .login-form__header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
  }

  .el-form-item:last-child {
    margin-bottom: 0;
  }

  .login__form-title {
    display: flex;
    justify-content: center;
    color: #fff;
  }

  .submit-button {
    width: 100%;
  }

  .login-logo {
    width: 271px;
    height: 74px;
  }
  .imgcode-wrap {
    display: flex;
    align-items: center;
    .imgcode {
      height: 37px;
    }
  }
}
</style>
