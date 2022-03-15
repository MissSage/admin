<template>
  <div class="bg">
    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <!-- LOGO -->
        <div class="left">
          <div class="logo">
            <img :src="store.state.app.logo" alt="" />
          </div>
          <div class="title">{{ apptitle.name }}</div>
        </div>
        <div class="right">
          <!-- 头像 -->
          <el-avatar :size="45" src="https://empty">
            <img class="user-avatar" :src="userLogo" />
          </el-avatar>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ store.state.user.name }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
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
      </el-header>
      <!-- 内容主体 -->
      <el-main>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
          <!-- title -->
          <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
            <div class="content-left">
              <div class="content-left-top">
                <span>WELCOME!</span>
                <span>欢迎使用{{ apptitle.name }}</span>
              </div>
              <div class="content-left-bottom">
                你好，{{ store.state.user.firstName }}，开始您一天的工作吧！
              </div>
            </div>
          </el-col>
          <!-- 时间 -->
          <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" class="while">
            <div class="content-right">
              <span class="content-right-top">当前时间</span>
              <div class="content-right-bottom">
                <div class="date year">
                  <div v-for="i in time.year" :key="i">
                    <span>{{ i }}</span>
                  </div>
                  <span>年</span>
                </div>
                <div class="date mothen">
                  <div v-for="i in time.month" :key="i">
                    <span>{{ i }}</span>
                  </div>
                  <span>月</span>
                </div>
                <div class="date day">
                  <div v-for="i in time.day" :key="i">
                    <span>{{ i }}</span>
                  </div>
                  <span>日</span>
                </div>
                <div class="date">
                  <div class="time">
                    <span>{{ time.nowtime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
          <!-- 菜单大卡片 -->
          <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
            <el-card class="bigcard" shadow="always" @click="apps.Jump(apps.applist[0])">
              <div v-if="apps.applist[0]" class="card-content">
                <div class="img">
                  <img :src="apps.applist[0].img" />
                </div>
                <div class="card-title">{{ apps.applist[0].name }}</div>
              </div>
            </el-card>
          </el-col>
          <!-- 菜单小卡片 -->
          <el-col class="cards" :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
            <template v-for="(item, index) in apps.applist">
              <el-card
                v-if="index >= 1 && index < 7"
                :key="index"
                class="card"
                shadow="always"
                @click="apps.Jump(item)"
              >
                <div class="card-content">
                  <div class="img">
                    <img :src="item.img" />
                  </div>
                  <div class="card-title">{{ item.name }}</div>
                </div>
              </el-card>
            </template>
          </el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
          <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
          <!-- 更多菜单 -->
          <el-col class="othercards" :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
            <template v-for="(item, index) in apps.applist">
              <el-card
                v-if="index >= 7"
                :key="index"
                class="card"
                shadow="always"
                @click="apps.Jump(item)"
              >
                <div class="card-content">
                  <div class="img">
                    <img :src="item.img" />
                  </div>
                  <div class="card-title">{{ item.name }}</div>
                </div>
              </el-card>
            </template>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { getapplications } from '@/api/portal/'
import { useRouter } from 'vue-router'
import userLogo from '@/assets/icons/user-log.png'
import moment from 'moment'
import Cookies from 'js-cookie'
import { getrouting } from '@/api/portal'
import { removeSlash } from '@/utils/removeIdSlash'
import Layout from '@/views/layout/frame/Layout.vue' // Layout
import { getYinShouLoginParams } from '@/api/login'
import { getTenantInfo } from '@/api/tenant'
import useGlobal from '@/hooks/global/useGlobal'
import { IApps, ITime } from '.'
export default defineComponent({
  name: 'Portal',
  setup() {
    const router = useRouter()
    const date: any = ref(moment().format())
    const store = useStore()
    const { $message } = useGlobal()
    const _import = file => {
      return () => {
        return import('@/views/' + file + '.vue')
      }
    }

    const time = reactive<ITime>({
      year: computed(() => date.value.slice(0, 4)),
      month: computed(() => date.value.slice(5, 7)),
      day: computed(() => date.value.slice(8, 10)),
      nowtime: moment().format('HH:mm:ss').slice(0, 8)
    })

    const getUrlPramByName = (url: string, key: string): NormalOption | null => {
      if (url && url.indexOf('?') != -1) {
        const params = url.split('?')[1].split('&')
        const result: NormalOption = {
          label: '',
          value: ''
        }
        const filterdres = params.filter(item => item.indexOf('=') != -1 && item.indexOf(key) != -1)
        if (filterdres.length > 0) {
          result.label = key
          result.value = decodeURI(filterdres[0].split('=')[1])
          return result
        } else {
          return null
        }
      }
      return null
    }
    const apps = reactive<IApps>({
      applist: [],
      length: 0,
      getapplist: async () => {
        const tenantId = removeSlash(Cookies.get('tenantId') || '')
        let res = await getapplications(tenantId)
        
        if (res.status === 200) {
          apps.applist = res.data
          apps.length = apps.applist.length
          if (apps.applist.length === 1) {
            apps.Jump(apps.applist[0])
          }
        }
      },
      Jump: async (res: any) => {
        //跳转
        if (res.applicationUrl != '') {
          const param: NormalOption | null = getUrlPramByName(res.applicationUrl, 'type')
          if (param && param.value == 'yingshou') {
            const ysres = await getYinShouLoginParams()
            const appurl =
              res.applicationUrl.split('?')[0] +
              '?username=' +
              ysres.data.username +
              '&password=' +
              ysres.data.password
            window.open(appurl)
          } else {
            window.open(res.applicationUrl)
          }
        } else {
          Cookies.set('appid', res.id)
          Cookies.set('appname', res.name)
          getrouting(res.id).then(res => {
            const getrouter = apps.filterAsyncRouter(res.data)
            if (!getrouter[0]) {
              $message.warning('该应用没有可访问权限')
              return
            }
            let param = getrouter[0].path + ('/' + getrouter[0].children[0].path) || ''
            router.push(param)
          })
        }
      },
      filterAsyncRouter: extendRouterMap => {
        // 遍历后台传来的路由字符串，转换为组件对象
        const extendRouters = extendRouterMap.filter(route => {
          if (route.component) {
            if (route.component === 'Layout') {
              // Layout组件特殊处理
              route.component = Layout
            } else {
              route.component = _import(route.component)
            }
          }
          route.label = route.meta.title
          if (route.children && route.children.length > 0) {
            route.alwaysShow = true
            route.children = apps.filterAsyncRouter(route.children)
          }
          if (!route.label) {
            route.alwaysShow = false
          }
          return true
        })
        return extendRouters
      }
    })

    // 退出
    function logout() {
      store.dispatch('app/RealTimeMonitor', [])
      store.dispatch('app/HistoryTimeMonitor', {})
      store.dispatch('user/LogOut').then(() => {
        const pSSign = {
          returnSys: true
        }
        store.dispatch('user/SetUserProject', { pData: null, isSet: false })
        store.dispatch('app/ToggleSysSign', pSSign)
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }

    onBeforeMount(() => {
      setInterval(() => {
        date.value = moment().format()
        time.nowtime = moment().format('HH:mm:ss').slice(0, 8)
      }, 1000)
      apps.getapplist()
      apptitle.getTenants()
    })

    const apptitle = reactive({
      name: '',
      getTenants: () => {
        let tenantid = store.getters.tenant_id
        getTenantInfo(tenantid)
          .then(res => {
            console.log(res)

            if (res.data) {
              apptitle.name = res.data.additionalInfo.apptitle
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    })

    return {
      time,
      apps,
      userLogo,
      logout,
      store,
      apptitle
    }
  }
})
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  background-color: #040f31;
}
.el-container {
  background-image: url('./img/bg.png');
  background-size: cover;
  height: 100%;
}
.el-header {
  height: 80px;
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  line-height: 80px;
  height: 80px;
  background: #041245;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;

    .logo {
      width: 240px;
      font-size: 40px;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #ffffff;
      margin-right: 20px;
      display: flex;
      align-items: center;
      img {
        width: 100%;
        max-height: 50px;
      }
    }
    .title {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #e3e9ff;
    }
  }
  .right {
    display: flex;
    align-items: center;
    height: 80px;
    .el-dropdown-link {
      padding-left: 10px;
      color: #adbefa;
    }
  }
}
.el-main::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.el-main {
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 160px;
  height: 100%;
  overflow: auto;
  .content-left {
    height: 150px;
    margin-top: 40px;
    .content-left-top {
      display: flex;
      font-size: 32px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9da4b8;
      line-height: 45px;
      span {
        margin-right: 16px;
      }
    }
    .content-left-bottom {
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9da4b8;
      line-height: 33px;
      margin-top: 18px;
      display: flex;
    }
  }
  .content-right {
    width: 600px;
    height: 160px;
    display: flex;
    margin-top: 40px;
    flex-direction: column;
    align-items: flex-start;

    .content-right-top {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5ccde5;
      line-height: 22px;
    }
    .content-right-bottom {
      width: 100%;
      margin-top: 20px;
      display: flex;
      .date {
        display: flex;
        div {
          width: 36px;
          height: 64px;
          background: rgba(41, 180, 232, 0.2);
          border: 1px solid #4bafc8;
          margin-right: 8px;
          span {
            position: relative;
            top: -40px;
            width: 20px;
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #29e8dc;
            line-height: 45px;
          }
        }
        span {
          position: relative;
          top: 45px;
          left: 3px;
          width: 16px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5ccde5;
          line-height: 22px;
          margin-right: 8px;
        }
        .time {
          width: 160px;
        }
      }
    }
  }
  .while {
    display: flex;
    justify-content: flex-end;
  }
  .bigcard,
  .card {
    cursor: pointer;
  }
  .bigcard {
    height: 600px;
    background: linear-gradient(180deg, #4bdde0 0%, #1b4aa8 100%);
    box-shadow: 2px 2px 10px 0px rgba(34, 93, 176, 0.4);
    border-radius: 8px;
    margin-bottom: 35px;
    .card-content {
      width: 100%;
      height: 520px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      .img {
        width: 120px;
        height: 120px;
        // border: 2px solid #76eeff;
        img {
          width: 96px;
          height: 96px;
          margin: 12px;
        }
      }
      .card-title {
        width: 100%;
        height: 33px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 33px;
      }
    }
  }
  .cards {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .card {
      width: 365px;
      max-width: 365px;
      flex-grow: 1;
      margin-left: 20px;
      height: 280px;
      margin-bottom: 35px;
      background: linear-gradient(180deg, #4bdde0 0%, #1b4aa8 100%);
      box-shadow: 2px 2px 10px 0px rgba(34, 93, 176, 0.4);
      border-radius: 8px;
      .card-content {
        width: 100%;
        height: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .img {
          width: 120px;
          height: 120px;
          // border: 2px solid #76eeff;
          img {
            width: 96px;
            height: 96px;
            margin: 12px;
          }
        }
        .card-title {
          width: 100%;
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 33px;
        }
      }
    }
  }
  .othercards {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .card {
      width: 370px;
      max-width: 370px;
      flex-grow: 1;
      margin-right: 20px;
      height: 280px;
      margin-bottom: 35px;
      background: linear-gradient(180deg, #4bdde0 0%, #1b4aa8 100%);
      box-shadow: 2px 2px 10px 0px rgba(34, 93, 176, 0.4);
      border-radius: 8px;
      .card-content {
        width: 100%;
        height: 250px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .img {
          width: 120px;
          height: 120px;
          // border: 2px solid #76eeff;
          img {
            width: 96px;
            height: 96px;
            margin: 12px;
          }
        }
        .card-title {
          width: 100%;
          height: 33px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 33px;
        }
      }
    }
  }
  .el-card {
    border: 1px solid #232322;
  }
}
</style>
