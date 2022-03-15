<template>
  <el-dialog
    v-model="visible"
    width="85%"
    custom-class="variable-dialog"
    :title="varDialogInfo.currentTitle"
    :close-on-click-modal="false"
    @close="varDialogInfo.close"
  >
    <div class="operation-btn-box">
      <div class="btn-box">
        <el-button type="primary" icon="el-icon-push" @click="addVariable">添加变量</el-button>
      </div>
      <p>
        请填写编辑变量信息后保存
        <span class="msg-green"><span class="msg-bold">变量名称 变量实际名称</span> 不可重复</span>
        变量实际名称 <span class="msg-green">只能输入英文,数字,下划线,#字符</span> ，公式中必须
        包含变量本身且不能有其他变量。
      </p>
      <!-- <p class="message">现未做任何控制，请信息全部填完后保存   不要乱存脏数据</p> -->
    </div>
    <!-- {{ columnData }} -->
    <el-table :data="protocolData" :highlight-current-row="false">
      <el-table-column sortable type="index" width="50"></el-table-column>
      <el-table-column
        v-for="(item, index) of columnData"
        :key="index"
        :label="item.i18n.zh_CN"
        :prop="item.key"
        width="200"
      >
        <template #default="scope">
          <el-input
            v-if="item.type === 'string'"
            v-model="scope.row[item.key]"
            size="mini"
            placeholder="请输入"
            class="item-input-style"
            :disabled="handleDisable(item.key, scope.row)"
          ></el-input>
          <el-input-number
            v-else-if="item.type === 'number'"
            v-model="scope.row[item.key]"
            size="mini"
            controls-position="right"
            :min="item.min"
            :disabled="handleDisable(item.key, scope.row)"
            :max="item.max"
            class="item-input-number"
            placeholder="请输入"
          ></el-input-number>
          <el-select
            v-else-if="item.type === 'select'"
            v-model="scope.row[item.key]"
            size="mini"
            placeholder="请选择"
            class="item-input-style"
            :disabled="handleDisable(item.key, scope.row)"
            @change="() => item.change(scope.row, item)"
          >
            <el-option
              v-for="options of item.options"
              :key="options.key"
              :label="options.value"
              :value="options.key"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="right" width="150">
        <template #default="scope">
          <div class="operate-btn" style="height: '56px'">
            <el-button
              size="mini"
              icon="el-icon-document-copy"
              type="text"
              @click="handleCopy(scope)"
              >复制</el-button
            >
            <el-button size="mini" icon="el-icon-close" type="text" @click="haneleDelete(scope)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="tail-btn">
      <el-button type="primary" icon="el-icon-check" :disabled="saveDis" @click="save"
        >保存</el-button
      >
      <el-button @click="varDialogInfo.close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveTemplateProtocol } from '@/api/device'
