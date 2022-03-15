<template>
  <div class="login-container">

    <div class="login-content">
      <div class="img-box">
        <img src="" alt="" />
      </div>
      <div class="login-input-box">
        <el-form
          ref="loginForm"
          class="login-form"
          auto-complete="on"
          :model="loginForm"
          label-position="left"
        >
          <h1 class="form-title">欢迎使用</h1>
          <h1 class="form-title" style="margin-bottom: 48px">{{title}}</h1>
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              auto-complete="on"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <i class="el-icon-lock"></i>
              <!-- <svg-icon icon-class="password"></svg-icon> -->
            </span>
            <el-input
              v-model="loginForm.password"
              name="password"
              :type="pwdType"
              placeholder="请输入密码"
              auto-complete="on"
              @keyup.enter="handleLogin"
            ></el-input>
            <!-- <span class="show-pwd" @click="showPwd">
                <svg-icon icon-class="eye"  v-if="visiblePwd"/>
                <svg-icon icon-class="openeye" v-else/>
              </span> -->
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>

          <div class="reset-link">
            <!-- <p class="msg">推荐使用Chrome浏览器</p> -->
            <!-- <router-link to="/requestResetPwd" class="reset-pwd">忘记密码</router-link> -->
          </div>
        </el-form>
      </div>
    </div>
    <div class="seize-a-seat"></div>

    <div class="tips">
      <p class="msg">推荐使用Chrome浏览器 <span>v_1.0</span></p>
      <!-- <span>&copy;2018 成都星云联动科技有限公司 版权所有 0.45</span> -->
    </div>
  </div>
</template>

