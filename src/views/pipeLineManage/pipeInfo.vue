<template>
    <!-- 计划巡检任务 -->
    <div v-loading="totalLoading" class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AddOrUpdateDialog
            v-if="addOrUpdateConfig.visible"
            ref="addOrUpdate"
            :config="addOrUpdateConfig"
            @refreshData="refreshData"
        />
    </div>
</template>

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import {
    getPipeList,
    delPipe,
    getPipeDetail,
    exportPipeLine,
    importPipeLine,
    downloadPipeLineTemplate
} from '@/api/pipeLine'
import { ref, onBeforeMount, defineComponent } from 'vue'
import { getPipeNodeList } from '@/api/pipeLine'
// import useProject from '@/hooks/project/useProject'
import ImportBtn from './components/ImportBtn.vue'
import useGlobal from '@/hooks/global/useGlobal'

export default defineComponent({
    components: { CardTable, CardSearch, AddOrUpdateDialog },
    setup() {
        const { $messageError, $messageSuccess, $format, $confirm } = useGlobal()
        const cardSearch = ref<any>(null)

        const downloadTemplate = async () => {
            const res = await downloadPipeLineTemplate()
            const url = window.URL.createObjectURL(res.data)
            console.log(url)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', `用户列表.xlsx`)
            document.body.appendChild(link)
            link.click()
        }
        const _exportPipeLine = async () => {
            const res = await exportPipeLine()
            const url = window.URL.createObjectURL(res.data)
            console.log(url)
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', `用户列表.xlsx`)
            document.body.appendChild(link)
            link.click()
        }
        const totalLoading = ref<boolean>(false)
        const _importPipeLine = async (formData: any) => {
            totalLoading.value = true
            const res = await importPipeLine(formData)
            totalLoading.value = false
            console.log(res, 'importRealDevice')
            if (~~res.data.code === 0 && ~~res.status === 200) {
                $messageSuccess('导入成功')
                refreshData()
            }
        }

        const cardSearchConfig = ref<CSSearchConfig>({
            operation: {
                search: { text: '查询', handle: () => refreshData() },
                add: {
                    text: '添加管线',
                    perm: true,
                    handle: () => {
                        addOrUpdateConfig.value.title = '添加管线'
                        addOrUpdateConfig.value.defaultValue = {}
                        addOrUpdateConfig.value.visible = true
                        //do
                    }
                }
            },
            extraOperations: [
                {
                    text: '下载模板',
                    // perm: $btnPerms('user_manage_addUser'),
                    perm: true,
                    handle: () => downloadTemplate()
                },
                {
                    text: '导出',
                    // perm: $btnPerms('user_manage_addUser'),
                    perm: true,
                    handle: () => _exportPipeLine()
                },
                {
                    text: '导入',
                    // perm: $btnPerms('user_manage_addUser'),
                    perm: true,
                    handle: (formData: any) => _importPipeLine(formData),
                    component: ImportBtn
                }
            ],
            defaultParams: {},
            filters: [{ label: '搜索', key: 'keyword', type: 'input', width: '360px' }]
        })

        const cardTableConfig = ref<CTCardTable>({
            loading: false,
            dataList: [],
            columns: [
                { prop: 'name', label: '管道名称' },
                { prop: 'code', label: '管道编号' },
                { prop: 'type', label: '管道类型' },
                { prop: 'caliber', label: '管径' },
                {
                    prop: 'buildTime',
                    icon: 'el-icon-time',
                    label: '建设时间',
                    width: 218,
                    formatter: row => $format(row.createTime),
                    iconStyle: { color: '#69E850', display: 'inline-block', 'font-size': '16px' }
                }
            ],
            operations: [
                {
                    label: '编辑',
                    perm: true,
                    icon: 'iconfont icon-baogao',
                    handle: row => editPipe(row)
                },
                {
                    label: '删除',
                    perm: true,
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

        const addOrUpdateConfig = ref<AOUConfig>({
            visible: false,
            title: '添加管线',
            close: () => (addOrUpdateConfig.value.visible = false),
            addUrl: 'api/shuiwu/pipe/save',
            editUrl: 'api/shuiwu/pipe/save',
            defaultValue: {},
            externalParams: {},
            columns: [
                {
                    type: 'input',
                    label: '管线名称',
                    key: 'name'
                    // rules: [{ required: true, message: '请填写管线名称' }]
                },
                {
                    type: 'input',
                    label: '管线编号',
                    key: 'code'
                    // rules: [{ required: true, message: '请填写管线编号' }]
                },
                {
                    type: 'input',
                    label: '管线类型',
                    key: 'type',
                    options: [{ label: '普通管线', value: 'PT' }]
                    // rules: [{ required: true, message: '请填写管线类型' }]
                },
                {
                    type: 'select',
                    label: '管道起点',
                    key: 'startPointId',
                    options: [{ label: '普通管线', value: 'PT' }]
                    // rules: [{ required: true, message: '请选择' }]
                },
                {
                    type: 'select',
                    label: '管道终点',
                    key: 'endPointId',
                    options: [{ label: '普通管线', value: 'PT' }]
                    // rules: [{ required: true, message: '请选择' }]
                },
                {
                    type: 'input',
                    label: '管道材料',
                    key: 'material'
                    // rules: [{ required: true, message: '请填写管道材料' }]
                },
                {
                    type: 'input-number',
                    label: '管径',
                    key: 'caliber'
                    // rules: [{ required: true, message: '请填写管径' }]
                },
                {
                    type: 'date',
                    label: '建设时间',
                    key: 'buildTime'
                    // rules: [{ required: true, message: '请选择' }]
                },
                {
                    type: 'date',
                    label: '投入使用时间',
                    key: 'startUseTime'
                    // rules: [{ required: true, message: '请选择' }]
                },
                {
                    type: 'date',
                    label: '废弃时间',
                    key: 'discardTime'
                    // rules: [{ required: true, message: '请选择' }]
                },
                {
                    type: 'input',
                    label: '埋设方式',
                    key: 'buriedMethod'
                    // rules: [{ required: true, message: '请填写埋设方式' }]
                },
                {
                    type: 'input',
                    label: '管道位置',
                    key: 'address'
                    // rules: [{ required: true, message: '请填写管道位置' }]
                },
                {
                    type: 'textarea',
                    rows: 3,
                    label: '备注',
                    key: 'remark'
                }
            ]
        })

        const refreshData = async (isFirst?: boolean) => {
            cardTableConfig.value.loading = true
            const paramsObj: any = {
                page: cardTableConfig.value.pagination.page,
                size: cardTableConfig.value.pagination.limit
            }
            if (!isFirst && cardSearch.value) Object.assign(paramsObj, cardSearch.value.queryParams)
            try {
                const res = await getPipeList(paramsObj)
                console.log(res, 'getPipeList')
                cardTableConfig.value.loading = false
                if (res.status === 200) {
                    cardTableConfig.value.dataList = res.data.data
                    cardTableConfig.value.pagination.total = res.data.total
                } else {
                    $messageError('获取失败')
                }
            } catch (error) {
                cardTableConfig.value.loading = false
            }
        }

        onBeforeMount(async () => {
            refreshData(true)
            const res = await getPipeNodeList({ page: 1, size: 999999 })
            const options = res.data.data.map(item => ({ label: item.name, value: item.id }))
            addOrUpdateConfig.value.columns[3].options = options
            addOrUpdateConfig.value.columns[4].options = options
        })

        const handleDelete = (row?: any) => {
            $confirm('确定删除指定管道?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPipe([row.id]).then(() => {
                    $messageSuccess('操作成功')
                    refreshData()
                })
            })
        }

        const editPipe = async (row: any) => {
            const res = await getPipeDetail(row.id)
            if (res.status !== 200) return $messageError('获取管线详情失败！')
            addOrUpdateConfig.value.title = '编辑管线'
            addOrUpdateConfig.value.defaultValue = res.data
            addOrUpdateConfig.value.visible = true
        }

        return {
            cardSearchConfig,
            cardTableConfig,
            refreshData,
            cardSearch,
            addOrUpdateConfig,
            editPipe,
            totalLoading
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
