<template>
  <!-- 设备转移 主页 -->
  <div class="tree-right-detail-box">
    <!--搜索栏-->
    <CardSearch ref="cardSearch" :config="cardSearchConfig" />
    <!--表格-->
    <CardTable :config="cardTableConfig" />
    <!--详情-->
    <!--  <detail
                  v-if="detialConfig.visible"
                  v-model="detialConfig.visible"
                  :detial-config="detialConfig"
                  @closeDialog="closeDialog"
          ></detail>-->
  </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import { ref, defineComponent, onMounted } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import type { ICTCardTable, ITableItem } from '@/common/types/ledger/transf'
//引入转移接口方法
import { getTableData, deleteTransfer } from '@/api/ledger/trans'
import { QueryListParam } from '@/common/types/common'
import router from '@/router'
//引格式化
import { FORMATSTATUS, FORMATSTATUSTB, STATUSCOLORS } from '@/common/constans/ledger'

export default defineComponent({
  name: 'Transfer',
  components: { CardTable, CardSearch },
  setup() {
    //1.定义
    const { $confirm, $message, $format } = useGlobal()
    const addBtnTxt = '添加转移申请'
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    //查询栏
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: addBtnTxt,
          perm: true,
          handle: () => {
            //连接台账登记页
            sessionStorage.removeItem('row')
            router.push({
              name: 'addTransApply',
              query: { delFlag: 1, type: 0, title: '添加调拨申请' }
            })
          }
        },
        del: {
          text: '批量删除',
          disableHandle: () => {
            return (
              !cardTableConfig.value.selectList || cardTableConfig.value.selectList.length === 0
            )
          },
          handle: () => handleDelete(),
          perm: true
        }
      },
      defaultParams: {},
      filters: [{ label: '搜索', key: 'transferNo', type: 'input', width: '360px' }]
    })
    //表格栏
    const cardTableConfig = ref<ICTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      operationFixed: 'right',
      tableSelectChangeHandle: (val: ITableItem[]) => {
        cardTableConfig.value.selectList = val
      },
      columns: [
        { prop: 'transferNo', label: '转移编号', width: 200 },
        {
          prop: '',
          label: '状态',
          width: 100,
          backgroundHandle: row => STATUSCOLORS[row.status],
          formatter: (row: ITableItem) => FORMATSTATUSTB[row.status].text,
          cellStyle: {
            'border-radius': '8px',
            color: '#fff',
            'line-height': '35px',
            height: '30px',
            padding: '5px 15px',
            'font-size': '16px'
          }
        },
        { prop: 'reviewerName', label: '审核人' },
        { prop: 'applicantName', label: '申请人' },
        {
          prop: '',
          label: '申请时间',
          width: 200,
          formatter: row => $format(row.createTime)
        },
        { prop: 'projectName', label: '调往部门' },
        { prop: 'position', label: '调往地址' },
        { prop: 'director', label: '新资产负责人' },
        { prop: 'remark', label: '调拨说明' }
      ],
      operations: [
        {
          labelHandle: row => (row.status == '2' ? '审核' : '详情'),
          perm: true,
          colorHandle: row => (row.status == '2' ? '#FF59E9FF' : '#2A96D5FF'),
          iconHandle: row =>
            row.status == '2' ? 'iconfont icon-qitingcaozuo-tingzhi' : 'iconfont icon-xiangqing',
          handle: row => handleEdit(row)
        },
        {
          label: '删除',
          perm: true,
          color: 'red',
          icon: 'iconfont icon-shanchu',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '150px',
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
    //查询数据
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      const { transferNo } = cardSearch.value?.queryParams
      const paramsObj: QueryListParam = {
        page: cardTableConfig.value.pagination.page,
        size: cardTableConfig.value.pagination.limit,
        transferNo
      }
      try {
        const res = await getTableData(paramsObj)
        console.log(res)
        cardTableConfig.value.loading = false
        if (res.status === 200) {
          cardTableConfig.value.dataList = res.data.data
          cardTableConfig.value.pagination.total = res.data.total
        } else {
          $message.error('获取失败')
        }
        cardTableConfig.value.loading = false
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    //2.方法
    //挂载后再加载数据
    onMounted(async () => {
      refreshData()
    })
    //删除
    const handleDelete = (row?: ITableItem) => {
      console.log(row)
      $confirm('确定删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = cardTableConfig.value?.selectList?.map(node => node.id) ?? []
        }
        deleteTransfer(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          refreshData()
        })
      })
    }
    //编辑
    const handleEdit = async (row: any) => {
      sessionStorage.setItem('row', JSON.stringify(row))
      router.push({ name: 'addTransApply', query: { delFlag: 0, title: formatStatus(row) } })
    }
    //标题
    const formatStatus = (row: ITableItem) => {
      return row.status == 2 ? '调拨审核' : '调拨详情'
    }
    //返回
    return {
      cardSearch,
      cardSearchConfig,
      cardTableConfig,
      refreshData,
      detialConfig: {
        visible: false,
        info: {}
      }
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
  margin-top: 20px;
}
</style>
