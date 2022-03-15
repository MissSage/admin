<template>
    <!-- 折旧 主页 -->
    <treeBox v-loading="totalLoading">
        <template #tree>
            <TreeList :tree-data="treeData"/>
        </template>
        <template #detailBody>
            <div class="tree-right-detail-box">
                <CardSearch ref="cardSearch" :config="cardSearchConfig"/>
                <CardTable ref="cardTable" :config="cardTableConfig"/>
            </div>
        </template>
    </treeBox>
</template>

<script>
    import CardSearch from '@/components/cardSearch/index.vue'
    import CardTable from '@/components/cardTable/index.vue'
    import {tBaseMixin} from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
    import {getProjectRoot} from '@/api/project'
    import {getTableData} from '@/api/ledger/depreciation'
    import TreeList from '@/components/treeList/index.vue'
    import {getDatasList} from '@/api/device'
    import {TrueExcel} from '@/utils/exportExcel'
    import useGlobal from '@/hooks/global/useGlobal'
    import {FORMATMETHOD} from '@/common/constans/ledger'
    const {$message, $format, $btnPerms} = useGlobal()
    export default {
        name: 'depreciation',
        components: {
            CardTable,
            CardSearch,
            TreeList
        },
        mixins: [tBaseMixin],
        data() {
            return {
                //1.定义
                totalLoading: false,
                excel: new TrueExcel(),
                //搜索框
                cardSearchConfig: {
                    operation: {
                        search: {text: '查询', handle: () => this.getProjectData()}
                    },
                    filters: [
                        {label: '搜索', key: 'deviceName', type: 'input', width: '360px'}
                    ]
                },
                //表
                cardTableConfig: {
                    loading: false,
                    dataList: [],
                    indexVisible: {
                        label: '序号',
                        width: '50px',
                        align: 'center'
                    },
                    columns: [
                        {prop: 'deviceNo', label: '设备编号', fixed: 'left', width: 200},
                        {prop: 'deviceName', label: '设备名称', fixed: 'left', width: 200},
                        {
                            prop: 'depreciationMonth', label: '折旧年月',
                            width: 200,
                            icon: 'el-icon-time',
                            iconStyle: {
                                color: '#69e850',
                                display: 'inline-block',
                                'font-size': '16px'
                            }
                        },
                        {
                            prop: '', label: '折旧方法', width: 200,
                            formatter: row => FORMATMETHOD[row.depreciationMethod]
                        },
                        {prop: 'purchaseAmount', label: '采购金额', width: 200},
                        {prop: 'useLife', label: '使用寿命', width: 200},
                        {prop: 'netResidualRate', label: '净残率'},
                        {prop: 'countMonth', label: '折旧月份'},
                        {prop: 'originValue', label: '原值', width: 200},
                        {prop: 'depreciationCurrent', label: '当期折旧', width: 200},
                        {prop: 'depreciationTotal', label: '累计折旧', width: 200},
                        {prop: 'netValue', label: '净值', width: 200}
                    ],
                    pagination: {
                        page: 1,
                        limit: 20,
                        total: 0,
                        layout: 'total, sizes, prev, pager, next, jumper',
                        sizeHandle: val => {
                            this.cardTableConfig.pagination.limit = val
                            this.refreshData()
                        },
                        pageHandle: val => {
                            this.cardTableConfig.pagination.page = val
                            this.refreshData()
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
                        this.getProjectData(true)
                    }
                }
            }
        },
        created() {
            this.totalLoading = true
            //获取列表项目数据
            getProjectRoot()
                .then(res => {
                    this.totalLoading = false
                    if (res.data) {
                        this.treeData.data = res.data
                        this.treeData.currentProject = res.data[0]
                        //获取表格数据
                        this.getProjectData(true)
                    } else {
                        $message('暂无项目不可操作，请创建项目111')
                    }
                })
                .catch(err => {
                    console.log('报错内容：' + err)
                    $message('暂无项目 不可操作，请创建项目222')
                })
            //30秒表格数据刷新
            // this.refreshInterval = setInterval(() => this.refreshData(), 30 * 1000)
        },
        //2.方法
        methods: {
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
                        this.cardTableConfig.dataList = res.data.data
                        this.cardTableConfig.pagination.total = res.data.total
                    } else {
                        $message('无数据')
                    }
                })
            },
            //刷新数据 -弃用
            async refreshData() {
                this.cardTableConfig.loading = true
                const {name} = cardSearch.value?.queryParams
                const paramsObj = {
                    page: this.cardTableConfig.pagination.page,
                    size: this.cardTableConfig.pagination.limit,
                    projectId: this.treeData.currentProject.id,
                    name
                }
                if (this.$refs && this.$refs.cardSearch) {
                    Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
                } else {
                    Object.assign(paramsObj, this.cardSearchConfig.defaultParams)
                }
                if (!paramsObj.sensorId) return (this.cardTableConfig.loading = false)
                const res = await getDatasList(paramsObj.sensorId, {
                    group: paramsObj.group,
                    page: paramsObj.page,
                    size: paramsObj.size
                })
                console.log(res, 'getDatasListgetDatasList')
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
