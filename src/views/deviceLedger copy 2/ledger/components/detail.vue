<template>
  <el-dialog title="设备详情" width="1280px" :visibles="detialConfig.visible" @close="closeDialog">
    <el-tabs type="card">
      <el-tab-pane label="基础信息">
        <div class="detail-info-container">
          <el-form
            ref="infoForm"
            :model="deviceForm"
            class="detail-form"
            :rules="rules"
            label-width="200px"
          >
            <el-form-item
              v-for="(item, index) of detailInfo"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              class="info-form-item"
              :class="item.width"
            >
              <el-input
                v-if="item.type === 'text'"
                v-model="deviceForm[item.prop]"
                style="line-height: 49px"
                placeholder="请输入"
              ></el-input>
              <el-select
                v-else-if="item.type === 'select'"
                v-model="deviceForm[item.prop]"
                placeholder="请选择"
              >
                <el-option
                  v-for="(option, i) of item.options"
                  :key="i"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'date'"
                v-model="deviceForm[item.prop]"
                style="width: 206px"
                type="date"
                format="yyyy-MM-dd"
                value-format="timestamp"
                placeholder="选择日期"
                class="date-picker"
                :clearable="false"
              ></el-date-picker>
              <div v-else-if="item.type === 'state-select'" class="state-select-box">
                <el-select
                  v-model="deviceForm[item.prop]"
                  placeholder="请选择"
                  @change="changeState(item.prop)"
                >
                  <el-option
                    v-for="(option, i) of item.options"
                    :key="i"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
                <p
                  class="d-state"
                  :class="{
                    'state-red': deviceForm[item.prop] === '0',
                    'd-usage': item.prop === 'status' && deviceForm[item.prop] === '1',
                    'state-blue': item.prop === 'useFlag' && deviceForm[item.prop] === '1',
                    'usage-idle-machines': deviceForm[item.prop] === '2'
                  }"
                >
                  {{ item.nameMap[deviceForm[item.prop]] }}
                </p>
              </div>
              <el-input-number
                v-else-if="item.type === 'number'"
                v-model="deviceForm[item.prop]"
                controls-position="right"
              ></el-input-number>
              <el-input
                v-else
                v-model="deviceForm[item.prop]"
                type="textarea"
                :rows="2"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item label="设备图片" class="info-form-item form-custom">
              <div class="upload-icon-box">
                <el-upload
                  class="avatar-uploader"
                  :action="actionUrl"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="uploaderAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="deviceForm.imageUrl" :src="deviceForm.imageUrl" class="avatar" />
                  <i
                    v-else
                    class="avatar-uploader-icon"
                    :class="{
                      'el-icon-plus': deviceForm.imageUrl === '',
                      'el-icon-edit-outline': deviceForm.imageUrl !== ''
                    }"
                  ></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="相关文件" class="info-form-item form-custom">
              <el-upload
                class="upload-file"
                :action="actionUrl"
                :headers="headers"
                :on-change="handleChange"
                :limit="5"
                :show-file-list="false"
                :file-list="fileList"
              >
                <el-button size="small" type="primary" class="upload-btn">点击上传</el-button>
              </el-upload>
              <div class="fileContainer">
                <div
                  v-for="(file, index) in deviceForm.fileList"
                  :key="index"
                  @click="downloadFile(file)"
                >
                  {{ file.name }}
                  <div class="delBtn" @click.stop="delFile(index)">×</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item class="form-foot">
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
// import { saveEquipmentbill } from '@/api/custom-SN-controller'
// import { removeSlash } from '@/utils/removeIdSlash.js'

