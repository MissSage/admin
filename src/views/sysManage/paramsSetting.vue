<template>
  <!-- 命令库管理 -->
  <div class="tree-right-detail-box">
    <div class="paramsSetting">
      <h1>参数配置</h1>
      <div class="formContainer">
        <el-form label-position="top" :model="dataForm">
          <el-form-item label="app版本号">
            <div class="appVersion">
              <div class="versionText">{{ dataForm.appVersion }}</div>
              <div class="selectBtn" @click="uploadAppVersion">上传APP</div>
            </div>
          </el-form-item>
          <el-form-item label="app服务器地址">
            <el-input v-model="dataForm.appServe"></el-input>
          </el-form-item>
          <el-form-item label="app强制升级">
            <el-input v-model="dataForm.appUpdate"></el-input>
          </el-form-item>
          <el-form-item label="app升级说明">
            <el-input v-model="dataForm.appIntro"></el-input>
          </el-form-item>
          <el-form-item label="app下载地址">
            <el-input v-model="dataForm.appLink"></el-input>
          </el-form-item>
          <el-form-item label="h5服务器地址">
            <el-input v-model="dataForm.h5Serve"></el-input>
          </el-form-item>
          <el-form-item label="mqtt服务器端口">
            <el-input v-model="dataForm.mqttPort"></el-input>
          </el-form-item>
          <el-form-item label="mqtt服务器地址">
            <el-input v-model="dataForm.mqttServe"></el-input>
          </el-form-item>
          <el-form-item label="mqtt账号">
            <el-input v-model="dataForm.mqttAccount"></el-input>
          </el-form-item>
          <el-form-item label="mqtt密码">
            <el-input v-model="dataForm.mqttPWD"></el-input>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker
              v-model="dataForm.exprationTime"
              align="right"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="socket服务器地址">
            <el-input v-model="dataForm.socketServe"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="iconfont icon-baocun" @click="saveSetting">保存</el-button>
      </div>
    </div>
    <AddOrUpdateDialog
      v-if="addOrUpdateConfig.visible"
      :config="addOrUpdateConfig"
      @refreshData="getAppVersion"
    />
  </div>
</template>

<script>
import { saveConstants, getConstantsAttributeById } from '@/api/constants'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
export default {
  components: { AddOrUpdateDialog },
  data() {
    return {
      dataForm: {},
      addOrUpdateConfig: {
        visible: false,
        title: '上传APP',
        labelWidth: '130px',
        close: () => {
          this.addOrUpdateConfig.visible = false
        },
        addUrl: 'api/app/version',
        editUrl: 'api/app/version',
        defaultValue: {},
        columns: [
          {
            type: 'input',
            label: '版本名称',
            key: 'versionName',
            rules: [{ required: true, message: '请输入APP版本' }]
          },
          {
            type: 'input',
            label: '版本号',
            key: 'versionCode',
            rules: [{ required: true, message: '请输入APP版本' }]
          },
          {
            type: 'textarea',
            label: '备注',
            key: 'remark'
          },
          {
            type: 'file',
            label: '上传apk',
            key: 'url',
            rules: [{ required: true, message: '请上传apk' }]
          }
        ]
      }
    }
  },
  created() {
    this.getSetting()
  },

  methods: {
    async getSetting() {
      const res = await getConstantsAttributeById({
        type: 'xunjian',
        key: 'xunjian'
      })
      if (res.status === 200) {
        this.dataForm = JSON.parse(res.data[0].value)
      }
    },

    async saveSetting() {
      const params = {
        type: 'xunjian',
        key: 'xunjian',
        value: JSON.stringify(this.dataForm)
      }
      const res = await saveConstants([params])
      if (res.status === 200) {
        $message.success('保存成功')
      }
    },

    uploadAppVersion() {
      this.addOrUpdateConfig.visible = true
    },

    getAppVersion() {
      this.$store.dispatch('app/SetAppVersion')
    }
  }
}
</script>

<style lang="scss" scoped>
.appVersion {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  .versionText {
    border: 1px solid #dcdfe6;
    border-right: none;
    padding: 0 12px;
    flex: 1;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  .selectBtn {
    width: 80px;
    text-align: center;
    padding: 0 12px;
    background-color: #3e8ef7;
    color: #fff;
    cursor: pointer;
  }
}
.paramsSetting {
  margin: 16px 0;
  background-color: #fff;
  overflow-y: auto;
  .formContainer {
    padding: 0 28px 28px;
  }
  h1 {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 25px;
    margin: 12px 12px 16px;
  }
}
</style>

<style lang="scss">
.paramsSetting {
  .iconfont::before {
    margin-right: 8px;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item__label {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .el-form-item {
      margin-bottom: 32px;
      width: 45%;
    }
  }
}
</style>
