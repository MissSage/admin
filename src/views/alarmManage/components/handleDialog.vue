<template>
  <div class="handle-dialog">
    <el-dialog
      v-model="visible"
      title="解除告警"
      width="35%"
      append-to-body
      class="alarm-design"
      :close-on-click-modal="false"
      @close="dialogInfo.close"
    >
      <el-form ref="form" :model="form" label-width="90px" :rules="rules">
        <el-form-item label="解除备注" prop="removeRemark">
          <el-input v-model="form.removeRemark" placeholder="请输入解除备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="dialogInfo.close">取 消</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="API.rowOperations[name].visible = false">取 消</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { clearAlarmByAuth } from '@/api/alarm' // clearAlarm,
import { removeSlash } from '@/utils/removeIdSlash' // 处理id
import useGlobal from '@/hooks/global/useGlobal'
const { $messageSuccess,$messageError } = useGlobal()
export default {
  name: 'HandleDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogInfo'],
  data() {
    // 表单校验
    const checkText = (rules, value, callback) => {
      if (value.trim() === '') {
        console.log(value)
        callback(new Error('输入不可为空，请输入'))
      } else {
        callback()
      }
    }
    return {
      form: {
        removeRemark: ''
      },
      rules: {
        removeRemark: [
          { required: true, message: '请输入告警解除备注', trigger: 'blur' },
          { validator: checkText, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    visible() {
      return this.dialogInfo.visible
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const info = this.dialogInfo.row
          const params = {
            alarmId: [],
            remark: this.form.removeRemark
          }
          const tempId = removeSlash(info.id.id)
          params.alarmId.push(tempId)
          // if (this.$route.path === '/eventAlarm/realTimeAlarm' || this.$route.path === '/moverealTimeAlarm') {
          //   const secret = removeSlash(this.$store.state.user.id) + '.' + (new Date()).valueOf()
          //   params.secret = btoa(secret)
          // } else {
          //   const getUserId = this.$route.fullPath.split('=secret')
          //   params.secret = getUserId[getUserId.length - 1]
          // }
          console.log(params, this.$route.path, '-----单独')
          clearAlarmByAuth(params).then(() => {
            $messageSuccess('解除操作成功')
            this.dialogInfo.close()
            this.$emit('refresh')
            // this.reload()
          })
        } else {
          $messageError('请填写备注')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
