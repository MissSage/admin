<!-- 企业详情 -->
<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>企业详情</span>
      </div>
    </template>
    <div class="introduce">
      <el-row :gutter="10">
        <!-- 文本介绍 -->
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
          <div class="tenantInfoBox">
            <h1 class="tenantName infoText">{{ enterprise.enterprisevalue.name }}</h1>
            <div class="textBox">
              <label>平台名称：</label>
              <p class="infoText">{{ enterprise.additionalInfo.platformName || '' }}</p>
            </div>
            <div class="textBox">
              <label>企业地址：</label>
              <p class="infoText">{{ enterprise.enterprisevalue.address }}</p>
            </div>
            <div class="textBox">
              <label>创建时间：</label>
              <p class="infoText">{{ time }}</p>
            </div>
            <div class="textBox">
              <label>企业简介：</label>
              <p class="infoText bottom">{{ enterprise.additionalInfo.companyProfiles || '' }}</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
        <!-- 地图 -->
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
          <div class="messageContainer">
            <div class="amap-container">
              <div id="innerAmap" style="height: 100%; width: 100%"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="apps">
      <div class="manage-title">
        <span>应用管理</span>
      </div>
      <div class="manage">
        <div class="cs">
          <div class="cards">
            <el-row :gutter="30">
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <!-- 添加应用 -->
                <div class="cardinput" @click="appoperate.addApp">
                  <div class="icon">
                    <img src="../img/input.png" />
                  </div>
                  <div class="text">添加应用</div>
                </div>
              </el-col>
              <el-col
                v-for="item in apps.items"
                :key="item.id"
                :xs="6"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6"
              >
                <div class="card">
                  <div class="title">
                    <span class="title-text">{{ item.name }}</span>
                    <div class="title-buttom">
                      <el-dropdown trigger="click">
                        <span class="el-dropdown-link css">
                          <img src="../img/icon.png" />
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item @click="appoperate.editApp(item)"
                              >编辑</el-dropdown-item
                            >
                            <el-dropdown-item @click="appoperate.deleteApp(item)"
                              >删除</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                  <div class="introduce">
                    <span>{{ item.remark }}</span>
                  </div>
                  <div class="application-icon">
                    <span>应用图标：</span>
                    <div class="icon">
                      <img :src="item.img" />
                    </div>
                  </div>
                  <div class="type">
                    <span>应用类型：{{ item.type === '1' ? '基本类型' : '其他类型' }}</span>
                  </div>
                  <div class="update-time">
                    <span>更新时间：{{ apps.time(item.createTime) }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <configsialog :config="configs"></configsialog>
  </el-card>
</template>

<script lang="ts">
import useAmap from '@/hooks/amap'
import configsialog from './add.vue'
import { defineComponent, onMounted, reactive, ref, watch, computed } from 'vue'
import { dialogrule } from '../index'
import moment from 'moment'
import { getapplications, deleteapplications } from '@/api/portal'
import { removeSlash } from '@/utils/removeIdSlash'

import useGlobal from '@/hooks/global/useGlobal'
const { $messageInfo, $confirm } = useGlobal()

export default defineComponent({
  name: '企业详情',
  components: {
    configsialog
  },
  props: {
    config: {
      type: Object as any,
      default() {
        return {}
      }
    }
  },

  setup(props: any) {
    const enterprise = reactive({
      enterprisevalue: computed(() => props.config.value),
      additionalInfo: computed(() => {
        const avalue = props.config.value.additionalInfo
        if (avalue) {
          if (typeof avalue == 'object') {
            return avalue
          } else {
            return JSON.parse(avalue)
          }
        } else {
          return [{ platformName: '', companyProfiles: '' }]
        }
      })
    })

    const time = computed(() =>
      moment(props.config.value.createdTime).format('YYYY-MM-DD HH:mm:ss')
    )

    const configs = ref<dialogrule>({
      visible: false,
      title: '添加应用',
      type: true,
      close: () => {
        configs.value.visible = false
        getapplication()
      },
      value: computed(() => props.config.value),
      appform: {}
    })

    interface appoperate {
      addApp: () => void
      editApp: (item: any) => void
      deleteApp: (item: any) => void
    }
    const appoperate = reactive<appoperate>({
      addApp: () => {
        configs.value.title = '添加应用'
        configs.value.type = true
        configs.value.appform = {
          id: null,
          name: '',
          type: '1',
          applicationUrl: '',
          orderNum: 0,
          remark: '',
          img: '',
          createTime: null,
          menuIdList: null
        }
        configs.value.visible = true
      },
      editApp: (item: any) => {
        configs.value.title = '修改应用'
        configs.value.appform = item
        configs.value.type = false
        configs.value.visible = true
      },

      deleteApp: (item: any) => {
        const msg = `确认要删除该应用吗？`
        $confirm(msg, '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteapplications([item.id]).then(() => {
              $messageInfo('删除成功')
              getapplication()
            })
          })
          .catch(() => {
            //
          })
      }
    })

    interface state {
      dataForm: any
    }
    const state = reactive<state>({
      dataForm: { location: [116, 39] }
    })

    interface apps {
      items: any[]
      time: any
    }
    const apps = reactive<apps>({
      items: [],
      time: (createtime: string) => {
        return moment(createtime).format('YYYY-MM-DD HH:mm:ss')
      }
    })

    onMounted(async () => {
      // 渲染完成之后， 判断是否有location选项 初始化地图
      getmap()
    })

    const getmap = async () => {
      const mapConfig = {
        // 地图要绑定的事件
        events: {
          mapmove: (map: any) => {
            const center = map.getCenter()
            state.dataForm.location = center
          }
        },
        center: state.dataForm.location
      }
      // amap封装，可以自定义修改接口  hooks/amap
      const { setMarker } = await useAmap('innerAmap', mapConfig)

      // 不可删除，用于显示坐标
      setMarker(state.dataForm.location, {
        icon: require('@/assets/icons/map-location.png')
      })

      // 设置监听，经纬度改变  地图中心改变
      watch(
        () => state.dataForm.location,
        () => {
          //
        }
      )
    }

    const getapplication = () => {
      const tenantid = removeSlash(props.config.value.id.id)
      getapplications(tenantid).then(res => {
        apps.items = res.data
      })
    }

    watch(enterprise, () => {
      getapplication()
      state.dataForm.location = [props.config.value.latd, props.config.value.lgtd]
      getmap()
    })

    return {
      configs,
      appoperate,
      enterprise,
      time,
      state,
      apps
    }
  }
})
</script>

