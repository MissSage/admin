<template>
    <!-- 盘点 主页 -->
    <div class="tree-right-detail-box">
        <!--搜索栏-->
        <CardSearch ref="cardSearch" :config="cardSearchConfig"/>
        <!--表格-->
        <CardTable :config="cardTableConfig"/>
    </div>
</template>

<script lang="ts">
    import CardSearch from '@/components/cardSearch/index.vue'
    import CardTable from '@/components/cardTable/index.vue'
    import {ref, defineComponent, onMounted} from 'vue'
    import useGlobal from '@/hooks/global/useGlobal'
    import type{ICTCardTable, ITableItem} from '@/common/types/ledger/check'
    //引入接口方法
    import {getTableData, deleteInventory} from '@/api/ledger/check'
    import {CHEFORMATSTATUS, PSTATUSCOLORS} from '@/common/constans/ledger'
    //引入双击显示详情
    // import detail from './components/detail.vue'
    import router from '@/router'

    export default defineComponent({
        name: 'check',
        components: {CardTable, CardSearch},
        setup() {
            //1.定义
            const {$confirm, $message, $format} = useGlobal()
            const addBtnTxt = '添加盘点计划'
            const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
            //查询栏
            const cardSearchConfig = ref<CSSearchConfig>({
                operation: {
                    search: {text: '查询', handle: () => refreshData()},
                    add: {
                        text: addBtnTxt,
                        perm: true,
                        handle: () => {
                            sessionStorage.removeItem('check')
                            router.push({name: 'addCheckApply', query: {type:1,title: addBtnTxt}})
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
                filters: [{label: '搜索', key: 'inventoryNo', type: 'input', width: '360px'}]
            })
            //表格栏
            const cardTableConfig = ref<ICTCardTable>({
                loading: false,
                dataList: [],
                selectList: [],
                indexVisible: false,
                operationFixed: 'right',
                tableSelectChangeHandle: (val: ITableItem[]) => {
                    cardTableConfig.value.selectList = val
                },
                columns: [
                    {prop: 'inventoryNo', label: '盘点编号',width:200},
                    {
                        prop: '', label: '状态',width:120,
                        backgroundHandle: (row: ITableItem) => PSTATUSCOLORS[row.status],
                        formatter: (row: ITableItem) => CHEFORMATSTATUS[row.status],
                        cellStyle:{
                            'border-radius': '8px',
                            color: '#fff',
                            'line-height': '35px',
                            height: '30px',
                            padding: '5px 15px',
                            'font-size': '16px'
                        }
                    },
                    {prop: 'inventoryPersonNames', label: '盘点人',width:250},
                    {
                        prop: '', label: '计划盘点时间',
                        width: 200,
                        formatter: (row: ITableItem) => row.expectInventoryTime ? $format(row.expectInventoryTime) : ''
                    },
                    {prop: 'remark', label: '盘点说明'}
                ],
                operations: [
                    {
                        labelHandle: row => (row.status == '2' ? '详情' : '盘点'),
                        perm: true,
                        colorHandle: row =>
                            row.status == '2'
                                ? '#2A96D5FF'
                                : '#FF59E9FF',
                        iconHandle: row =>
                            row.status == '2'
                                ? 'iconfont icon-xiangqing'
                                : 'iconfont icon-qitingcaozuo-tingzhi',
                        handle: row => handleEdit(row)
                    }, {
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
                const { inventoryNo } = cardSearch.value?.queryParams
                const paramsObj = {
                    page: cardTableConfig.value.pagination.page,
                    limit: cardTableConfig.value.pagination.limit,
                    inventoryNo
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
                    deleteInventory(ids).then(res => {
                        if (res.status === 200) {
                            $message.success('删除成功')
                            refreshData()
                        }
                    })
                })
            }
            //编辑
            const handleEdit = async (row: ITableItem) => {
                sessionStorage.setItem("check", JSON.stringify(row))
                router.push({name: 'addCheckApply', query: {title: '盘点详情'}})
            }
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
