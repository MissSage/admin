<template>
  <div class="scadaBox">
    <img :src="scadaImg" class="imgBox" />
    <h1 class="title">{{ scada.name }}</h1>
    <p class="scadaInfo">创建时间：{{ getTime(scada.createTime) }}</p>
    <p class="scadaInfo">备注：{{ scada.detail }}</p>
    <div class="footer">
      <div class="opreation" @click="set">
        <span>
          <i style="color: #1f7ad5" class="iconfont icon-shezhi1"></i>
          <span class="icon-text">设置</span>
          <i class="break">|</i>
        </span>
      </div>
      <!-- <div @click="copy" class="opreation"><span><i style="color:#22B4DD" class="iconfont icon-icon_fuzhi"></i>复制<i class="break">|</i></span></div> -->
      <div class="opreation" @click="preview">
        <span>
          <i style="color: #11a57c" class="iconfont icon-yulan1"></i>
          <span class="icon-text">预览</span>
          <i class="break">|</i></span
        >
      </div>
      <div class="opreation" @click="del">
        <span><i style="color: #ff5722" class="iconfont icon-shanchu"></i>
        <span class="icon-text">删除</span>
        </span>
      </div>
    </div>
    <div class="editScada">
      <i style="color: #fff" class="iconfont icon-bianji" @click="editScada"></i>
    </div>
  </div>
</template>

<script>
import scadaImg from '@/assets/other/scada-pc.png'
import moment from 'moment'
import useGlobal from '@/hooks/global/useGlobal'
const { $confirm } = useGlobal()
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['scada'],
  data() {
    return { scadaImg, scadaUrl: this.$store.state.app.scadaUrl }
  },

  methods: {
    set() {
      this.$emit('set', this.scada)
    },
    copy() {
      this.$emit('copy', this.scada.id)
    },
    del() {
      // 删除
      $confirm('确定删除该组态, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //   删除方法
          this.$emit('del', this.scada.id)
        })
        .catch(() => {
          //
        })
    },
    preview() {
      // 预览
      const path =
        this.scadaUrl + 'viewer/' + this.scada.id + '?token=' + this.$store.state.user.token
      window.open(path)
    },
    editScada() {
      // 编辑
      const path =
        this.scadaUrl + 'app/editor/' + this.scada.id + '?token=' + this.$store.state.user.token
      console.log(this.$store.state.user.token, this.scada, path)
      window.open(path)
      console.log('编辑 绕登陆才行', this.scada, path)
    },
    getTime(val) {
      return moment(val).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.scadaBox {
  margin-bottom: 26px;
  margin-right: 26px;
  width: 400px;
  height: 300px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #2b2f44;
  color: $text-color;
  position: relative;

  &:hover {
    box-shadow: 0 0 5px #036ced;
    .editScada {
      visibility: visible;
    }
  }
  .editScada {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
    visibility: hidden;
  }
  .imgBox {
    width: 100%;
    height: 168px;
  }
  .title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $text-color;
    line-height: 22px;
    text-align: center;
    margin: 8px 0;
  }
  .scadaInfo {
    padding: 0 12px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $text-color;
    line-height: 20px;
    margin-bottom: 8px;
  }
  .footer {
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    text-align: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    cursor: pointer;
    background: #343953;
    color: $text-color;
    display: flex;
    justify-content: center;
    .opreation {
      position: relative;
      width: 25%;
      .iconfont, .icon-text{
        line-height: 35px;
      }
      .iconfont{
        font-size: 10px;
        &::before{
          font-size: 10px;
        }
      }
      .break {
        position: absolute;
        right: -5px;
        top: -2px;
        font-size: 16px;
        color: $text-color;
        font-style: normal;
      }
    }
  }
}
</style>
