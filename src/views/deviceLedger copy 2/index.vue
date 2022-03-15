<template>
  <!-- 设备台账 -->
  <div class="equipment-account-warpper custom-page">
    <el-card class="tooltip-wrapper">
      <div class="top-bar">
        <el-input v-model="filterText" class="d-name-input" placeholder="设备名称"></el-input>
        <div class="buttons">
          <el-button type="primary" @click="queryData">查询</el-button>
          <el-button class="reset-green" @click="clickAdd">新增</el-button>
          <!-- <el-button class="export-orange" @click="handlerExport">导出</el-button> -->
        </div>
      </div>
    </el-card>
    <el-card class="main-content">
      <div class="table-box">
        <!-- <simpleTable :tableConfig="tableConfig" class="s-table"></simpleTable> -->
        <el-table :data="filterData" height="100%" size="mini" @row-click="clcikRow">
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="图片" width="80">
            <template #default="scope">
              <div class="img-box">
                <img :src="scope.row.imageUrl ? scope.row.imageUrl : deviceImg" alt="" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" prop="name" width="200">
            <template #default="scope">
              <span class="table-r-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备编号" prop="serialNumber" width="100"></el-table-column>
          <el-table-column label="设备类别" prop="type" width="80"></el-table-column>
          <el-table-column label="设备状态" prop="status" width="80">
            <template #default="scope">
              <p class="d-state" :class="{ 'state-fault': !~~scope.row.status }">
                {{ ~~scope.row.status ? '正常' : '故障' }}{{ scope.row.status }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="使用情况" prop="useFlag" width="80">
            <template #default="scope">
              <p
                class="d-usage"
                :class="{
                  'usage-disable': scope.row.useFlag === '0',
                  'usage-idle-machines': scope.row.useFlag === '2'
                }"
              >
                {{
                  scope.row.useFlag === '1' ? '在用' : scope.row.useFlag === '2' ? '闲置' : '禁用'
                }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="负责人" prop="creator"></el-table-column>
          <el-table-column label="品牌" prop="brand"></el-table-column>
          <el-table-column label="设备型号" prop="deviceModel"></el-table-column>
          <el-table-column label="供应商" prop="gys" width="200"></el-table-column>
          <el-table-column label="单位" prop="unit" width="60"></el-table-column>
          <el-table-column label="所属部门" prop="dept" width="80"></el-table-column>
          <el-table-column
            label="安装位置"
            prop="installationLocation"
            width="200"
          ></el-table-column>
          <el-table-column label="购置日期" prop="pTime" width="100"></el-table-column>
          <el-table-column label="购置金额" prop="price"></el-table-column>
          <el-table-column label="出厂时间" prop="dmTime" width="100"></el-table-column>
          <el-table-column label="投产时间" prop="tcTime" width="100"></el-table-column>
          <el-table-column label="预计报废时间" prop="esTime" width="110"></el-table-column>
          <el-table-column label="计量设备 级别" prop="measurementGrade"></el-table-column>
          <el-table-column label="备注" prop="remark" width="200"></el-table-column>
        </el-table>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="15"
        :total="filterData.length"
        class="pageination"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <detail
      v-if="detialConfig.visible"
      v-model="detialConfig.visible"
      :detial-config="detialConfig"
      @closeDialog="closeDialog"
    ></detail>
  </div>
</template>

<script>
import detail from './components/detail.vue'
export default {
  name: 'UserManage',
  components: {
    detail
  },
  data() {
    return {
      queryAsset: null,
      filterText: '',
      assetTree: [],
      areaNormalizer(node) {
        return {
          id: node.assetId
        }
      },
      detialConfig: {
        visible: false,
        info: {}
      },
      total: 0,
      currentPage: 1,
      tableData: [],
      filterData: [
        {
          id: 'ff8080817b8016a2017b804c04b40000',
          name: '测试',
          serialNumber: '',
          type: '',
          status: '',
          useFlag: '',
          creator: '',
          brand: '',
          deviceModel: '',
          dept: '',
          installationLocation: '',
          price: 0,
          purchaseTime: null,
          dateOfManufacture: null,
          productionTime: null,
          estimatedScrapTime: null,
          measurementGrade: '',
          remark: '',
          additionalInfo:
            '{"gys":"","unit":"","imageUrl":"http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: 'http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png',
          gys: '',
          unit: '',
          pTime: 'Invalid date',
          dmTime: 'Invalid date',
          tcTime: 'Invalid date',
          esTime: 'Invalid date'
        },
        {
          id: 'ff8080817b8016a2017b822479e00001',
          name: '124',
          serialNumber: '34',
          type: '',
          status: '1',
          useFlag: '',
          creator: '',
          brand: '',
          deviceModel: '',
          dept: '',
          installationLocation: '1234',
          price: 0,
          purchaseTime: null,
          dateOfManufacture: null,
          productionTime: 1629907200000,
          estimatedScrapTime: null,
          measurementGrade: '',
          remark: '',
          additionalInfo: '{"gys":"","unit":"","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '',
          unit: '',
          pTime: 'Invalid date',
          dmTime: 'Invalid date',
          tcTime: '2021-08-26',
          esTime: 'Invalid date'
        }
      ],
      showData: [],
      deviceDetailData: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.currentPage = 1
      this.detialConfig = { visible: false, info: {} }
      this.deviceDetailData = []
      this.filterData = [
        {
          id: 'ff8080817b8016a2017b822479e00001',
          name: '124',
          serialNumber: '34',
          type: '生产设备',
          status: '1',
          useFlag: '2',
          creator: '王伟',
          brand: 'gk',
          deviceModel: 's57457',
          dept: '行政',
          installationLocation: '行政楼',
          price: 440,
          purchaseTime: 1622390400000,
          dateOfManufacture: 1627833600000,
          productionTime: 1629907200000,
          estimatedScrapTime: 1692892800000,
          measurementGrade: '0',
          remark: '',
          additionalInfo: '{"gys":"","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '',
          unit: '育才中学',
          pTime: '2021-05-31',
          dmTime: '2021-08-02',
          tcTime: '2021-08-26',
          esTime: '2023-08-25'
        },
        {
          id: 'ff8080817b8016a2017b9a20c4c60002',
          name: '电表',
          serialNumber: '12312',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '张三丰',
          brand: '测试',
          deviceModel: 'A2312',
          dept: '教导处',
          installationLocation: '教导处办公室',
          price: 2000,
          purchaseTime: 1629648000000,
          dateOfManufacture: 1628524800000,
          productionTime: 1630339200000,
          estimatedScrapTime: 1693324800000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo: '{"gys":"测试","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '测试',
          unit: '育才中学',
          pTime: '2021-08-23',
          dmTime: '2021-08-10',
          tcTime: '2021-08-31',
          esTime: '2023-08-30'
        },
        {
          id: 'ff8080817b8016a2017b804c04b40000',
          name: '测试',
          serialNumber: 'A2454',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '黄山',
          brand: '康王',
          deviceModel: 'D543634',
          dept: '行政',
          installationLocation: '行政楼',
          price: 1000,
          purchaseTime: 1625673600000,
          dateOfManufacture: 1622995200000,
          productionTime: 1629648000000,
          estimatedScrapTime: 1692374400000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo:
            '{"gys":"","unit":"育才中学","imageUrl":"http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: 'http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png',
          gys: '',
          unit: '育才中学',
          pTime: '2021-07-08',
          dmTime: '2021-06-07',
          tcTime: '2021-08-23',
          esTime: '2023-08-19'
        }
      ]
      this.showData = [
        {
          id: 'ff8080817b8016a2017b822479e00001',
          name: '124',
          serialNumber: '34',
          type: '生产设备',
          status: '1',
          useFlag: '2',
          creator: '王伟',
          brand: 'gk',
          deviceModel: 's57457',
          dept: '行政',
          installationLocation: '行政楼',
          price: 440,
          purchaseTime: 1622390400000,
          dateOfManufacture: 1627833600000,
          productionTime: 1629907200000,
          estimatedScrapTime: 1692892800000,
          measurementGrade: '0',
          remark: '',
          additionalInfo: '{"gys":"","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '',
          unit: '育才中学',
          pTime: '2021-05-31',
          dmTime: '2021-08-02',
          tcTime: '2021-08-26',
          esTime: '2023-08-25'
        },
        {
          id: 'ff8080817b8016a2017b9a20c4c60002',
          name: '电表',
          serialNumber: '12312',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '张三丰',
          brand: '测试',
          deviceModel: 'A2312',
          dept: '教导处',
          installationLocation: '教导处办公室',
          price: 2000,
          purchaseTime: 1629648000000,
          dateOfManufacture: 1628524800000,
          productionTime: 1630339200000,
          estimatedScrapTime: 1693324800000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo: '{"gys":"测试","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '测试',
          unit: '育才中学',
          pTime: '2021-08-23',
          dmTime: '2021-08-10',
          tcTime: '2021-08-31',
          esTime: '2023-08-30'
        },
        {
          id: 'ff8080817b8016a2017b804c04b40000',
          name: '测试',
          serialNumber: 'A2454',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '黄山',
          brand: '康王',
          deviceModel: 'D543634',
          dept: '行政',
          installationLocation: '行政楼',
          price: 1000,
          purchaseTime: 1625673600000,
          dateOfManufacture: 1622995200000,
          productionTime: 1629648000000,
          estimatedScrapTime: 1692374400000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo:
            '{"gys":"","unit":"育才中学","imageUrl":"http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: 'http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png',
          gys: '',
          unit: '育才中学',
          pTime: '2021-07-08',
          dmTime: '2021-06-07',
          tcTime: '2021-08-23',
          esTime: '2023-08-19'
        }
      ]
      this.tableData = [
        {
          id: 'ff8080817b8016a2017b822479e00001',
          name: '124',
          serialNumber: '34',
          type: '生产设备',
          status: '1',
          useFlag: '2',
          creator: '王伟',
          brand: 'gk',
          deviceModel: 's57457',
          dept: '行政',
          installationLocation: '行政楼',
          price: 440,
          purchaseTime: 1622390400000,
          dateOfManufacture: 1627833600000,
          productionTime: 1629907200000,
          estimatedScrapTime: 1692892800000,
          measurementGrade: '0',
          remark: '',
          additionalInfo: '{"gys":"","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '',
          unit: '育才中学',
          pTime: '2021-05-31',
          dmTime: '2021-08-02',
          tcTime: '2021-08-26',
          esTime: '2023-08-25'
        },
        {
          id: 'ff8080817b8016a2017b9a20c4c60002',
          name: '电表',
          serialNumber: '12312',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '张三丰',
          brand: '测试',
          deviceModel: 'A2312',
          dept: '教导处',
          installationLocation: '教导处办公室',
          price: 2000,
          purchaseTime: 1629648000000,
          dateOfManufacture: 1628524800000,
          productionTime: 1630339200000,
          estimatedScrapTime: 1693324800000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo: '{"gys":"测试","unit":"育才中学","imageUrl":"","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: '',
          gys: '测试',
          unit: '育才中学',
          pTime: '2021-08-23',
          dmTime: '2021-08-10',
          tcTime: '2021-08-31',
          esTime: '2023-08-30'
        },
        {
          id: 'ff8080817b8016a2017b804c04b40000',
          name: '测试',
          serialNumber: 'A2454',
          type: '生产设备',
          status: '1',
          useFlag: '1',
          creator: '黄山',
          brand: '康王',
          deviceModel: 'D543634',
          dept: '行政',
          installationLocation: '行政楼',
          price: 1000,
          purchaseTime: 1625673600000,
          dateOfManufacture: 1622995200000,
          productionTime: 1629648000000,
          estimatedScrapTime: 1692374400000,
          measurementGrade: '0',
          remark: '无',
          additionalInfo:
            '{"gys":"","unit":"育才中学","imageUrl":"http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png","fileList":[]}',
          tenantId: '1eb23dd8d3901409066d1d391b68965',
          assetId: '1eb5b8f08f6b91097b1e5410dad486c',
          imageUrl: 'http://183.220.138.22:2080/a9a5fbb0-0615-11ec-9b5e-7bddc102c9f5.png',
          gys: '',
          unit: '育才中学',
          pTime: '2021-07-08',
          dmTime: '2021-06-07',
          tcTime: '2021-08-23',
          esTime: '2023-08-19'
        }
      ]
    },
    queryData() {
      this.filterData = this.tableData.filter(
        v => v.name.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1
      )
    },
    clickAdd() {
      this.detialConfig.info = {}
      this.detialConfig.visible = true
    },
    clcikRow(row) {
      console.log(row, 'row')
      let m = JSON.parse(JSON.stringify(row))
      console.log(m)
      this.detialConfig.info = m
      this.detialConfig.visible = true
    },
    closeDialog() {
      this.getTableData()
      this.detialConfig.visible = false
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.showData = this.filterData.slice(val * 12 - 12, [val * 12])
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__body {
    padding: 15px 0;
  }
  &.tooltip-wrapper {
    .el-card__body {
      padding: 15px;
    }
  }
  &.main-content{
    height: calc(100% - 120px);
    .el-card__body{
      height: 100%;
    }
  }
}
.equipment-account-warpper {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: $bg-color-dark;
  .tooltip-wrapper {
    overflow: visible;
    position: relative;
    margin: 22px 0;
  }
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .d-name-input {
      width: 200px;
    }
  }
  .main-content {
    .table-box {
      height: calc(100% - 40px);
      background-color: rgb(40, 42, 48);
      .s-table {
        border: 1px solid rgba(65, 86, 167, 1);
      }
      .img-box {
        width: 56px;
        height: 56px;
        border-radius: 5px;
        overflow: hidden;
        img {
          max-height: 100%;
          max-width: 100%;
        }
      }
      .table-r-name {
        color: #4699ff;
      }
      .d-state {
        color: #328eff;
        padding: 3px 10px;
        display: inline-block;
        border: 1px solid #328eff;
        background: rgba(50, 142, 255, 0.2);
      }
      .state-fault {
        color: #e93672;
        border-color: #e93672;
        background: rgba(233, 54, 114, 0.2);
      }
      .d-usage {
        color: #32ff7c;
        padding: 3px 10px;
        display: inline-block;
        border: 1px solid #32ff7c;
        background: rgba(50, 255, 125, 0.2);
      }
      .usage-disable {
        color: #ff3232;
        border-color: #ff3232;
        background: rgba(255, 50, 50, 0.2);
      }
      .usage-idle-machines {
        color: #ffcc32;
        border-color: #ffcc32;
        background: rgba(255, 204, 50, 0.2);
      }
    }
    .pagination {
      margin: 15px 0 10px 20px;
      text-align: left;
    }
  }
}
</style>
