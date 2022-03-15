<template>
  <div class="navbar-container">
    <el-menu class="navbar" mode="horizontal">
      <div class="left-box">
        <!-- 收缩按钮 -->
        <hamburger
          class="hamburger-container"
          :is-active="!!sidebar.opened"
          :toggle-click="toggleSideBar"
        ></hamburger>
        <!-- 面包屑 -->
        <!-- <breadcrumb></breadcrumb> -->
        <div class="title-box">
          <p class="title">{{ appname }}</p>
          <!-- <p style="display: none">{{ getAppUrl }}</p> -->
          <!-- <p class="detail">Industrial IOT Cloud Platform</p> -->
        </div>
      </div>
      <div id="fill" class="fill">
        <div v-if="bulletinLast.title === '' && !alarmView">
          <span class="login-info">上次登录时间：{{ lastLoginDate }}</span>
          <span class="login-info margin-l">上次登录IP：{{ lastLoginIp }}</span>
        </div>
        <!-- <p v-if="bulletinLast.title !== ''" class="bulletin bulletin-title" id="b-title">{{bulletinLast.title}}</p> -->
        <!-- <div v-if="bulletinLast.title !== ''" class="bulletin-browsing" id="scroll_div">
        <p class="bulletin body" id="scroll_begin">{{bulletinLast.body}}</p>
        <div class="bulletin body scroll-body" id="scroll_end"></div>
                </div>-->
        <AlarmScrollView v-if="false" />
      </div>
      <div class="right-box">
        <!-- name -->
        <!-- <p class="min-name">海岛兆瓦级电源设备能量管理系统</p> -->
        <!-- 主题 -->
        <!-- <div class="page-theme">
        <el-switch class="theme-change" style="display: block" v-model="customColor" @change="themeChange"
        active-color="#207AE8" inactive-color="#eaeaea" active-text="暗" inactive-text="亮"></el-switch>
                </div>-->

        <p v-if="sysSign" class="sys-sign-btn" @click="returnSys">
          <i class="iconfont icon-fanhui"></i> 返回平台
        </p>

        <!-- <p class="current-time">{{ currentTime }}</p> -->
        <!-- <el-popover trigger="hover" placement="bottom" width="120px">
                    <div ref="qrCodeUrl" class="qrcode"></div>
                    <template #reference>
                        <p class="downloadApp">
                            <i class="iconfont icon-xiazaiAPP"></i>下载APP
                        </p>
                    </template>
                </el-popover>-->
        <p class="return-app" @click="JumpApp"><i class="el-icon-s-home"></i> 返回门户</p>
        <!-- 告警 -->
        <el-badge v-if="alarmShow" class="alarm" :value="alarm">
          <el-button
            icon="el-icon-bell"
            type="text"
            class="alarm-icon"
            @click="jumpToAlarm"
          ></el-button>
        </el-badge>

        <!-- 账号信息 -->
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span>{{ name }}</span>
            <img class="user-avatar" :src="userLog" />
            <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
            <!-- <i class="el-icon-caret-bottom"></i> -->
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <router-link class="inlineBlock" to="/accountManage/index">
                <el-dropdown-item>
                  <span>账户管理</span>
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided>
                <span style="display: block" @click="logout">登出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>
    <!-- <div class="auxiliary-navigation">
    <div class="left-box">
      <breadcrumb></breadcrumb>
    </div>
    <div class="fill">
      <span class="login-info">上次登陆时间：{{lastLoginDate}}</span>
      <span class="login-info margin-l">上次登陆IP：{{lastLoginIp}}</span>

    </div>
    <el-button type="text" icon="el-icon-warning" class="warning-color">帮助中心</el-button>
        </div>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import AlarmScrollView from './alarmScrollView.vue'
import Hamburger from '@/components/Hamburger'
// import Breadcrumb from '@/components/Breadcrumb'
// import { getBulletinLast } from '@/api/constants-controller'
import { getLastLogin } from '@/api/login'
import { getLogo } from '@/api/tenant'
import userLog from '@/assets/icons/user-log.png'

import QRCode from 'qrcodejs2'
import Cookies from 'js-cookie'
// import { createNamespacedHelpers } from 'vuex'
// const { mapState } = createNamespacedHelpers('user')

