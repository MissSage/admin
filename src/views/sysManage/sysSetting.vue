<template>
  <div class="system-settings-container">
    <!-- 总账号下 系统设置 -->
    <div v-if="!currentSYS" class="short-message-config config-box custom-bg-box-shadow1">
      <!-- <p class="config-title">短信配置</p> -->
      <div class="top-title-box unified-theme-bg-color">
        <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>短信配置</p>
        <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
      </div>
      <el-form
        ref="smForm"
        size="small"
        :rules="rules"
        :model="shortMessage"
        label-width="140px"
        class="short-msg-form"
      >
        <el-form-item label="服务提供商" prop="service">
          <el-select v-model="shortMessage.service" placeholder="请选择短信服务提供商">
            <el-option
              v-for="(option, index) of shortMsgService"
              :key="index"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="签名内容" prop="content">
        <el-input v-model="shortMessage.content" placeholder="签名内容"></el-input>
      </el-form-item> -->
        <el-form-item label="设备模板ID" prop="deviceTemplateID">
          <el-input v-model="shortMessage.deviceTemplateID" placeholder="设备模板ID"></el-input>
        </el-form-item>
        <el-form-item label="触发模板ID" prop="occurTemplateID">
          <el-input v-model="shortMessage.occurTemplateID" placeholder="触发模板ID"></el-input>
        </el-form-item>
        <el-form-item label="验证模板ID" prop="captchaKey">
          <el-input v-model="shortMessage.captchaKey" placeholder="验证模板ID"></el-input>
        </el-form-item>
        <el-form-item label="API key" prop="apiKey">
          <el-input
            v-model="shortMessage.apiKey"
            type="password"
            placeholder="请输入API key"
          ></el-input>
        </el-form-item>
        <el-form-item label="发送短信测试至" prop="sendMes">
          <el-input v-model="shortMessage.sendMes" placeholder="" type="text"></el-input>
        </el-form-item>
        <!-- <p class="tips_p">由于云片网机制的原因，请不要反复点击 发送测试短信 按钮，否则会发送失败，建议点击间隔大于1分钟</p> -->
        <el-form-item label="">
          <el-button v-show="show" type="warning" @click="handlesendTestMes"
            >发送测试短信</el-button
          >
          <el-button v-show="!show" type="warning">{{ count }} 秒后重新发送</el-button>
          <el-button type="primary" @click="saveShortMsgConfig">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="currentSYS" class="email-config config-box custom-bg-box-shadow1">
      <div class="top-title-box unified-theme-bg-color">
        <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>邮箱配置</p>
        <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="getEmailInfo">刷新</el-button> -->
      </div>
      <!-- <p class="config-title">邮箱配置</p> -->
      <div class="email-config-form">
        <el-form ref="form" :model="settings.settingItems" label-width="140px">
          <el-form-item
            v-for="(item, index) of settings.settingItems"
            :key="index"
            :label="item.name"
            :rules="settings.settingItems[index].rules"
            :prop="'[' + index + '].value'"
          >
            <el-input v-if="item.type === 'string'" v-model="item.value"></el-input>
            <el-input
              v-if="item.type === 'password'"
              v-model="item.value"
              type="password"
            ></el-input>
            <el-input-number
              v-if="item.type === 'number'"
              v-model="item.value"
              :min="0"
            ></el-input-number>
            <el-switch v-if="item.type === 'bollean'" v-model="item.value"></el-switch>
            <el-select
              v-if="item.type === 'selection'"
              v-model="item.value"
              :placeholder="item.name"
            >
              <el-option
                v-for="(option, idx) of item.options"
                :key="idx"
                :label="option"
                :value="option"
              ></el-option>
            </el-select>
            <span v-if="item.message" class="info-message">{{ item.message }}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="handlesendTestMail">发送测试邮件</el-button>
            <el-button type="primary" @click="handleSaver">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 企业下 系统设置 -->
    <div v-if="!currentSYS" class="enterprise-config config-box custom-bg-box-shadow1">
      <div class="top-title-box unified-theme-bg-color">
        <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>企业配置</p>
        <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
      </div>
      <!-- <p class="config-title">企业配置</p> -->
      <el-form
        ref="eForm"
        :rules="rulesE"
        :model="enterprise"
        label-width="100px"
        class="enterprise-form"
      >
        <!-- <el-form-item label="企业名称" prop="name">
        <el-input v-model="enterprise.name" placeholder="请输入企业名称" style='width:400px'></el-input>
      </el-form-item> -->
        <el-form-item label="LOGO" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :headers="headers"
          >
            <img v-if="enterprise.imageUrl" :src="enterprise.imageUrl" class="avatar" />
            <i v-else :class="imgIcon" class="avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="saveEnterprise">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="enterprise-big-screen-config config-box custom-bg-box-shadow1">
      <div class="top-title-box unified-theme-bg-color">
        <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>大屏配置</p>
      </div>
      <p class="p-title-tips">开启菜单 名称 地址 不可为空 不可重复</p>
      <div class="big-container-data">
        <div v-for="(item, i) in configUrl" :key="i">
          <div class="data-row">
            <span class="data-row-span"><i class="iconfont icon-yemian"></i> 页面{{ i + 1 }}</span>
            <span class="row-label">菜单名称</span>
            <el-input
              v-model="item.name"
              placeholder="请输入名称"
              class="row-name-input"
            ></el-input>
            <span class="row-label">地址</span>
            <el-input v-model="item.url" placeholder="请输入地址" class="row-url-input"></el-input>
            <el-switch
              v-model="item.state"
              active-text="开启"
              inactive-text="关闭"
              inactive-color="#C0CCDA"
              active-color="#409EFF"
            ></el-switch>
          </div>
        </div>
      </div>
      <el-button class="edit-primary-blue" @click="saveBigScreen">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  getAdminSettings,
  saveAdminSettings,
  sendTestMail,
  setMesKey,
  sendMes,
  getSMKey
} from '@/api/admin'
import { getConstantsAttributeById, saveConstants } from '@/api/constants'
import { getTenantInfo, saveTenant } from '@/api/tenant'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()

