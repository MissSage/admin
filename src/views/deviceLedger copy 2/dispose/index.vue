<template>
    <!-- 设备处置 主页 -->
    <div class="tree-right-detail-box">
        <!--搜索栏-->
        <CardSearch ref="cardSearch" :config="cardSearchConfig"/>
        <!--表格-->
        <CardTable :config="cardTableConfig"/>
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
    import {ref, defineComponent, onMounted} from 'vue'
    import useGlobal from '@/hooks/global/useGlobal'
    import type{ICTCardTable, ITableItem} from '@/common/types/ledger/dispose'
    //引入接口方法：查询，删除
    import {getTableData, deleteHandle} from '@/api/ledger/disposition'
    import {QueryListParam} from '@/common/types/common'
    //格式化数据
    import {FORMATSTATUSTB,STATUSCOLORS, CTYPESCOLORS,DISTYPEFORMATSTATUS} from '@/common/constans/ledger'
    import router from '@/router'

    export default defineComponent({
        name: 'Dispose',
        components: {CardTable, CardSearch},
        setup() {
            //1.定义变量
            const {$confirm, $message, $format} = useGlobal()
            const addBtnTxt = '添加处置申请'
            const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
            //查询栏
            const cardSearchConfig = ref<CSSearchConfig>({
                operation: {
                    search: {text: '查询', handle: () => refreshData()},
                    add: {
                        text: addBtnTxt,
                        perm: true,
                        handle: () => {
                            //跳转处置申请页
                            sessionStorage.removeItem('data')
                            router.push({name: 'addDisApply', query: {type: 0, title: addBtnTxt}})
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
                filters: [{label: '搜索', key: 'handleNo', type: 'input', width: '360px'}]
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
                    {prop: 'handleNo', label: '处置编号',width:250},
                    {
                        prop: '', label: '状态',width:100,
                        backgroundHandle: row => STATUSCOLORS[row.status],
                        formatter: (row: ITableItem) => FORMATSTATUSTB[row.status].text,
                        cellStyle:{
                            'border-radius': '8px',
                            color: '#fff',
                            'line-height': '35px',
                            height: '30px',
                            padding: '5px 15px',
                            'font-size': '16px'
                        }
                    },
                    {prop: 'reviewerName', label: '审核人',width:180},
                    {prop: 'applicantName', label: '申请人',width:180},
                    {
                        prop: '', label: '申请时间',
                        width: 200,
                        formatter: (row: ITableItem) => row.createTime ? $format(row.createTime) : ''
                    },
                    {
                        prop: '', label: '处置类型',width:100,
                        formatter: (row: ITableItem) => DISTYPEFORMATSTATUS[row.handleType],
                        textColorHandle: (row: ITableItem) => CTYPESCOLORS[row.handleType],
                        borderHandle: (row: ITableItem)  =>'1px '+ CTYPESCOLORS[row.handleType]+' solid',
                        cellStyle:{
                            'border-radius': '8px',
                            'line-height': '35px',
                            height: '30px',
                            padding: '4px 13px',
                            'font-size': '16px'
                        }
                    },
                    {prop: 'remark', label: '处置说明'}
                ],
                operations: [
                    {
                        labelHandle: row => (row.status == '2' ? '审核' : '详情'),
                        perm: true,
                        colorHandle: row =>
                            row.status == '2'
                                ? '#FF59E9FF'
                                : '#2A96D5FF',
                        iconHandle: row =>
                            row.status == '2'
                                ? 'iconfont icon-qitingcaozuo-tingzhi'
                                : 'iconfont icon-xiangqing',
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
            //2.方法
            //挂载后再加载数据
            onMounted(async () => {
                refreshData()
            })
            //查询数据
            const refreshData = async () => {
                cardTableConfig.value.loading = true
                const {handleNo} = cardSearch.value?.queryParams
                const paramsObj: QueryListParam = {
                    page: cardTableConfig.value.pagination.page,
                    size: cardTableConfig.value.pagination.limit,
                    handleNo
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
                    deleteHandle(ids).then(res => {
                        if (res.status === 200) {
                            $message.success('删除成功')
                            refreshData()
                        }
                    })
                })
            }
            //编辑
            const handleEdit = async (row: ITableItem) => {
                sessionStorage.setItem('data', JSON.stringify(row))
                router.push({name: 'addDisApply', query: {title: formatStatus(row)}})
            }
            //标题
            const formatStatus = (row: ITableItem) => {
                return row.status == 2 ? '处置审核' : '处置详情'
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
