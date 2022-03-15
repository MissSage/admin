<template>
  <div class="alarm-settings-dialog">
    <el-dialog
      v-if="visible"
      v-model="visible"
      title="告警设置"
      width="630px"
      append-to-body
      class="alarm-design"
      :close-on-click-modal="false"
      @close="dialogConfig.close"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        class="alarm-settings-form"
        label-width="130px"
      >
        <el-form-item label="仪表名称" prop="deviceName">
          <el-select
            v-if="formData.id ? false : true"
            v-model="formData.deviceName"
            placeholder="请选择仪表"
            style="width: 400px"
            filterable
            @change="deviceSelect"
          >
            <el-option
              v-for="item in devicesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-else v-model="formData.deviceName" placeholder="请选择仪表2" disabled>
            <el-option
              v-for="item in devicesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测数据" prop="attribute">
          <el-select
            v-model="formData.attribute"
            placeholder="请选择仪表后选择监测"
            style="width: 400px"
          >
            <el-option
              v-for="item in energyTypes"
              :key="item.propertyCategory"
              :label="item.name"
              :value="item.propertyCategory"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时段" required>
          <el-time-select
            v-model="period.start"
            placeholder="起始时间"
            :editable="false"
            :clearable="false"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              maxTime: period.end
            }"
            style="width: 180px"
          ></el-time-select>
          <span class="sperater">&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp; </span>
          <el-time-select
            v-model="period.end"
            placeholder="结束时间"
            :editable="false"
            :clearable="false"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: period.start
            }"
            style="width: 180px"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="告警名称" prop="name">
          <el-input
            v-model="formData.name"
            class="severity"
            placeholder="请输入告警名称"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="告警级别" prop="severity">
          <!-- <el-input v-model="formData.severity" class="severity" placeholder="请输入告警级别"></el-input> -->
          <!-- <el-select v-model="formData.severity" placeholder="请选择告警级别">
            <el-option v-for="item in severityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-radio-group v-model="formData.severity">
            <el-radio label="提示">提示告警</el-radio>
            <el-radio label="次要">次要告警</el-radio>
            <el-radio label="重要">重要告警</el-radio>
            <el-radio label="紧急">紧急告警</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="告警描述">
          <el-input
            v-model="formData.alarmRemarks"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入告警描述"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <!-- <el-select v-model="formData.alarmType" placeholder="请选择告警类型" @change="alarmTypeChange" :disabled="alarmDisabled">
            <el-option v-for="item in alarmTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-radio-group
            v-model="formData.alarmType"
            :disabled="alarmDisabled"
            @change="alarmTypeChange"
          >
            <el-radio-button label="scope">范围告警</el-radio-button>
            <el-radio-button label="change">变动告警</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="周期告警">
          <el-switch v-model="formData.isCycle" @change="isCycleChange"></el-switch>
          <span class="restore-text m-left-15">周期告警 仅对设备<span class="msg-text">累计属性</span>有效，请谨慎选择 </span>
        </el-form-item> -->
        <el-form-item v-if="formData.isCycle" label="周期" prop="cycle">
          <el-select v-model="formData.cycle" placeholder="请选择周期">
            <el-option value="day" label="日"></el-option>
            <el-option value="month" label="月"></el-option>
            <el-option value="year" label="年"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.alarmType === 'scope'" label="告警触发最小值">
          <el-input-number
            v-model="formData.alarmMinValue"
            placeholder="请输入最小告警值"
            :controls="false"
            style="width: 400px"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-if="formData.alarmType === 'scope'" label="告警触发最大值">
          <el-input-number
            v-model="formData.alarmMaxValue"
            placeholder="请输入最大告警值"
            :controls="false"
            style="width: 400px"
          ></el-input-number>
        </el-form-item>
        <el-form-item v-if="formData.alarmType === 'change'" label="变动告警">
          从
          <el-input-number
            v-model="formData.cAlarmFrom"
            class="change-alarm"
            placeholder="请输入最小告警值"
            :controls="false"
          ></el-input-number>
          到
          <el-input-number
            v-model="formData.cAlarmTo"
            class="change-alarm"
            placeholder="请输入最大告警值"
            :controls="false"
          ></el-input-number>
          告警
        </el-form-item>
        <el-form-item v-if="!formData.isCycle" label="告警恢复">
          <el-popover placement="right" width="400" trigger="click">
            <el-form label-width="110px">
              <el-form-item label="恢复类型">
                <el-select
                  v-model="formData.restoreType"
                  placeholder="请选择告警类型"
                  :disabled="alarmDisabled"
                >
                  <el-option
                    v-for="item in alarmTypes"
                    :key="item.value"
                    :label="item.rLabel"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="formData.restoreType === 'scope'" label="恢复触发最小值">
                <el-input-number
                  v-model="formData.recoverMinValue"
                  placeholder="请输入最小告警值"
                  :controls="false"
                ></el-input-number>
              </el-form-item>
              <el-form-item v-if="formData.restoreType === 'scope'" label="恢复触发最大值">
                <el-input-number
                  v-model="formData.recoverMaxValue"
                  placeholder="请输入最大告警值"
                  :controls="false"
                ></el-input-number>
              </el-form-item>
              <el-form-item v-if="formData.restoreType === 'change'" label="变动恢复">
                从
                <el-input-number
                  v-model="formData.cRecoverFrom"
                  placeholder="请输入给定警值"
                  :controls="false"
                ></el-input-number>
              </el-form-item>
              <el-form-item v-if="formData.restoreType === 'change'" label="">
                到
                <el-input-number
                  v-model="formData.cRecoverTo"
                  placeholder="请输入目标警值"
                  :controls="false"
                ></el-input-number>
              </el-form-item>
            </el-form>
            <template #reference>
              <el-button class="delete-orange">手动设置</el-button>
            </template>
          </el-popover>
          <span class="restore-text">默认恢复为设置的同类型取反</span>
        </el-form-item>
        <el-card v-if="formData.alarmType === 'scope'" class="box-card msg">
          <span
            >说明：
            <p>1.最大值与最小值最少填写一项</p></span
          >
          <p>2.若只填写最小值：监测数据 &lt; 最小值, 则触发告警</p>
          <p>3.若只填写最大值：监测数据 &gt; 最大值, 则触发告警</p>
          <p>4.若同时填写最小值与最大值：最小值 &lt;监测数据&lt; 最大值, 则触发告警</p>
        </el-card>
        <!-- <el-form-item>
          <el-button type="primary" @click="Save(formData)">保 存</el-button>
          <el-button plain @click="dialogConfig.visible = false">取 消</el-button>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="dialogConfig.close">取 消</el-button>
          <el-button type="primary" @click="Save(formData)">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getAttributes } from '@/api/telemetry'