export default {
  name: 'SystemSettings',
  inject: ['reload'],
  data() {
    const validateText = (rule, value, callback) => {
      if (value.trim() !== '') {
        callback()
      } else {
        callback(new Error('请输入有效字符 空格无效'))
      }
    }
    const validateID = (rule, value, callback) => {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('不能输入汉字'))
      } else {
        return callback()
      }
    }
    return {
      currentSYS: true,
      show: true,
      count: '',
      timer: null,
      tenantId: this.$store.state.user.tenantId,
      shortMessage: {
        service: 'ypw',
        apiKey: 'dc2b77c6e1f351ab1bef55991642ff16',
        occurTemplateID: '3716214', // 暂时写死
        deviceTemplateID: '3715352',
        captchaKey: '3770334',
        sendMes: ''
      },
      shortMsgService: [{ label: '云片网', value: 'ypw' }],
      rules: {
        service: [{ required: true, message: '请选择短信服务提供商', trigger: 'change' }],
        apiKey: [
          { required: true, message: '请输入apiKey', trigger: 'blur' },
          { validator: validateText, trigger: 'blur' }
        ],
        occurTemplateID: [
          { required: true, message: '请输入触发模板ID', trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }
        ],
        deviceTemplateID: [
          { required: true, message: '请输入设备模板ID', trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }
        ],
        captchaKey: [
          { required: true, message: '请输入验证模板ID', trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }
        ]

        // ,
        // content:[
        //   { required: true, message: '请输入签名内容', trigger: 'blur' }
        // ]
      },
      settings: {
        name: '邮箱设置',
        key: 'mail',
        id: '',
        settingItems: {
          mailFrom: {
            type: 'string',
            name: '邮件来自',
            value: '',
            message: '如：smtp.163.com',
            rules: [
              { required: true, message: '请输入用户邮箱', trigger: 'blur' },
              { type: 'email', message: '请输入正确邮箱地址', trigger: 'blur' }
            ]
          },
          smtpProtocol: {
            type: 'selection',
            name: 'SMTP协议',
            value: '',
            options: ['smtp', 'smtps'],
            rules: [{ required: true, message: '请选择SMTP协议', trigger: 'blur' }]
          },
          smtpHost: {
            type: 'string',
            name: 'SMTP网关',
            value: '',
            rules: [
              { required: true, message: '请输入SMTP网关', trigger: 'blur' }
              // { validator: validateSMTP, trigger: 'blur' } // url
            ]
          },
          smtpPort: {
            type: 'number',
            name: 'SMTP端口',
            message: '一般为25或465',
            value: '',
            rules: [{ required: true, message: '请输入SMTP端口', trigger: 'blur' }]
          },
          timeout: {
            type: 'number',
            name: '超时毫秒数',
            value: '',
            rules: [{ required: true, message: '请输入超时毫秒数', trigger: 'blur' }]
          },
          enableTls: {
            type: 'bollean',
            name: '启用TLS',
            value: true
          },
          username: {
            type: 'string',
            name: '用户账号',
            value: '',
            rules: [
              { required: true, message: '请输入用户账号', trigger: 'blur' },
              { type: 'email', message: '账号为邮箱格式', trigger: 'blur' }
            ]
          },
          password: {
            type: 'password',
            name: '密码',
            value: '',
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { max: 20, min: 8, message: '密码在8-20位', trigger: 'blur' }
            ]
          },
          mailTo: {
            type: 'string',
            name: '测试邮件发送至',
            value: '',
            rules: [
              { required: false, message: '请输入接收测试邮件的邮箱', trigger: 'blur' },
              { type: 'email', message: '请输入正确邮箱地址', trigger: 'blur' }
            ]
          }
        }
      },
      // 企业log
      headers: {},
      actionUrl: '',
      imgIcon: 'el-icon-plus',
      enterprise: {
        name: '',
        imageUrl: ''
      },
      tenantInfo: {},
      tenantLogoInfo: {},
      // 大屏
      configUrl: [],
      sysBigScreen: [
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage1' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage2' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage3' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage4' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage5' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'sysPage6' }
      ],
      TenantBigScreen: [
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage1' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage2' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage3' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage4' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage5' },
        { name: '', url: '', routerUrl: '/extendPage/sysPage/', state: false, key: 'tenantPage6' }
      ],
      rulesE: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { validator: validateText, trigger: 'blur' }
        ],
        imageUrl: [{ required: true, message: '请上传企业logo', trigger: 'blur' }]
      }
    }
  },
  created() {
    getSMKey().then(res => {
      this.shortMessage.apiKey = res.data.smsAppKey
      this.shortMessage.occurTemplateID = res.data.smsModelKey
      this.shortMessage.deviceTemplateID = res.data.smsDeviceKey
      this.shortMessage.captchaKey = res.data.captchaKey
    })
    this.currentSYS = this.$store.state.user.roles[0] === 'SYS_ADMIN'
    if (!this.currentSYS) {
      this.actionUrl = this.$store.state.app.actionUrl + '/file/api/upload/image'
      this.headers['X-Authorization'] = 'Bearer ' + this.$store.getters.token
      this.imgIcon = 'el-icon-plus'
      // getLogo().then(res => {
      //   this.enterprise.imageUrl = res.data
      //   this.imgIcon = 'el-icon-edit'
      // })
      getTenantInfo(this.$store.state.user.tenantId).then(res => {
        this.tenantInfo = res.data
        this.tenantLogoInfo =
          this.tenantInfo.additionalInfo && this.tenantInfo.additionalInfo.logoUrl
            ? this.tenantInfo.additionalInfo
            : { logoUrl: '' }
        if (this.tenantInfo.additionalInfo) {
          this.imgIcon = 'el-icon-edit'
          this.enterprise.imageUrl = this.tenantInfo.additionalInfo.logoUrl
        }
      })
      // 大屏
      this.configUrl = this.TenantBigScreen
    } else {
      this.configUrl = this.sysBigScreen
      this.getEmailInfo()
    }
    this.getBigScreen()
    // this.enterprise.imageUrl
  },
  methods: {
    // 短信配置保存
    saveShortMsgConfig() {
      this.$refs['smForm'].validate(valid => {
        if (valid) {
          console.log('---通过验证')
          const params = {
            smsAppKey: this.shortMessage.apiKey,
            smsDeviceKey: this.shortMessage.deviceTemplateID,
            smsModelKey: this.shortMessage.occurTemplateID,
            captchaKey: this.shortMessage.captchaKey
          }
          setMesKey(params).then(res => {
            if (res.data.captchaKey) {
              $message({
                type: 'success',
                message: '保存成功'
              })
            }
          })
        } else {
          $message({
            type: 'warning',
            message: '请按提示输入'
          })
          return false
        }
      })
    },
    handlesendTestMes() {
      // 发送测试短信
      const params = this.shortMessage.sendMes
      const reg = /^1\d{10}$/ //      /^1[34578]\d{9}$/
      if (!reg.test(params)) {
        $message({
          type: 'warning',
          message: '请输入正确的手机号格式'
        })
        return
      } else {
        const TIME_COUNT = 60
        if (!this.timer) {
          this.sendTest(params)
          this.count = TIME_COUNT
          this.show = false
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      }
    },
    sendTest(params) {
      sendMes(params)
        .then(res => {
          if (res.data) {
            $message({
              type: 'success',
              message: '发送成功'
            })
          } else {
            $message({
              type: 'warning',
              message: '发送短信失败，请检查配置信息是否正确'
            })
          }
        })
        .catch(err => {
          console.log(err)
          $message.error('发送失败，请检查输入的电话号码是否存在！')
        })
    },
    // 企业配置
    saveEnterprise() {
      this.$refs.eForm.validate(valid => {
        if (valid) {
          this.tenantLogoInfo.logoUrl = this.enterprise.imageUrl
          this.tenantInfo.additionalInfo = this.tenantLogoInfo
          console.log(this.tenantInfo, '---通过验证')
          saveTenant(this.tenantInfo)
            .then(res => {
              $message({
                message: '修改成功',
                type: 'success'
              })
              this.$store.dispatch('app/ToggleLogo', res.data.additionalInfo.logoUrl)
              // return getLogo()
              // this.reload()
            })
            // .then(logRes => {
            //   this.$store.dispatch('app/ToggleLogo', logRes.data)
            // })
            .catch(err => console.log(err))
        } else {
          $message({
            type: 'warning',
            message: '请按提示输入'
          })
          return false
        }
      })
    },
    // 保存 邮件等配置
    handleSaver() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {}
          params.id = {}
          params.id.id = this.settings.id
          params.key = this.settings.key
          params.jsonValue = {}
          for (const item in this.settings.settingItems) {
            const value = this.settings.settingItems[item].value
            params.jsonValue[item] = value.toString()
          }
          saveAdminSettings(params)
            .then(res => {
              console.log(res)
              $message({
                message: '保存成功',
                type: 'success'
              })
            })
            .catch(err => {
              $message.error('保存失败，用户账号或密码不匹配')
              console.log(err)
            })
        } else {
          $message.error('请填写符合要求的信息')
          return false
        }
      })
    },
    // 发送测试邮件
    handlesendTestMail() {
      console.log('send test e-mail')
      if (!this.settings.settingItems.mailTo.value) {
        $message.error('请填写接收测试邮件的邮箱地址')
        return
      }
      const params = {}
      params.id = {}
      params.id.id = this.settings.id
      params.key = this.settings.key
      params.jsonValue = {}
      for (const item in this.settings.settingItems) {
        const value = this.settings.settingItems[item].value
        params.jsonValue[item] = value.toString()
      }
      sendTestMail(params)
        .then(res => {
          console.log(res)
          $message({
            message: '操作成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          $message.error('发送失败，请检查输入的账号和密码或接收测试邮件的邮箱是否存在！')
        })
    },
    beforeAvatarUpload(file) {
      let isImg = true
      const isLt2M = file.size / 1024 / 1024 < 1

      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp' ||
        file.type === 'image/x-bmp'
      ) {
        isImg = true
      } else {
        isImg = false
        $message.error('上传logo图片只能是 JPG,JPEG,PNG,BMP 格式!')
      }
      if (!isLt2M) {
        $message.error('上传logo图片大小不能超过 1MB!')
      }
      return isImg && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.enterprise.imageUrl = res
      $message.success('图片已上传 请保存操作')
      console.log(res, file, '图片上传')
      // setTimeout(this.refresh(), 3000)
      // setTimeout(() => {
      //   this.reload()
      // }, 1000)
    },
    // 保存大屏配置
    saveBigScreen() {
      console.log(this.configUrl, '----s url')
      const data = {}
      const newRouter = []
      const nameText = {} // []
      const urlList = {} // []
      for (const item of this.configUrl) {
        if (item.state) {
          if (item.name === '' || item.url === '') {
            $message('开启的菜单 名称 地址 不可为空')
            return
          }
          nameText[item.name] = item.key
          urlList[item.url] = item.key
        }
      }

      for (const [i, item] of this.configUrl.entries()) {
        // 验证开启的菜单
        if (item.state) {
          // if (urlList.includes(item.url) || nameText.includes(item.name)) {
          if (
            (urlList[item.url] && urlList[item.url] !== item.key) ||
            (nameText[item.name] && nameText[item.name] !== item.key)
          ) {
            console.log(item, nameText, urlList, 'item')
            $message('开启的菜单 名称 地址 不可重复')
            return
          }
          const reg = new RegExp('^[0-9a-zA-Z\u4e00-\u9fa5]{1,8}$')
          if (!reg.test(item.name)) {
            $message('菜单名称应在1到8个字符')
            return
          }
          const valid =
            /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?/g
          console.log(this.IsURL(item.url), '---url')
          if (valid.test(item.url)) {
            // if (this.IsURL(item.url)) {
            const info = {
              name: item.name,
              state: item.state
            }
            // 双加密
            const path = encodeURIComponent(item.url)
            info.url = item.routerUrl + btoa(path)
            data[item.key] = info
            const router = {
              path: info.url,
              name: item.key,
              component: () => import('@/views/extendPage/sysPage'),
              meta: { title: item.name, icon: 'icon-daping' }
            }
            newRouter.push(router)
          } else {
            const index = i + 1
            const text = '开启的 页面' + index + ' url地址格式不正确'
            $message(text)
            return
          }
        } else {
          const info = {
            name: item.name,
            state: item.state,
            url: item.url
          }
          data[item.key] = info
        }
      }
      const params = {
        type: this.currentSYS ? 'sysBigScreen' : 'tenantBigScreen',
        key: this.currentSYS ? 'sys_admin' : this.tenantId,
        value: JSON.stringify(data)
      }
      saveConstants([params]).then(() => {
        const routerInfo = {
          router: newRouter,
          currentSYS: this.currentSYS
        }
        this.$store.dispatch('setBigScreen', routerInfo)
        $message({
          message: '保存成功 稍后生效',
          type: 'success'
        })
        location.reload()
        // setTimeout(() => {
        //   this.reload()
        // }, 600)
        console.log(newRouter, '----newRouter')
      })
    },
    refreshData() {
      //
    },
    // 获取邮件配置等
    getEmailInfo() {
      getAdminSettings(this.settings.key).then(res => {
        this.settings.id = res.data.id.id
        let jsonValue = res.data.jsonValue
        jsonValue = JSON.parse(JSON.stringify(jsonValue), (k, v) =>
          v === 'true' ? true : v === 'false' ? false : v
        )
        for (const item in jsonValue) {
          this.settings.settingItems[item].value = jsonValue[item]
        }
      })
    },
    getBigScreen() {
      const BigScreen = this.currentSYS ? this.sysBigScreen : this.TenantBigScreen
      const params = {
        type: this.currentSYS ? 'sysBigScreen' : 'tenantBigScreen',
        key: this.currentSYS ? 'sys_admin' : this.tenantId
      }
      getConstantsAttributeById(params).then(res => {
        const rData = JSON.parse(res.data[0].value)
        for (const item of BigScreen) {
          const info = rData[item.key]
          item.name = info.name
          item.state = info.state
          if (info.state) {
            // 双解码
            const url = info.url.split('/extendPage/sysPage/')[1]
            item.url = decodeURIComponent(atob(url))
          } else {
            item.url = info.url
          }
        }
        this.configUrl = BigScreen
        console.log(BigScreen)
      })
    },
    IsURL(str_url) {
      const strRegex =
        '^((https|http|ftp|rtsp|mms)?://)' +
        "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
        '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
        '|' + // 允许IP和DOMAIN（域名
        "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
        '[a-z]{2,6})' + // first level domain- .com or .museum
        '(:[0-9]{1,4})?' + // 端口- :80
        '((/?)|' + // a slash isn't required if there is no file name
        "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
      const re = new RegExp(strRegex)
      // re.test()
      if (re.test(str_url)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.system-settings-container {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  background: #131624;
  .config-box {
    background-color: #222536;
    box-shadow: 0 0 5px rgb(85, 84, 84);
    &.short-message-config {
      // margin: 0 auto;
      margin-bottom: 20px;
      .short-msg-form {
        max-width: 600px;
        margin-left: 25px;
        padding: 15px 0 1px 0;
      }
      .tips_p {
        font-size: 12px;
        margin-left: 10px;
        color: #0bbc07;
      }
    }
    &.email-config {
      height: 860px;
      margin: 0 auto 15px auto;
      .email-config-form {
        height: calc(100% - 50px);
        padding: 10px 15px;
        max-width: 600px;
        .info-message {
          margin-left: 10px;
          color: #8d8d8d;
        }
      }
    }
    &.enterprise-config {
      height: 280px;
      margin-bottom: 20px;
      .enterprise-form {
        padding-top: 15px;
        .avatar-uploader {
          width: 180px;
          height: 52px;
          border-radius: 6px;
          border: 1px dashed #dd7323;
          &:hover {
            border-color: #409eff;
          }
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 50px;
          line-height: 50px;
          text-align: center;
        }
        .avatar {
          width: 178px;
          height: 50px;
          display: block;
        }
      }
    }
    &.enterprise-big-screen-config {
      height: 560px;
      overflow: hidden;
      .p-title-tips {
        color: rgb(36, 148, 74);
        font-size: 14px;
        margin-left: 40px;
      }
      .big-container-data {
        height: 400px;
        margin-left: 40px;
        overflow-y: auto;
        .data-row {
          width: 100%;
          height: 62px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .row-label {
            margin: 0 10px 0 50px;
            color: #e7e7e7;
          }
          .row-name-input {
            width: 160px;
          }
          .row-url-input {
            width: 500px;
            margin-right: 50px;
          }
          .data-row-span {
            font-weight: 400;
            color: #e7e7e7;
            font-size: small;
          }
          .el-row {
            margin-left: 20px;
            .el-col {
              padding-top: 20px;
            }
          }
        }
        .icon-yemian {
          color: #2882c6;
        }
      }
      button {
        margin-left: 40px;
      }
    }
    :deep(.el-form-item) {
      margin-bottom: 18px;
      .el-form-item__label {
        line-height: 32px;
      }
    }
  }
}
</style>
