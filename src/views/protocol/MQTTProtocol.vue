<template>
  <!-- DTU 协议模板 -->
  <div class="template-protocol-container">
    <div class="left-template-box custom-bg-box-shadow1">
      <div class="title-box custom-bottom-box-shadow">
        <p class="title-text top-title"><i class="iconfont icon-shuangjiantouyou"></i>模板列表</p>
        <!-- <el-button size="mini" type="primary" @click="addTemplate">添加模板</el-button> -->
      </div>
      <el-input
        v-model="filterTemplate"
        placeholder="输入模板名称搜索"
        class="tree-filter-create-box"
      >
        <template #append>
          <el-button icon="iconfont icon-8" @click="filterTemplate = ''"> 重置</el-button></template
        >
      </el-input>
      <el-button class="tree-o-btn add-blue-green" icon="el-icon-document-add" @click="addTemplate"
        >新建模板</el-button
      >
      <div class="operation-btns">
        <el-button
          icon="iconfont icon-bianji"
          class="node-o-btn edit-primary-blue"
          @click="editTemplate(currentItem)"
          >编辑</el-button
        >
        <el-upload
          class="upload-demo"
          :action="actionUrl"
          :on-change="handleChange"
          :headers="headers"
          :show-file-list="false"
          :on-success="uploadSuccess"
        >
          <el-button class="node-o-btn add-child-blue" icon="iconfont icon-daoru">导入</el-button>
        </el-upload>
        <el-button
          icon="iconfont icon-shanchu"
          class="node-o-btn delete-orange"
          @click="deleteTemplate(currentItem)"
          >删除</el-button
        >

        <!-- type="success" -->
      </div>
      <span class="alltemp">所有模板</span>
      <div class="template-list-box">
        <div
          v-for="(item, i) in fTemplateList"
          :key="i"
          class="t-item"
          :class="{ 'active-item': item.id === currentTemplate.id }"
          @click="clickTemplate(item)"
        >
          <p class="t-item-name"><i class="iconfont icon-moban"></i> {{ item.name }}</p>
          <span class="hover-button">
            <i class="el-icon-edit" style="color: #0a81ff" @click.stop="editTemplate(item)"></i>
            <i
              class="iconfont icon-daochu1"
              style="color: #32d1db"
              @click.stop="exportTemplate(item)"
            ></i>
            <i class="el-icon-delete" style="color: #f56c6c" @click.stop="deleteTemplate(item)"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="right-protocol-box custom-main-bg-box-shadow1">
      <!-- <div class="top-title-box unified-theme-bg-color">
        <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>协议解析</p>
      </div> -->
      <CardSearch ref="cardSearch" :config="cardSearchConfig" />
      <CardTable :config="cardTableConfig" />
    </div>
    <tpDialog
      v-if="dialogInfo.visible"
      :dialog-info="dialogInfo"
      @getTemlate="getTemlate"
    ></tpDialog>
    <variableDialog
      v-if="varDialogInfo.visible"
      :var-dialog-info="varDialogInfo"
      @getTemlate="getTemlate"
    ></variableDialog>
  </div>
</template>

<script>
import {
  getTemplateProtocol,
  delTemplate,
  getTemplateListByType,
  copyTemplateProtocol,
  exportTemplateProtocol
} from '@/api/device' // getTemplateList,
import tpDialog from './components/dialog.vue'
import variableDialog from './components/variableDialog.vue'
import { importFileHandle } from './utils/importControl'
import downloader from 'js-file-download'
import ImportBtn from '@/components/importBtn/index.vue'
import valueTextMap from './components/valueTextMap.js'
import _ from 'lodash'
import CardTable from '@/components/cardTable/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import useGlobal from '@/hooks/global/useGlobal'
const { $btnPerms, $message, $confirm } = useGlobal()

