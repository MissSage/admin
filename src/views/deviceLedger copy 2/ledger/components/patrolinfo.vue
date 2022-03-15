<template>
  <div class="info-container">
    <!--巡检统计 -->
    <h3>巡检统计</h3>
    <el-form ref="baseForm" :model="formData">
      <SLFlexGroup>
        <el-form-item label="巡检次数：" prop="deviceNo">
          <span>{{ formData.total }} 次</span>
        </el-form-item>
        <el-form-item label="最近巡检：" prop="deviceName">
          <span>{{ formData.executeTime }}</span>
        </el-form-item>
        <el-form-item
          label=""
          prop="deviceName"
          class="ls-flex-item--1"
          style="height: 250px"
        >
          <div ref="pic" style="height: 100%; width: 50%; display: inline-block"></div>
        </el-form-item>
      </SLFlexGroup>
      <h3>巡检计划</h3>
      <CardTable :config="cardTableConfig" style="height: 400px" />
      <h3>巡检记录</h3>
      <CardTable :config="cardTableConfigFile" style="height: 400px" />
    </el-form>
  </div>
</template>

<script lang="ts">
import SLFlexGroup from '@/components/SLFlexGroup/index.vue'
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import { ref, onMounted, reactive, toRefs } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { ICTCardTable } from '@/common/types/ledger/ledger'
//接口
import { getXJDataById, getXJRWDataById, getXJPicData } from '@/api/ledger/ledger'
import router from '@/router'

const { $message } = useGlobal()
import { useRoute } from 'vue-router'
import useProject from '@/hooks/project/useProject'
import * as echarts from 'echarts'