export default {
  components: {
    Hamburger,
    AlarmScrollView
  },
  data() {
    return {
      appname: '',
      userLog,
      userName: this.$store.state.user.name,
      alarm: 0,
      customColor: true,
      currentTime: '',
      lastLoginDate: '',
      lastLoginIp: '',
      bulletinScroll: null,
      bulletinLast: {
        title: '',
        body: ''
      },
      audioMute: true,

      alarmView: false
    }
  },
  computed: {
    ...mapState('user', ['roles', 'name']),
    ...mapState('app', ['sysSign']),
    ...mapState('permission', ['addRouters', 'sysRouter']),
    ...mapGetters(['sidebar', 'avatar']),
    alarmShow() {
      if (this.roles.includes('SYS_ADMIN') && this.roles.includes('TENANT_SYS')) {
        return false
      } else {
        // if (this.$store.state.permission.addRouters && this.$store.extendRouterMap.length > 0) {
        let state = false
        for (const item of this.addRouters) {
          if (item.label === '告警管理') {
            state = true
          }
        }
        if (state) {
          return true
        } else {
          return false
        }
        // }
      }
    },
    getAppUrl() {
      if (!this.$refs || !this.$refs.qrCodeUrl) return this.$store.state.app.appUrl
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.$store.state.app.appUrl,
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log(qrcode)
      return this.$store.state.app.appUrl
    }
  },

  async created() {
    // 实时时间
    // setInterval(() => {
    //   this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    // }, 1000)
    // 屏幕宽度 控制侧栏收缩
    if (window.innerWidth < 1425) {
      if (this.sidebar.opened) {
        this.$store.dispatch('app/ToggleSideBar')
      }
    }
    // this.getLastLoginInfo()

    // 实时获取告警信息
    // if (this.alarmShow) {
    //   this.alarm = await getAlarmCount()
    //   this.alarmInterval = setInterval(async () => {
    //     this.alarm = await getAlarmCount()
    //   }, 60 * 1000 * 1)
    // }
    // 获取应用名称
    this.appname = Cookies.get('appname')
  },
  async mounted() {
    setTimeout(() => this.$store.dispatch('app/SetAppVersion'), 3000)

    if (this.roles[0] === 'SYS_ADMIN') {
      // 没有公告 显示上传登录信息
      this.alarmView = false
      this.getLastLoginInfo()
    } else {
      this.alarmView = true
      // 获取公告
      // getBulletinLast().then(res => {
      //   // console.log(res.data, 'getBulletinLast')
      //   if (res.data && res.data.title) {
      //     this.bulletinLast.title = res.data.title + '：'
      //     this.bulletinLast.body = res.data.body
      //     setTimeout(() => {
      //       this.scrollImgLeft()
      //     }, 1000)
      //   } else {
      //     // 没有公告 显示上传登录信息
      //     this.getLastLoginInfo()
      //   }
      // })
    }
  },
  beforeUnmount() {
    clearInterval(this.bulletinScroll)
    // clearInterval(this.scrollAlarmInterval)
  },
  methods: {
    // 返回sys
    returnSys() {
      // 设置 菜单，权限，token
      const pSSign = {
        returnSys: true
      }
      const sysSign = this.sysSign
      const sysRouter = this.sysRouter
      console.log(sysSign, this.sysRouter)
      this.$store.dispatch('user/ToggleToken', sysSign.oToken)
      this.$store.dispatch('user/ToggleRoles', ['SYS_ADMIN'])
      this.$store.dispatch('user/ToggleTenantId', { id: '', sys: false })
      this.$store.dispatch('app/ToggleSysSign', pSSign)
      this.$store.dispatch('permission/sysRouter')
      this.$router.addRoutes(sysRouter)
      getLogo().then(logRes => {
        this.$store.dispatch('app/ToggleLogo', logRes.data)
        this.$router.push('/HVACPage/monitoring-map/index/gisM')
      })
      // setToken(sysSign.oToken)
    },
    jumpToAlarm() {
      console.log('clicked')
      this.$router.push({
        path: '/HVACPage/realTimeAlarm/index/ah'
      })
    },
    JumpApp() {
      this.$router.push('/app')
    },
    toggleSideBar() {
      this.$store.dispatch('app/ToggleSideBar')
    },
    // themeChange() {
    //   const body = document.getElementsByClassName('app-body')
    //   if (this.customColor) {
    //     this.$store.dispatch('ToggleTheme', '252C47')
    //     body[0].classList.remove('app-body-white')
    //     body[0].classList.add('app-body-dark')
    //   } else {
    //     this.$store.dispatch('ToggleTheme', '409EFF')
    //     body[0].classList.remove('app-body-dark')
    //     body[0].classList.add('app-body-white')
    //   }
    //   location.reload()
    // },
    logout() {
      this.$store.dispatch('app/RealTimeMonitor', [])
      this.$store.dispatch('app/HistoryTimeMonitor', {})

      this.$store.dispatch('user/LogOut').then(() => {
        const pSSign = {
          returnSys: true
        }
        this.$store.dispatch('user/SetUserProject', { pData: null, isSet: false })
        this.$store.dispatch('app/ToggleSysSign', pSSign)
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getLastLoginInfo() {
      getLastLogin().then(res => {
        this.lastLoginDate = res.data.lastLoginDate
        this.lastLoginIp = res.data.lastLoginIp
      })
    },
    scrollImgLeft() {
      const speed = 50 // 初始化速度 也就是字体的整体滚动速度
      const s_begin = document.getElementById('scroll_begin') // 获取滚动的开头id
      const s_end = document.getElementById('scroll_end') // 获取滚动的
      const s_div = document.getElementById('scroll_div') // 获取整体的
      const boxWidth = document.getElementById('fill').clientWidth
      const titleWidth = document.getElementById('b-title').clientWidth
      const s_boxWidth = boxWidth - titleWidth // 滚动区的宽度
      s_end.innerHTML = s_begin.innerHTML
      let bValue = 40
      let value = null
      if (s_begin.offsetWidth * 2 < s_boxWidth) {
        const mLeft = s_boxWidth - s_begin.offsetWidth
        s_end.style.marginLeft = mLeft + 'px'
        s_end.style.marginRight = s_begin.offsetWidth + 'px'
        bValue = mLeft / 2
        value = mLeft + s_begin.offsetWidth * 3 - s_boxWidth
      }
      // console.log(s_begin.offsetWidth, value, 'chu')
      this.bulletinScroll = setInterval(() => {
        this.marquee(s_div, s_end, bValue, value)
      }, speed)
      // 鼠标点击这条公告栏的时候,清除上面的方法,让公告栏暂停
      s_div.onmouseover = () => {
        clearInterval(this.bulletinScroll)
      }
      // 鼠标点击其他地方的时候,公告栏继续运动
      s_div.onmouseout = () => {
        this.bulletinScroll = setInterval(() => {
          this.marquee(s_div, s_end, bValue, value)
        }, speed)
      }
    },
    marquee(s_div, s_end, bValue, value) {
      if (value !== null) {
        if (s_div.scrollLeft >= value - 10) {
          s_div.scrollLeft = 0
        } else {
          s_div.scrollLeft++
        }
      } else {
        if (s_end.offsetWidth - s_div.scrollLeft <= bValue) {
          s_div.scrollLeft = 0
        } else {
          s_div.scrollLeft++
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar-container {
  height: 60px;
}
.auxiliary-navigation {
  height: 40px;
  display: flex;
  align-items: center;
  padding-right: 10px;
  box-shadow: 0 0 5px #999999;
  border-bottom: 1px solid #999999;
  .fill {
    flex: 1;
    text-align: center;
    .login-info {
      color: #8e8e8e;
      font-size: 14px;
    }
    .margin-l {
      margin-left: 30px;
    }
  }
  .warning-color {
    color: #ff9527;
  }
}
.navbar {
  display: flex;
  height: 60px;
  line-height: 60px;
  // background-color: #11a57c;
  // background: linear-gradient(to bottom, #37ABE5, #266691);
  background: #2e303e;
  border-radius: 0px !important;
  justify-content: space-between;
  .left-box {
    display: flex;
    .hamburger-container {
      line-height: 70px;
      height: 60px;
      padding: 0 10px;
    }
    .title-box {
      color: #fff;
      // padding: 0 10px;
      width: 300px;
      .title {
        // margin: 17px 0 0 0;
        line-height: 60px;
        font-size: 28px;
        font-family: STXinwei;
        font-weight: 500;
        // text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
      }
      .detail {
        margin: 0 0 7px 0;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 1.5px;
      }
    }
  }
  .fill {
    flex: 1;
    text-align: center;
    overflow: hidden;
    padding: 0 15px;
    margin: 0 15px;
    // background-color: #0d1249;
    white-space: nowrap;
    display: flex;
    .login-info {
      color: #fff;
      font-size: 14px;
    }
    .margin-l {
      margin-left: 30px;
    }
    .bulletin {
      margin: 0 0;
      height: 100%;
      font-size: 14px;
    }
    .bulletin-title {
      color: #ffeb00;
      font-weight: 600;
    }
    .bulletin-browsing {
      height: 100%;
      // display: flex;
      overflow: hidden;
      white-space: nowrap;
      #scroll_begin,
      #scroll_end {
        display: inline;
      }
      .body {
        color: #ffe088;
      }
      .scroll-body {
        margin-left: 80px;
      }
    }
  }
  .right-box {
    display: flex;
    align-items: center;
    .min-name {
      font-size: 24px;
      font-weight: 600;
      color: #1bacff;
      margin-right: 1.5rem;
    }
    .return-app{
      cursor: pointer;
    }
    .sys-sign-btn {
      color: #fff;
      padding: 0 10px;
      margin: 0 1.5rem 0 0;
      // background-color: #FFB800;
      border: 1px solid #fff700;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
      &:hover,
      &:active,
      &:focus {
        background-color: rgb(245, 176, 2);
      }
    }

    .return-app {
      color: #fff;
      margin: 0 20px;
      font-size: 14px;
    }
    .current-time {
      color: #fff;
      margin: 0 1.5rem 0 0;
    }
    .downloadApp {
      color: #fff;
      margin: 0 1.5rem 0 0;
      cursor: pointer;
      font-size: 14px;
      > i.iconfont::before {
        font-size: 16px;
      }
    }
    .alarm {
      margin-right: 3rem;
      sup {
        top: 15px;
      }
    }
    .alarm-icon {
      color: #fff;
    }
    .page-theme {
      margin-right: 1.5rem;
      display: flex;
      height: 50px;
      align-items: center;
      .theme-change {
        .el-switch__label.is-active {
          color: #fff;
        }
      }
    }
    .avatar-container {
      .avatar-wrapper {
        margin-right: 30px;
        color: #fff;
        cursor: pointer;
        // margin-top: 5px;
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;
        .user-avatar {
          width: 30px;
          height: 30px;
          margin-left: 10px;
          border-radius: 50%;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
}
</style>
