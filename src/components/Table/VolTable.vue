<template>
  <!-- 2021.11.18移除voltable方法@cell-mouse-leave="rowEndEdit" -->
  <div
    class="vol-table"
    :class="[textInline ? 'text-inline' : '', fxRight ? 'fx-right' : '']"
  >
    <div class="mask" v-show="loading" />
    <div class="message" v-show="loading">加载中.....</div>
    <el-table
      lazy
      stripe
      tooltip-effect="dark"
      border
      ref="table"
      class="v-table"
      :show-summary="summary"
      :summary-method="getSummaryData"
      :row-key="rowKey"
      :key="randomTableKey"
      :load="loadTreeChildren"
      @select="userSelect"
      @select-all="userSelect"
      @selection-change="selectionChange"
      @row-dblclick="rowDbClick"
      @row-click="rowClick"
      @header-click="headerClick"
      @sort-change="sortChange"
      :height="realHeight"
      :max-height="realMaxHeight"
      :data="url ? rowData : tableData"
      :row-class-name="initIndex"
      :cell-style="getCellStyle"
      style="width: 100%"
    >
      <el-table-column
        v-if="columnIndex"
        type="index"
        :fixed="fixed"
        width="55"
      />
      <el-table-column
        v-if="ck"
        type="selection"
        :fixed="fixed"
        width="55"
      />
      <!-- 2020.10.10移除table第一行强制排序 -->
      <el-table-column
        v-for="(column, cindex) in filterColumns"
        :prop="column.field"
        :label="column.title"
        :min-width="column.width"
        :formatter="formatter"
        :fixed="column.fixed"
        :key="column.field + cindex"
        :align="column.align"
        :sortable="column.sort ? 'custom' : false"
      >
        <template #default="scope">
          <!-- 2020.06.18增加render渲染自定义内容 -->
          <VolTableRender
            v-if="column.render && typeof column.render === 'function'"
            :row="scope.row"
            key="rd-01"
            :index="scope.$index"
            :column="column"
            :render="column.render"
          />
          <!-- 启用双击编辑功能，带编辑功能的不会渲染下拉框文本背景颜色 -->
          <!-- @click="rowBeginEdit(scope.$index,cindex)" -->
          <!-- 2021.09.21增加编辑时对readonly属性判断 -->
          <div v-else-if="column.edit && !column.readonly" class="edit-el">
            <div
              @click.stop
              v-if="column.edit.keep || edit.rowIndex === scope.$index"
              class="e-item"
            >
              <div>
                <!-- 2020.07.24增加日期onChange事件 -->
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 100%"
                  v-if="['date', 'datetime'].indexOf(column.edit.type) !== -1"
                  v-model="scope.row[column.field]"
                  @change="column.onChange"
                  :type="column.edit.type"
                  :placeholder="
                    column.placeholder
                      ? column.placeholder
                      : '请选择' + column.title
                  "
                  :disabled-date="(val:any) => getDateOptions(val, column)"
                  :value-format="getDateFormat(column)"
                />
                <el-switch
                  v-else-if="column.edit.type === 'switch'"
                  v-model="scope.row[column.field]"
                  active-color="#0f84ff"
                  inactive-color="rgb(194 194 194)"
                  @change="
                    (val:any) => {
                      switchChange(val, scope.row, column);
                    }
                  "
                  :active-value="
                    typeof scope.row[column.field] === 'boolean' ? true : 1
                  "
                  :inactive-value="
                    typeof scope.row[column.field] === 'boolean' ? false : 0
                  "
                />
                <el-select
                  size="small"
                  style="width: 100%"
                  v-else-if="
                    ['select', 'selectList'].indexOf(column.edit.type) !== -1
                  "
                  v-model="scope.row[column.field]"
                  :filterable="
                    column.filter || column.bind.data.length > 10 ? true : false
                  "
                  :multiple="column.edit.type === 'select' ? false : true"
                  :placeholder="
                    column.placeholder
                      ? column.placeholder
                      : '请选择' + column.title
                  "
                  :autocomplete="column.autocomplete"
                  @change="
                    column.onChange && column.onChange(scope.row, column)
                  "
                  clearable
                >
                  <el-option
                    v-for="item in column.bind.data"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  >
                    {{ item.value }}
                  </el-option>
                </el-select>
                <el-input
                  v-else
                  @change="inputKeyPress(scope.row, column, $event)"
                  @input="inputKeyPress(scope.row, column, $event)"
                  @keyup.enter="inputKeyPress(scope.row, column, $event)"
                  size="small"
                  v-model="scope.row[column.field]"
                  :placeholder="'请输入' + column.title"
                />
              </div>
              <div
                class="extra"
                v-if="column.extra && edit.rowIndex === scope.$index"
              >
                <a
                  :style="column.extra.style"
                  @click="extraClick(scope.row, column)"
                >
                  <i v-if="column.extra.icon" :clss="[column.extra.icon]" />
                  {{ column.extra.text }}
                </a>
              </div>
            </div>
            <template v-else>
              <div
                v-if="column.formatter"
                v-html="column.formatter(scope.row, column)"
              />
              <div v-else>{{ formatter(scope.row, column, true) }}</div>
            </template>
          </div>
          <!--没有编辑功能的直接渲染标签-->
          <template v-else>
            <a
              href="javascript:void(0)"
              @click="link(scope.row, column, $event)"
              v-if="column.link"
              v-text="scope.row[column.field]"
            />
            <img
              v-else-if="column.type === 'img'"
              v-for="(file, imgIndex) in getFilePath(
                scope.row[column.field],
                column
              )"
              :key="imgIndex"
              :onerror="defaultImg"
              @click="viewImg(scope.row, column, file.path, $event)"
              class="table-img"
              :src="file.path"
            >
            <a
              style="margin-right: 8px"
              v-else-if="column.type === 'file' || column.type === 'excel'"
              class="t-file"
              v-for="(file, fIndex) in getFilePath(
                scope.row[column.field],
                column
              )"
              :key="fIndex"
              @click="dowloadFile(file)"
            >{{ file.name }}</a>
            <span v-else-if="column.type === 'date'">{{
              formatterDate(scope.row, column)
            }}</span>
            <div
              v-else-if="column.formatter"
              @click="formatterClick(scope.row, column, $event)"
              v-html="column.formatter(scope.row, column)"
            />
            <!-- 2021.11.18修复table数据源设置为normal后点击行$event缺失的问题 -->
            <div
              v-else-if="column.bind && column.normal"
              @click="formatterClick(scope.row, column, $event)"
              :style="column.getStyle && column.getStyle(scope.row, column)"
            >
              {{ formatter(scope.row, column, true) }}
            </div>
            <div
              v-else-if="column.click"
              @click="formatterClick(scope.row, column)"
            >
              {{ scope.row[column.field] }}
            </div>
            <template v-else-if="column.bind">
              <el-tag
                size="small"
                :class="[isEmptyTag(scope.row, column)]"
                :type="getColor(scope.row, column)"
              >
                {{ formatter(scope.row, column, true) }}
              </el-tag>
            </template>

            <span v-else>{{ formatter(scope.row, column, true) }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="!paginationHide">
      <div class="block pagination" key="pagination-01">
        <el-pagination
          key="pagination-02"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paginations.page"
          :page-sizes="paginations.sizes"
          :page-size="paginations.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginations.total"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import VolTableRender from './VolTableRender'
import { defineComponent, PropType, toRefs, reactive, ref, watch, onMounted, computed } from 'vue'
import { IELTable } from '@/types/element-plus'
import base from '@/utils/common'
import { useStore } from '@/store/'
import { ElMessage } from 'element-plus'
import axios from 'axios'
export default defineComponent({
  components: { VolTableRender },
  props: {
    rowKey: {
    // 树形结构的主键字段，如果设置值默认会开启树形table；注意rowKey字段的值必须是唯一（2021.05.02）
      type: String,
      default: ''
    },
    loadTreeChildren: {
    // 树形结构加载子节点
      type: Function,
      default: (tree:any, treeNode:any, resolve:any) => {
        return resolve([])
      }
    },
    textInline: {
    // 表格内容超出后是否换行显示（2020.01.16）
      type: Boolean,
      default: true
    },
    tableData: {
    // 表数据源,配置了url就不用传这个参数了
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    height: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    linkView: {
      type: Function as PropType<(row:any, column:any)=>any>,
      default: () => {
        return 1
      }
    },
    pagination: {
      type: Object as PropType<any>,
      default: () => {
        return { total: 0, size: 30, sortName: '' }
      }
    },
    url: {
      type: String,
      default: ''
    },
    paginationHide: {
      type: Boolean,
      default: true
    },
    color: {
      type: Boolean,
      default: true
    },
    index: {
    // 是否创建索引号,如果需要表格编辑功能，这里需要设置为true
      type: Boolean,
      default: false
    },
    allowEmpty: {
    // 表格数据为空时是否默认为--
      type: Boolean,
      default: true
    },
    defaultLoadPage: {
    // 传入了url，是否默认加载表格数据
      type: Boolean,
      default: true
    },
    loadKey: {
    // 是否自动从后台加载数据源
      type: Boolean,
      default: true
    },
    single: {
      type: Boolean, // 是否单选
      default: false
    },
    doubleEdit: {
      type: Boolean, // 是否双击启用编辑功能
      default: true
    },
    beginEdit: {
    // 编辑开始
      type: Function as PropType<(row:any, column:any, elementIndex:any)=>boolean>,
      default: (row:any, column:any, index:any) => {
        return true
      }
    },
    endEditBefore: {
    // 结束编辑前
      type: Function as PropType<(row:any, column:any, rowIndex:any)=>boolean>,
      default: (row:any, column:any, index:any) => {
        return true
      }
    },
    endEditAfter: {
    // 结束编辑前
      type: Function as PropType<(row:any, column:any, rowIndex:any)=>boolean>,
      default: (row:any, column:any, index:any) => {
        return true
      }
    },
    ck: {
    // 是否显示checkbox
      type: Boolean,
      default: true
    },
    columnIndex: {
    // 是否显示行号(2020..11.1)
      type: Boolean,
      default: true
    }
  },
  emits: ['rowDbClick', 'rowClick', 'loadBefore', 'loadAfter', 'rowChange'],
  setup (props, ctx) {
    let _errMsg = ''
    const state = reactive({
      fixed: false, // 是固定行号与checkbox
      clickEdit: true, // 2021.07.17设置为点击行结束编辑
      randomTableKey: 1,
      visiblyColumns: [],
      key: '',
      realHeight: 0,
      realMaxHeight: 0,
      enableEdit: false, // 是否启表格用编辑功能
      empty: props.allowEmpty ? '' : '--',
      defaultImg: 'state.src="' + require('@/assets/imgs/error.png') + '"',
      loading: false,
      footer: {},
      total: 0,
      formatConfig: {} as any,
      // defaultColor: "",
      // 2020.09.06调整table列数据源的背景颜色
      colors: [
        '',
        'warning',
        'success',
        'green',
        'info'
        // "magenta",
        // "geekblue",
        // "gold",
        // "orange",
        // "default",
      ],
      rule: {
        phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        decimal: /(^[-0-9][0-9]*(.[0-9]+)?)$/,
        number: /(^[-0-9][0-9]*([0-9]+)?)$/
      },
      columnNames: [] as any[],
      rowData: [] as any[],
      paginations: {
        sort: '',
        order: 'desc',
        Foots: '',
        total: 0,
        // 2020.08.29增加自定义分页条大小
        sizes: [30, 60, 100, 120],
        size: 30, // 默认分页大小
        wheres: [] as any[],
        page: 1,
        rows: 30
      },
      errorFiled: '',
      edit: { columnIndex: -1, rowIndex: -1 }, // 当前双击编辑的行与列坐标
      editStatus: {} as any,
      summary: false, // 是否显示合计
      // 目前只支持从后台返回的summaryData数据
      summaryData: [] as any[],
      summaryIndex: {} as any,
      remoteColumns: [] as any[], // 需要每次刷新或分页后从后台加载字典数据源的列配置
      cellStyleColumns: {} as any, // 有背景颜色的配置
      fxRight: false, // 是否有右边固定表头
      selectRows: [] as any[] // 当前选中的行
    })

    const table = ref<IELTable>()
    const watchRowSelectChange = (newLen:any, oldLen:any) => {
      if (newLen < oldLen && state.selectRows.length) {
        state.selectRows = []
        table.value && table.value.clearSelection()
      }
    }

    const getHeight = () => {
      // 没有定义高度与最大高度，使用table默认值
      if (!props.height && !props.maxHeight) {
        return null
      }
      // 定义了最大高度则不使用高度
      if (props.maxHeight) {
        return null
      }
      // 使用当前定义的高度
      return props.height
    }
    const switchChange = (val:any, row:any, column:any) => {
      // 这里在初始化的时候也会触发change事件
      if (Object.keys(row).length <= 1) {
        return
      }
      if (column.onChange) {
        column.onChange(val, row, column)
      }
    }
    const inputKeyPress = (row:any, column:any, $event:any, $e?:any) => {
      column.onKeyPress && column.onKeyPress(row, column, $event)
      getInputSummaries(null, null, $event, column)
    }
    const extraClick = (row:any, column:any) => {
      column.extra.click &&
        column.extra.click(row, column, props.url ? state.rowData : props.tableData)
    }
    const headerClick = (column:any, event:any) => {
      if (state.clickEdit && state.edit.rowIndex !== -1) {
        if (
          rowEndEdit(
            props.url
              ? state.rowData[state.edit.rowIndex]
              : props.tableData[state.edit.rowIndex],
            column
          )
        ) {
          state.edit.rowIndex = -1
        }
      }
      // state.edit.rowIndex = -1;
    }
    const rowDbClick = (row:any, column:any, event:any) => {
      // 2021.05.23增加双击行事件
      ctx.emit('rowDbClick', { row, column, event })
    }
    const rowClick = (row:any, column:any, event:any) => {
      // 正在编辑时，禁止出发rowClick事件
      if (state.edit.rowIndex === -1) {
        ctx.emit('rowClick', { row, column, event })
      }
      // 点击行事件(2020.11.07)

      if (!props.doubleEdit) {
        return
      }
      // 点击其他行时，如果点击的行与正在编辑的行相同，保持编辑状态
      if (state.clickEdit && state.edit.rowIndex !== -1) {
        if (row.elementIndex === state.edit.rowIndex) {
          // 点击的单元格如果不可以编辑，直接结束编辑
          // 2020.10.12修复结束编辑时，element table高版本属性获取不到的问题
          const _col = props.columns.find((x) => {
            return x.field === ((event && event.property) || column.property)
          })
          if (_col && (!_col.edit || _col.readonly)) {
            if (rowEndEdit(row, event)) {
              state.edit.rowIndex = -1
            }
          }
          return
        }
        if (rowEndEdit(row, event && event.property ? event : column)) {
          state.edit.rowIndex = -1
        }
      }
      rowBeginEdit(row, column)
    }
    const store = useStore()
    const ipAddress = import.meta.env.VITE_API_BASEURL
    const dowloadFile = (file:any) => {
      base.dowloadFile(
        file.path,
        file.name,
        {
          Authorization: store.getters.getToken()
        },
        ipAddress
      )
    }
    const getFilePath = (pathSring:any, column:any) => {
      // 获取表的图片与文件显示
      if (!pathSring) return []
      // 增加图片自定义操作
      // 返回格式必须是[{name:"文件名",path:"图片全路径或base64格式"}]
      if (column.formatter) {
        return column.formatter(pathSring)
      }
      const filePath = pathSring.replace(/\\/g, '/').split(',')
      const fileInfo = []
      for (let index = 0; index < filePath.length; index++) {
        const file = filePath[index]
        // 2020.12.19增加base64图片显示
        if (column.base64) {
          fileInfo.push({
            name: '',
            path:
              (file.indexOf('base64,') === -1 ? 'data:image/png;base64,' : '') +
              file
          })
        } else if (file.indexOf('.') !== -1) {
          const splitFile = file.split('/')
          if (splitFile.length > 0) {
            fileInfo.push({
              name: splitFile[splitFile.length - 1],
              path: base.isUrl(file) ? file : ipAddress + file
            })
          }
        }
      }
      return fileInfo
    }
    // 重置table
    const reset = () => {
      if (props.tableData && props.tableData.length > 0) {
        props.tableData.splice(0)
      }
      if (state.rowData && state.rowData.length > 0) {
        state.rowData.splice(0)
      }
      if (!props.paginationHide) {
        state.paginations.page = 1
        // state.paginations.rows = 30;
        if (state.paginations.wheres && state.paginations.wheres.length > 0) {
          state.paginations.wheres.splice(0)
        }
      }
      state.errorFiled = ''
      state.edit.columnIndex = -1
      state.edit.rowIndex = -1
    }
    const getMaxHeight = () => {
      // 没有定义高度与最大高度，使用table默认值
      if (!props.height && !props.maxHeight) {
        return null
      }
      // 定义了最大高度使用最大高度
      if (props.maxHeight) {
        return props.maxHeight
      }
      // 不使用最大高度
      return null
    }
    const getSelectedOptions = (column:any) => {
      if (column.bind && column.bind.data && column.bind.data.length > 0) {
        return column.bind.data
      }
      return []
    }
    const formatterClick = (row:any, column:any, event?:any) => {
      column.click && column.click(row, column, event)
      event.stopPropagation()
    }
    const initIndex = ({ row, rowIndex }:any) => {
      if (props.index) {
        row.elementIndex = rowIndex
      }
      // if (rowIndex%2!==0) {
      //  return "even-row";
      // }
    }
    function toggleEdit (event:any) {}
    function setEditStatus (status:any) {
      // state.columns.forEach((x) => {
      //   if (x.hasOwnProperty("edit")) {
      //     state.$set(x.edit, "status", status);
      //   }
      // });
    }
    // 通过button按钮启用编辑
    function beginWithButtonEdit (scope:any) {
      // url?rowData:tableData
      rowBeginEdit(scope.row, props.columns[scope.$index])
    }
    function rowBeginEdit (row:any, column:any) {
      if (state.edit.rowIndex !== -1) {
        return
      }
      const _row = props.columns.find((x:any) => x.field === column.property)
      if (_row) {
        if (_row.readonly) {
          return
        }
        if (
          // 不能编辑的字段、switch，点击不开启启编辑功能
          !_row.edit ||
          (_row.edit.keep && _row.edit.type === 'switch')
        ) {
          return
        }
      }
      if (!state.enableEdit) return
      _errMsg = ''
      // 编辑前
      // if (!props.beginEdit(row, column, row.elementIndex)) return
      // if (row.hasOwnProperty('elementIndex')) {
      //   if (state.edit.rowIndex === row.elementIndex) {
      //     return
      //   }
      //   state.edit.rowIndex = row.elementIndex
      // }
    }
    const rowEndEdit = (row:any, column:any, event?:any) => {
      if (state.clickEdit && event) {
        return true
      }
      if (!state.enableEdit) {
        if (!state.errorFiled) {
          if (
            state.edit.rowIndex !== -1 &&
            !props.endEditAfter(row, column, state.edit.rowIndex)
          ) {
            return false
          }
          state.edit.rowIndex = -1
        }
        return true
      }
      if (!props.doubleEdit && event) {
        return true
      }
      // 结束编辑前
      if (!props.endEditBefore(row, column, state.edit.rowIndex)) return false

      if (state.edit.rowIndex !== -1) {
        const row = (props.url ? state.rowData : props.tableData)[
          state.edit.rowIndex
        ]
        for (let index = 0; index < props.columns.length; index++) {
          const _column = props.columns[index]
          if (_column.edit) {
            if (!validateRow(row, _column)) {
              return
            }
          }
        }
      }
      if (!props.endEditAfter(row, column, state.edit.rowIndex)) return false
      state.edit.rowIndex = -1
      return true
    }
    const validateRow = (row:any, option:any) => {
      if (!validateColum(option, row)) {
        state.errorFiled = option.field
        _errMsg = option.title + _errMsg
        ElMessage.error(_errMsg)
        return false
      }
      state.errorFiled = ''
      return true
    }
    function validateColum (option:any, data:any) {
      if (option.hidden || option.bind) return true
      const val = data[option.field]
      if (option.require || option.required) {
        if (val !== '0' && (val === '' || val === undefined)) {
          if (!state.errorFiled) {
            _errMsg = '不能为空'
          }
          return false
        }
      }
      if (!option.edit) {
        return true
      }
      const editType = option.edit.type
      // 验证数字
      if (editType === 'int' || editType === 'decimal' || editType === 'number') {
        if (val === '' || val === undefined) return true
        if (editType === 'decimal') {
          if (!state.rule.decimal.test(val)) {
            _errMsg = '只能是数字'
            return false
          }
        } else if (!state.rule.decimal.test(val)) {
          _errMsg = '只能是数字'
          return false
        }
        if (
          option.edit.min !== undefined &&
          typeof option.edit.min === 'number' &&
          val < option.edit.min
        ) {
          _errMsg = '不能小于' + option.edit.min
          return false
        }
        if (
          option.edit.max !== undefined &&
          typeof option.edit.max === 'number' &&
          val > option.edit.max
        ) {
          _errMsg = '不能大于' + option.edit.max
          return false
        }
        return true
      }

      // 验证字符串
      if (val && (editType === 'text' || editType === 'string')) {
        if (
          option.edit.min !== undefined &&
          typeof option.edit.min === 'number' &&
          val.length < option.edit.min
        ) {
          _errMsg = '至少' + option.edit.min + '个字符'
          return false
        }
        if (
          option.edit.max !== undefined &&
          typeof option.edit.max === 'number' &&
          val.length > option.edit.max
        ) {
          _errMsg = '最多' + option.edit.max + '个字符'
          return false
        }
      }
      return true
    }
    function delRow () {
      const rows = getSelected()
      if (rows.length === 0) return ElMessage.error('请选择要删除的行!')

      const data = props.url ? state.rowData : props.tableData
      const indexArr = getSelectedIndex()
      if (indexArr.length === 0) {
        return ElMessage.error(
          "删除操作必须设置VolTable的属性index='true'"
        )
      }
      // if (indexArr.length === 0 || !state.key) {
      //   return state.$message.error(
      //     "请设置index=true属性或指columns的字段为key"
      //   );
      // }
      if (indexArr.length === 0) {
        // let keyValues=[]
        // rows.forEach(x=>{
        //   if (x[state.key]) {
        //   }
        //   keyValues.push(x[state.key])
        // })
        // data.find(x=>)
      } else {
        for (let i = data.length - 1; i >= 0; i--) {
          if (indexArr.indexOf(i) !== -1) {
            data.splice(i, 1)
          }
        }
      }
      state.edit.rowIndex = -1
      return rows
    }
    function addRow (row:any) {
      if (!row) {
        row = {}
      }
      props.columns.forEach((x) => {
        // if (!row.hasOwnProperty(x.field)) {
        //   if (x.edit && x.edit.type === 'switch') {
        //     row[x.field] = x.type === 'bool' ? false : 0
        //   } else if (!row.hidden) {
        //     // 2020.09.06添加行时，设置默认字段
        //     row[x.field] = undefined
        //   }
        // }
      })
      if (!props.url) {
        props.tableData.push(row)
        return
      }
      state.rowData.push(row)
    }
    function viewImg (row:any, column:any, url:any, $event:any) {
      $event.stopPropagation()
      base.previewImg(url)
      // window.open(row[column.field]);
    }
    function link (row:any, column:any, $e:any) {
      $e.stopPropagation()
      props.linkView(row, column)
    }
    function getSelected () {
      return state.selectRows
    }
    function getSelectedIndex () {
      if (!props.index) {
        // 只有设置了属性index才有索引行
        return []
      }
      const indexArr = state.selectRows.map((x) => {
        return x.elementIndex
      })
      return indexArr || []
    }
    function GetTableDictionary (rows:any) {
      // 分页或刷新或重新绑定数据源
      if (state.remoteColumns.length === 0 || !rows || rows.length === 0) return
      const remoteInfo:any = {}
      for (let index = 0; index < state.remoteColumns.length; index++) {
        const column = state.remoteColumns[index]
        //  column.bind.data.splice(0);
        const key = column.bind.key
        const data:any[] = []
        rows.forEach((row:any) => {
          if (data.indexOf(row[column.field]) === -1) {
            data.push(row[column.field])
          }
        })
        if (data.length > 0) {
          remoteInfo[key] = data
        }
      }
      if (remoteInfo.length === 0) return
      // ha= Object.assign([], ha, hb)

      // state.http
      axios.post('/api/Sys_Dictionary/GetTableDictionary', remoteInfo)
        .then((dic:any) => {
          dic.forEach((x:any) => {
            state.remoteColumns.forEach((column) => {
              if (column.bind.key === x.key) {
                column.bind.data = Object.assign([], column.bind.data, x.data)
                // column.bind.data.push(...x.data);
              }
            })
          })
        })
    }
    function load (query?:any, isResetPage?:any) {
      // isResetPage重置分页数据
      if (!props.url) return
      if (isResetPage) {
        resetPage()
      }
      let param = {
        page: state.paginations.page,
        rows: state.paginations.rows,
        sort: state.paginations.sort,
        order: state.paginations.order,
        wheres: [] as any[]|string // 查询条件，格式为[{ name: "字段", value: "xx" }]
      }
      let status = true
      // 合并查询信息(包查询分页、排序、查询条件等)
      if (query) {
        param = Object.assign(param, query)
      }
      /* 查询前处理(如果需要查询条件，实现组件方法loadBefore方法即可:
        loadBefore=(param, callBack)=>{
          param.wheres = [{ name: "PhoneNo", value: "13419098211" }];
          callBack(true);
        })
      */
      ctx.emit('loadBefore', param, (result:any) => {
        status = result
      })
      if (!status) return

      if (param.wheres && param.wheres instanceof Array) {
        param.wheres = JSON.stringify(param.wheres)
      }
      state.loading = true
      axios.post(props.url, param).then(
        (data:any) => {
          // 2021.06.04修复tree不刷新的问题
          if (props.rowKey) {
            state.randomTableKey++
            state.rowData.splice(0)
          }
          state.loading = false
          // 查询返回结果后处理
          // 2020.10.30增加查询后返回所有的查询信息
          ctx.emit(
            'loadAfter',
            data.rows || [],
            (result:any) => {
              status = result
            },
            data
          )
          if (!status) return
          GetTableDictionary(data.rows)
          state.rowData = data.rows || []
          state.paginations.total = data.total
          // 合计
          getSummaries(data)
        },
        (error:any) => {
          ElMessage.error(error.message)
          state.loading = false
          // state.$Message.error(error || "网络异常");
        }
      )
    } // 获取统计
    function getSummaries (data:any) {
      if (!state.summary || !data.summary) return
      state.summaryData.splice(0)
      // 开启了行号的，+1
      if (props.columnIndex) {
        state.summaryData.push('')
      }
      // 如果有checkbox，应该算作是第一行
      if (props.ck) {
        state.summaryData.push('')
      }

      props.columns.forEach((col:any) => {
        if (!col.hidden) {
          // if (data.summary.hasOwnProperty(col.field)) {
          //   state.summaryData.push(data.summary[col.field])
          // } else {
          //   state.summaryData.push('')
          // }
          state.summaryData.push('')
        }
      })
      if (state.summaryData.length > 0 && state.summaryData[0] === '') {
        state.summaryData[0] = '合计'
      }
    }
    function getInputChangeSummaries () {}
    function handleSizeChange (val:any) {
      state.paginations.size = val
      state.paginations.rows = val
      load()
    }
    function handleCurrentChange (val:any) {
      state.paginations.page = val
      load()
    }
    function sortChange (sort:any) {
      state.paginations.sort = sort.prop
      state.paginations.order = sort.order === 'ascending' ? 'asc' : 'desc'
      load()
    }
    function resetPage () {
      // 重置查询分页
      // state.paginations.rows = 30;
      state.paginations.page = 1
    }
    function selectionChange (selection:any) {
      // console.log(selection);
      // 选择行事件,只有单选才触发
      state.selectRows = selection
      if (props.single) {
        if (selection.length === 1) {
          ctx.emit('rowChange', selection[0])
        }
        if (selection.length > 1) {
          const _row = selection[selection.length - 1]
          table.value && table.value.toggleRowSelection(selection[0], true)
          state.selectRows = [_row]
        }
      }
    }
    function getColor (row:any, column:any) {
      const val = row[column.field]
      if (column.getColor && typeof column.getColor === 'function') {
        const _color = column.getColor(row, column)
        if (_color) {
          return _color
        }
      }
      if (!val && val !== '0') {
        return ''
      }
      if (!state.formatConfig[column.field]) {
        state.formatConfig[column.field] = [val]
        return state.colors[0]
      }
      let index = state.formatConfig[column.field].indexOf(val)
      if (index !== -1) {
        return state.colors[index]
      }
      if (state.formatConfig[column.field].length > 5) {
        return ''
      }

      if (index === -1) {
        state.formatConfig[column.field].push(val)
        index = state.formatConfig[column.field].length - 1
      }
      return state.colors[index]
    }
    function formatterDate (row:any, column:any) {
      return (row[column.field] || '').substr(0, 10)
    }
    function formatter (row:any, column:any, template:any) {
      if (!template) return row[column.property]
      let val = row[column.field]
      // 是否值
      if (column.edit && column.edit.type === 'switch') {
        return val ? '是' : '否'
      }
      if (!column.bind || !column.bind.data) {
        return row[column.field]
      }
      if (!val && val !== 0) return val
      // 编辑多选table显示
      if (
        (column.bind.type === 'selectList' || column.bind.type === 'checkbox') &&
        typeof val === 'string' &&
        val.indexOf(',') !== -1
      ) {
        return getSelectFormatter(column, val)
      }
      const source = column.bind.data.filter((x:any) => {
        // return x.key !== "" && x.key === val;
        // 2020.06.06修复单独使用table组件时,key为数字0时转换成文本失败的问题
        return x.key !== '' && x.key !== undefined && x.key + '' === val + ''
      })
      if (source && source.length > 0) val = source[0].value
      return val
    }
    function getSelectFormatter (column:any, val:any) {
      // 编辑多选table显示
      const valArr = val.split(',')
      for (let index = 0; index < valArr.length; index++) {
        column.bind.data.forEach((x:any) => {
          // 2020.06.06修复数据源为selectList时,key为数字0时不能转换文本的问题
          if (
            x.key !== '' &&
            x.key !== undefined &&
            x.key + '' === valArr[index] + ''
          ) {
            valArr[index] = x.value
          }
        })
      }
      return valArr.join(',')
    }
    function onChange (scope:any, val:any, event:any, column:any) {
      // 2020.09.03修复onChange不触发的问题
      const row = scope.row
      if (column.onChange && !column.onChange(row, val, event)) {
        return
      }
      // 输入框求和实时计算
      getInputSummaries(scope, val, event, column)
    }
    // input输入实时求和
    function getInputSummaries (scope:any, val:any, event:any, column:any) {
      // column列设置了summary属性的才计算值
      if (!column.summary) return
      const sum = 0
      // (props.url ? state.rowData : props.tableData).forEach((x, index) => {
      //   if (x.hasOwnProperty(column.field) && !isNaN(x[column.field])) {
      //     sum += x[column.field] * 1
      //   }
      // })
      state.summaryData[state.summaryIndex[column.field]] = sum
    }
    function getSummaryData ({ columns, data }:any) {
      return state.summaryData
    }
    function getCellStyle (row:any) {
      // 2020.12.13增加设置单元格颜色
      if (row.column.property) {
        return (
          state.cellStyleColumns[row.column.property] &&
          state.cellStyleColumns[row.column.property](
            row.row,
            row.rowIndex,
            row.columnIndex
          )
        )
      }
    }
    function compareDate (date1:any, date2:any) {
      if (!date2) {
        return true
      }
      return (
        date1.valueOf() <
        (typeof date2 === 'number' ? date2 : new Date(date2).valueOf())
      )
    }
    function getDateOptions (date:any, item:any) {
      // 2021.07.17设置时间可选范围
      if ((!item.min && !item.max) || !date) {
        return false
      }
      if (item.min && item.min.indexOf(' ') === -1) {
        // 不设置时分秒，后面会自动加上 08:00
        item.min = item.min + ' 00:00:000'
      }
      return (
        compareDate(date, item.min) || !compareDate(date, item.max)
      )
    }
    function getDateFormat (column:any) {
      // 见https://day.js.org/docs/zh-CN/display/format
      return column.edit.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
    }
    function userSelect (selection:any, row:any) {
      state.selectRows = selection
      if (!props.single) {
        ctx.emit('rowChange', { row, selection })
      }
    }
    function isEmptyTag (row:any, column:any) {
      if (!row[column.field] && row[column.field] !== '0') {
        return 'empty-tag'
      }
      return ''
    }

    watch(
      () => props.tableData.length,
      (newLen:any, oldLen:any) => watchRowSelectChange(newLen, oldLen)
    )
    watch(
      () => state.rowData.length,
      (newLen:any, oldLen:any) => watchRowSelectChange(newLen, oldLen)
    )
    const filterColumns = computed(
      () => props.columns.filter((x, index) => {
        if (!x.field) {
          x.field = x.title + index
        }
        return !x.hidden
      })
    )
    onMounted(() => {
      state.realHeight = getHeight() || 0
      state.realMaxHeight = getMaxHeight() || 0
      state.fxRight = props.columns.some((x) => {
        return x.fixed === 'right'
      })
      // 2021.09.21移除强制固定行号与checkbox列
      if (
        state.fxRight ||
      props.columns.some((x:any) => {
        return x.fixed
      })
      ) {
        state.fixed = true
      }

      // 从后台加下拉框的[是否启用的]数据源
      const keys:any[] = []
      const columnBind:any[] = []
      state.summaryData.push('合计')
      if (props.columnIndex) {
        state.summaryData.push(' ')
      }
      props.columns.forEach((x:any, _index:any) => {
        if (x.cellStyle) {
          state.cellStyleColumns[x.field] = x.cellStyle
        }
        if (!x.hidden) {
          // state.summaryIndex[x.field] = _index;
          // 2020.10.11修复求和列错位的问题
          state.summaryData.push('')
          state.summaryIndex[x.field] = state.summaryData.length - 1
        }
        // 求和
        if (x.summary && !state.summary) {
          state.summary = true
        }
        if (x.bind && x.bind.key && (!x.bind.data || x.bind.data.length === 0)) {
          // 写入远程
          if (!x.bind.data) x.bind.data = []
          if (x.bind.remote) {
            state.remoteColumns.push(x)
          } else if (props.loadKey) {
            keys.push(x.bind.key)
            x.bind.valueTyoe = x.type
            columnBind.push(x.bind)
          }
        }
      })
      if (keys.length > 0) {
        // state.http
        axios.post('/api/Sys_Dictionary/GetVueDictionary', keys)
          .then((dic:any) => {
            dic.forEach((x:any) => {
              columnBind.forEach((c) => {
                // 转换数据源的类型与列的类型一致(2020.04.04)
                if (c.valueTyoe === 'int' || c.valueTyoe === 'sbyte') {
                  x.data.forEach((d:any) => {
                    // 2020.09.01增加对数字类型的二次判断
                    if (!isNaN(d.key)) {
                      d.key = ~~d.key
                    }
                  })
                }
                if (c.key === x.dicNo) c.data.push(...x.data)
              })
            })
          })
      }

      state.paginations.sort = props.pagination.sortName
      // 2020.08.29增加自定义分页条大小
      Object.assign(state.paginations, props.pagination)
      if (props.pagination.size) {
        state.paginations.rows = props.pagination.size
      }
      // state.enableEdit = props.columns.some((x:any) => {
      //   return x.hasOwnProperty('edit')
      // })
      const keyColumn = props.columns.find((x:any) => {
        return x.isKey
      })
      if (keyColumn) {
        state.key = keyColumn.field
      }
      // state.$emit
      props.defaultLoadPage && load()
    })
    return {
      ...toRefs(state),
      filterColumns,
      isEmptyTag,
      userSelect,
      getDateFormat,
      getDateOptions,
      compareDate,
      getCellStyle,
      getSummaryData,
      getInputSummaries,
      onChange,
      getSelectFormatter,
      formatter,
      formatterDate,
      getColor,
      selectionChange,
      resetPage,
      sortChange,
      handleCurrentChange,
      handleSizeChange,
      getInputChangeSummaries,
      getSummaries,
      load,
      GetTableDictionary,
      getSelectedIndex,
      getSelected,
      link,
      viewImg,
      addRow,
      delRow,
      validateColum,
      validateRow,
      rowEndEdit,
      rowBeginEdit,
      beginWithButtonEdit,
      setEditStatus,
      toggleEdit,
      initIndex,
      formatterClick,
      getSelectedOptions,
      getMaxHeight,
      reset,
      getFilePath,
      dowloadFile,
      rowClick,
      rowDbClick,
      headerClick,
      extraClick,
      inputKeyPress,
      switchChange,
      getHeight,
      watchRowSelectChange
    }
  }
})
</script>
<style lang="scss" scoped>
.vol-table {
  position: relative;
  .mask {
    opacity: 0.2;
    position: absolute;
    width: 100%;
    height: 100%;
    background: #d0d0d0;
    z-index: 100;
  }
  .message {
    text-align: center;
    color: #635c5c;
    font-size: 15px;
    font-weight: 600;
    background: #eee;
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    z-index: 200;
    left: 0;
    right: 0;
    width: 150px;
    margin: 0 auto;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #a09e9e;
  }
}
.e-item {
  display: flex;
  > div:first-child {
    flex: 1;
  }
}
.vol-table ::v-deep(.el-pager .number) {
  padding: 0 7px;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  margin-left: 8px;
  font-weight: 500;
  min-width: 28px;
}
.vol-table ::v-deep(.el-pager .number.active) {
  background: #ed4014;
  color: #fff;
}
.vol-table .t-file {
  color: #1e8cff;
  cursor: pointer;
  border-bottom: 1px solid;
  padding-bottom: 2px;
}
.vol-table .empty-tag {
  border: none;
  background: none;
}
.v-table ::v-deep(.el-date-editor .el-icon-date),
.v-table ::v-deep(.el-date-editor .el-icon-time) {
  width: 10px;
}

.vol-table.fx-right ::v-deep(.el-table__header th:last-child) {
  border-left: 1px solid #eff1f5;
}
.vol-table.fx-right ::v-deep(.el-table__row) {
  td:last-child {
    border-left: 1px solid #eff1f5;
  }
}
</style>

<style scoped>
/* .v-table ::v-deep(.even-row){
  background: rgb(245,247,250);
} */
.pagination {
  text-align: right;
  padding: 2px 28px;
  border: 1px solid #eee;
  border-top: 0px;
}
.v-table ::v-deep(.el-input .el-input__inner) {
  padding: 0 7px;
}
.v-table ::v-deep(.el-table__header th) {
  /* padding: 0px !important; */
  background-color: #f8f8f9 !important;
  font-size: 13px;
  height: 46px;
  color: #616161;
}
.v-table ::v-deep(.el-date-editor .el-input__inner) {
  padding-left: 20px;
}
.v-table ::v-deep(.el-table__header th.is-sortable) {
  padding: 3px !important;
}
.vol-table.text-inline ::v-deep(.el-table__body .cell),
.vol-table ::v-deep(.el-table__header-wrapper .cell) {
  word-break: inherit !important;
  white-space: nowrap !important;
}
/* .v-table  ::v-deep(.el-table__body td) {
  padding: 9px 0 !important;
} */

.v-table ::v-deep(.el-table__footer td) {
  padding: 7px 0 !important;
}

.vol-table ::v-deep(.el-table-column--selection .cell) {
  display: inline;
}
.vol-table.text-inline ::v-deep(.el-table th > .cell) {
  white-space: nowrap !important;
}

.vol-table .table-img {
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
  width: 40px;
  object-fit: cover;
}
.vol-table .table-img:hover {
  cursor: pointer;
}
</style>
