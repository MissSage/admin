<template>
  <el-dialog
    v-model="visible"
    :title="dialogInfo.currentTitle"
    class="alarm-design"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" class="template-form" label-width="120px" width="30%">
      <el-form-item label="模板名称" prop="name" :rules="currencyRules.text">
        <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
      </el-form-item>
      <el-form-item label="协议类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择协议类型" disabled>
          <el-option label="MQTT协议" value="MQTT"></el-option>
          <el-option label="MODBUS协议" value="MODBUS"></el-option>
          <el-option label="DTU协议" value="DTU"></el-option>
          <el-option label="NB-DTU协议" value="NBDTU"></el-option>
          <el-option label="NB-MQTT协议" value="NBMQTT"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="dialogInfo.close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addTemplate } from '@/api/device' // , editTemplate
import currencyRules from '@/utils/formValidate'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
export default {
  name: 'TpDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogInfo'],
  data() {
    return {
      form: {
        name: '',
        type: '',
        remark: '',
        additionalInfo: ''
      },
      typeEdit: false,
      currencyRules
    }
  },
  computed: {
    visible() {
      return this.dialogInfo.visible
    }
  },
  created() {
    const cInfo = this.dialogInfo.template
    for (const item in cInfo) {
      this.form[item] = cInfo[item]
    }
    this.form.type = this.dialogInfo.type
    // if (this.dialogInfo.template.id) {
    //   this.typeEdit = true
    // } else {
    //   this.typeEdit = false
    // }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.dialogInfo)
          // 通过验证后对应调方法保存
          for (const item of this.dialogInfo.data) {
            if (
              (this.dialogInfo.template.id &&
                item.id !== this.dialogInfo.template.id &&
                item.name === this.form.name) ||
              (!this.dialogInfo.template.id && item.name === this.form.name)
            ) {
              $message('协议模板名称不可重复')
              return
            }
          }
          if (this.dialogInfo.template.id) {
            this.form.id = this.dialogInfo.template.id
            this.form.createTime = this.dialogInfo.template.createTime
          }
          addTemplate(this.form).then(() => {
            this.$emit('getTemlate')
            $message({
              type: 'success',
              message: '操作成功'
            })
            this.dialogInfo.close()
          })
        } else {
          $message.error('请按提示输入信息后再保存')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.template-form {
  height: 100%;
}
</style>
