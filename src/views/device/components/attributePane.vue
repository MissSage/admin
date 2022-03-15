<template>
  <div class="attribute-pane-container">
    <div class="info-show-box img-box">
      <!-- <img :src="imgUrl"  class="info-image" alt=""> -->
      <img :src="hostInfo.imageUrl" alt="" class="info-image" />
    </div>
    <div class="info-show-box i-s-box2" :class="{ showmargin: currentHost.showTwo }">
      <!-- <el-form :model="hostInfo" size="mini" label-width="70px">
        <el-form-item label="网关名称">
          <p class="h-d-value">{{hostInfo.name}}</p>
        </el-form-item>
        <el-form-item label="创建时间">
          <p class="h-d-value">{{hostInfo.createdTime}}</p>
        </el-form-item>
        <el-form-item label="网关秘钥">
          <p class="h-d-value">{{hostInfo.credentialsId}}</p>
        </el-form-item>
        <el-form-item label="网关简介">
          <p class="h-d-value">{{hostInfo.introduction}}</p>
        </el-form-item>
      </el-form> -->
      <div class="info-row-box">
        <p class="info-item">
          <span class="info-label">网关名称：</span>
          <span class="info-value">{{ hostInfo.name }}</span>
        </p>
      </div>
      <p class="info-item">
        <span class="info-label">创建时间：</span>
        <span class="info-value">{{ hostInfo.createdTime }}</span>
      </p>
      <!-- <p class="info-item info-item2"><span class="info-label">网关秘钥：</span> <span class="info-value">{{hostInfo.credentialsId}}</span></p> -->
      <p v-if="showHardware" class="info-item">
        <span class="info-label">硬件ID：</span>
        <span class="info-value">{{ hostInfo.hardwareId }}</span>
      </p>
      <p class="info-item">
        <span class="info-label">网关串号：</span>
        <span class="info-value">{{ hostInfo.foreignKey }}</span>
      </p>
      <!-- <p class="info-item"><span class="info-label">掉线判断：</span> <span class="info-value">{{timeMap[hostInfo.dropJudgement]}}</span></p> -->
      <!-- <p class="info-item info-flex"><span class="info-f-label">网关简介： </span> <span class="span-des">{{hostInfo.introduction}}</span></p> -->
    </div>
    <!-- <div class="info-map-box map-box">
      <Amap :amap-config="amapConfig" />
    </div> -->
    <div class="info-map-box">
      <!-- <div class="i-m-item" v-if='!currentHost.showTwo'>
        <span>详情链接</span>
        <el-select size="mini" v-model="hostInfo.detailUrl" collapse-tags multiple placeholder="详情链接" disabled style="width: calc(100% - 69px); overflow : hidden; text-overflow : ellipsis; white-space : nowrap;">
          <el-option v-for="item in currentHost.scadaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div> -->
      <div class="map-box" :class="{ showImg: currentHost.showTwo }">
        <div id="detailAmap" style="height: 100%; width: 100%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import noImg from '@/assets/other/no-image.jpg'
import moment from 'moment'
import { defineComponent, computed, onMounted } from 'vue'
import useAmap from '@/hooks/amap'

export default defineComponent({
  name: 'AttributePane',
  // eslint-disable-next-line vue/require-prop-types
  props: ['currentProject', 'currentHost', 'showHardware'],
  setup(props) {
    const hostInfo = computed(() => {
      const info = {
        name: props.currentHost.name,
        createdTime: moment(props.currentHost.createdTime).format('YYYY-MM-DD HH:mm:ss'),
        imageUrl: props.currentHost.imageUrl !== '' ? props.currentHost.imageUrl : noImg,
        credentialsId: props.currentHost.credentialsId,
        introduction: props.currentHost.introduction,
        dropJudgement: props.currentHost.dropJudgement,
        hardwareId: props.currentHost.hardwareId,
        detailUrl: props.currentHost.detailUrl,
        foreignKey: props.currentHost.foreignKey
      }
      return info
    })

    onMounted(async () => {
      const { setMarker } = await useAmap('detailAmap', {})
      setMarker(props.currentHost.location || [116.4, 39.91], {
        icon: require('@/assets/icons/map-location.png')
      })
    })

    return {
      hostInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.attribute-pane-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .info-show-box {
    width: 36%;
    height: 101%;
    padding-right: 8px;
    padding-bottom: 8px;
    overflow-y: auto;
    .h-d-label {
      margin: 15px 0 10px 0;
      padding: 7px 10px;
      border-radius: 5px;
      background-color: aliceblue;
    }
    .top-label {
      margin: 0 0 10px 0;
    }
    .host-attribute-box {
      width: 100%;
      display: flex;
      padding: 5px 0;
      text-align: center;
      align-items: center;
      justify-content: space-between;
      .h-a-label {
        width: 100px;
        margin: 0 0;
      }
      .h-a-input {
        width: calc(100% - 100px);
      }
    }
  }
  .img-box {
    display: flex;
    justify-content: center;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .showmargin {
    margin-top: 0px;
  }
  .i-s-box2 {
    margin-left: 10px;
    padding-left: 5px;
    p {
      margin: 0 0;
    }
    .info-item {
      margin: 0 0 10px 0;
      font-weight: 400;
      color: rgba(148, 148, 148, 1);
      line-height: 20px;
      // width:420px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .info-value {
        font-size: small;
        color: #0094bf;
      }
    }
    .info-flex {
      display: flex;
      width: 100%;
      // height:80px;
      .info-f-label {
        width: 85px;
      }
      .span-des {
        width: calc(100% - 85px);
        font-size: small;
        min-height: 117px;
        word-break: break-all;
        color: #5d91a1;
        overflow-y: auto;
        line-height: 25px;
      }
    }
    .info-item2 {
      margin-left: 10px;
    }
    .info-row-box {
      display: flex;
    }
    .scada-select {
      width: 100%;
    }
    .h-d-save-box {
      text-align: center;
      margin: 10px 0;
      .h-d-save-btn {
        width: 40%;
        letter-spacing: 3px;
      }
    }
  }
  .info-map-box {
    width: 54%;
    margin-left: 10px;
    height: 100%;
    .i-m-item {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .i-item-tag {
      margin-right: 8px;
    }
    .map-box {
      height: calc(100% - 40px);
      width: 100%;
    }
    .showImg {
      margin-top: 30px;
    }
  }
}
</style>
