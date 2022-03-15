<template>
  <el-dialog
    v-model="visible"
    :width="dialogWidth || '460px'"
    :title="config.title || ''"
    :lock-scroll="false"
    @close="config.close"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :label-width="config.labelWidth || '120px'"
      label-position="top"
      :model="dataForm"
      class="dialogform addOrUpdateDialog"
    >
      <template v-for="item in config.columns">
        <!-- 数据项（可自定义新增属性，可能需要改typescript） -->
        <el-form-item
          v-if="item.type !== 'none'"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="dataForm[item.key]"
            :disabled="item.disabled"
            :placeholder="'请输入' + item.label"
          >
            <template #suffix>
              <i v-if="item.unit" class="inputUnit" style="margin-right: 10px">{{ item.unit }}</i>
            </template>
          </el-input>
          <!-- 密码输入框 -->
          <el-input
            v-if="item.type === 'password'"
            v-model="dataForm[item.key]"
            type="password"
            :disabled="item.disabled"
            :placeholder="'请输入' + item.label"
          >
          </el-input>
          <!-- 数字输入框 -->
          <el-input-number
            v-if="item.type === 'input-number'"
            v-model="dataForm[item.key]"
            :placeholder="'请输入'"
          >
            <template #suffix>
              <i v-if="item.unit" class="inputUnit" style="margin-right: 10px">{{ item.unit }}</i>
            </template>
          </el-input-number>
          <!-- 输入框 只能输入数字 -->
          <el-input
            v-else-if="item.type === 'number'"
            v-model="dataForm[item.key]"
            :placeholder="item.label"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            style="width: 100%"
          >
            <template #suffix>
              <i v-if="item.unit" class="inputUnit" style="margin-right: 10px">{{ item.unit }}</i>
            </template>
          </el-input>
          <!-- 多行文本框 -->
          <el-input
            v-else-if="item.type === 'textarea'"
            v-model="dataForm[item.key]"
            type="textarea"
            resize="none"
            :rows="item.rows"
            :placeholder="'请输入' + item.label"
          ></el-input>
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="dataForm[item.key]"
            :multiple="item.multiple"
            collapse-tags
            :placeholder="'请选择' + item.label"
            style="width: 100%"
            :filterable="item.search"
            @change="item.handleChange"
          >
            <el-option
              v-for="option of item.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            ></el-option>
          </el-select>
          <!-- 单选框 -->
          <el-radio-group
            v-if="item.type === 'radio'"
            v-model="dataForm[item.key]"
            @change="item.handleChange"
          >
            <el-radio
              v-for="option in item.options"
              :key="option.value"
              style="margin-bottom: 0"
              :label="option.value"
              >{{ option.label }}</el-radio
            >
          </el-radio-group>
          <!-- 日期选择器 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="dataForm[item.key]"
            :type="item.dateType"
            class="date-picker-input"
            range-separator="至"
            start-placeholder="开始日期"
            placeholder="请选择"
            end-placeholder="结束日期"
            style="width: 100%"
          ></el-date-picker>
          <!-- 时间选择器 -->
          <el-time-picker
            v-else-if="item.type === 'time'"
            v-model="dataForm[item.key]"
            :is-range="item.range"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :format="item.format"
            :value-format="item.valFormat"
            placeholder="请选择"
            style="width: 100%"
            @change="item.handleChange"
          >
          </el-time-picker>
          <!-- 联级选择器 -->
          <el-cascader
            v-if="item.type === 'cascader'"
            v-model="dataForm[item.key]"
            :options="item.options"
            clearable
            collapse-tags
            filterable
            style="width: 100%"
            :props="item.props"
            @change="item.handleChange"
          ></el-cascader>
          <!-- 图片上传 -->
          <el-upload
            v-if="item.type === 'image'"
            class="avatar-uploader"
            :action="item.imgActionUrl || imgActionUrl"
            :headers="item.headers || headers"
            :show-file-list="false"
            :on-success="(res, file) => handleUploadSuccess(res, file, item.key)"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="dataForm[item.key]" :src="dataForm[item.key]" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- 文件上传 -->
          <div v-if="item.type === 'file'" class="fileUpload">
            <el-upload
              class="upload-demo"
              :action="item.fileActionUrl || fileActionUrl"
              :headers="item.headers || headers"
              :show-file-list="false"
              :on-success="(res, file) => handleUploadSuccess(res, file, item.key)"
              :before-upload="beforeFileUpload"
            >
              <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
            <div v-if="dataForm[item.key]" class="fileBox">
              {{ uploadFileName }}<span @click="dataForm[item.key] = ''">×</span>
            </div>
          </div>
          <!-- 用户选择 -->
          <ChooseUserByRole
            v-if="item.type === 'userByRole'"
            width="100%"
            height="48px"
            @checkUsers="users => checkUsers(users, item.key)"
          />
          <!-- 经纬度 + 地图 -->
          <!-- 经纬度key固定为location,可以设置replaceKey来修正 -->
          <!-- 经纬度必须给location默认值 -->
          <!-- 一个表格中只能设置一个经纬度选项，需要多个的话要修改组建 -->
          <div v-if="item.type === 'location' && dataForm.location">
            <span class="location-label">经度：</span>
            <el-input-number
              v-model="dataForm.location[0]"
              :precision="4"
              size="small"
              class="location-input"
            ></el-input-number>
            <span class="location-label margin-l-10">纬度：</span>
            <el-input-number
              v-model="dataForm.location[1]"
              :precision="4"
              size="small"
              class="location-input"
            ></el-input-number>
            <p class="message-text">提示：请拖动地图 设置设备地图定位</p>
            <div class="get-location-box amap-container">
              <div id="innerAmap" style="height: 100%; width: 100%"></div>
            </div>
          </div>

          <!-- 表单附加信息  选择框下面的提示文字 -->
          <p v-if="item.message" :style="item.messageStyle">{{ item.message }}</p>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button size="mini" @click="config.close">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  ref,
  watch,
  computed,
  defineComponent,
  PropType
} from 'vue'
// import iconM from '@/assets/icons/map-location.png'
import request from '@/plugins/axios/rtsp'
import { cloneDeep } from 'lodash'
import ChooseUserByRole from '@/components/chooseUserByRole/index.vue'
import { useStore } from 'vuex'
import useGlobal from '@/hooks/global/useGlobal'
import useAmap from '@/hooks/amap'