<script>
import { scadaLogin, getKey } from '@/api/login'
import Cookies from 'js-cookie'
import useGlobal from '@/hooks/global/useGlobal'
import AES from '@/utils/AES'
import { cloneDeep } from 'lodash'
import { AuthYinshou } from '@/api/yinshou'
const { $message } = useGlobal()

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的账户，为邮箱格式'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      title: process.env.VUE_APP_TITLE || '智慧水务建设平台',
      loginForm: {
        username: '',
        password: '',
        requestId: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          {
            min: 8,
            max: 20,
            trigger: 'blur',
            message: '密码长度应该在8到20之间'
          }
        ]
      },
      loading: false,
      pwdType: 'password',
      visiblePwd: true,
      bgimg: '',
      // captchaText: '',
      // captchaInfo: [],
      colorList: [
        '#c23531',
        '#2f4554',
        '#0264b8',
        '#e68e21',
        '#0e9712',
        '#df0606',
        '#259797',
        '#6e7074',
        '#6b42cf',
        '#d211d5',
        '#b40b51'
      ]
    }
  },
  created() {
    // 双解码
    Cookies.set('title', this.title)
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        this.visiblePwd = !this.visiblePwd
      } else {
        this.pwdType = 'password'
        this.visiblePwd = !this.visiblePwd
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(() => {
        // just wanna cheat, useless code
        if (this.loginForm) {
          this.loading = true
          const loginForm = cloneDeep({ ...this.loginForm })
          // loginForm.username = loginForm.username.trim()
          // loginForm.username = btoa(loginForm.username).split('').reverse().join('')
          // loginForm.password = btoa(loginForm.password)
          // loginForm.password = loginForm.password.split('').reverse().join('')

          getKey()
            .then(res => {
              loginForm.username = AES.encrypt(loginForm.username,res.key)
              loginForm.password = AES.encrypt(loginForm.password,res.key)
              return this.$store.dispatch('user/Login', loginForm)
            })
            .then(() => {
              this.loading = false
              localStorage.setItem('ysinfo', JSON.stringify({
                u:loginForm.username,
                p:loginForm.password
              }))
              console.log(this.$store.getters.addRouters, 'addRouters')
              this.$router.push({ path: '/' })
              // 拿组态登陆信息
              const params = {
                strategy: 'local',
                username: loginForm.username,
                password: loginForm.password
              }
              scadaLogin(params).then(res => {
                this.$store.dispatch('user/ToggleScadaToken', res.data.accessToken)
              })
              AuthYinshou().then(res=>{
                Cookies.remove('JSESSIONID')
                Cookies.set('JSESSIONID',{
                  value:res.data.obj,
                  path:'/water_project',
                  httponly:true
                  })
              })
              // .then((res:any)=>{
              //   localStorage.setItem('yinshou',)
              // })
            })
            .catch(err => {
              this.loading = false
              // $message.error('登录失败，用户名或密码错误')
              $message.error(err.message)
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 48px;
    width: 85%;
    input {
      background: transparent;
      border: 0px !important;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      font-style: 18px;
      // color: $light_gray;
      color: #fff;
      height: 48px;
      border-color: transparent;
      &:focus {
        border-color: transparent !important;
        border: 0px !important;
      }
      // border-bottom: 1px solid #979797;
      // &:-webkit-autofill {
      //   -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: #fff !important;
      // }
    }
  }
  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    border: 1px solid #404354;
    border-radius: 4px;
    background: #333647;
    color: #6c7088;
    margin-bottom: 42px;
    &:nth-of-type(3) {
      border: none;
      background-color: transparent;
    }
  }
}
.login-container {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent !important; //设置input框记住密码背景颜色
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
    -webkit-text-fill-color: #fff !important; //设置浏览器默认密码字体颜色
  }

  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    // -webkit-text-fill-color: #FFFFFF !important;
    color: #fff !important;
    transition: background-color 5000s ease-in-out 0s !important;
    // background-color: transparent !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  // background-color: $bg;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: url('~@/assets/other/login_bg1.png') center no-repeat;
  background-size: 100% 100%;
  overflow-y: auto;
  .login-content {
    width: 80%;
    margin: 0 auto;
    // height: 58%;
    height: 540px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: 6px;
    // background: #23729F;
    // background: rgba(9, 17, 40, 0.5);
    // border: 2px solid #13679A;
    // box-shadow: inset 0 0 20px 2px rgba(0, 149, 255, 0.6),
    //   10px 10px 20px rgba(0, 0, 0, 0.5);
  }
  .img-box {
    width: 48%;
    margin-right: 5%;
    background: url('~@/assets/other/login_img.png') center no-repeat;
    background-size: 100% 100%;
  }
  .login-input-box {
    width: 30.5%;
    display: flex;
    align-items: center;
    // background: #0C162F;
    // background: rgba(9, 17, 40, 0.5);
    // border-left: 2px solid #13679a;
    // box-shadow: inset 0 0 20px 2px rgba(0, 149, 255, 0.6);
  }
  .login-form {
    margin: 0;
    .form-title {
      font-family: PingFangSC-Semibold;
      font-size: 40px;
      line-height: 64px;
      letter-spacing: 2px;
      color: #ffffff;
      font-weight: 500;
      margin: 0;
    }
    .label-login {
      font-weight: 600;
      color: #2e4383;
      font-size: 20px;
      margin-bottom: 20px;
      .l-b-border {
        padding-bottom: 5px;
        border-bottom: 2px solid #2e4383;
      }
    }
    .captcha-verification {
      width: 100%;
      height: 50px;
      display: flex;
      padding: 0 27px 0 33px;
    }
    .division {
      width: 4%;
      height: 52px;
      margin-top: -1px;
      // background: rgba(9, 17, 40, 0.5);
      // border-left: 1px solid rgba(255, 255, 255, 0.1);
      // border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    .captcha-show-box {
      width: 50%;
      height: 100%;
      display: flex;
      // padding: 0 10px;
      cursor: pointer;
      justify-content: space-evenly;
      .c-text {
        height: 30px;
        cursor: pointer;
        font-weight: 900;
        line-height: 30px;
      }
      .captcha-img {
        height: 100%;
        width: 100%;
      }
    }
    .login-btn {
      width: 100%;
      margin-top: 36px;
      height: 54px;
      background: #3e8ef7;
      border: 1px solid #404354;
      border-radius: 4px;
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      color: #ffffff;
      // line-height: 72px;
      letter-spacing: 5px;
      font-weight: 500;
    }
  }
  .reset-link {
    float: right;
    font-size: 14px;
    .reset-pwd {
      color: #60aeff;
    }
    .msg {
      text-align: center;
      margin: 0 90px;
      display: inline-block;
    }
  }
  .tips {
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 1rem;
    font-size: 14px;
    color: #c0c4cc;
    justify-content: center;
    .msg {
      text-align: center;
      color: #3d94dd;
      font-size: 12px;
      margin-right: 20px;
    }
    span {
      &:first-of-type {
        margin: auto;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
    .el-icon-lock {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    letter-spacing: 20px;
    text-shadow: 0 0 20px rgba(34, 145, 241, 0.61);
  }
  .seize-a-seat {
    height: 60px;
    width: 100%;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .receive-hide {
    display: none;
  }
  .bg-img0 {
    background: url('~@/assets/other/captcha-bg/bg-img0.png') center no-repeat;
  }
  .bg-img1 {
    background: url('~@/assets/other/captcha-bg/bg-img1.png') center no-repeat;
  }
  .bg-img2 {
    background: url('~@/assets/other/captcha-bg/bg-img2.png') center no-repeat;
  }
  .bg-img3 {
    background: url('~@/assets/other/captcha-bg/bg-img3.png') center no-repeat;
  }
  .bg-img4 {
    background: url('~@/assets/other/captcha-bg/bg-img4.png') center no-repeat;
  }
  .captcha-show-box {
    background-size: 100% 100%;
  }
}
</style>
