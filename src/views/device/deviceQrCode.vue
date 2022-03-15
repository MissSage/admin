<template>
  <!-- 实时报警 -->
  <div class="tree-right-detail-box tableBox tabsPage">
    <el-tabs v-model="deviceType" type="card">
      <el-tab-pane label="压力计" name="4"></el-tab-pane>
      <el-tab-pane label="水表" name="2"></el-tab-pane>
      <el-tab-pane label="管网" name="1"></el-tab-pane>
    </el-tabs>

    <el-card style="border-radius: 0" class="tooltip-wrapper">
      <div class="tooltip">
        <el-form :inline="true">
          <el-form-item label="搜索">
            <el-input v-model="keyWord" style="width: 240px" placeholder="请输入关键字搜索" />
          </el-form-item>
        </el-form>
        <div class="action-wrapper">
          <el-button type="primary" icon="iconfont icon-chaxun" @click="refreshData"
            >查询</el-button
          >
          <el-button type="primary" icon="iconfont icon-xiazai" @click="downLoadQrCode"
            >下载二维码</el-button
          >
        </div>
      </div>
    </el-card>
    <CardTable style="padding: 0 16px; border-radius: 0" :config="cardTableConfig" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onBeforeMount, watch } from 'vue'
import CardTable from '@/components/cardTable/index.vue'
import QRCodePopover from './components/QRCodePopover.vue'
import { getDeviceListByType, downloadQrCodeByType } from '@/api/device'
// import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
  name: 'DeviceQrCode',
  components: { CardTable },
  setup() {
    // const { $btnPerms } = useGlobal()
    const state = reactive<{
      deviceType: string
      keyWord: string
      deviceTypes: string[]
    }>({
      deviceType: '4',
      keyWord: '',
      deviceTypes: ['', '管网', '水表', '', '压力计']
    })

    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      columns: [
        { prop: 'name', label: '名称' },
        { prop: 'projectName', label: '所属项目' }
      ],
      operations: [
        {
          label: '二维码',
          // perm: $btnPerms('123'),
          perm: true,
          icon: 'iconfont icon-icon_fuzhi',
          component: QRCodePopover
        }
      ],
      operationWidth: '120px',
      pagination: {
        page: 1,
        limit: 20,
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

    const refreshData = async () => {
      cardTableConfig.value.dataList = []
      const params = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        keyword: state.keyWord,
        deviceType: state.deviceType
      }
      const res = await getDeviceListByType(params)

      cardTableConfig.value.dataList = res.data.data.map(item => ({
        ...item,
        ...JSON.parse(item.additionalInfo || '{}')
      }))
      cardTableConfig.value.pagination.total = res.data.total
    }

    onBeforeMount(() => {
      refreshData()
    })

    const downLoadQrCode = async () => {
      const res = await downloadQrCodeByType({ deviceType: state.deviceType })
      console.log(res, 'exportRealDevice')
      const url = window.URL.createObjectURL(res.data)
      console.log(url)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', `${state.deviceTypes[state.deviceType]}-设备二维码.zip`)
      document.body.appendChild(link)
      link.click()
    }

    const tabChange = () => {
      if (state.deviceType === '4') {
        cardTableConfig.value.columns = [
          { prop: 'name', label: '名称' },
          { prop: 'projectName', label: '所属项目' }
        ]
      } else if (state.deviceType === '2') {
        cardTableConfig.value.columns = [
          { prop: 'name', label: '名称' },
          { prop: 'projectName', label: '所属区域' },
          { prop: 'location', label: '地址' }
        ]
      } else {
        cardTableConfig.value.columns = [
          { prop: 'name', label: '名称' },
          { prop: 'code', label: '管道编号' }
        ]
      }
      refreshData()
    }

    watch(
      () => state.deviceType,
      () => tabChange()
    )

    return {
      ...toRefs(state),
      cardTableConfig,
      refreshData,
      downLoadQrCode
    }
  }
})
</script>

<style lang="scss" scoped>
.cardSearch {
  margin: 16px 0;
}
input {
  height: 48px;
}
.tableBox {
  padding: 15px;
}
.tooltip {
  width: 100%;
  display: flex;
  padding-bottom: 8px;
  justify-content: space-between;
}
.workCountBox {
  width: 18px;
  height: 18px;
  background-color: red;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: 30px;
  z-index: 100;
}
</style>

<style lang="scss">
.tabsPage {
  padding-bottom: 20px !important;
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content {
    display: none;
  }

  .tooltip {
    .el-input__inner {
      height: 48px;
    }
  }

  .el-tabs__nav-wrap {
    padding-left: 0 !important;
  }
}
</style>