export default defineComponent({
  components: { ChooseUserByRole },
  props: {
    config: {
      type: Object as PropType<AOUConfig>,
      default() {
        return {}
      }
    },
    dialogWidth: {
      type: String,
      default: '460px'
    }
  },
  setup(props: any, ctx) {
    const { $message, $format } = useGlobal()

    // 定义状态
    const state = reactive<any>({
      imgActionUrl: '',
      fileActionUrl: '',
      uploadFileName: '',
      headers: {},
      zoom: 11,
      center: [116.4, 39.91],
      dataForm: { id: null }
    })

    // ruleForm组建实例
    const ruleForm = ref<any>(null)

    // 定义标点rule  根据每个column.rule
    const rules = computed(() => {
      const rules: any = {}

      ;(props.config.columns || []).forEach(column => {
        rules[column.key] = column.rules
      })
      return rules
    })

    // 保存 save
    const submit = () => {
      ruleForm.value?.validate(async (valid: any) => {
        if (!valid) {
          return false
        }

        // 默认设置为新增
        let successText = '新增成功'
        let submitUrl = props.config.addUrl

        // 提交数据中若有 ID  则判断为修改
        if (state.dataForm.id) {
          console.log('is edit')
          if (!props.config.editUrl) {
            props.config.close()
            return
          }
          successText = '修改成功'
          submitUrl = props.config.editUrl
        } else {
           console.log('is add')
          if (!props.config.addUrl) {
            props.config.close()
            return
          }
        }

        // additionalInfo JSON对象字符串初始化
        const aInfo = {}

        // 提取提交参数对象 （深克隆 不影响表单正常显示）
        let queryParams = cloneDeep({ ...state.dataForm })

        // 遍历每个Key
        for (const item of props.config.columns) {
          // 经纬度选项默认key=location  若有replaceKey则替换
          if (item.type === 'location') {
            if (item.replaceKey) {
              queryParams[item.replaceKey] = [...queryParams.location]
              delete queryParams.location
            }
          }

          // 格式化日期选择器值(这个改一下比较好)
          if (item.type === 'date') {
            queryParams[item.key] = $format(queryParams[item.key], 'Y-M-D')
          }

          // 判断column.aInfo是否为true
          // 将aInfo的选项添加到aInfo对象中
          if (item.aInfo) {
            if (item.replaceKey) {
              aInfo[item.replaceKey] = queryParams[item.replaceKey]
              delete queryParams[item.replaceKey]
            } else {
              aInfo[item.key] = queryParams[item.key]
              delete queryParams[item.key]
            }
          }
        }

        // 参数对象结合外部额外参数
        queryParams = {
          ...queryParams,
          ...(props.config.externalParams || {})
        }

        // 如果aInfo中有任意值 设置additionalInfo
        if (Object.values(aInfo).length > 0) {
          queryParams.additionalInfo = JSON.stringify(aInfo)
        }

        console.log(queryParams, 'queryParamsqueryParams')

        // 在表单提交前 执行外部最后的参数自定义修改函数
        if (props.config.setSubmitParams) {
          queryParams = props.config.setSubmitParams(queryParams)
        }

        // post请求提交
        try {
          // // start
          // // 处理其它域的请求
          // // add by lc
          // // 20210908
          // const baseUrl = props.config.baseUrl
          // // 修改请求路径
          // baseUrl?request.defaults.baseURL = baseUrl:''
          // // 请求头修改
          // const requestHeaders=props.config.requestHeaders
          // if(requestHeaders){
          //   for(let key in requestHeaders){
          //     requestHeaders ? request.defaults.headers[key] = requestHeaders[key] : ''
          //   }
          // }
          // end
          const res = await request({
            url: submitUrl,
            method: 'post',
            data: queryParams
          })
          if (res.status === 200) {
            $message.success(successText)

            // 请求完成关闭窗口
            props.config.close()
            ctx.emit('refreshData')
          } else {
            $message.error('请求失败')
          }
        } catch (err: any) {
          $message.error(err.message || err.data.message)
        }
      })
    }

    // 图片上传成功，保存图片url
    const handleUploadSuccess = (res: string, file: any, key: string) => {
      console.log(res, 'handleUploadSuccess')
      state.dataForm[key] = res

      // dataForm重新赋值 刷新图片
      // state.dataForm = { ...state.dataForm }
    }

    const beforeAvatarUpload = (file: any) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        $message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        $message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

    // 暂存文件名
    const beforeFileUpload = (file: any) => {
      state.uploadFileName = file.name
      return true
    }

    onMounted(async () => {
      // 渲染完成之后， 判断是否有location选项 初始化地图
      if (props.config.columns.some(item => item.type === 'location')) {
        const mapConfig = {
          // 地图要绑定的事件
          events: {
            mapmove: (map: any) => {
              const center = map.getCenter()
              state.dataForm.location = [center.lng, center.lat]
            }
          },

          // 搜索功能（还未完善）
          search: {
            input: 'innerAmapSearch',
            select: (center: string[] | number[]) => {
              state.dataForm.location = center
            }
          }
        }

        // amap封装，可以自定义修改接口  hooks/amap
        const { setMarker } = await useAmap('innerAmap', mapConfig)

        const centerMarker = setMarker(state.dataForm.location, {
          icon: require('@/assets/icons/map-location.png')
        })

        // 设置监听，经纬度改变  地图中心改变
        watch(
          () => state.dataForm.location,
          () => {
            centerMarker.setPosition(state.dataForm.location)
          }
        )
      }
    })

    // 接收选择的用户数组 并赋给dataForm (字符串。‘，’分割)
    const checkUsers = (users: any[], key: string) => {
      state.dataForm[key] = users.map(user => user.id).join(',')
      ruleForm.value.validate(async (valid: any) => {
        if (!valid) {
          return false
        }
      })
    }

    const store = useStore()
    onBeforeMount(() => {
      // 初始化图片 文件上传url
      state.imgActionUrl = store.state.app.actionUrl + '/file/api/upload/image'
      state.fileActionUrl = store.state.app.actionUrl + '/file/api/upload/file'
      state.headers['X-Authorization'] = 'Bearer ' + store.getters.token
      init()
    })

    // 初始化默认值
    const init = () => {
      state.dataForm = cloneDeep(props.config.defaultValue)
      if (state.dataForm.location) {
        state.dataForm.location = [state.dataForm.location[0] - 1, state.dataForm.location[1] - 0]
      }

      // 如果有open属性 则调用自定义初始化函数
      if (props.config.open) props.config.open()
    }

    const visible = computed(() => props.config.visible)
    return {
      ...toRefs(state),
      rules,
      // mapConfig,
      submit,
      handleUploadSuccess,
      beforeAvatarUpload,
      beforeFileUpload,
      checkUsers,
      visible,
      ruleForm
    }
  }
})
</script>

<style lang="scss">
.addOrUpdateDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed #404354 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #3d4050 !important;
    background: #eee;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 256px;
    height: 156px;
    line-height: 156px;
    text-align: center;
  }
  .avatar {
    width: 256px;
    height: 156px;
    display: block;
  }
  .el-input-number__decrease {
    width: 46px !important;
    height: 46px !important;
    line-height: 46px !important;
  }
  .el-input-number__increase {
    width: 46px !important;
    height: 46px !important;
    line-height: 46px !important;
  }
}
</style>
>

<style lang="scss" scoped>
@import 'src/assets/css/amapSearchStyle.scss';
.searchInput {
  z-index: 1000;
  position: relative;
}
.location-label {
  color: #409eff;
}
.location-input {
  width: 170px;
}
.message-text {
  margin: 10px 0 12px 20px;
  color: #39b01c;
  line-height: initial;
}
.get-location-box {
  width: 100%;
  height: 250px;
}

.fileUpload {
  display: flex;
  .upload-demo {
    margin-right: 16px;
  }
  .fileBox {
    padding: 0 16px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    max-width: 240px;
    height: 40px;
    line-height: 40px;
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
    position: relative;
    > span {
      display: block;
      position: absolute;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
