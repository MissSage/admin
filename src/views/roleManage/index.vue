<template>
    <!-- 角色管理 -->
    <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" class="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AddOrUpdateDialog
            v-if="addOrUpdateConfig.visible"
            :config="addOrUpdateConfig"
            @refreshData="refreshData"
        />
        <Cataloge v-if="cataloge.visible" :table-config="cataloge" />
    </div>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import Cataloge from './components/rolemenu.vue'
import { getRolesByPage, deleteRole } from '@/api/menu'
import useGlobal from '@/hooks/global/useGlobal'
const { $message, $confirm } = useGlobal()
// import { removeSlash } from '@/utils/removeIdSlash.js' // 处理id
export default {
    name: 'RoleManage',
    components: { CardSearch, CardTable, AddOrUpdateDialog, Cataloge },
    data() {
        return {
            cardSearchConfig: {
                operation: {
                    search: { text: '查询', handle: () => this.refreshData() },
                    add: {
                        text: '添加角色',
                        handle: () => this.clickCreatedRole(),
                        perm: true
                    }
                },
                filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
            },
            cardTableConfig: {
                loading: false,
                dataList: [],
                columns: [{ prop: 'name', label: '角色名称' }],
                indexVisible: {
                    label: '序号',
                    width: '50px',
                    align: 'center'
                },
                operations: [
                    // role_manage_setBtnPerms 按钮权限按钮
                    {
                        label: '菜单授权',
                        icon: 'iconfont icon-menu',
                        perm: true,
                        handle: row => this.menuAuthorization(row)
                    },
                    {
                        label: '编辑',
                        perm: true,
                        icon: 'iconfont icon-bianji',
                        handle: row => this.clickEdit(row)
                    },
                    {
                        label: '删除',
                        icon: 'iconfont icon-shanchu1',
                        perm: true,
                        handle: row => this.haneleDelete(row)
                    }
                ],
                operationWidth: '280px',
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
            addOrUpdateConfig: {
                visible: false,
                title: '添加角色',
                labelWidth: '130px',
                close: () => {
                    this.addOrUpdateConfig.visible = false
                },
                addUrl: 'api/role/saveRole',
                editUrl: 'api/role/saveRole',
                defaultValue: {},
                columns: [
                    {
                        type: 'input',
                        label: '角色名称',
                        key: 'name',
                        rules: [{ required: true, message: '请输入角色名称' }]
                    }
                ]
            },
            cataloge: {
                visible: false,
                roleId: '',
                close: () => (this.cataloge.visible = false)
            },
            isCUSTOMER_USER: false
        }
    },
    computed: {
        multipleRow() {
            return this.tableSelection.length > 0
        }
    },
    created() {
        this.isCUSTOMER_USER = this.$store.state.user.roles[0] === 'CUSTOMER_USER'
        // 获取当前租户角色列表
        this.refreshData()
    },
    methods: {
        refreshData() {
            const params = {
                size: this.cardTableConfig.pagination.limit,
                page: this.cardTableConfig.pagination.page
            }
            if (this.$refs && this.$refs.cardSearch)
                Object.assign(params, this.$refs.cardSearch.queryParams)
            getRolesByPage(params).then(res => {
                console.log(res.data)
                this.cardTableConfig.dataList = res.data.data
                this.cardTableConfig.pagination.total = res.data.total
                // this.clickReset()
            })
        },
        // 点击添加角色
        clickCreatedRole() {
            if (this.isCUSTOMER_USER) {
                $message('无权限')
                return
            }
            this.addOrUpdateConfig.title = '添加角色'
            this.addOrUpdateConfig.defaultValue = {}
            this.addOrUpdateConfig.visible = true
        },
        // 点击菜单授权
        menuAuthorization(row) {
            if (this.isCUSTOMER_USER) {
                $message('无权限')
                return
            }
            this.cataloge.roleId = row.id.id
            this.cataloge.visible = true
        },
        selectionChange(val) {
            this.tableSelection = val
            console.log(this.tableSelection, '-----tableSelection')
        },

        clickEdit(row) {
            if (this.isCUSTOMER_USER) {
                $message('无权限')
                return
            }
            this.addOrUpdateConfig.defaultValue = { ...row }
            this.addOrUpdateConfig.defaultValue.id = row.id.id
            this.addOrUpdateConfig.title = '编辑角色'
            this.addOrUpdateConfig.visible = true
            // this.ruleForm = scope.row
        },
        // 查询
        clickFilterData() {
            this.filterData = this.roleData.filter(item => {
                return item.name.toLowerCase().includes(this.filterText.toLowerCase())
            })
            this.showData = this.filterData.slice(0, [12])
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.showData = this.filterData.slice(val * 12 - 12, [val * 12])
        },
        haneleDelete(row) {
            if (this.isCUSTOMER_USER) {
                $message('无权限')
                return
            }
            $confirm('确定删除该角色, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除角色方法
                deleteRole(row.id.id)
                    .then(() => {
                        this.refreshData()
                        $message('删除成功')
                    })
                    .catch(err => {
                        console.log(err, 'err')
                        $message.error(err.data.message)
                    })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.role-manage-h-container {
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    overflow-y: auto;

    .content-box-container {
        padding: 10px;
        height: calc(100% - 60px);
        .operate-btn {
            button {
                border-radius: 20px;
            }
        }
    }
    .filter-box {
        display: flex;
        height: 48px;
        margin-bottom: 10px;
        justify-content: space-between;
        .box-btns {
            display: flex;
            align-items: center;
        }
        .filter-input {
            width: 200px;
            margin-right: 10px;
        }
    }
}
</style>

<style>
/* 弹出框颜色 */
.el-message-box {
    display: inline-block;
    width: var(--el-messagebox-width);
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #222536;
    border-radius: var(--el-messagebox-border-radius);
    border: 1px solid #000000;
    font-size: var(--el-messagebox-font-size);
    box-shadow: var(--el-box-shadow-light);
    text-align: left;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
</style>