export default {
  name: 'DTUProtocol',
  components: {
    tpDialog,
    variableDialog,
    CardTable,
    CardSearch
  },
  data() {
    return {
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: params => this.clickFilterData(params.name) },
          add: {
            text: '当前页变量增改',
            perm: $btnPerms('pc_device_deviceAdd'),
            perm: true,
            handle: () => this.editProtocolVariable()
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '240px' }],

        extraOperations: [
          // {
          //   text: '下载模板',
          //   perm: $btnPerms('pc_device_deviceAdd'),
          //   perm: true,
          //   handle: () => this.downloadTemplate()
          // },
          {
            text: '导入',
            perm: $btnPerms('pc_device_deviceAdd'),
            perm: true,
            handle: file => importFileHandle(this, file, 'DTU', this.currentTemplate),
            component: ImportBtn
          }
        ]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        indexVisible: {
          label: '序号',
          width: '50px',
          align: 'center'
        },
        columns: [
          { prop: 'name', label: '变量名称', width: 80 },
          { prop: 'propertyCategory', label: '实际变量名称(非中文)', width: 180 },
          {
            prop: 'statType',
            label: '统计类型',
            formatter: row => this.valueTextMap.statType[row.statType]
          },
          // {
          //   prop: 'dataType',
          //   label: '数据类型',
          //   width: 140,
          //   formatter: row => this.valueTextMap.dataType[row.dataType]
          // },
          {
            prop: 'propertyType',
            label: '变量类型',
            width: 140,
            formatter: row => this.valueTextMap.propertyType[row.propertyType]
          },
          { prop: 'unit', label: '单位' },
          // {
          //   prop: 'registerType',
          //   label: '寄存器类型',
          //   width: 140,
          //   formatter: row => this.valueTextMap.registerType[row.registerType]
          // },
          // { prop: 'functionCode', label: '功能码' },
          // { prop: 'registerAddress', label: '寄存器地址', width: 140 },
          // { prop: 'byteCount', label: '读取寄存器个数', width: 180 },
          // { prop: 'bitPosition', label: '位寄存器读取地址', width: 200 },
          // {
          //   prop: 'registerSignFlag',
          //   label: '数据有无符号',
          //   width: 140,
          //   formatter: row => this.valueTextMap.registerSignFlag[row.registerSignFlag]
          // },
          { prop: 'sampleDeviation', label: '每小时数据偏差值', width: 140 },
          // {
          //   prop: 'order',
          //   label: '大小端',
          //   width: 140,
          //   formatter: row => this.valueTextMap.order[row.order]
          // },
          // { prop: 'byteOrder', label: '解析顺序', width: 120 },
          { prop: 'dataOffset', label: '数据偏移量', width: 100 },
          { prop: 'samplingMax', label: '采样最大值', width: 120, textColor: '#FF5722' },
          { prop: 'samplingMin', label: '采样最小值', width: 120, textColor: '#33AB9F' },
          { prop: 'sampleCoef', label: '采样系数', width: 100, textColor: '#FFB800' },
          { prop: 'unitCoef', label: '数据小数位', width: 100 },
          { prop: 'range', label: '量程' },
          { prop: 'formulaProperty', label: '公式' }
        ],

        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, prev, pager, next, jumper',
          sizeHandle: () => {
            // do
          },
          pageHandle: val => this.handleCurrentChange(val)
        }
      },

      actionUrl: '',
      filterTemplate: '',
      templateList: [],
      dialogInfo: {
        currentTitle: '添加协议模板',
        visible: false,
        template: {},
        type: 'MQTT',
        data: [],
        close: () => (this.dialogInfo.visible = false)
      },
      uploadDis: false,
      headers: {},
      currentTemplate: {},
      varDialogInfo: {
        currentTitle: '添加变量',
        visible: false,
        template: {},
        protocolList: [],
        prototypeData1: [],
        prototypeData2: [],
        filtered: [],
        close: () => (this.varDialogInfo.visible = false)
      },
      protocolData: [],
      copyInfo: null,
      currentItem: {},
      valueTextMap
    }
  },
  computed: {
    fTemplateList() {
      return this.templateList.filter(item => {
        return item.name.toLowerCase().includes(this.filterTemplate.toLowerCase())
      })
    }
  },
  created() {
    this.actionUrl = this.$store.state.app.actionUrl + '/api/deviceTemplate/import/DTU'
    this.getTemlate()
    this.headers['X-Authorization'] = 'Bearer ' + this.$store.getters.token
  },
  methods: {
    // 获取所有模板
    getTemlate() {
      getTemplateListByType('MQTT').then(res => {
        this.templateList = res.data
        this.dialogInfo.data = res.data
        // !this.currentTemplate.id &&  默认操作了模板列表就自带选中第一个
        if (this.templateList.length > 0) {
          const select = this.currentItem.id ? this.currentItem : this.templateList[0]
          this.clickTemplate(select)
        } else {
          this.filterProtocolData = []
          this.cardTableConfig.pagination.total = this.filterProtocolData.length
          this.protocolData = []
          this.cardTableConfig.dataList = []
          $message({
            type: 'warning',
            message: '暂无数据'
          })
          this.$forceUpdate()
        }
      })
    },
    // 点击模板 拿协议信息
    clickTemplate(item) {
      this.currentItem = item
      getTemplateProtocol(item.id).then(res => {
        this.currentTemplate = res.data
        this.protocolData = []
        this.cardTableConfig.pagination.page = 1
        if (this.currentTemplate.protocolList) {
          for (const [index, item] of this.currentTemplate.protocolList.entries()) {
            item.indexNumber = index + 1
            this.protocolData.push(item)
          }
        }
        // for (const item of this.protocolData) {
        //   for (const val in this.valueTextMap) {
        //     item[val]
        //   }
        // }
        this.filterProtocolData = this.protocolData
        this.cardTableConfig.pagination.total = this.filterProtocolData.length
        this.cardTableConfig.dataList = this.filterProtocolData.slice(0, 15)
      })
    },
    // 导出
    exportTemplate() {
      exportTemplateProtocol(this.currentTemplate.id).then(res => {
        const downloadData = JSON.stringify(res.data)
        downloader(downloadData, 'export.json')
      })
    },
    uploadSuccess(res) {
      $message(res.message)
      this.getTemlate()
    },
    handleChange() {
      // do sth
    },
    // add模板
    addTemplate() {
      this.dialogInfo.visible = true
      this.dialogInfo.currentTitle = '添加协议模板'
      const info = {
        name: '',
        type: '',
        remark: '',
        additionalInfo: ''
      }
      this.dialogInfo.template = info
    },
    editTemplate(item) {
      this.dialogInfo.visible = true
      this.dialogInfo.currentTitle = '编辑协议模板'
      for (const i in item) {
        this.dialogInfo.template[i] = item[i]
      }
    },
    copyTemplate(item) {
      if (item) {
        this.currentTemplate = item
      }
      copyTemplateProtocol(this.currentTemplate.id).then(res => {
        $message(res.data.result)
        this.getTemlate()
      })
    },
    // 刷新
    async refreshData() {
      this.getTemlate()
    },
    deleteTemplate(item) {
      const msg = '确定要删除' + item.name + '吗?'
      $confirm(msg, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTemplate(item.id)
            .then(() => {
              $message({
                type: 'success',
                message: '删除成功'
              })
              this.currentItem = {}
              this.getTemlate()
            })
            .catch(err => {
              const msg = err.data.message
              $message(msg)
            })
        })
        .catch(e => {
          console.log(e)
        })
    },

    editProtocolVariable() {
      this.varDialogInfo.template = this.currentTemplate
      this.varDialogInfo.protocolList = this.cardTableConfig.dataList
      // 被过滤的 也存起来 保存时要用
      if (this.protocolData.length !== this.filterProtocolData.length) {
        const filtered = _.pullAll(this.protocolData, this.filterProtocolData)
        this.varDialogInfo.filtered = filtered
      }
      // 存 当前页前后的数据 保存时要用
      if (this.filterProtocolData.length > 15) {
        if (this.cardTableConfig.pagination.page === 1) {
          this.varDialogInfo.prototypeData1 = []
          this.varDialogInfo.prototypeData2 = this.filterProtocolData.slice(
            15,
            this.filterProtocolData.length
          )
        } else {
          const index = this.cardTableConfig.pagination.page * 15 - 15
          this.varDialogInfo.prototypeData1 = this.filterProtocolData.slice(0, index)
          this.varDialogInfo.prototypeData2 = this.filterProtocolData.slice(
            this.cardTableConfig.pagination.page * 15,
            this.filterProtocolData.length
          )
        }
      } else {
        this.varDialogInfo.prototypeData1 = []
        this.varDialogInfo.prototypeData2 = []
      }
      this.varDialogInfo.visible = true
      this.varDialogInfo.currentTitle = '协议变量操作'
    },
    clickFilterData(name) {
      this.filterProtocolData = this.protocolData.filter(item => {
        return item.name.toLowerCase().includes(name.toLowerCase())
      })
      this.cardTableConfig.pagination.total = this.filterProtocolData.length
      this.cardTableConfig.dataList = this.filterProtocolData.slice(0, 15)
    },
    // 导入
    handleVarChange() {
      //do sth
    },
    async uploadFile(file) {
      this.uploadDis = true
      importFileHandle(this, file, 'DTU', this.currentTemplate)
      // const data = await importFileHandle(this, file, '')
    },

    handleCurrentChange(val) {
      // 页码切换
      this.cardTableConfig.pagination.page = val
      this.cardTableConfig.dataList = this.filterProtocolData.slice(val * 15 - 15, [val * 15])
    }
  }
}
</script>

<style lang="scss" scoped>
@import './css/templatePageCss.scss';

.template-protocol-container {
  .left-template-box {
    .template-list-box {
      .t-item {
        .t-item-name {
          .iconfont {
            color: #26cf7d;
          }
        }
      }
    }
  }
}
</style>
