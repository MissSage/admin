<template>
  <!-- 实时数据 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <treeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <el-scrollbar>
        <div class="tree-right-detail-box cardDetailBox">
          <div class="top-title-box unified-theme-bg-color">
            <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>数据曲线</p>
            <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button">刷新</el-button> -->
          </div>
          <div class="table-chart-container content-box-container">
            <div class="top-box-together">
              <div class="filter-box">
                <div class="query-list-container">
                  <div v-for="(item, index) of queryList" :key="index" class="query-list">
                    <el-select
                      v-model="queryList[index].deviceId"
                      style="width: 150px"
                      filterable
                      placeholder="请选择采集器"
                      @change="changeDevice(queryList[index], index)"
                    >
                      <el-option
                        v-for="(deviceItem, deviceIndex) of deviceList"
                        :key="deviceIndex"
                        :label="deviceItem.name"
                        :value="deviceItem.rId"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="queryList[index].queryDGroup"
                      style="width: 120px"
                      placeholder="请选择设备"
                      @change="changeGroup(queryList[index], index)"
                    >
                      <el-option
                        v-for="option in queryList[index].groupList"
                        :key="option"
                        :label="option"
                        :value="option"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="queryList[index].queryVar"
                      placeholder="请选择变量"
                      style="flex-basis: 200px;"
                      filterable
                      multiple
                      collapse-tags
                      @change="getTSDBData()"
                    >
                      <el-option
                        v-for="option in queryList[index].optionVar"
                        :key="option.label"
                        :label="option.value"
                        :value="option.label"
                      ></el-option>
                    </el-select>
                    <i
                      class="el-icon-close close-btn"
                      @click="removeQueryItem(queryList[index], index)"
                    ></i>
                    <!-- <el-button
                    class="el-button_removeQueryItem"
                    type="info"
                    icon="el-icon-close"
                    @click="removeQueryItem(queryList[index], index)"
                  ></el-button> -->
                  </div>
                  <div class="add-button-container">
                    <el-button icon="el-icon-plus" type="primary" @click="addQueryItem"
                      >添加查询项</el-button
                    >
                  </div>
                </div>
                <div class="spliter"></div>
              </div>
              <div class="float-top-box">
                <div class="data-gap">
                  <span class="data-set-gap">数据采集间隔 </span>
                  <el-select
                    v-model="queryType"
                    class="interval-type"
                    style="width: 32%"
                    @change="queryInterval"
                  >
                    <el-option
                      v-for="(item, index) of queryTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button icon="iconfont icon-daochu1" type="primary" @click="exportData">
                    导出</el-button
                  >
                </div>
              </div>
            </div>
            <div class="charts-box">
              <VChart ref="charts1" :option="charts1Option"></VChart>
            </div>
            <div class="table-box spec-box">
              <el-table
                v-if="deviceList.length !== 0"
                ref="tableBody"
                height="100%"
                :data="tableData"
                style="width: 100%"
              >
                <el-table-column prop="date" label="日期"> </el-table-column>
                <el-table-column
                  v-for="item of assetIds"
                  :key="item"
                  :prop="item"
                  :label="deviceWithPropsTextMap ? deviceWithPropsTextMap.get(item) : item"
                >
                  <template #default="scope">
                    <span>{{ scope.row[item] }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="unit" label="单位" width="180"> </el-table-column> -->
                <!-- <el-table-column label=""> </el-table-column> -->
              </el-table>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </template>
  </treeBox>
</template>

<script>
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import treeList from '@/components/treeList/index.vue'
import { getProjectRoot } from '@/api/project'
import { getDeviceVarGroup, getDevice } from '@/api/device'
import { getAttributes } from '@/api/telemetry'
import { queryDeviceDataIstar } from '@/api/tsdb'
import { removeSlash } from '@/utils/removeIdSlash'
import { TrueExcel } from '@/utils/exportExcel' // , Download
import { dwnai, dwnaiRetainNull } from '@/utils/processNumber'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'RealTimeMonitor',
  components: { treeList },
  mixins: [tBaseMixin],
  data() {
    return {
      intervalId: null,
      excel: new TrueExcel(),
      treeData: {
        that: this,
        title: '区域列表',
        data: [],
        isFilterTree: true,
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.getProjectData(data)
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        currentProject: {}
      },
      totalLoading: false,
      deviceList: [],
      queryReslut: {},
      queryList: [],
      deviceGroupMap: {}, // new Map(),
      templateGroupMap: {},
      tableData: [],
      val: '',
      devicePropMap: {},
      assetIds: [],
      queryType: '15m',
      queryTypeList: [
        { label: '1 m', value: '1m' },
        { label: '5 m', value: '5m' },
        { label: '10 m', value: '10m' },
        { label: '15 m', value: '15m' }
      ],
      isClear: false,
      optionsVisible: false,
      deviceStandard: new Map(),
      deviceTextMap: new Map(),
      devicePropsTextMap: new Map(),
      deviceWithPropsTextMap: new Map(),
      deviceInfoMap: new Map(),
      deviceMapKey: new Map(),
      charts1Option: {
        backgroundColor: '#222536', // this.$store.state.app.theme === '252C47' ? '#252C47' : 'white',
        title: {
          text: '实时数据',
          textStyle: {
            fontSize: 15,
            color: '#fff'
          }
        },
        grid: {
          left: 10,
          right: 70,
          bottom: '20%',
          top: '15%',
          containLabel: true,
          backgroundColor: 'transparent'
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
            bottom: 5,
            dataBackground: {
              lineStyle: {
                color: '#6070A0'
              },
              areaStyle: {
                color: 'rgba(189, 210, 225, 0.75)'
              }
            },
            textStyle: {
              color: '#fff' // '#333'
            },
            left: 10,
            right:70,
            bottom:10
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            width: 30,
            showDataShadow: false,
            right: 10,
            bottom:'20%',
            top:'15%',
            filterMode: 'none',
            textStyle: {
              color: '#fff' // '#333'
            }
          }
        ],
        textStyle: {
          color: '#fff' // '#333'
        },
        // color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        color: [
          '#9E87FF',
          '#73DDFF',
          '#fe9a8b',
          '#F56948',
          '#9E87FF',
          '#0090FF',
          '#36CE9E',
          '#FFC005',
          '#FF515A',
          '#8B5CFF',
          '#00CA69'
        ],
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            var relVal = params[0].name
            for (var i = 0; i < params.length; i++) {
              relVal +=
                '<div class="circle" ><span style="background:' +
                params[i].color +
                '"></span>' +
                params[i].seriesName +
                ' : ' +
                params[i].value +
                '' +
                this.deviceInfoMap.get(params[i].seriesName) +
                '</div>'
            }
            return relVal
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#ffffff',
              color: '#333'
            }
          }
        },
        legend: {
          data: [],
          type: 'scroll',
          left: 100,
          textStyle: {
            backgroundColor: '#222536',
            color: '#fff' // '#333'
          },
          pageIconColor: '#3E8EF7', // '#2f4554',
          pageTextStyle: {
            color: '#BCC3DF' // '#aaa'
          }
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#fff' // '#333'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff' //更改坐标轴文字颜色
              // fontSize: 14 //更改坐标轴文字大小
            }
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: '#303958' // '#ccc'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#333' // '#333'
            }
          },
          min: null,
          max: null
        },
        series: []
      }
    }
  },
  computed: {
    readyForQuery() {
      if (this.queryList.length > 0) {
        let ready = true
        for (const item of this.queryList) {
          if (item.queryVar.length > 0) {
            ready = false
          }
        }
        return ready
      } else {
        return true
      }
    }
  },
  created() {
    this.totalLoading = true
    getProjectRoot()
      .then(res => {
        if (res.data) {
          this.treeData.data = res.data
          const fTData = this.treeData.data.filter(v => !v.disabled)
          this.getProjectData(fTData[0])
          this.totalLoading = false
        } else {
          this.totalLoading = false
          this.$message('暂无项目 不可操作，请创建项目')
        }
      })
      .catch(() => {
        this.totalLoading = false
        this.$message('暂无项目 不可操作，请创建项目')
      })
    this.intervalId = setInterval(() => {
      if (!this.readyForQuery) {
        this.getTSDBData()
      }
    }, 30 * 1000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    // 点击项目
    getProjectData(data) {
      if (!data.disabled) {
        this.$refs.charts1.clear()
        this.charts1Option.xAxis.data = []
        this.charts1Option.series = []
        this.tableData = []
        this.assetIds = []
        this.treeData.currentProject = data
        this.queryList = []
        getDevice(data.id).then(res => {
          this.deviceList = res.data
          for (const device of this.deviceList) {
            device.rId = removeSlash(device.id.id)
            this.deviceTextMap.set(device.rId, device)
          }
          if (this.deviceList[0]) {
            // const defaultItem = {
            //   deviceId: '',
            //   energyType: '',
            //   option: []
            // }
            // this.queryList = [defaultItem]
            // this.getDeviceProps(this.queryList[0], 0)
          }
        })
      }
    },
    async getTSDBData() {
      this.$refs.charts1.clear()
      this.queryReslut = {}
      this.tableData = []
      this.charts1Option.xAxis.data = []
      this.charts1Option.series = []
      const queryData = {
        start: moment().subtract(2, 'hours').valueOf(),
        end: moment().valueOf(),
        type: this.queryType,
        attributes: []
      }
      for (const queryItem of this.queryList) {
        for (const val of queryItem.queryVar) {
          queryData.attributes.push(queryItem.deviceId + '.' + val)
        }
      }
      if (queryData.attributes.length > 0) {
        const res = await queryDeviceDataIstar(queryData)
        // this.queryReslut = Ob
        for (const [index, value] of Object.entries(res.data)) {
          if (!this.queryReslut[index]) {
            this.queryReslut[index] = {}
          }
          this.queryReslut[index] = Object.assign(this.queryReslut[index], value)
        }

        this.postProcess()
      }
    },
    postProcess() {
      const xAxisData = _.keys(this.queryReslut)
      this.charts1Option.xAxis.data = xAxisData.map(item => item.substring(5))

      const deviceIdAndProps = _.keys(_.values(this.queryReslut)[0]).map(
        id => id.split('.')[0] + '.' + id.split('.')[1]
      )
      this.assetIds = deviceIdAndProps
      // post legend
      this.charts1Option.legend.data = _.keys(_.values(this.queryReslut)[0]).map(
        id =>
          this.deviceTextMap.get(id.split('.')[0]).name +
          '.' +
          this.devicePropsTextMap.get(id.split('.')[1])
      )
      _.keys(_.values(this.queryReslut)[0]).map((id, i) =>
        this.deviceWithPropsTextMap.set(id, this.charts1Option.legend.data[i])
      )
      // // 获取单位
      const units = []
      for (const item of this.queryList) {
        for (const val of item.queryVar) {
          const info = item.optionVar.find(v => v.label === val)
          const unit = info.unit ? info.unit : ''
          const temp = {
            id: item.deviceId + '.' + val,
            name: '',
            unit: unit
          }
          temp.name =
            this.deviceTextMap.get(temp.id.split('.')[0]).name +
            '.' +
            this.devicePropsTextMap.get(temp.id.split('.')[1])
          this.deviceWithPropsTextMap.set(temp.id, temp.name + ' (' + unit + ')')
          units.push(temp)
        }
      }
      units.forEach(item => {
        this.deviceInfoMap.set(item.name, item.unit)
      })
      // post data to echarts
      this.charts1Option.series = []
      for (const item of deviceIdAndProps) {
        const serie = {
          name:
            this.deviceTextMap.get(item.split('.')[0]).name +
            '.' +
            this.devicePropsTextMap.get(item.split('.')[1]),
          type: 'line',
          areaStyle: {
            opacity: 0.3
          },
          data: []
        }
        // // let standard = ''
        // if (this.deviceStandard.get(item) || this.deviceStandard.get(item) === 0) {
        // }
        for (const eachResult of _.values(this.queryReslut)) {
          serie.data.push(dwnaiRetainNull(eachResult[item]))
        }
        this.charts1Option.series.push(serie)
      }

      // generate form data
      _.keys(this.queryReslut).map(resultItem => {
        const row = {
          date: resultItem
        }
        let isMapKey = false
        if (this.deviceMapKey.size > 0) {
          isMapKey = true
        }
        for (const device of deviceIdAndProps) {
          const value =
            this.queryReslut[resultItem][device] === null
              ? '-'
              : dwnai(this.queryReslut[resultItem][device])
          let key = false
          const keyMapList = this.deviceMapKey.get(device)
          if (isMapKey && keyMapList) {
            for (const k of keyMapList) {
              if (k.key === parseFloat(value)) {
                row[device] = k.value + ': ' + value

                key = true
              }
            }
          }
          if (!key) {
            for (const item of units) {
              if (item.id === device && String(value).split(' ').length < 2) {
                row[device] = value
              }
            }
          }
        }
        this.tableData.unshift(row)
      })
      if (this.charts1Option.series.length === 0) {
        this.$message('无数据')
      }
    },
    addQueryItem() {
      const queryItem = {
        deviceId: '',
        queryDGroup: '',
        queryVar: [],
        templateId: '',
        isGroup: false,
        // energyType: [],
        // option: [],
        groupList: [],
        optionVar: [],
        deviceGroup: {}
      }
      this.queryList.push(queryItem)
      // if (this.queryList.length === 0 && this.deviceList.length > 0) {
      //   this.queryList.push(queryItem)
      //   this.queryList[0].deviceId = this.deviceList[0].rId
      // }
    },
    changeDevice(queryItem) {
      // if (!queryItem.templateId) {
      //   queryItem.templateId = this.deviceTextMap.get(queryItem.deviceId).templateId
      // }
      // if (this.templateGroupMap[queryItem.templateId]) {
      if (false) {
        this.setGroup(this.templateGroupMap[queryItem.templateId], queryItem)
      } else {
        getDeviceVarGroup(queryItem.deviceId).then(res => {
          this.templateGroupMap[queryItem.templateId] = res.data
          this.setGroup(res.data, queryItem)
        })
      }
    },
    setGroup(data, queryItem) {
      queryItem.deviceGroup = data
      // 置空
      queryItem.queryDGroup = ''
      queryItem.queryVar = []
      queryItem.groupList = []
      queryItem.optionVar = []
      for (const item in data) {
        queryItem.groupList.push(item)
        for (const prop of data[item]) {
          this.devicePropsTextMap.set(prop.label, prop.value)
        }
      }
      // queryItem.queryDGroup = queryItem.groupList[0]
    },
    changeGroup(queryItem) {
      if (queryItem.groupList.length === 0) {
      } else {
        queryItem.queryVar = []
        queryItem.optionVar = queryItem.deviceGroup[queryItem.queryDGroup]
        // queryItem.queryVar = [queryItem.optionVar[0].label]  // value label 颠倒 多处 记得上方绑定同换
      }
    },
    removeQueryItem(queryItem, index) {
      this.queryList.splice(index, 1)
      this.getTSDBData()
    },

    async getDeviceProps(queryItem) {
      queryItem.energyType = []
      const res = await getAttributes('DEVICE', queryItem.deviceId)
      for (const item of res.data) {
        if (item.key === 'prop') {
          queryItem.option = JSON.parse(item.value)
          if (!this.devicePropMap[queryItem.deviceId]) {
            this.devicePropMap[queryItem.deviceId] = queryItem.option
          }
          for (const prop of queryItem.option) {
            this.devicePropsTextMap.set(prop.propertyCategory, prop.name)
            if (prop.additionalInfo && prop.additionalInfo.length > 0) {
              this.deviceMapKey.set(
                removeSlash(queryItem.deviceId) + '.' + prop.propertyCategory,
                prop.additionalInfo
              )
            }
            if (prop.standard || prop.standard === 0) {
              this.deviceStandard.set(
                removeSlash(queryItem.deviceId) + '.' + prop.propertyCategory,
                prop.standard
              )
            }
          }
          this.optionsVisible = queryItem.option.length > 0
        }
      }
    },
    exportData() {
      // 导出
      this.excel.addElTable(this.$refs.tableBody)
      this.postExport()
    },
    postExport() {
      // pass
      if (this.$refs.charts1) {
        const charts1 = this.$refs.charts1
        console.log(charts1)
        const width = charts1.getWidth()
        const height = charts1.getHeight()
        const img1 = {
          src: charts1.getDataURL({
            pixelRatio: window.devicePixelRatio || 1
          }),
          width,
          height
        }
        console.log(img1, 'img1img1')
        this.excel.addImage(img1)
      }
      if (this.$refs.charts2) {
        const charts2 = this.$refs.charts2
        const width = charts2.getWidth()
        const height = charts2.getHeight()
        const img2 = {
          src: charts2.getDataURL({
            pixelRatio: window.devicePixelRatio || 1
          }),
          width,
          height
        }

        this.excel.addImage(img2)
      }
      this.excel.export()
    },
    queryInterval() {
      if (this.queryList.length > 0) {
        let ready = false
        for (const item of this.queryList) {
          if (item.queryVar.length > 0) {
            ready = true
          }
        }
        if (ready) {
          this.getTSDBData()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  height: 40px;
}
.table-chart-container {
  overflow-y: auto;
  .top-box-together {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-wrap: wrap;
    .filter-box {
      margin: 8px 0;
      width: 490px;
      .spliter {
        flex: auto;
      }
      .query-list-container {
        .query-list {
          margin-bottom: 15px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .el-select{
            flex-basis: 30%;
          }
          .close-btn {
            width: 28px;
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px 5px;
            text-align: center;
            color: $text-color;
            border-radius: 50%;
            background-color: $bg-color;
            border: 1px solid $border-color;
          }
          .el-button {
            color: $text-color;
            background-color: $bg-color;
            border-color: $border-color;
            font-size: 16px;
            border-radius: 5px;
            width: 40px;
            height: 32px;
            margin-left: 5px;
            padding: 0;
            &:hover {
              background-color: $color-button-darkblue;
              border-color: $border-color;
            }
          }
        }
      }
      .interval-type {
        width: 100px;
      }
    }
    .float-top-box {
      margin: 8px 0;
      width: 320px;
      .data-gap {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .data-set-gap {
          display: inline-block;
          margin-right: 8px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #0094bf;
          line-height: 20px;
        }
      }
    }
  }
  .charts-box {
    margin: 0;
  }
  .table-box {
    height: 400px;
    margin-top: 20px;
  }
}
</style>
