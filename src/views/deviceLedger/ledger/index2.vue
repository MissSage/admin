<template>
  <!-- 台账 主页 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable ref="cardTable" :config="cardTableConfig" />
      </div>
      <InfoDialog
        v-if="AddDialogConfig.visible"
        :visible="AddDialogConfig.visible"
        :close="AddDialogConfig.close"
        :current-id="AddDialogConfig.currentId"
        :device-no="AddDialogConfig.deviceNo"
        :readonly="AddDialogConfig.readonly"
        :title="AddDialogConfig.title"
        :width="'60%'"
      />
    </template>
  </treeBox>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import { getTableData, deleteAccount } from '@/api/ledger/ledger'
import TreeList from '@/components/treeList/index.vue'
import { TrueExcel } from '@/utils/exportExcel'
import useGlobal from '@/hooks/global/useGlobal'
import router from '@/router'
import { getDatasList } from '@/api/device'
//格式化
import {
  deviceStatus,
  deviceStatusCor,
  deviceGrade,
  deviceGradeCor,
  DIVFORMATSOURCE,
  DIVFORMATTYPE
} from '@/common/constans/ledger'

const { $message, $format, $confirm } = useGlobal()
import InfoDialog from './components/InfoDialog.vue'

export default {
  name: 'Depreciation',
  components: {
    CardTable,
    CardSearch,
    TreeList,
    InfoDialog
  },
  mixins: [tBaseMixin],
  data() {
    return {
      //信息弹框
      AddDialogConfig: {
        visible: false,
        title: '',
        currentId: '',
        deviceNo: '',
        readonly: false,
        close: () => {
          this.AddDialogConfig.visible = false
        }
      },
      totalLoading: false,
      excel: new TrueExcel(),
      //搜索框
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.getProjectData() },
          add: {
            text: '设备登记',
            perm: true,
            handle: () => {
              router.push({
                name: 'deviceRegis',
                query: { type: 1, projectId: this.treeData.currentProject.id, title: '设备登记' }
              })
            }
          },
          del: {
            text: '批量删除',
            disableHandle: () => !this.cardTableConfig.selectList?.length,
            handle: () => this.handleDelete(),
            perm: true
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
      },
      //表格
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        operationFixed: 'right',
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        // cellHandleClick: row => this.OpenInfoDialog(row),//点击单元格。弃用
        columns: [
          {
            prop: '',
            label: '设备状态',
            fixed: 'left',
            width: 100,
            formatter: row => deviceStatus[row.deviceStatus],
            backgroundHandle: row => deviceStatusCor[row.deviceStatus],
            cellStyle: {
              'border-radius': '8px',
              color: '#fff',
              'line-height': '35px',
              height: '30px',
              padding: '5px 15px',
              'font-size': '16px'
            }
          },
          {
            prop: 'imgs',
            label: '图片',
            fixed: 'left',
            width: 124,
            image: true
          },
          {
            prop: 'deviceNo',
            label: '设备编号',
            fixed: 'left',
            width: 200,
            textColor: '#6BD2F8FF',
            handleClick: row => this.OpenInfoDialog(row),
            cellStyle: {
              cursor: 'pointer'
            }
          },
          { prop: 'deviceName', label: '设备名称', width: 200, fixed: 'left' },
          {
            prop: '',
            label: '设备等级',
            width: 120,
            formatter: row => deviceGrade[row.deviceGrade],
            borderHandle: row => '1px ' + deviceGradeCor[row.deviceGrade] + ' solid',
            textColorHandle: row => deviceGradeCor[row.deviceGrade],
            cellStyle: {
              'border-radius': '8px',
              'line-height': '35px',
              height: '30px',
              padding: '4px 13px',
              'font-size': '16px'
            }
          },
          { prop: 'unit', label: '单位' },
          {
            prop: 'deviceType',
            label: '设备类别',
            width: 200
            // formatter: row => DIVFORMATTYPE[row.deviceType]
          },
          { prop: 'brand', label: '品牌' },
          { prop: 'supplier', label: '供应商' },
          {
            prop: '',
            label: '设备来源',
            width: 200,
            formatter: row => DIVFORMATSOURCE[row.deviceSource]
          },
          { prop: 'purchaseAmount', label: '采购金额' },
          {
            prop: '',
            label: '购置日期',
            width: 200,
            formatter: row => $format(row.purchaseTime),
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: '',
            label: '保修期至',
            width: 200,
            formatter: row => $format(row.warrantyTime),
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: '',
            label: '启用日期',
            width: 200,
            formatter: row => $format(row.enableTime),
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          {
            prop: '',
            label: '预计报废时间',
            width: 200,
            formatter: row => $format(row.expectScrapTime),
            icon: 'el-icon-time',
            iconStyle: {
              color: '#69e850',
              display: 'inline-block',
              'font-size': '16px'
            }
          },
          { prop: 'director', label: '负责人' },
          { prop: 'projectName', label: '所属部门' },
          { prop: 'remark', label: '备注', width: 400 }
        ],
        operationWidth: '160px',
        operations: [
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => this.editData(row)
          },
          {
            label: '删除',
            perm: true,
            color: 'red',
            icon: 'iconfont icon-shanchu',
            handle: row => this.handleDelete(row)
          }
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          layout: 'total, sizes, prev, pager, next, jumper',
          sizeHandle: val => {
            this.cardTableConfig.pagination.limit = val
            this.getProjectData()
          },
          pageHandle: val => {
            this.cardTableConfig.pagination.page = val
            this.getProjectData()
          }
        }
      },
      //项目列表
      treeData: {
        that: this,
        title: '项目列表',
        data: [],
        loading: false,
        isFilterTree: true,
        currentId: '',
        currentProject: {},
        expandNodeId: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeNodeHandleClick: data => {
          this.treeData.currentProject = data
          this.getProjectData()
        }
      }
    }
  },
  created() {
    this.totalLoading = true
    //列表项目数据
    getProjectRoot()
      .then(res => {
        this.totalLoading = false
        if (res.data) {
          this.treeData.data = res.data
          this.treeData.currentProject = res.data[0]
          this.getProjectData()
        } else {
          $message('暂无项目不可操作，请创建项目')
        }
      })
      .catch(err => {
        console.log('报错内容：' + err)
        $message('暂无项目 不可操作，请创建项目')
      })
    //30秒表格数据刷新
    // this.refreshInterval = setInterval(() => this.refreshData(), 30 * 1000)
  },
  methods: {
    OpenInfoDialog(row) {
      console.log('表格，此单元格被点击')
      this.AddDialogConfig.title = '设备详情'
      this.AddDialogConfig.currentId = row.id
      this.AddDialogConfig.deviceNo = row.deviceNo
      this.AddDialogConfig.readonly = false
      this.AddDialogConfig.visible = true
    },
    //点击项目 获取项目下的主机从机
    getProjectData() {
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        limit: this.cardTableConfig.pagination.limit,
        projectId: this.treeData.currentProject.id
      }
      if (this.$refs && this.$refs.cardSearch) {
        Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      } else {
        Object.assign(paramsObj, this.cardSearchConfig.defaultParams)
      }
      this.cardTableConfig.loading = false
      getTableData(paramsObj).then(res => {
        this.cardTableConfig.loading = false
        if (res.data) {
          let ndata = res.data.data
          this.cardTableConfig.dataList = ndata
          this.cardTableConfig.pagination.total = res.data.total
        } else {
          $message('无数据')
        }
      })
    },
    //刷新数据
    async refreshData() {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        projectId: this.treeData.currentProject.id
      }
      if (this.$refs && this.$refs.cardSearch) {
        Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      } else {
        Object.assign(paramsObj, this.cardSearchConfig.defaultParams)
      }

      // if (!paramsObj.sensorId) {
      //   this.cardTableConfig.loading = false
      //   return
      // }

      const res = await getDatasList(paramsObj.sensorId, {
        group: paramsObj.group,
        page: paramsObj.page,
        size: paramsObj.size
      })
      this.cardTableConfig.loading = false
      this.cardTableConfig.dataList = res.data.data
      this.cardTableConfig.pagination.total = res.data.total
    },
    //刷新项目列表
    refreshTree() {
      getProjectRoot()
        .then(res => {
          if (res.data) {
            this.treeData.data = res.data
            this.treeData.currentProject = res.data[0]
            this.getProjectData(true)
          } else {
            $message('暂无项目 不可操作，请创建项目')
          }
        })
        .catch(err => {
          console.log(err)
          $message('暂无项目 不可操作，请创建项目')
          this.totalLoading = false
        })
      this.totalLoading = false
    },
    beforeUnmount() {
      clearInterval(this.refreshInterval)
    },
    //删除数据
    handleDelete(row) {
      $confirm('确定删除该条数据, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        if (row) {
          ids = [row.id]
        } else {
          ids = this.cardTableConfig.selectList.map(item => item.id)
        }
        deleteAccount(ids).then(res => {
          if (res.status === 200) {
            $message.success('删除成功')
            this.getProjectData(true)
          }
        })
      })
    },
    //编辑
    editData(row) {
      router.push({
        name: 'deviceRegis',
        query: {
          type: 2,
          projectId: this.treeData.currentProject.id,
          id: row.id,
          title: '设备编辑'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cardSearch {
  margin: 16px 0;
}

input {
  height: 48px;
}

.tableBox {
  margin-top: 20px;
}
</style>