export default {
  name: 'Detail',
  // eslint-disable-next-line vue/require-prop-types
  props: ['detialConfig'],
  data() {
    return {
      actionUrl: 'http://183.220.138.22:8081/api/tenant/upload/file',
      headers: {},
      deviceForm: {
        id: '',
        name: '',
        serialNumber: '',
        type: '',
        status: '',
        useFlag: '',
        creator: '',
        brand: '',
        deviceModel: '',
        dept: '',
        price: 0,
        purchaseTime: '',
        dateOfManufacture: '',
        productionTime: '',
        estimatedScrapTime: '',
        measurementGrade: '',
        remark: '',
        // additionalInfo: null,
        installationLocation: '',
        gys: '',
        unit: '',
        imageUrl: '',
        fileList: []
      },
      detailInfo: [
        { label: '设备名称', prop: 'name', type: 'text' },
        { label: '设备编号', prop: 'deviceCode', type: 'text' },
        {
          label: '设备类别',
          prop: 'deviceType',
          type: 'select',
          options: [{ label: '生产设备', value: '生产设备' }]
        },
        { label: '单位', prop: 'unit', type: 'text' },
        // { label: '品牌', prop: 'brand', type: 'select', options: [{ label: '天华', value: '天华' }] },
        { label: '品牌', prop: 'brand', type: 'text' },
        { label: '设备型号', prop: 'deviceModel', type: 'text' },
        { label: '供应商', prop: 'gys', type: 'text', width: 'width-100' },
        { label: '购置金额', prop: 'price', type: 'number' },
        { label: '购置日期', prop: 'pTime', type: 'date' },
        { label: '出厂时间', prop: 'dateOfManufacture', type: 'date' },
        { label: '投产时间', prop: 'productionTime', type: 'date' },
        { label: '预计报废时间', prop: 'esTime', type: 'date' },
        {
          label: '是否计量设备',
          prop: 'measurementGrade',
          type: 'select',
          options: [
            { label: '否', value: '1' },
            { label: '一级', value: '2' },
            { label: '二级', value: '0' }
          ]
        },
        {
          label: '设备状态',
          prop: 'status',
          type: 'state-select',
          options: [
            { label: '正常', value: '1' },
            { label: '故障', value: '0' }
          ],
          nameMap: { 1: '正常', 0: '故障' }
        },
        {
          label: '使用状态',
          prop: 'useFlag',
          type: 'state-select',
          options: [
            { label: '在用', value: '1' },
            { label: '闲置', value: '2' },
            { label: '禁用', value: '0' }
          ],
          nameMap: { 1: '在用', 2: '闲置', 0: '禁用' }
        },
        { label: '负责人', prop: 'creator', type: 'text' },
        { label: '所属部门', prop: 'dept', width: 'width-100', type: 'text' },
        {
          label: '安装位置',
          prop: 'installationLocation',
          type: 'text',
          width: 'width-100'
        },
        {
          label: '备注',
          prop: 'remark',
          type: 'textarea',
          width: 'width-100 remark-item'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceCode: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        productionTime: [{ required: true, message: '请选择投产时间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择设备状态', trigger: 'blur' }],
        useFlag: [{ required: true, message: '请选择使用状态', trigger: 'blur' }],
        installationLocation: [{ required: true, message: '请输入安装位置', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  created() {
    console.log(this.detialConfig, 'detialConfig')
    this.headers['X-Authorization'] = 'Bearer ' + this.$store.getters.token
    if (this.detialConfig.info.id) {
      this.deviceForm = { ...this.detialConfig.info }
      const info = JSON.parse(this.deviceForm.additionalInfo)
      console.log(info)
      this.deviceForm.imageUrl = info.imageUrl || ''
      this.deviceForm.fileList = info.fileList || []
      this.fileList = info.fileList || []
      this.deviceForm.unit = info.unit
      this.deviceForm.gys = info.gys
      console.log(this.detialConfig)
    }
  },
  methods: {
    handleChange(file, fileList) {
      console.log(fileList, file)
      this.deviceForm.fileList = fileList.map(item => ({
        url: item.response || item.url,
        name: item.name
      }))
      this.deviceForm = { ...this.deviceForm }
    },
    uploaderAvatarSuccess(res) {
      this.deviceForm.imageUrl = res
      this.$message({
        type: 'success',
        message: '上传到数据库成功 保存后生效'
      })
    },
    beforeAvatarUpload(file) {
      let isImg = true
      const isLt2M = file.size / 1024 / 1024 < 2

      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp' ||
        file.type === 'image/x-bmp'
      ) {
        isImg = true
      } else {
        isImg = false
        this.$message.error('上传logo图片只能是 JPG,JPEG,PNG,BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传logo图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    // changeState() {},
    closeDialog() {
      this.$emit('closeDialog')
    },
    save() {
      this.closeDialog()
      console.log('save', this.deviceForm)
      if (!this.deviceForm.tenantId) {
        // this.deviceForm.tenantId = removeSlash(this.$store.state.user.tenantId)
      }
      const info = {
        gys: this.deviceForm.gys,
        unit: this.deviceForm.unit,
        imageUrl: this.deviceForm.imageUrl || '',
        fileList: this.deviceForm.fileList || []
      }
      this.deviceForm.additionalInfo = JSON.stringify(info)
    },
    downloadFile(file) {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = file.url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    },
    delFile(index) {
      this.deviceForm.fileList.splice(index, 1)
      this.fileList = this.deviceForm.fileList
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-info-container {
  .title {
    line-height: 40px;
    margin-bottom: 10px;
  }
  :deep(.el-input__inner) {
    height: 49px;
    widows: 206.4px;
    outline: medium;
  }
  .detail-form {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .info-form-item {
      width: 33.33%;
      .date-picker {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .el-input-number {
        width: 100%;
      }
      .state-select-box {
        position: relative;
        .d-state {
          position: absolute;
          top: 10px;
          left: 5px;
          z-index: 10;
          padding: 3px 10px;
          line-height: 18px;
        }
        .state-red {
          color: #ff3232;
          border: 1px solid #ff3232;
          background: #512d43;
        }
        .state-blue {
          color: #328eff;
          border: 1px solid #328eff;
          background: #283f6c;
        }
        .d-usage {
          color: #32ff7c;
          border: 1px solid #32ff7c;
          background: #285652;
        }
        .usage-idle-machines {
          color: #ffcc32;
          border: 1px solid #ffcc32;
          background: #514c43;
        }
      }
    }
    .width-100 {
      width: 100%;
    }
    .form-foot {
      width: 100%;
      text-align: right;
      .el-button {
        margin-top: 25px;
      }
    }
    .fileContainer {
      display: flex;
      flex-wrap: wrap;
      margin-left: 12px;
      .fileBox {
        position: relative;
        cursor: pointer;
        margin-bottom: 12px;
        margin-right: 12px;
        height: 40px;
        line-height: 40px;
        padding: 0 12px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: rgba(235, 232, 51, 0.4);
        border: 1px solid #ffcc32;
        .delBtn {
          width: 12px;
          height: 12px;
          line-height: 12px;
          position: absolute;
          top: 4px;
          right: 4px;
          text-align: center;
        }
      }
    }
    .form-custom {
      width: 50%;
    }
    .upload-btn {
      margin: 10px;
    }
    .upload-icon-box {
      height: 127px;
      width: 300px;
      margin: 10px;
      .avatar-uploader {
        width: 300px;
        border: 1px dashed #23729f;
        border-radius: 6px;
        overflow: hidden;
        &:hover {
          border-color: #23729f;
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #26c94f;
        width: 300px;
        height: 127px;
        line-height: 127px;
        text-align: center;
      }
      .avatar {
        width: 300px;
        height: 127px;
        display: block;
      }
    }
    .info-form-item ::v-deep {
      margin-bottom: 0;
      .el-form-item__label {
        font-weight: 500;
        text-align: center;
        background: #e6e6e6;
        border: 1px solid #a6a6a6;
        margin-bottom: 0;
        border-bottom: 0;
        border-right: 0;
      }
      .el-form-item__content {
        border: 1px solid #a6a6a6;
        border-bottom: 0;
      }
    }
    .form-custom ::v-deep,
    .remark-item ::v-deep {
      .el-form-item__label {
        height: 100%;
      }
    }
    .form-foot ::v-deep {
      border-top: 1px solid #a6a6a6;
    }
  }
}

.margin-r-10 {
  margin-right: 10px;
}
.el-icon-document {
  color: #207ae8;
}
.el-icon-setting {
  color: #ff3232;
}
.el-icon-document-checked {
  color: #20e8c7;
}
.keynote-text {
  color: #20dae8;
}

</style>
