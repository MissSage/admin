<template>
  <div class="drag-container">
    <div class="drag-left">
      <div class="left-title">组件列表</div>
      <vue-draggable
        v-model="components"
        @end="end1"
        class="left-draggable-item"
        :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
        animation="300"
        @start="onStart"
        :sort="false"
        :move="onMove1"
      >
        <transition-group>
          <div
            :class="item.id === 1 ? 'item forbid' : 'item'"
            v-for="item in components"
            :key="item.id"
          >
            <i :class="item.icon" />
            {{ item.name }}
          </div>
        </transition-group>
      </vue-draggable>
      <div class="example">
        <div @click="example1">
          示例一
          <i class="el-icon-arrow-right" />
        </div>
        <div @click="example2">
          示例二
          <i class="el-icon-arrow-right" />
        </div>
        <div @click="example3">
          示例三
          <i class="el-icon-arrow-right" />
        </div>
      </div>
    </div>

    <div class="drag-center">
      <div class="center-top">
        <span>
          <!-- <i class="el-icon-warning-outline"></i>高效的表单配置 -->
        </span>
        <el-button
          type="primary"
          size="mini"
          plain
          @click="save"
        >
          <i class="el-icon-check" />保存
        </el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          @click="priview"
        >
          <i class="el-icon-view" />预览
        </el-button>
        <el-button
          type="primary"
          size="mini"
          plain
          @click="download"
        >
          <i class="el-icon-view" />下载
        </el-button>
        <el-button
          type="primary"
          @click="clearItems"
          size="mini"
          plain
        >
          <i class="el-icon-delete" />清空
        </el-button>
        <a
          style="margin-left: 15px"
          href="http://v2.volcore.xyz/document/api"
          target="_blank"
        >设计器基于框架volform、voltable、volupload、volbox定制开发</a>
      </div>
      <div>
        <el-alert
          title="关于表单设计器"
          type="info"
          :show-icon="true"
          :closable="false"
        >
          <div>1、表单设计器基于draggable开发,为本框架自定义页面功能的补充,框架仍以可视化代码生成器为核心</div>
          <div>2、支持可视化设计1对1、1对多及表单下拉框自动绑定、table自动加载数据(分页、编辑)、自动上传文件、富文本编辑</div>
        </el-alert>
      </div>
      <el-scrollbar style="flex: 1">
        <div
          class="tips"
          key="empty"
          v-show="!currentComponents.length"
        >
          请将左边组件拖入此容器中
        </div>
        <el-form label-position="top">
          <vue-draggable
            class="draggable-container"
            v-model="currentComponents"
            @end="end2"
            animation="300"
            :move="onMove"
            group="componentsGroup"
          >
            <transition-group>
              <div
                class="item2"
                :class="{ actived: index === currentIndex }"
                @click="itemClick(item, index)"
                :style="{ width: item.width + '%' }"
                v-for="(item, index) in currentComponents"
                :key="index"
              >
                <i class="el-icon-document-copy" @click.stop="copyItem(item)" />
                <i class="el-icon-delete" @click.stop="removeItem(index)" />
                <el-form-item
                  :required="item.required"
                  label-position="top"
                  style="width: 100%"
                  :label="item.type === 'line' ? '' : item.name"
                >
                  <el-col>
                    <!-- <div></div> -->
                    <!-- {{ item.name }} -->
                    <el-input
                      v-if="item.type === 'text'"
                      placeholder="请输入内容"
                      v-model="item.value"
                      :disabled="item.readonly"
                      size="medium"
                    />
                    <el-input
                      v-else-if="item.type === 'textarea'"
                      type="textarea"
                      v-model="item.value"
                      :disabled="item.readonly"
                      placeholder="请输入内容"
                    />
                    <el-date-picker
                      v-else-if="item.type === 'date'"
                      v-model="item.value"
                      type="date"
                      :disabled="item.readonly"
                      size="medium"
                      placeholder="选择日期"
                    />
                    <el-radio-group
                      :disabled="item.readonly"
                      v-else-if="item.type === 'radio'"
                      v-model="item.value"
                    >
                      <el-radio
                        v-for="obj in item.data"
                        :key="obj.key"
                        :label="obj.value"
                        :value="obj.key"
                      />
                    </el-radio-group>

                    <el-checkbox-group
                      v-model="item.values"
                      :disabled="item.readonly"
                      style="width: 100%; display: inline-block"
                      v-else-if="item.type === 'checkbox'"
                    >
                      <el-checkbox
                        v-for="obj in item.data"
                        :key="obj.key"
                        :label="obj.value"
                        :value="obj.key"
                      />
                      <!-- <el-checkbox label="复选框 A"></el-checkbox>
                      <el-checkbox label="复选框 B"></el-checkbox>
                      <el-checkbox label="复选框 C"></el-checkbox>-->
                    </el-checkbox-group>

                    <el-select
                      style="width: 100%"
                      :disabled="item.readonly"
                      v-model="item.value"
                      size="medium"
                      v-else-if="item.type === 'select'"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="obj in item.data"
                        :key="obj.value"
                        :label="obj.label"
                        :value="obj.value"
                      />
                    </el-select>
                    <el-select
                      style="width: 100%"
                      :disabled="item.readonly"
                      v-model="item.values"
                      size="medium"
                      :multiple="true"
                      v-else-if="item.type === 'selectList'"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="obj in item.data"
                        :key="obj.value"
                        :label="obj.label"
                        :value="obj.value"
                      />
                    </el-select>
                    <el-cascader
                      :disabled="item.readonly"
                      style="width: 100%"
                      v-else-if="item.type === 'cascader'"
                      v-model="item.values"
                      :options="item.data"
                      @change="() => { }"
                    />

                    <el-switch
                      :disabled="item.readonly"
                      v-model="item.value"
                      style="width: 100%"
                      v-else-if="item.type === 'switch'"
                      active-color="#13ce66"
                      inactive-color="#0e7ef3"
                      :active-value="1"
                      :inactive-value="0"
                    />
                    <div class="col-line" v-else-if="item.type === 'line'">{{ item.name }}</div>

                    <lgs-uploader
                      v-else-if="
                        item.type === 'img' || item.type === 'excel' || item.type === 'file'
                      "
                      :file-info="item.fileInfo"
                      :url="item.url"
                      :img="item.type === 'img'"
                      :excel="item.type === 'excel'"
                      :multiple="item.multiple"
                      :max-size="item.maxSize"
                      :max-file="item.maxFile"
                      :auto-upload="item.autoUpload"
                    />
                    <lgs-editor
                      v-else-if="item.type === 'editor'"
                      :url="item.url"
                      v-model="item.value"
                      :height="item.height"
                    />

                    <lgs-table
                      v-else-if="item.type === 'table'"
                      :url="item.url"
                      :load-key="true"
                      :index="item.edit"
                      :table-data="item.tableData"
                      :columns="item.columns"
                      :height="item.height"
                      :pagination-hide="true"
                      :column-index="item.columnIndex"
                      :ck="item.ck"
                    />
                    <el-button
                      @click="model = true"
                      v-else-if="item.type === 'box'"
                      type="primary"
                      size="small"
                    >
                      {{ item.name }}
                    </el-button>
                  </el-col>
                </el-form-item>
              </div>
            </transition-group>
          </vue-draggable>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="drag-right">
      <div class="left-title">组件属性</div>
      <div class="attr" v-show="currentIndex != -1">
        <div class="attr-item">
          <div class="text">字段名称</div>
          <el-input size="medium" v-model="currentItem.name" />
        </div>
        <div class="attr-item">
          <div class="text">字段(唯一字段)</div>
          <el-input size="medium" v-model="currentItem.field" />
        </div>
        <div class="attr-item" v-show="currentItem.type === 'table'">
          <div class="text">后台返回数据接口地址</div>
          <el-input
            size="medium"
            placeholder="例:api/表名/getPageData"
            v-model="currentItem.url"
          />
        </div>
        <div
          class="attr-item"
          v-show="
            currentItem.type != 'table' && currentItem.hasOwnProperty('url')
          "
        >
          <div class="text">上传接口地址(后台接口)</div>
          <el-input
            size="medium"
            placeholder="可用框架地址:api/表名/upload"
            v-model="currentItem.url"
          />
          <div class="text" style="margin-top: 10px">文件大小限制(M)</div>
          <el-input size="medium" v-model="currentItem.maxSize" />
          <div class="text" style="margin-top: 10px">是否多文件上传</div>
          <el-switch
            v-model="currentItem.multiple"
            style="width: 100%"
            active-color="#13ce66"
            inactive-color="rgb(165 165 165)"
            :active-value="true"
            :inactive-value="false"
          />
          <div class="text" style="margin-top: 10px">是否自动上传</div>
          <el-switch
            v-model="currentItem.autoUpload"
            style="width: 100%"
            active-color="#13ce66"
            inactive-color="rgb(165 165 165)"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
        <div class="attr-item" v-show="currentItem.data">
          <div class="text">数据源(下拉框绑定设置中维护)</div>

          <!-- dicList -->
          <el-select
            style="width: 100%"
            v-model="currentItem.key"
            size="medium"
            @change="dicChange"
            placeholder="请选择数据源字典"
          >
            <el-option
              v-for="item in dicList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="attr-item" v-show="currentItem.type != 'table'">
          <div class="text">标签宽度</div>
          <el-slider
            style="width: 90%"
            :min="20"
            v-model="colWidth"
            :step="10"
            show-stops
          />
        </div>
        <div class="attr-item attr2" v-show="currentItem.type != 'table'">
          <div>
            <div class="text">必填</div>
            <el-switch
              v-model="currentItem.required"
              style="width: 100%"
              active-color="#13ce66"
              inactive-color="rgb(165 165 165)"
              :active-value="true"
              :inactive-value="false"
            />
          </div>

          <div>
            <!-- active-text="是"
            inactive-text="否"-->
            <div class="text">只读</div>
            <el-switch
              v-model="currentItem.readonly"
              style="width: 100%"
              active-color="#13ce66"
              inactive-color="rgb(165 165 165)"
              :active-value="true"
              :inactive-value="false"
            />
          </div>
        </div>
        <div v-show="currentItem.type === 'table'">
          <div class="attr-item">
            <div class="text">是否使用选项卡(tabs)</div>
            <div>
              <el-switch
                v-model="currentItem.tabs"
                style="width: 100%"
                active-text="是"
                inactive-text="否"
                active-color="#13ce66"
                inactive-color="rgb(165 165 165)"
                :active-value="true"
                :inactive-value="false"
              />
            </div>
          </div>
          <div class="attr-item attr2">
            <el-button
              style="width: 100%"
              @click="openTableModel"
              type="primary"
              size="medium"
            >
              table配置
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LgsDialog v-model="model">
    <div>弹出框内容</div>
    <template #footer>
      <div>
        <el-button
          type="primary"
          size="mini"
          @click="model = false"
        >
          <i class="el-icon-close" />点击关闭
        </el-button>
        <el-button size="mini" @click="model = false">
          <i class="el-icon-close" />关闭
        </el-button>
      </div>
    </template>
  </LgsDialog>
  <LgsDialog v-model="priviewModel">
    <FormPreview :options="viewFormData" />
  </LgsDialog>
  <LgsDialog v-model="tableModel">
    <el-alert
      title="关于table配置"
      type="info"
      :closable="false"
      show-icon
    >
      此处table是对框架voltable基本操作的配置,如果需要事件触发、数据加载等更多功能，请在生成后的代码添加需要的功能，完整配置见文档
      <a
        href="http://v2.volcore.xyz/document/api"
        style="color: #1e88e5; margin-left: 9px"
        target="_blank"
      >voltable</a>
    </el-alert>
    <div class="btns">
      <div class="btns-left">
        表格默认功能按钮：
        <el-checkbox
          v-for="item in currentItem.buttons"
          :label="item.name"
          :key="item.name"
        >
          {{ item.name }}
        </el-checkbox>
      </div>
      <div class="btns-right">
        <el-button
          type="primary"
          size="mini"
          @click="addRow"
        >
          <i class="el-icon-plus" />添加字段
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="delRow"
        >
          <i class="el-icon-delete" />删除字段
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="sortRow"
        >
          <i class="el-icon-sort" />重新排列
        </el-button>
      </div>
    </div>
    <lgs-table
      :load-key="true"
      :table-data="currnetTableData"
      :columns="currentTableOption"
      :height="448"
      ref="lgsTable"
      :index="true"
      :pagination-hide="true"
      :column-index="true"
      :ck="true"
    />
    <template #footer>
      <div style="text-align: center">
        <el-button size="mini" @click="tableModel = false">
          <i class="el-icon-close" />关闭
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="saveConfigOptions"
        >
          <i class="el-icon-check" />保存
        </el-button>
      </div>
    </template>
  </LgsDialog>