export default {
  name: 'Registration',
  components: {
    CardTable,
    SLFlexGroup
  },
  props: {
    currentId: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    //1.定义变量
    const { $format } = useGlobal()
    const cardSearchSon = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchFa = ref<InstanceType<typeof CardSearch> | null>(null)
    const cardSearchRele = ref<InstanceType<typeof CardSearch> | null>(null)
    //所属部门数据
    const { getAreaTreeData } = useProject()
    //路由
    const route = useRoute()
    //添加级联选择
    const state = reactive<{
      showTable: boolean
      areaTree: NormalOption[]
      projectId: string
      dialogVisible: boolean
    }>({
      showTable: true,
      areaTree: [],
      projectId: '',
      dialogVisible: false
    })
    const baseForm = ref<any>()
    //巡检计划
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'content',
          label: '计划名称',
          textColor: '#6BD2F8FF',
          width: 180,
          textDecoration: 'underline'
        },
        { prop: '', label: '限制时间', width: 100, formatter: row => row.limitTime + 'h' },
        { prop: '', label: '循环周期', width: 100, formatter: row => row.periodTime + '天' },
        {
          prop: '',
          label: '下一次巡检时间',
          width: 200,
          formatter: row => $format(row.executeTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: 'userNames', label: '任务人' }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfig.value.pagination.limit = val
          refreshData()
        },
        pageHandle: val => {
          cardTableConfig.value.pagination.page = val
          refreshData()
        }
      }
    })
    //巡检记录
    const cardTableConfigFile = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      operationFixed: 'right',
      columns: [
        {
          prop: 'content',
          label: '任务名称',
          textColor: '#6BD2F8FF',
          width: 180,
          textDecoration: 'underline'
        },
        {
          prop: '',
          label: '任务开始时间',
          width: 200,
          formatter: row => $format(row.executeTime),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        {
          prop: '',
          label: '任务结束时间',
          width: 200,
          formatter: row => $format(row.executeTime + row.limitTime * 60 * 60 * 1000),
          icon: 'el-icon-time',
          iconStyle: {
            color: '#69e850',
            display: 'inline-block',
            'font-size': '16px'
          }
        },
        { prop: '', label: '限制时间', formatter: row => row.limitTime + 'h' },
        { prop: 'userNames', label: '任务人' }
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        sizeHandle: val => {
          cardTableConfigFile.value.pagination.limit = val
          refreshDataFile()
        },
        pageHandle: val => {
          cardTableConfigFile.value.pagination.page = val
          refreshDataFile()
        }
      }
    })
    //表单内容
    let formData = ref<any>({
      total: 0,
      executeTime: ''
    })

    let FilesList = ref<any>({
      list: []
    })
    let states = reactive({
      pic: ref()
    })
    //2.方法
    //开始一个生命周期钩子,挂载后再加载数据
    onMounted(async () => {
      initForm()
      state.areaTree = await getAreaTreeData()
      initPicCharts(states.pic)
    })
    //初始化-数据表格
    const initForm = () => {
      if (props.currentId) {
        const paramsObj = {
          page: 1,
          size: 5,
          deviceId: props.currentId
        }
        getXJDataById(paramsObj).then(res => {
          console.log('res ', res)
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        })
        getXJRWDataById(paramsObj).then(res => {
          cardTableConfigFile.value.dataList = res.data.data
          cardTableConfigFile.value.pagination.total = res.data.total
          formData.value.total = res.data.total
          if (res.data.total > 0) {
            formData.value.executeTime = $format(res.data.data[0].executeTime)
          }
        })
      } else {
        $message.error('获取设备信息失败')
      }
    }
    //刷新巡检计划
    const refreshData = async () => {
      const paramsObj = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        deviceId: props.currentId
      }
      getXJDataById(paramsObj).then(res => {
        cardTableConfig.value.dataList = res.data.data
        cardTableConfig.value.pagination.total = res.data.total
      })
    }
    //刷新巡检记录
    const refreshDataFile = async () => {
      const paramsObj = {
        page: cardTableConfigFile.value.pagination.page,
        size: cardTableConfigFile.value.pagination.limit,
        deviceId: props.currentId
      }
      getXJRWDataById(paramsObj).then(res => {
        cardTableConfigFile.value.dataList = res.data.data
        cardTableConfigFile.value.pagination.total = res.data.total
        formData.value.total = res.data.total
        if (res.data.total > 0) {
          formData.value.executeTime = $format(res.data.data[0].executeTime)
        }
      })
    }
    //转化pin数据方法
    let PinData = ref<any>({
      data: [],
      label: []
    })
    //转化pin数据方法
    const formatPinData = (data: any) => {
      if (data.data.length <= 0) {
        PinData.value.data.push({
          value: 0,
          name: '0',
          label: {
            color: '#363847'
          }
        })
      } else {
        data.data.forEach((item: any) => {
          let pitem = { value: item.count, name: item.status }
          PinData.value.label.push(item.status)
          PinData.value.data.push(pitem)
        })
      }
    }
    //饼图
    const initPicCharts = (item: any) => {
      var myChart = echarts.init(item)
      //获取数据
      const paramsObj = {
        deviceId: props.currentId
      }
      getXJPicData(paramsObj).then(res => {
        console.log('res', res)
        formatPinData(res)
        const data1 = PinData.value.data
        //数据
        var option = {
          title: {
            text: '巡检情况',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 15,
              lineHeight: 25
            }
          },
          // backgroundColor: '#0a1a2a',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.9)',
            formatter: function (params) {
              return (
                params.seriesName +
                '<br/>' +
                params.marker +
                '<span style="color:' +
                params.color +
                '">' +
                params.data['name'] +
                '\n' +
                params.data['value'] +
                '</span>'
              )
            }
          },
          legend: {
            selectedMode: false,
            orient: 'vertical',
            itemWidth: 20,
            itemHeight: 20,
            icon: 'circle',
            right: '10',
            top: 'center',
            textStyle: {
              fontSize: 14,
              color: '#6e69b2'
            },
            data: PinData.value.label //['低级', '中级', '⾼级', '极⾼']
          },
          series: [
            {
              name: '',
              type: 'pie',
              hoverAnimation: false,
              legendHoverLink: false,
              cursor: 'default',
              radius: ['32%', '50%'],
              center: ['45%', '50%'],
              color: [
                'rgba(0, 150, 254, 0.2)',
                'rgba(2, 205, 206, 0.2)',
                'rgba(253, 160, 0, 0.2)',
                'rgba(191, 40, 18, 0.2)'
              ],
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              zlevel: 1,
              itemStyle: {
                normal: {
                  borderColor: '#0a1a2a'
                },
                ellipsis: {
                  borderColor: '#0a1a2a'
                }
              },
              tooltip: {
                show: false
              },
              data: data1
            },
            {
              name: '',
              type: 'pie',
              zlevel: 2,
              cursor: 'default',
              hoverAnimation: false,
              legendHoverLink: false,
              radius: ['37%', '50%'],
              center: ['45%', '50%'],
              color: [
                'rgba(0, 150, 254, 0.5)',
                'rgba(2, 205, 206, .5)',
                'rgba(253, 160, 0, .5)',
                'rgba(191, 40, 18, .5)'
              ],
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  borderColor: '#0a1a2a'
                },
                ellipsis: {
                  borderColor: '#0a1a2a'
                }
              },
              tooltip: {
                show: false
              },
              data: data1
            },
            {
              name: 'title',
              type: 'pie',
              zlevel: 3,
              hoverAnimation: false,
              legendHoverLink: false,
              radius: ['43%', '50%'],
              center: ['45%', '50%'],
              color: [
                'rgba(0, 150, 254, 1)',
                'rgba(2, 205, 206, 1)',
                'rgba(253, 160, 0, 1)',
                'rgba(191, 40, 18, 1)'
              ],
              label: {
                show: true,
                formatter: (params: any) => {
                  return `
 ${params.name}: ${params.percent}%
 ${params.data.value}个
 `
                },
                padding: [0, -30],
                textStyle: {
                  lineHeight: 25
                }
              },
              labelLine: {
                show: true,
                showAbove: true,
                length: 30,
                length2: 50
              },
              itemStyle: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: '#0a1a2a'
              },
              data: data1
            }
          ]
        }
        myChart.setOption(option)
      })
    }
    const FileList = ref<any>([])
    //返回
    return {
      formData,
      FilesList,
      FileList,
      cardSearchSon,
      cardSearchFa,
      cardSearchRele,
      cardTableConfig,
      cardTableConfigFile,
      refreshDataFile,
      ...toRefs(state), //添加级联选择
      ...toRefs(states), //添加级联选择
      initForm,
      initPicCharts,
      baseForm
    }
  },
  //返回
  methods: {
    //返回上一页
    goOff() {
      router.push({ name: 'deviceLedgerIndex' })
    },
    handlePreview(file) {
      console.log('预览图片', file)
    },
    handleExceed(files, FileList) {
      $message.warning(
        `The limit is 5, you selected ${files.length} files this time, add up to ${
          files.length + FileList.length
        } totally`
      )
    },
    beforeRemove(file, FileList) {
      // return $confirm(`Cancel the transfert of ${file.name} ?`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/ledger-router.scss';
span {
  font-size: 16px;
}
el-form-item {
  width: 280px;
  font-size: 15px;
}
.sel {
  position: absolute;
  clip: rect(2px 80px 30px 2px);
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 15px;
  font-weight: bold;
}
.info-item-size {
  width: 280px;
  font-size: 15px;
}

.uploadPic-style {
  margin-left: 30px;
  width: 100%;
}

.uploadFile-btn-style {
  margin-left: 1290px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.item-size-wd {
  height: 80px;
  width: 680px;
  margin-top: 20px;
}

.table-style {
  margin-left: 50px;
  width: 1448px;
}
</style>