<style lang="scss" scoped>
.box-card {
  margin: 22px 0;
  background: #222536;
  width: 100%;
  height: 100%;
  .card-header {
    color: #fff;
  }
}
.app-custom .app-wrapper .main-container .app-main .el-card {
  background: #222536;
}
.introduce {
  height: 40%;
}
.apps {
  height: 60%;
  position: relative;
  .manage-title {
    position: absolute;
    z-index: 100;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 160px;
    height: 40px;
    background: linear-gradient(180deg, #2d5181 0%, #28305b 100%);
    border-radius: 6px;
    border: 1px solid #3f9cec;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .manage ::-webkit-scrollbar {
    display: none;
  }
  .manage {
    width: 100%;
    height: 100%;
    margin-top: 20px;
    overflow: hidden;
    border: 1px solid #1e72ee;
    z-index: -50;

    .cs {
      width: 100%;
      height: 430px;
      padding: 40px 20px 0px;
      overflow: auto;
      .cards {
        .cardinput {
          width: 100%;
          height: 300px;
          background: #202947;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          padding: 60px 1px;
          &:hover {
            box-shadow: 0px 0px 10px 0px rgba(69, 178, 255, 0.3);
            border: 1px solid #45b2ff;
          }
          .icon {
            width: 44px;
            height: 44px;
          }
          .text {
            width: 64px;
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #43acf7;
            line-height: 22px;
          }
        }
        .card {
          flex-grow: 1;
          width: 100%;
          height: 300px;
          background: #2e395a;
          border-radius: 4px;
          margin-bottom: 30px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          &:hover {
            box-shadow: 0px 0px 10px 0px rgba(69, 178, 255, 0.3);
            border: 1px solid #45b2ff;
            padding: 15px;
          }
          &:hover .title .title-buttom {
            display: initial;
            cursor: pointer;
          }
          .title {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title-text {
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #43acf7;
              line-height: 22px;
              display: inline-block;
              .css {
                color: #ffffff;
              }
            }
            .title-buttom {
              display: none;
            }
          }
          .introduce {
            width: 100%;
            height: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #c1c3d9;
              line-height: 20px;
            }
          }
          .application-icon {
            display: flex;
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #c1c3d9;
              line-height: 20px;
            }
            .icon {
              width: 72px;
              height: 72px;
              border: 1px solid #415564;
              padding: 7px;
              img {
                width: 100%;
              }
            }
          }
          .type {
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #c1c3d9;
              line-height: 20px;
            }
          }
          .update-time {
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #c1c3d9;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}

.tenantInfoBox {
  color: #fff;
  .tenantName {
    height: 33px;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 33px;
    margin-bottom: 25px;
  }
  label {
    width: 100px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #d4d4d4;
    line-height: 20px;
  }
  .textBox {
    display: flex;
    margin-bottom: 16px;
    .infoText {
      width: 644px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
    }
    .bottom {
      height: 100px;
    }
  }
}

// 地图
.messageContainer {
  width: 100%;
  height: 90%;
  .tenantName {
    margin: 0;
    height: 32px;
    font-family: PingFangSC-Medium;
    line-height: 32px;
    font-size: 24px;
    color: #cfd2df;
    font-weight: 500;
    margin-bottom: 32px;
  }
  .textBox {
    display: flex;
    margin-top: 22px;
    label {
      font-size: 16px;
      font-weight: 400;
      min-width: 90px;
    }
  }
  .amap-container {
    height: 100%;
    width: 100%;
  }
}
:deep(.el-dropdown-selfdefine) {
  font-size: 24px;
  color: #ffffff;
  display: flex;
  align-items: center;
}
</style>
