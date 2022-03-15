<template>
    <!-- 数据监测 -->
    <treeBox>
        <template #tree>
            <TreeList :tree-data="treeData" />
        </template>
        <template #detailBody>
            <div class="tree-right-detail-box">
                <CardSearch ref="cardSearch" :config="cardSearchConfig" />
                <CardTable ref="cardTable" :config="cardTableConfig" />
            </div>
        </template>
    </treeBox>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import TreeList from '@/components/SLTree/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import { removeSlash } from '@/utils/removeIdSlash'
import {
    getDevice,
    getDatasList
} from '@/api/device'
import { TrueExcel } from '@/utils/exportExcel' // , Download
import useGlobal from '@/hooks/global/useGlobal'
import { defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue-demi'
import { ref } from 'vue'
const { $messageInfo, $format } = useGlobal()

export default defineComponent({
    components: { CardTable, CardSearch, TreeList },
    mixins: [tBaseMixin],
    setup() {
        const totalLoading = ref(false)
        const excel = new TrueExcel()
        const refreshInterval = ref<any>()
        const cardTable = ref<InstanceType<typeof CardTable>>()
        const cardSearch = ref<InstanceType<typeof CardSearch>>()
        const cardSearchConfig = reactive<CSSearchConfig>({
            operation: {
                search: { text: '查询', handle: () => refreshData() },
                export: {
                    text: '导出',
                    // perm: $btnPerms('data_export'),
                    perm: true,
                    disableHandle: () =>
                        !cardTableConfig.selectList || cardTableConfig.selectList.length == 0,
                    handle: () => exportData()
                }
            },
            defaultParams: {
                group: ''
            },
            filters: [
                {
                    label: '采集器',
                    key: 'sensorId',
                    type: 'select',
                    width: '240px',
                    options: [],
                    handleChange: () => refreshData()
                },
                {
                    label: '设备',
                    key: 'group',
                    type: 'select',
                    width: '240px',
                    options: [{ label: '全部', value: '' }]
                }
            ]
        })
        const cardTableConfig = reactive<CTCardTable>({
            loading: false,
            dataList: [],
            indexVisible: {
                label: '序号',
                width: '50px',
                align: 'center'
            },
            columns: [
                // { prop: 'serialNumber', label: '测量设备点位' },
                // { prop: 'serialNumber', label: '探头ID' },
                {
                    prop: 'collectionTime',
                    label: '最后更新时间',
                    formatter: row => $format(row.collectionTime),
                    icon: 'el-icon-time',
                    iconStyle: {
                        color: '#69e850',
                        display: 'inline-block',
                        'font-size': '16px'
                    }
                },
                { prop: 'propertyName', label: '监测量' },
                {
                    prop: 'value',
                    label: '监测值'
                    // formatter: row => (row.value || '-') + row.unit
                    // cellStyle: {
                    //   color: 'darkblue',
                    //   'font-weight': 600,
                    //   'font-size': '20px'
                    // }
                }
            ],
            pagination: {
                page: 1,
                limit: 20,
                total: 0,
                layout: 'total, sizes, prev, pager, next, jumper',
                sizeHandle: val => {
                    cardTableConfig.pagination.limit = val
                    refreshData()
                },
                pageHandle: val => {
                    cardTableConfig.pagination.page = val
                    refreshData()
                }
            }
        })
        // 点击项目 获取项目下的主机从机
        const getProjectData = data => {
            // 设置当前选中项目信息
            treeData.currentProject = data
            getDevice(data.id).then(res => {
                console.log(res.data)
                if (res.data && res.data.length > 0) {
                    cardSearchConfig.filters[0].options = res.data.map(item => ({
                        label: item.name,
                        value: removeSlash(item.id.id)
                    }))
                    if (cardSearch.value) {
                        cardSearch.value.queryParams.sensorId = removeSlash(res.data[0].id.id)
                    } else {
                        cardSearchConfig.defaultParams = {
                            group: '',
                            sensorId: removeSlash(res.data[0].id.id)
                        }
                    }
                    refreshData()
                    // getDeviceVarGroup(removeSlash(res.data[0].id.id))
                } else {
                    cardSearchConfig.filters[0].options = []
                    cardTableConfig.dataList = []
                    cardSearch.value && (cardSearch.value.queryParams.sensorId = '')
                }
            })
        }
        const treeData = reactive<SLTreeConfig>({
            title: '项目列表',
            data: [],
            loading: false,
            isFilterTree: true,
            currentProject: {},
            expandNodeId: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            treeNodeHandleClick: getProjectData
        })
        const exportData = () => {
            if (!cardTable.value) return
            // export
            excel.addElTable(cardTable.value.$refs.elTable)
            excel.export()
        }
        const refreshTree = () => {
            getProjectRoot()
                .then(res => {
                    if (res.data) {
                        treeData.data = res.data
                        const fTData = treeData.data.filter(v => !v.disabled)
                        treeData.currentProject = fTData[0]
                        getProjectData(fTData[0])
                        totalLoading.value = false
                    } else {
                        $messageInfo('暂无项目 不可操作，请创建项目')
                        totalLoading.value = false
                    }
                })
                .catch(err => {
                    console.log(err)
                    $messageInfo('暂无项目 不可操作，请创建项目')
                    totalLoading.value = false
                })
        }

        // const getDeviceVarGroup = (sensorId?: string) => {
        //   getDeviceVarGroupAPI(sensorId).then(res => {
        //     console.log(res.data)
        //   refreshData()
        //   })
        // }
        const refreshData = async () => {
            cardTableConfig.loading = true
            const paramsObj = {
                page: cardTableConfig.pagination.page,
                size: cardTableConfig.pagination.limit,
                projectId: treeData.currentProject.id,
                sensorId: '',
                group: ''
            }
            if (cardSearch.value) {
                Object.assign(paramsObj, cardSearch.value.queryParams)
            } else {
                Object.assign(paramsObj, cardSearchConfig.defaultParams)
            }

            if (!paramsObj.sensorId) return (cardTableConfig.loading = false)

            const res = await getDatasList(paramsObj.sensorId, {
                group: paramsObj.group,
                page: paramsObj.page,
                size: paramsObj.size
            })
            cardTableConfig.loading = false

            cardTableConfig.dataList = res.data.data
            cardTableConfig.pagination.total = res.data.total
        }
        onBeforeUnmount(() => {
            refreshInterval.value && clearInterval(refreshInterval.value)
            console.log('dataMonitoring is Unmounted')
        })
        onMounted(() => {
            refreshTree()
            refreshInterval.value = setInterval(() => refreshData(), 30 * 1000)
        })
        return {
            refreshData,
            // getDeviceVarGroup,
            getProjectData,
            refreshTree,
            exportData,
            treeData,
            cardTableConfig,
            cardSearchConfig,
            cardSearch,
            cardTable
        }
    },
    // created() {
    //   this.refreshTree()
    //   this.refreshInterval = setInterval(() => this.refreshData(), 30 * 1000)
    // },

    methods: {}
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