</template>

<script lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import FormPreview from './FormPreview.vue'
import { components, tableOption } from './options'
import { options1, options2, options3 } from './formTemplate'
import axios from 'axios'
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import LgsTable from '../LgsTable/LgsTable.vue'
export default defineComponent({
  name: 'LgsFormDraggable',
  props: {
    userComponents: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    }
  },
  components: {
    VueDraggable: VueDraggableNext,
    FormPreview
  },
  emits: ['save'],
  setup (props, ctx) {
    const state = reactive<{
      drag: boolean
      options1: any
      options2: any
      options3: any
      colWidth: number
      currentIndex: number
      currentItem: any
      currnetTableData: any[]
      currentTableOption: any
      // 定义要被拖拽对象的数组
      components: any
      currentComponents: any[]
      dicList: any[]
      model: boolean
      tableModel: boolean
      priviewModel: boolean
      viewFormData: { fields: any, formOptions: any[], tables: any[], tabs: any[] }
    }>({
      drag: false,
      options1: options1,
      options2: options2,
      options3: options3,
      colWidth: 100,
      currentIndex: -1,
      currentItem: {},
      currnetTableData: [],
      currentTableOption: tableOption,
      // 定义要被拖拽对象的数组
      components: components,
      currentComponents: [],
      dicList: [],
      model: false,
      tableModel: false,
      priviewModel: false,
      viewFormData: { fields: {}, formOptions: [], tables: [], tabs: [] }
    })
    const getFormOptions = (item: any) => {
      const _option: any = {}
      _option.field = item.field
      _option.title = item.name
      _option.type = item.type
      _option.required = item.required
      _option.readonly = item.readonly
      if (item.type === 'line') {
        _option.title = ''
        const title = item.name
        _option.render = (h: any) => {
          return h(
            'div',
            {
              style: {
                'line-height': '25px',
                'font-weight': 'bold',
                'margin-left': '15px',
                'border-bottom': '1px solid #dadada'
              }
            },
            title
            // 也可以在这里放一些组件，例如：
            // resolveComponent("el-tooltip"),
            // {
            //   content: "这里是提示的内容",
            //   props: { effect: "dark", placement: "top-start" },
            //   style: {},
            // },
            // [h("a", { style: { color: "#2a92ff" } }, "提示信息")]
          )
        }
      }
      if (item.type === 'editor') {
        _option.height = item.height
      }
      if (item.width === 100) {
        _option.colSize = 12
      } else {
        _option.colSize = (_option.width * 12) / 100
      }
      if ([
        'img',
        'excel',
        'file'
      ].indexOf(item.type) !== -1) {
        _option.maxSize = item.maxSize
        _option.fileInfo = item.fileInfo
        _option.multiple = item.multiple
        _option.autoUpload = item.autoUpload
        _option.maxFile = item.maxFile
      }
      if (
        [
          'img',
          'excel',
          'file',
          'editor',
          'table'
        ].indexOf(item.type) !== -1
      ) {
        _option.url = item.url
      }
      if (item.data) {
        _option.data = item.data
        _option.dataKey = item.key
      }
      return _option
    }
    const getLineFormOptions = (index: any) => {
      const _index = index
      let endIndex = index
      let width = 0
      const _options = []
      for (index; index < filterCurrentComponents().length; index++) {
        const item = state.currentComponents[index]
        if (item.width + width <= 100) {
          width = item.width + width
          endIndex = index
          _options.push(getFormOptions(item))
        }
      }
      return { options: _options, index: _index, endIndex: endIndex }
    }
    const filterCurrentComponents = () => {
      return state.currentComponents.filter((x: any) => {
        return x.type !== 'table'
      })
    }
    const setSpan = () => { }
    const priview = () => {
      const _fields: any = {}
      const _formOptions: any[] = []
      let endIndex = -1
      filterCurrentComponents().forEach((item: any, index: any) => {
        // if (item.hasOwnProperty('values')) {
        //   _fields[item.field] = []
        // } else {
        //   _fields[item.field] = null
        // }

        if (item.width === 100) {
          _formOptions.push([getFormOptions(item)])
        } else {
          if (endIndex === -1) {
            const lineOptions = getLineFormOptions(index)
            endIndex = lineOptions.endIndex
            _formOptions.push(lineOptions.options)
            endIndex--
          } else {
            endIndex--
          }
        }
        // _fields[item.field] = null;xc
        // let _option = {};
        // _option.field = item.field;
        // _option.title = item.name;
        // _option.type = item.type;
        // _option.required = item.required;
        // _option.readonly = item.readonly;
        // if (["img", "excel", "file"].indexOf(item.type) != -1) {
        //   _option.maxSize = item.maxSize;
        //   _option.fileInfo = item.fileInfo;
        //   _option.multiple = item.multiple;
        //   _option.autoUpload = item.autoUpload;
        //   _option.maxFile = item.maxFile;
        // }
        // if (
        //   ["img", "excel", "file", "editor", "table"].indexOf(item.type) != -1
        // ) {
        //   _option.url = item.url;
        // }
        // if (item.data) {
        //   _option.data = item.data;
        //   _option.dataKey = item.key;
        // }
        // _formOptions.push(_option);
      })
      state.viewFormData.fields = _fields
      // console.log(JSON.stringify(_formOptions))
      state.viewFormData.formOptions = _formOptions
      state.priviewModel = true
      let tableIndex = 0
      const keys: any[] = []
      const tables = state.currentComponents
        .filter((x) => {
          return x.type === 'table'
        })
        .map((m) => {
          m.pagination = !m.url
          if (m.name === '表格') {
            tableIndex++
          }
          return {
            name: m.name + (m.name === '表格' ? tableIndex : ''),
            url: m.url,
            tabs: m.tabs,
            pagination: m.pagination,
            buttons: m.buttons,
            columns: m.columns.map((c: any) => {
              const obj: any = {
                title: c.title,
                field: c.field,
                hidden: !c.show,
                width: c.width,
                required: c.required,
                bind: null
              }

              if (c.dataSource) {
                obj.bind = { key: c.dataSource, data: [] }
              }
              if (c.dataSource) {
                keys.push(c.dataSource)
              }
              if (c.edit) {
                if (!obj.bind) {
                  obj.bind = { key: '', data: [] }
                }
                obj.edit = { type: c.editType }
              }
              return obj
            }),
            tableData: [
              {},
              {},
              {}
            ]
          }
        })
      state.viewFormData.tables = tables.filter((x) => {
        return !x.tabs
      })
      state.viewFormData.tabs = tables.filter((x) => {
        return x.tabs
      })
      getDicKeys(keys)
    }
    const getDicKeys = (keys: any) => {
      if (!keys.length) {
        return
      }
      axios.post('api/Sys_Dictionary/GetVueDictionary', keys)
        .then((result: any) => {
          result.forEach((c: any) => {
            state.viewFormData.tables.forEach((t: any) => {
              const _option = t.columns.find((x: any) => {
                return x.bind && x.bind.key === c.dicNo
              })
              if (_option) {
                _option.bind.data = c.data
              }
            })
            state.viewFormData.tabs.forEach((t: any) => {
              const _option = t.columns.find((x: any) => {
                return x.bind && x.bind.key === c.dicNo
              })
              if (_option) {
                _option.bind.data = c.data
              }
            })
          })
        })
    }
    const save = () => {
      ctx.emit('save', state.currentComponents)
    }
    const download = () => {
      ElMessage.info('开发中')
    }
    const openTableModel = () => {
      const dataSource = state.currentTableOption.find((x: any) => {
        return x.field === 'dataSource'
      })
      if (!dataSource.bind.data.length) {
        dataSource.bind.data = state.dicList
      }
      state.currnetTableData = JSON.parse(
        JSON.stringify(state.currentItem.columns)
      )
      state.tableModel = true
    }
    const addRow = () => {
      state.currnetTableData.push({ field: getField() })
    }
    const lgsTable = ref<InstanceType<typeof LgsTable>>()
    const delRow = () => {
      ElMessageBox.confirm('确认要删除选择的数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        lgsTable.value && lgsTable.value.delRow()
      })
    }
    const sortRow = () => {
      state.currnetTableData = state.currnetTableData.sort((a: any, b: any) => {
        return a.orderNo - b.orderNo
      }) // .reverse();
      ElMessage.success('列显示顺序已重新排列,点击预览可查看')
    }
    const saveConfigOptions = () => {
      state.currentItem.columns = JSON.parse(
        JSON.stringify(state.currnetTableData)
      )
      state.tableModel = false
    }
    const copyItem = (item: any) => {
      const itemClone = JSON.parse(JSON.stringify(item))
      itemClone.field = 'field' + new Date().valueOf()
      state.currentComponents.push(itemClone)
    }
    const removeItem = (index: any) => {
      state.currentComponents.splice(index, 1)
      state.colWidth = 100
      state.currentIndex = -1
      state.currentItem = {}
    }
    const clearItems = () => {
      state.currentComponents.length = 0
      state.colWidth = 100
      state.currentIndex = -1
      state.currentItem = {}
    }
    const itemClick = (item: any, index: any) => {
      state.currentIndex = index
      state.colWidth = state.currentComponents[state.currentIndex].width
      state.currentItem = state.currentComponents[state.currentIndex]
    }
    // 开始拖拽事件
    const onStart = (e: any, e1: any) => {
      state.drag = true
    }
    const getField = () => {
      return 'field' + new Date().valueOf()
    }
    // 左边往右边拖动时的事件
    const end1 = (e: any) => {
      if (e.from !== e.to) {
        const obj = JSON.parse(JSON.stringify(state.components[e.oldIndex]))
        obj.field = getField()
        obj.width = 100
        obj.readonly = false
        obj.required = false
        state.currentComponents.splice(e.newIndex, 1, obj)
        props.userComponents.splice(0)
        props.userComponents.push(...state.currentComponents)
        // state.currentComponents = state.currentComponents.filter((x) => {
        //   return x.hasOwnProperty("field");
        // });
        state.colWidth = 100
        state.currentIndex = e.newIndex // state.currentComponents.length - 1;
        state.currentItem = state.currentComponents[state.currentIndex]
      }
    }
    // 右边往左边拖动时的事件
    const end2 = (e: any) => { }

    const onMove1 = (e: any, originalEvent: any) => {
      // state.moveId = e.relatedContext.element.id;
      return true
    }
    // move回调方法
    const onMove = (e: any, originalEvent: any) => {
      console.log(JSON.stringify(state.currentComponents))
      return true
    }
    const dicChange = (key: any) => {
      axios.post('api/Sys_Dictionary/GetVueDictionary', [key])
        .then((result: any) => {
          state.currentItem.data = result[0].data
          if (result[0].data.length) {
            if (state.currentItem.type === 'select') {
              state.currentItem.value = result[0].data[0].value
            } else {
              state.currentItem.values = [result[0].data[0].value]
            }
          }
        })
    }
    const example1 = () => {
      state.currentComponents = state.options1
    }
    const example2 = () => {
      state.currentComponents = state.options2
    }
    const example3 = () => {
      state.currentComponents = state.options3
    }
    watch(
      () => state.colWidth,
      (newVal: any) => {
        if (state.currentIndex !== -1) {
          state.currentComponents[state.currentIndex].width = newVal
        }
      }
    )
    onMounted(() => {
      //  state.currentComponents = state.userComponents;
      state.currentComponents.push(...props.userComponents)
      // state.http
      state.dicList = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3' }
      ]
      // axios.post('api/Sys_Dictionary/GetBuilderDictionary', {})
      //   .then((x: any) => {
      //     state.dicList = x.map((c: any) => {
      //       return { key: c, value: c }
      //     })
      //   })
    })
    const tabsTable = computed(
      () => {
        return state.currentComponents.filter(x => {
          return x.type === 'table' && x.tabs === true
        })
      }
    )
    return {
      ...toRefs(state),
      tabsTable,
      example3,
      example2,
      example1,
      dicChange,
      onMove,
      onMove1,
      end2,
      end1,
      onStart,
      itemClick,
      clearItems,
      removeItem,
      copyItem,
      saveConfigOptions,
      sortRow,
      delRow,
      addRow,
      openTableModel,
      download,
      save,
      getDicKeys,
      priview,
      setSpan,
      filterCurrentComponents,
      getLineFormOptions,
      getFormOptions
    }
  }
})

