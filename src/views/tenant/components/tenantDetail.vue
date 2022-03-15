<template>
  <div class="tenantDetailBox">
    <h1 class="title">企业详情</h1>
    <div class="container">
      <div class="tenantInfoBox">
        <div class="messageContainer">
          <h1 class="tenantName infoText">{{ tenant.title }}</h1>
          <div class="textBox">
            <label>项目地址： </label>
            <p class="infoText">{{ tenant.address }}</p>
          </div>
          <div class="textBox">
            <label>创建时间： </label>
            <p class="infoText">{{ formatTime(tenant.createdTime) }}</p>
          </div>
          <div class="textBox">
            <label>项目简介： </label>
            <p class="infoText">{{ tenant.remark }}</p>
          </div>
          <!-- 22   -->
        </div>
        <div class="messageContainer">
          <div id="tenantAmap" class="amap-container"></div>
        </div>
      </div>
      <div class="deviceInfoBox">
        <div>
          <p class="infoText">设备数</p>
          <p style="color: #3897ff" class="bigNum">24</p>
        </div>
        <div>
          <p class="infoText">运行中</p>
          <p style="color: #4fe8a8" class="bigNum">16</p>
        </div>
        <div>
          <p class="infoText">报警中</p>
          <p style="color: #f02726" class="bigNum">2</p>
        </div>
        <div>
          <p class="infoText">未运行</p>
          <p style="color: #facc26" class="bigNum">6</p>
        </div>
      </div>
      <CardTable style="margin-bottom: 5px" :config="cardTableConfig" />
    </div>
  </div>
</template>

<script>
import CardTable from '@/components/cardTable/index.vue'
import useAmap from '@/hooks/amap'
import moment from 'moment'

export default {
  components: { CardTable },
  // eslint-disable-next-line vue/require-prop-types
  props: ['tenant'],
  data() {
    return {
      amapConfig: {
        viewCenter: [104.06, 30.67],
        zoom: 15
      },
      cardTableConfig: {
        indexVisible: {
          label: '序号',
          width: '100px'
        },
        loading: false,
        dataList: [
          { deviceName: '梅林水厂小无线', devicePosition: '梅林水厂小无线' },
          {
            deviceName: '盆海嘉里小无线',
            devicePosition: '盆海嘉里小无线小无线'
          },
          { deviceName: '测试用虚拟电机', devicePosition: '技术部' },
          {
            deviceName: '防爆结构测试（水厂）',
            devicePosition: '防爆结构测试（水厂）'
          }
        ],
        columns: [
          { prop: 'deviceName', label: '设备名称' },
          { prop: 'devicePosition', label: '设备位号' }
        ]
      }
    }
  },

  created() {
    console.log(this.tenant, 'tenant')
    this.amapConfig.viewCenter = [this.tenant.lgtd, this.tenant.latd]
    // this.amapConfig.markerListAmap[0].position = [this.tenant.lgtd, this.tenant.latd]
  },
  async mounted() {
    const {} = await useAmap('tenantAmap', {})
  },
  methods: {
    formatTime(val) {
      return moment(val).format('YYYY-MM-DD HH:MM:ss')
    }
  }
}
</script>
<style lang="scss" scope>
.tenantDetailBox {
  flex: auto;
  margin: 20px 0 10px;
  // flex: 1;
  .title {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    letter-spacing: 0;
    border-bottom: 1px solid #f4f7faff;
    padding-left: 16px;
    margin: 0;
    font-weight: 400;
  }
  .infoText {
    font-size: 16px;
    color: #333;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    overflow: hidden;
  }
  .container {
    padding: 0 16px;
    .tenantInfoBox {
      margin: 28px 0;
      height: 360px;
      display: flex;
      justify-content: space-between;
      .messageContainer {
        width: 46%;
        .tenantName {
          margin: 0;
          height: 32px;
          font-family: PingFangSC-Medium;
          line-height: 32px;
          font-size: 24px;
          color: #333;
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
    }
    .deviceInfoBox {
      height: 80px;
      background: #f4f7faff;
      display: flex;
      justify-content: space-around;
      margin-block: 28px;
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        text-align: center;
      }
      .bigNum {
        font-family: PingFangSC-Semibold;
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }
    }
  }
}
</style>