import currencyRules from '@/utils/formValidate'
import _ from 'lodash'
import useGlobal from '@/hooks/global/useGlobal'
import valueTextMap from './valueTextMap'
const { $message } = useGlobal()
export default {
  name: 'VariableDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['varDialogInfo'],
  emits: ['getTemlate'],
  data() {
    const textUnderline = (rule, value, callback) => {
      const valid = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g
      if (valid.test(value)) {
        callback()
      } else {
        callback(new Error('可输入中文、英文、数字、下划线字符'))
      }
    }
    // 只能输入英文,数字,下划线,横线
    const inputControl = (rule, value, callback) => {
      const valid = /^[5A-Za-z0-9\_]+$/
      if (valid.test(value)) {
        callback()
      } else {
        callback(new Error('只能输入英文,数字,下划线字符'))
      }
    }
    return {
      // 两种协议类型有的属性区分
      NBMQTT: [
        'name',
        'propertyCategory',
        'statType',
        'propertyType',
        'unit',
        'sampleDeviation',
        'dataOffset',
        'samplingMax',
        'samplingMin',
        'sampleCoef',
        'unitCoef',
        'range',
        'formulaProperty',
        'group'
      ],
      MQTT: [
        'name',
        'propertyCategory',
        'statType',
        'propertyType',
        'unit',
        'controlOptions',
        'sampleDeviation',
        'dataOffset',
        'samplingMax',
        'samplingMin',
        'sampleCoef',
        'unitCoef',
        'range',
        'formulaProperty',
        'group'
      ],
      MODBUS: [
        'name',
        'propertyCategory',
        'statType',
        'dataType',
        'propertyType',
        'unit',
        'registerType',
        'functionCode',
        'registerAddress',
        'byteCount',
        'bitPosition',
        'registerSignFlag',
        'sampleDeviation',
        'order',
        'byteOrder',
        'dataOffset',
        'samplingMax',
        'samplingMin',
        'sampleCoef',
        'unitCoef',
        'range',
        'formulaProperty',
        'group'
      ],
      DTU: [
        'name',
        'propertyCategory',
        'statType',
        'dataType',
        'propertyType',
        'unit',
        'controlOptions',
        'registerType',
        'functionCode',
        'registerAddress',
        'byteCount',
        'bitPosition',
        'registerSignFlag',
        'sampleDeviation',
        'order',
        'byteOrder',
        'dataOffset',
        'samplingMax',
        'samplingMin',
        'sampleCoef',
        'unitCoef',
        'range',
        'formulaProperty',
        'group'
      ],
      NBDTU: [
        'name',
        'propertyCategory',
        'statType',
        'dataType',
        'propertyType',
        'unit',
        'registerType',
        'functionCode',
        'registerAddress',
        'byteCount',
        'bitPosition',
        'registerSignFlag',
        'sampleDeviation',
        'order',
        'byteOrder',
        'dataOffset',
        'samplingMax',
        'samplingMin',
        'sampleCoef',
        'unitCoef',
        'range',
        'formulaProperty',
        'group'
      ],
      protocolType: [],
      columnData: [], // 当前table行
      protocolData: [],
      saveDis: false,
      formData: {
        number: {
          type: 'number',
          value: 0,
          i18n: {
            en_US: 'number',
            zh_CN: '排列序号'
          },
          precision: 0,
          min: -1,
          hasValue: false
        },
        name: {
          type: 'string',
          value: '',
          maxLength: -1,
          i18n: {
            en_US: 'name',
            zh_CN: '变量名称'
          },
          required: true,
          hasValue: false,
          rule: [
            { required: true, message: '请输入 变量名称', trigger: 'blur' },
            { max: 20, message: '名称长度不超过20', trigger: 'blur' },
            { validator: textUnderline, trigger: 'blur' }
          ]
        },
        propertyCategory: {
          type: 'string',
          value: '',
          maxLength: -1,
          i18n: {
            en_US: 'property category',
            zh_CN: '实际变量名称(非中文)'
          },
          required: true,
          unique: true,
          hasValue: false,
          rule: [
            {
              required: true,
              message: '请输入 实际变量名称(非中文)',
              trigger: 'blur'
            },
            { max: 20, message: '字符长度不超过20', trigger: 'blur' },
            { validator: inputControl, trigger: 'blur' }
          ]
        },
        statType: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'stat type',
            zh_CN: '统计类型'
          },
          required: true,
          options: [
            {
              key: '1',
              value: '累计值'
            },
            {
              key: '0',
              value: '瞬时值'
            }
          ],
          hasValue: false,
          rule: [{ required: true, message: '请选择 统计类型', trigger: 'change' }]
        },
        dataType: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'data type',
            zh_CN: '数据类型'
          },
          required: true,
          options: [
            {
              key: 'char',
              value: '8位有符号数'
            },
            {
              key: 'byte',
              value: '8位无符号数'
            },
            {
              key: 'short',
              value: '16位有符号数'
            },
            {
              key: 'word',
              value: '16位无符号数'
            },
            {
              key: 'DINT',
              value: '32位有符号数'
            },
            {
              key: 'Dword',
              value: '32位无符号数'
            },
            {
              key: 'float',
              value: '单精度浮点数'
            },
            {
              key: 'REAL',
              value: '双精度浮点数'
            },
            {
              key: 'String',
              value: 'String字符串'
            },
            {
              key: 'Long',
              value: 'Long'
            },
            {
              key: 'Boolean',
              value: 'Boolean'
            },
            {
              key: 'hlong',
              value: '有符号Long'
            },
            {
              key: 'ulong',
              value: '无符号Long'
            },
            {
              key: 'part',
              value: '24位特殊读取'
            },
            {
              key: 'bit',
              value: 'Bit'
            }
          ],
          hasValue: false,
          rule: [{ required: true, message: '请选择 数据类型', trigger: 'change' }]
        },
        propertyType: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'property type',
            zh_CN: '变量类型'
          },
          required: true,
          options: this.formatPropertyTypeOption(valueTextMap.propertyType),
          hasValue: false,
          rule: [{ required: true, message: '请选择 变量类型', trigger: 'change' }]
        },
        unit: {
          type: 'string',
          value: '',
          maxLength: 10,
          i18n: {
            en_US: 'unit',
            zh_CN: '单位'
          },
          required: true,
          hasValue: false,
          rule: [
            { required: true, message: '请输入 单位', trigger: 'blur' },
            { max: 10, message: '字符长度不超过10', trigger: 'blur' }
          ]
        },
        // 数据通过特殊的语法输入，如：
        // 开:1;关:2;停用:3
        // 含义：
        // 同一组数据用冒号隔开，冒号前表示要显示的值，冒号后表示实际值或要下发的值；
        // 不同组的数据用分号隔开
        // 注意：所有的符号全部使用英文输入法的符号
        controlOptions: {
          type: 'string',
          value: '',
          i18n: {
            en_US: 'controlOptions',
            zh_CN: '控制项'
          },
          disabled: false,
          hasValue: false
        },
        registerType: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'register type',
            zh_CN: '寄存器类型'
          },
          required: true,
          options: [
            {
              key: '0',
              value: '普通寄存器'
            },
            {
              key: '1',
              value: '位寄存器'
            }
          ],
          hasValue: false,
          rule: [{ required: true, message: '请选择 寄存器类型', trigger: 'change' }],
          change: () => {
            // if (this.formData.registerType.value === '1' || this.formData.registerType.value === 1) {
            //   // this.formData.bitPosition.hasValue = true
            //   this.formData.bitPosition.disabled = false
            // } else {
            //   this.formData.bitPosition.disabled = true
            // }
            console.log(this.formData.bitPosition, 'bitPosition')
          }
        },
        functionCode: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'function code',
            zh_CN: '功能码'
          },
          required: true,
          precision: 0,
          min: 1,
          hasValue: false,
          rule: [{ required: true, message: '请输入 功能码', trigger: 'blur' }]
        },
        registerAddress: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'register address',
            zh_CN: '寄存器地址'
          },
          required: true,
          precision: 0,
          min: 0,
          hasValue: false,
          rule: [{ required: true, message: '请输入 寄存器地址', trigger: 'blur' }]
        },
        byteCount: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'register count',
            zh_CN: '读取寄存器个数'
          },
          required: true,
          precision: 0,
          min: 1,
          hasValue: false,
          rule: [
            {
              required: true,
              message: '请输入 读取寄存器个数',
              trigger: 'blur'
            }
          ]
        },
        bitPosition: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'bit position',
            zh_CN: '位寄存器读取地址'
          },
          // needed 关联关系， 存在key值为value才显示
          needed: {
            key: 'registerType',
            value: '1'
          },
          hasValue: false
        },
        registerSignFlag: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'register sign flag',
            zh_CN: '数据有无符号'
          },
          required: true,
          options: [
            {
              key: '0',
              value: '无符号'
            },
            {
              key: '1',
              value: '有符号'
            }
          ],
          hasValue: false,
          rule: [
            {
              required: true,
              message: '请选择 数据有无符号',
              trigger: 'change'
            }
          ]
        },
        sampleDeviation: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'sample deviation',
            zh_CN: '每小时数据偏差值'
          },
          required: true,
          precision: 0,
          hasValue: false,
          rule: [
            {
              required: true,
              message: '请输入 每小时数据偏差值',
              trigger: 'blur'
            }
          ]
        },
        order: {
          type: 'select',
          value: '',
          i18n: {
            en_US: 'order',
            zh_CN: '大小端'
          },
          required: true,
          options: [
            {
              key: 'big',
              value: '大端在前'
            },
            {
              key: 'little',
              value: '小端在前'
            }
          ],
          hasValue: false,
          rule: [{ required: true, message: '请选择 大小端', trigger: 'change' }]
        },
        byteOrder: {
          type: 'string',
          value: '',
          maxLength: -1,
          i18n: {
            en_US: 'byte order',
            zh_CN: '解析顺序'
          },
          required: true,
          hasValue: false,
          rule: [{ required: true, message: '请输入 解析顺序', trigger: 'blur' }]
        },
        dataOffset: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'data offset',
            zh_CN: '数据偏移量'
          },
          required: true,
          precision: 0,
          hasValue: false,
          rule: [{ required: true, message: '请输入 数据偏移量', trigger: 'blur' }]
        },
        samplingMax: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'sampling max',
            zh_CN: '采样最大值'
          },
          required: true,
          precision: 0,
          hasValue: false,
          rule: [{ required: true, message: '请输入 采样最大值', trigger: 'blur' }]
        },
        samplingMin: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'sampling min',
            zh_CN: '采样最小值'
          },
          required: true,
          precision: 0,
          hasValue: false,
          rule: [{ required: true, message: '请输入 采样最小值', trigger: 'blur' }]
        },
        sampleCoef: {
          type: 'number',
          value: 1,
          i18n: {
            en_US: 'sample coef',
            zh_CN: '采样系数'
          },
          required: true,
          precision: 0,
          hasValue: false,
          min: 0,
          rule: [{ required: true, message: '请输入 采样系数', trigger: 'blur' }]
        },
        unitCoef: {
          type: 'number',
          value: -1,
          i18n: {
            en_US: 'unit coef',
            zh_CN: '数据小数位'
          },
          required: true,
          precision: 0,
          min: -1,
          hasValue: false,
          rule: [{ required: true, message: '请输入 数据小数位', trigger: 'blur' }]
        },
        range: {
          type: 'number',
          value: '',
          i18n: {
            en_US: 'range',
            zh_CN: '量程'
          },
          required: false,
          precision: 0
        },
        formulaProperty: {
          type: 'string',
          value: '',
          maxLength: -1,
          i18n: {
            en_US: 'formula property',
            zh_CN: '公式'
          },
          required: false
        },
        group: {
          type: 'string',
          value: '',
          maxLength: -1,
          i18n: {
            en_US: 'group',
            zh_CN: '设备'
          },
          required: false
        }
      },
      currencyRules,
      protocolRules: {}
    }
  },
  computed: {
    visible() {
      return this.varDialogInfo.visible
    }
  },
  created() {
    this.protocolType = this[this.varDialogInfo.template.type]
    for (const item of this.protocolType) {
      const info = this.formData[item]
      info.key = item
      this.protocolRules[item] = info.rule
      this.columnData.push(info)
    }
    this.protocolData = []
    if (this.varDialogInfo.protocolList && this.varDialogInfo.protocolList.length > 0) {
      for (const item of this.varDialogInfo.protocolList) {
        this.protocolData.push(item)
      }
    } else {
      this.addVariable()
    }
    console.log(this.varDialogInfo)
    console.log(this.columnData, this.protocolRules, 'columnData  this.protocolRules')
  },
  methods: {
    handleDisable(key, row) {
      switch (key) {
        case 'controlOptions':
          return row.propertyType !== 4 && row.propertyType !== '4'
        case 'bitPosition':
          return row.registerType === 0 || row.registerType === '0'
        default:
          break
      }
    },
    formatPropertyTypeOption(data) {
      const arr = []
      if (!data) return arr
      for (var key in data) {
        const option = {
          key: key,
          value: data[key]
        }
        arr.push(option)
      }
      return arr
    },
    addVariable() {
      const info = {}
      for (const item of this.protocolType) {
        info[item] = null
      }
      info.unitCoef = -1
      info.sampleCoef = 1
      this.protocolData.push(info)
    },
    handleCopy(scope) {
      // 复制
      console.log('复制', scope)
      const row = JSON.parse(JSON.stringify(scope.row))
      this.protocolData.push(row)
      $message.success('成功：已复制添加到最后一行')
    },
    haneleDelete(scope) {
      // table 删除
      this.protocolData.splice(scope.$index, 1)
      // this.
      $message.success('删除当前行成功')
    },
    save() {
      // const list = []
      // const listName = []
      // const protolist = this.varDialogInfo.template.protocolList

      // protolist.forEach((value,index)=> {
      //   list.push(value.name)
      //   const reg = new RegExp("[\\u4E00-\\u9FFF]+","g")
      //   if(reg.test(value.propertyCategory)) {
      //     $message('实际变量名称（非中文）不可为中文')
      //     return
      //   }else {
      //     listName.push(value.propertyCategory)
      //   }
      // })
      // //单位、每小时数据偏差值、数据偏移量、采样最大值、最小值、量程、公式不用必填

      // var newlist = list.sort()
      // for(var i = 0; i< newlist.length -1 ;i++) {
      //   if(newlist[i] == list[i + 1]) {
      //     $message('变量名称不可重复')
      //     return
      //   }
      // }
      // var newlistName = listName.sort()
      // for(var i = 0; i< newlistName.length -1 ;i++) {
      //   if(newlistName[i] == listName[i + 1]) {
      //     $message('实际变量名称不可重复')
      //     return
      //   }
      // }
      const params = this.varDialogInfo.template
      this.saveDis = true
      const textName = {}
      const textPC = {}
      const protolist = this.protocolData

      for (const value of protolist) {
        // 判断是否为空
        // const varInfo = ['name', 'dataType', 'order', 'propertyCategory', 'statType', 'propertyType']
        // for (const item of varInfo) {
        //   if (value.item == '' || !value.item) {
        //     $message('变量名称、实际变量名称 统计、变量类型 数据类型 数据小数位 大小端 量程不可为空')
        //     this.saveDis = false
        //     return
        //   }
        // }
        // if (this.varDialogInfo.controlInput) {
        //   const dtuInfo = ['registerType','functionCode','registerAddress', 'byteCount', 'bitPosition', 'registerSignFlag', 'byteOrder']
        //   for (const item of varInfo) {
        //     if (value.item == '' || !value.item) {
        //       $message('寄存器类型、功能码、寄存器地址、寄存器读取个数、 位寄存器读取地址 数据有无符号 解析顺序不可为空')
        //       this.saveDis = false
        //       return
        //     }
        //   }
        // }
        // 唯3不控制必填的：bitPosition，range，formulaProperty
        // for (const val of this.protocolType) {

        // }
        // const noNeedControl = ['bitPosition', 'range', 'formulaProperty', 'unit', 'sampleDeviation', 'samplingMax' , 'samplingMin', 'dataOffset']
        const tableNameList = []
        for (const item of this.columnData) {
          tableNameList.push(item.key)
        }
        const myTableList = _.without(
          tableNameList,
          'group',
          'bitPosition',
          'range',
          'formulaProperty',
          'unit',
          'sampleDeviation',
          'samplingMax',
          'samplingMin',
          'dataOffset',
          'registerAddress',
          'bitPosition',
          'unitCoef'
        )

        for (const item of myTableList) {
          if (value[item] === '' || !value[item]) {
            $message(
              '除单位、每小时数据偏差值、数据偏移量、采样最大值、采样最小值、量程、公式、寄存器地址、位寄存器读取地址、设备外，其余项不可为空'
            )
            this.saveDis = false
            return
          }
        }

        if (value.name !== '' && value.propertyCategory !== '') {
          console.log(value.propertyCategory, 'value.propertyCategory')
          const reg = /^[5A-Za-z0-9\_\#]+$/ // new RegExp('[\\u4E00-\\u9FFF]+', 'g')
          if (!reg.test(value.propertyCategory)) {
            $message('实际变量名称（非中文）只能输入英文,数字,下划线,#字符')
            this.saveDis = false
            return
          }

          if (!textName[value.name] && !textPC[value.propertyCategory]) {
            textName[value.name] = value.name
            textPC[value.propertyCategory] = value.propertyCategory
          } else {
            $message('变量名称、实际变量名称 不可重复')
            this.saveDis = false
            return
          }
        } else {
          $message('变量名称、实际变量名称 不可为空')
          this.saveDis = false
          return
        }
      }
      // const params = this.varDialogInfo.template
      if (
        this.varDialogInfo.protocolList.length === 0 &&
        this.varDialogInfo.filtered.length === 0
      ) {
        params.protocolList = this.protocolData
      } else {
        const pData1 = this.varDialogInfo.filtered.concat(this.protocolData)
        const pData2 = this.varDialogInfo.prototypeData1.concat(pData1)

        params.protocolList = pData2.concat(this.varDialogInfo.prototypeData2)
      }
      console.log('保存的数据', params)
      $message('保存中 请稍后')
      saveTemplateProtocol(params).then(() => {
        $message('保存成功')
        this.saveDis = false
        this.varDialogInfo.close()
        this.$emit('getTemlate')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.variable-dialog {
  min-width: 1350px;
  overflow-x: auto;
  .template-form {
    display: flex;
    flex-wrap: wrap;
    .form-item-style {
      width: 25%;
    }
  }
  .operation-btn-box {
    // height: 90px;
    margin: -10px 0 15px 0;
    .btn-box {
      height: 50px;
      align-items: center;
      margin-bottom: 16px;
    }
  }
  .cope-btn {
    background-color: #0ab8b9;
    color: #fff;
  }
  .delete-btn {
    background-color: #ff5722;
    color: #fff;
  }
  .tail-btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
  .message {
    color: red;
  }
  .msg-green {
    color: rgb(41, 173, 39);
  }
  .msg-bold {
    font-weight: 700;
  }
  .row-hover {
    .hover-icon {
      display: none;
    }
    &:hover {
      .hover-icon {
        display: block;
        cursor: pointer;
        i {
          margin-left: 20px;
          &:hover {
            color: #2680eb;
          }
        }
      }
    }
  }
}
</style>