</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.drag-container {
  /* padding: 20px; */
  display: flex;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
.drag-left {
  width: 250px;
  display: flex;
  border-right: 1px solid #eee;
  flex-direction: column;
}
.left-title {
  height: 42px;
  text-align: left;
  border-right: 1px solid #eee;
  padding: 10px 0 10px 11px;
  border-bottom: 1px solid #eee;
}
.drag-center {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.left-draggable-item {
  //   flex: 1;
  display: inline-block;
  padding: 5px;
  //   border-right: 1px solid #eee;
}

.left-draggable-item .item {
  cursor: move;
  float: left;
  width: 111px;
  /* height: 20px; */
  text-align: center;
  border: 1px solid #eeeeee;
  padding: 2px 13px;
  text-align: left;
  line-height: 28px;
  margin: 4px;
  border-radius: 3px;
  background: #f0f9eb;
  font-size: 13px;
}
.draggable-container {
  display: inline-block;
  width: 100%;
  height: calc(100vh - 215px);
  padding: 10px 0;
}

.item2 {
  position: relative;
  cursor: move;
  padding: 18px 10px 10px 10px;
  text-align: left;
  float: left;
  margin-bottom: 10px;
}
.item2 .el-icon-delete,
.item2 .el-icon-document-copy {
  position: absolute;
  right: 10px;
  top: 2px;
  padding: 5px;
  display: none;
  color: red;
  cursor: pointer;
}
.item2 .el-icon-document-copy {
  right: 35px;
}
.item2:hover,
.actived {
  background: #f0f9eb;
}
.item:hover {
  border: 1px dashed #787be8;
  color: #787be8;
}
.item2:hover .el-icon-delete,
.item2:hover .el-icon-document-copy {
  display: block;
}

.drag-right {
  background: #f7fbff3d;
  width: 250px;
  border-left: 1px solid #eee;
}

.center-top {
  height: 42px;
  line-height: 41px;
  background: #f2f5fb;
  border-bottom: 1px solid #eee;
  text-align: left;
  padding: 0 10px;
  font-size: 12px;
  color: #3391f3;
}
.center-top span {
  margin-right: 10px;
}
.attr {
  padding: 0px 15px 15px 15px;
}
.attr-item {
  text-align: left;
  margin-top: 12px;
  font-size: 14px;
}
.attr-item .text {
  padding: 0 0 5px 5px;
}
.attr2 {
  display: flex;
}
.attr2 > div {
  flex: 1;
}
.tips {
  position: absolute;
  font-size: 26px;
  letter-spacing: 6px;
  left: 0px;
  right: 0px;
  top: 150px;
  width: 500px;
  margin: auto;
  color: #c5c5c5;
}
.col-line {
  line-height: 25px;
  font-weight: bold;
  border-bottom: 1px solid rgb(218 218 218);
}
.drag-container ::v-deep(.el-col) {
  width: 100%;
}
// .drag-center ::v-deep(.el-form-item__label) {
//   line-height: 0 !important;
// }
.drag-center ::v-deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
.drag-center ::v-deep(.el-form-item) {
  margin-bottom: 10px;
}
.drag-center ::v-deep(.el-date-editor) {
  width: 100%;
}
.drag-center ::v-deep(.el-checkbox) {
  margin-right: 15px;
}
.drag-center ::v-deep(.el-checkbox__label) {
  padding-left: 5px;
}
// .drag-center ::v-deep(.hello > div) {
//   z-index: 500 !important;
// }
.drag-center ::v-deep(th),
.drag-center ::v-deep(td) {
  padding: 6px 0;
}
.example {
  margin-top: 8px;
  > div {
    cursor: pointer;
    padding: 14px 20px;
    border-top: 1px solid #eee;
    font-size: 13px;
    color: #646465;
    position: relative;
  }
  > div:hover {
    background: rgb(231, 231, 231);
  }
  i {
    position: absolute;
    right: 20px;
  }
}
.btns {
  padding: 8px 0;
  display: flex;
  > div {
    flex: 1;
  }
  .btns-left {
    padding-top: 8px;
    color: black;
    font-weight: bold;
  }
  .btns-right {
    text-align: right;
  }
}
</style>