// import { getDevicesAll } from '@/api/device-controller/'
import _ from 'lodash'
import useGlobal from '@/hooks/global/useGlobal'
const { $messageError } = useGlobal()
export default {
  name: 'SettingsDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogConfig'],
  data() {
    // 表单校验
    const checkText = (rules, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('输入不可为空，请输入'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        alarmRemarks: '',
        alarmType: 'scope',
        alarmName: '',
        deviceName: '',
        // tenantId: {
        //   entityType: 'TENANT',
        //   id: ''
        // },
        deviceId: {
          entityType: 'DEVICE',
          id: ''
        },
        attribute: '',
        details: {
          alarmRemarks: ''
        },
        isCycle: false,
        cycle: null,
        params: '',
        alarmScript: '',
        restoreScript: '',
        severity: '',
        period: '00:00-24:00',
        restoreType: 'scope'
      },
      period: {
        start: '',
        end: ''
      },
      groupList: [
        { name: '电压越上限', value: '电压越上限' },
        { name: '电压越下限', value: '电压越下限' },
        { name: '电压波动', value: '电压波动' },
        { name: '三相电压不平衡', value: '三相电压不平衡' },
        { name: '谐波电流', value: '谐波电流' }
      ],
      // changeAlarm: true,
      // changeRecover: true,
      alarmTypes: [
        {
          value: 'scope',
          label: '范围告警',
          rLabel: '范围恢复'
        },
        {
          value: 'change',
          label: '变动告警',
          rLabel: '变动恢复'
        }
      ],
      severityList: [
        {
          value: 'tips',
          label: '提示'
        },
        {
          value: 'secondary',
          label: '次要'
        },
        {
          value: 'urgent',
          label: '紧急'
        },
        {
          value: 'serious',
          label: '严重'
        }
      ],
      alarmDisabled: false,
      devicesList: this.dialogConfig.deviceList,
      energyTypes: [],
      deviceInfo: [],
      rules: {
        alarmType: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
        deviceName: [{ required: true, message: '请选择仪表', trigger: 'change' }],
        attribute: [{ required: true, message: '请选择仪表后选择监测', trigger: 'change' }],
        name: [
          { required: true, message: '请输入告警名称', trigger: 'blur' },
          { validator: checkText, trigger: 'blur' }
        ],
        severity: [{ required: true, message: '请选择告警级别', trigger: 'blur' }],
        cycle: [{ required: true, message: '请选择周期', trigger: 'change' }]
        // level1: [
        //   { validator: validateLevel1, trigger: 'blur' }
        // ],
      },
      collapse: ['1', '2']
    }
  },
  computed: {
    visible() {
      return this.dialogConfig.visible
    }
  },
  created() {
    // this.getInitialData()
    console.log(this.dialogConfig)
    const temp = this.dialogConfig.temp
    for (const item in temp) {
      this.formData[item] = temp[item]
    }

    this.formData.restoreType =
      this.formData.recoverValue === '取反' ? this.formData.alarmType : this.formData.restoreType

    if (temp.params && temp.params !== '') {
      this.alarmDisabled = true
      const info = JSON.parse(temp.params)
      this.formData.alarmMinValue = info.alarmMinValue
      this.formData.alarmMaxValue = info.alarmMaxValue
      this.formData.recoverMinValue = info.recoverMinValue
      this.formData.recoverMaxValue = info.recoverMaxValue

      this.formData.cAlarmFrom = info.cAlarmFrom
      this.formData.cAlarmTo = info.cAlarmTo
      this.formData.cRecoverFrom = info.cRecoverFrom
      this.formData.cRecoverTo = info.cRecoverTo
    } else {
      this.formData.params = {}
    }
    this.period.start = this.formData.period.split('-')[0]
    this.period.end = this.formData.period.split('-')[1]

    if (this.formData.deviceId.id !== '' && temp.deviceId) {
      this.formData.deviceName = temp.deviceId.id
      this.formData.alarmRemarks = temp.details.alarmRemarks
      this.deviceSelect()
    } else {
      this.formData.alarmRemarks = ''
    }
  },
  methods: {
    // 根据选的设备获取可监测数据
    deviceSelect() {
      const devices = this.formData.deviceName
      getAttributes('DEVICE', devices).then(val => {
        this.energyTypes = []
        this.deviceInfo = val.data
        val.data.forEach(v => {
          if (v.key === 'prop') {
            this.energyTypes = JSON.parse(v.value)
          }
        })
      })
    },
    alarmTypeChange() {
      // do sth
    },
    isCycleChange() {
      if (this.formData.isCycle) {
        this.formData.cycle = 'day'
      } else {
        this.formData.cycle = null
      }
    },
    Save() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          if (
            (this.formData.recoverMinValue || this.formData.recoverMinValue === 0) &&
            (this.formData.recoverMaxValue || this.formData.recoverMaxValue === 0) &&
            this.formData.recoverMinValue >= this.formData.recoverMaxValue
          ) {
            $messageError('输入错误：恢复最小值需小于恢复最大值')
            return false
          }
          if (
            (this.formData.alarmMinValue || this.formData.alarmMinValue === 0) &&
            (this.formData.alarmMaxValue || this.formData.alarmMaxValue === 0) &&
            this.formData.alarmMinValue >= this.formData.alarmMaxValue
          ) {
            $messageError('输入错误：告警最小值需小于告警最大值')
            return false
          }
          this.saveSubmit()
        } else {
          $messageError('请核实填写信息后提交')
          return false
        }
      })
    },
    saveSubmit() {
      // 告警类型
      const attribute = this.formData.attribute
      this.formData.params = {}
      if (this.formData.alarmType === 'scope') {
        if (
          this.formData.alarmMinValue ||
          this.formData.alarmMaxValue ||
          this.formData.alarmMinValue === 0 ||
          this.formData.alarmMaxValue === 0
        ) {
          if (this.formData.alarmMinValue === 0 && this.formData.alarmMaxValue === 0) {
            $messageError('范围告警,告警值不可同时为0')
            return false
          }
          // type, minValue, maxValue, attribute, 状态
          this.scriptCode(
            'scope',
            this.formData.alarmMinValue,
            this.formData.alarmMaxValue,
            attribute,
            'reverse'
          )
          this.alarmVal(this.formData.alarmMinValue, this.formData.alarmMaxValue, '告警值', 'alarm')
          this.formData.details.setAlarmType = '范围告警'
        } else {
          $messageError('范围告警,至少输入一个告警值')
          return false
        }
      } else {
        if (
          (this.formData.cAlarmFrom || this.formData.cAlarmFrom === 0) &&
          (this.formData.cAlarmTo || this.formData.cAlarmTo === 0)
        ) {
          this.scriptCode(
            'change',
            this.formData.cAlarmFrom,
            this.formData.cAlarmTo,
            attribute,
            'reverse'
          )
          this.formData.details.alarmSetValue =
            this.formData.cAlarmFrom + ' → ' + this.formData.cAlarmTo
          this.formData.details.setAlarmType = '变动告警'
        } else {
          $messageError('变动告警,变动值必填')
          return false
        }
      }
      if (this.formData.restoreType === 'scope') {
        if (
          this.formData.recoverMinValue ||
          this.formData.recoverMaxValue ||
          this.formData.recoverMinValue === 0 ||
          this.formData.recoverMaxValue === 0
        ) {
          if (this.formData.recoverMinValue === 0 && this.formData.recoverMaxValue === 0) {
            $messageError('范围告警,告警值不可同时为0')
            return false
          }
          this.scriptCode(
            'scope',
            this.formData.recoverMinValue,
            this.formData.recoverMaxValue,
            attribute,
            'handM'
          )
          this.alarmVal(
            this.formData.recoverMinValue,
            this.formData.recoverMaxValue,
            '恢复值',
            'hand'
          )
          this.formData.details.rType = '范围恢复'
          this.formData.details.recoverSet = true
          // this.formData.restoreType = 'scope'
        } else {
          this.formData.details.recoverSet = false
          this.formData.details.rType = '默认同类型'
        }
      } else {
        if (
          this.formData.cRecoverFrom ||
          this.formData.cRecoverFrom === 0 ||
          this.formData.cRecoverTo ||
          this.formData.cRecoverTo === 0
        ) {
          if (
            (this.formData.cRecoverFrom || this.formData.cRecoverFrom === 0) &&
            (this.formData.cRecoverTo || this.formData.cRecoverTo === 0)
          ) {
            this.scriptCode(
              'change',
              this.formData.cRecoverFrom,
              this.formData.cRecoverTo,
              attribute,
              'handM'
            )
            this.formData.details.recoverSetValue =
              this.formData.cRecoverFrom + ' → ' + this.formData.cRecoverTo
            this.formData.details.rType = '变动恢复'
            this.formData.details.recoverSet = true
            // this.formData.restoreType = 'change'
          } else {
            $messageError('变动恢复,两个变动值必填')
            return false
          }
        } else {
          this.formData.details.recoverSet = false
          this.formData.details.rType = '默认同类型'
        }
      }
      if (!this.formData.details.recoverSet) {
        this.formData.details.recoverSetValue = '取反'
        this.formData.restoreType = this.formData.alarmType
      }

      this.formData.params = JSON.stringify(this.formData.params)
      this.formData.details.alarmRemarks = this.formData.alarmRemarks
      this.formData.deviceId.id = this.formData.deviceName
      // 设备属性
      this.energyTypes.forEach(v => {
        if (v.propertyCategory === this.formData.attribute) {
          this.formData.details.attributeName = v.name
        }
      })
      this.formData.details.deviceName = this.formData.deviceName
      // this.formData.details = JSON.stringify(this.formData.details)
      // this.formData.name = this.formData.name.trim()
      this.formData.severity = this.formData.severity.trim()
      // this.formData.alarmName = this.formData.deviceName
      this.formData.alarmName = this.formData.name.trim()
      // 处理时间范围
      this.formData.period = this.period.start + '-' + this.period.end
      if (!this.formData.tenantId) {
        this.formData.tenantId = {
          entityType: 'TENANT',
          id: this.$store.state.user.tenantId
        }
      }
      const info = _.omit(this.formData, [
        'alarmRemarks',
        'deviceName',
        'alarmMaxValue',
        'alarmMinValue',
        'alarmTypeName',
        'recoverMaxValue',
        'recoverMinValue',
        'cycleName'
      ])
      const tempInfo = {}
      for (const i in info) {
        tempInfo[i] = this.formData[i]
        // if (i !== 'alarmRemarks' && i !== 'deviceName' && i !== 'alarmMaxValue' && i !== 'alarmMinValue' && i !== 'alarmTypeName' && i !== 'recoverMaxValue' && i !== 'recoverMinValue'  && i !== 'cycleName' ) {
        //   this.temp[i] = this.formData[i]
        // }
      }
      delete tempInfo.state
      this.$emit('Save', tempInfo)
      this.dialogConfig.close()
    },
    // type, minValue, maxValue, attribute, 状态
    scriptCode(type, min, max, attribute, vType) {
      let code = ''
      let recoverCode = ''
      if (type === 'scope') {
        let isMin = true
        let isMax = true
        if (min) {
          isMin = true
        } else {
          isMin = min === 0
        }
        if (max) {
          isMax = true
        } else {
          isMax = max === 0
        }
        if (isMin && isMax) {
          // 范围
          code = `try {var result = {}; var min = ${min}; var max = ${max}; if (min < parseFloat(msg.${attribute}) && parseFloat(msg.${attribute}) < max) {
            return true; } else { return false }} catch(e){return e}`
          if (vType === 'reverse') {
            recoverCode = `try {var result = {}; var min = ${min}; var max = ${max}; if (min >= parseFloat(msg.${attribute}) || parseFloat(msg.${attribute}) >= max) {
            return true; } else { return false }} catch(e){return e}`
          }
        }
        if (isMin && !isMax) {
          // min
          code = `try {var result = {}; var min = ${min}; if (min > parseFloat(msg.${attribute})) {
            return true; } else { return false }} catch(e){return e}`
          if (vType === 'reverse') {
            recoverCode = `try {var result = {}; var min = ${min}; if (min <= parseFloat(msg.${attribute})) {
              return true; } else { return false }} catch(e) { return e}`
          }
        }
        if (!isMin && isMax) {
          // max
          code = `try {var result = {}; var max = ${max}; if (max < parseFloat(msg.${attribute})) {
            return true; } else { return false }} catch(e){return e}`
          if (vType === 'reverse') {
            recoverCode = `try {var result = {}; var max = ${max}; if (max >= parseFloat(msg.${attribute})) {
              return true; } else { return false }} catch(e){return e}`
          }
        }
        if (vType === 'reverse') {
          this.formData.params.alarmMaxValue = max
          this.formData.params.alarmMinValue = min
        } else {
          this.formData.params.recoverMaxValue = max
          this.formData.params.recoverMinValue = min
        }
      } else {
        // code = `try {if (metadata.lastData[metadata.lastData.length - 1] === ${min} && msg.${attribute} === ${max}) {
        //   return true; } else { return false } } catch(e) { return e }`
        code = `try {if (parseFloat(metadata.lastData) === ${min} && parseFloat(msg.${attribute}) === ${max}) {
          return true; } else { return false } } catch(e) { return e }`
        if (vType === 'reverse') {
          // recoverCode = `try {if (metadata.lastData[metadata.lastData.length - 1] === ${max} && msg.${attribute} === ${min}) {
          //   return true; } else { return false }} catch(e){return e}`
          recoverCode = `try {if (parseFloat(metadata.lastData) === ${max} && parseFloat(msg.${attribute}) === ${min}) {
            return true; } else { return false }} catch(e){return e}`
        }
        this.formData.params.useLastData = true
        if (vType === 'reverse') {
          this.formData.params.cAlarmFrom = min
          this.formData.params.cAlarmTo = max
        } else {
          this.formData.params.cRecoverFrom = min
          this.formData.params.cRecoverTo = max
        }
      }
      if (vType === 'reverse') {
        this.formData.alarmScript = code
        this.formData.restoreScript = recoverCode
      } else {
        this.formData.restoreScript = code
      }
      return true
    },
    alarmVal(min, max, text, type) {
      let value = ''
      let isMin = true
      let isMax = true
      if (min) {
        isMin = true
      } else {
        isMin = min === 0
      }
      if (max) {
        isMax = true
      } else {
        isMax = max === 0
      }
      if (isMin && isMax) {
        value = min + ' < ' + text + ' < ' + max
      } else {
        const minv = min || min === 0 ? text + ' < ' + min : ''
        const maxv = max || max === 0 ? text + ' > ' + max : ''
        value = minv + maxv
      }
      if (type === 'alarm') {
        this.formData.details.alarmSetValue = value
      } else {
        this.formData.details.recoverSetValue = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.alarm-settings-dialog {
  padding: 0 20px;
}
.alarm-settings-form {
  // padding: 0 10px;
  .delete-orange {
    margin-right: 16px;
  }
  .el-date-editor.el-input {
    width: 140px;
  }
  .box-card {
    width: 585px;
    height: 120px;
    color: #8aff7f;
    background: #127ecd;
    span {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color:rgb(87, 92, 87);
      line-height: 17px;
      p {
        display: inline-block;
        text-indent: 0;
      }
    }
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color:rgba(92,184,83,1);
      line-height: 17px;
      text-indent: 3em;
      margin: 4px 0;
    }
  }
  .severity {
    width: 293px;
  }
  .restore-text {
    margin-right: 1rem;
    color: #74c260;
  }
  .m-left-15 {
    margin-left: 15px;
  }
  .msg-text {
    color: #d56400;
  }
  .change-alarm {
    margin: 0 5px;
  }
}
</style>
<style lang="scss">
.alarm-settings-form {
  .el-input__inner {
    height: 48px !important;
  }
}
</style>
