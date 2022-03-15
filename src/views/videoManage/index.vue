<template>
  <!-- 视频 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" :current-project="currentProject" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AddOrUpdateDialog
          v-if="addOrUpdateConfig.visible"
          ref="addOrUpdate"
          :config="addOrUpdateConfig"
          @refreshData="refreshData"
        />
      </div>
      <el-dialog
        v-if="previewDialog.visible"
        width="1540px"
        title="预览"
        :visible.sync="previewDialog.visible"
      >
        <div style="height: 560px; width: 100%"></div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="previewDialog.visible = false">关 闭</el-button>
          </span>
        </template>
      </el-dialog>
    </template>
  </treeBox>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import TreeList from '@/components/treeList/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
import { delRealDevice, getRealDevice } from '@/api/device'
import useGlobal from '@/hooks/global/useGlobal'
const { $message, $confirm } = useGlobal()
// import axios from 'axios'
export default {
  name: 'VideoManage',
  components: {
    TreeList,
    CardSearch,
    AddOrUpdateDialog,
    CardTable
  },
  mixins: [tBaseMixin],
  data() {
    return {
      previewDialog: {
        visible: false,
        url: ''
      },
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加摄像头',
            perm: true,
            handle: () => {
              this.addOrUpdateConfig.externalParams = {
                projectId: this.treeData.currentProject.id
              }
              this.addOrUpdateConfig.title = '添加摄像头'
              this.addOrUpdateConfig.visible = true
            }
          },
          del: {
            text: '批量删除',
            disableHandle: () => !this.cardTableConfig.selectList.length,
            perm: true,
            handle: () => this.handleDelete()
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
      },
      cardTableConfig: {
        loading: false,
        dataList: [],
        selectList: [],
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'name', label: '摄像头名称' },
          { prop: 'remark', label: '备注' },
          { prop: 'id', label: '序列号' },
          { prop: 'yanzhengma', label: '验证码' }
        ],
        operations: [
          {
            label: '预览',
            perm: true,
            icon: 'iconfont icon-copy',
            handle: row => this.previewVideo(row)
          },
          {
            label: '编辑',
            perm: true,
            icon: 'iconfont icon-bianji',
            handle: row => {
              this.addOrUpdateConfig.title = '编辑摄像头'
              this.addOrUpdateConfig.defaultValue = { ...row }
              this.addOrUpdateConfig.visible = true
            }
          },
          {
            perm: true,
            label: '删除',
            icon: 'iconfont icon-bianji',
            handle: row => this.handleDelete(row)
          }
        ],
        operationWidth: '200px',
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
        title: '添加摄像头',
        close: () => {
          this.addOrUpdateConfig.visible = false
        },
        addUrl: 'api/xjRealDevice/save',
        editUrl: 'api/xjRealDevice/save',
        defaultValue: {},
        externalParams: {},
        columns: [
          {
            type: 'input',
            label: '摄像头名称',
            key: 'videoName',
            rules: [{ required: true, message: '请填写摄像头名称' }]
          },
          {
            type: 'input',
            label: 'appKey',
            key: 'appKey',
            rules: [{ required: true, message: '请填写appKey' }]
          },
          {
            type: 'select',
            label: '摄像头类型',
            key: 'videoType',
            options: [{ label: '萤石云', value: '萤石云' }],
            rules: [{ required: true, message: '请选择' }]
          },
          {
            type: 'input',
            label: 'appSecret',
            key: 'appSecret',
            rules: [{ required: true, message: '请填写appSecret' }]
          },
          {
            type: 'input',
            label: '通道号',
            key: 'channelId',
            rules: [{ required: true, message: '请填写通道号' }]
          },
          {
            type: 'input',
            label: '序列号',
            key: 'serialNumber',
            rules: [{ required: true, message: '请填写序列号' }]
          },
          {
            type: 'input',
            label: '验证码',
            key: 'captcha',
            rules: [{ required: true, message: '请填写验证码' }]
          },
          {
            type: 'input',
            label: '视频流地址',
            key: 'url',
            rules: [{ required: true, message: '请填写视频流地址' }]
          }
        ]
      },
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
        treeNodeHandleClick(data) {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.refreshTree()
        }
      }
    }
  },
  created() {
    this.refreshTree(true)
  },
  methods: {
    async refreshData(isFirst) {
      this.cardTableConfig.loading = true
      const paramsObj = {
        page: this.cardTableConfig.pagination.page,
        size: this.cardTableConfig.pagination.limit,
        projectId: this.treeData.currentProject.id
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      try {
        const res = await getRealDevice(paramsObj)
        this.cardTableConfig.loading = false
        if (res.status === 200) {
          this.cardTableConfig.dataList = res.data.data
          this.cardTableConfig.pagination.total = res.data.total
        } else {
          $message.error('获取失败')
        }
      } catch (error) {
        this.cardTableConfig.loading = false
      }
    },
    refreshTree(isFirst) {
      getProjectRoot()
        .then(res => {
          if (res.data) {
            this.treeData.data = res.data
            const fTData = this.treeData.data.filter(v => !v.disabled)
            this.treeData.currentProject = fTData[0]
            this.refreshData(isFirst)
            this.totalLoading = false
          } else {
            $message('暂无项目 不可操作，请创建项目')
            this.totalLoading = false
          }
        })
        .catch(err => {
          console.log(err)
          $message('暂无项目 不可操作，请创建项目')
          this.totalLoading = false
        })
    },
    handleDelete(row) {
      $confirm('确定删除指定摄像头?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids = []
        if (row) {
          ids = [row.id]
        } else {
          ids = this.cardTableConfig.selectList.map(item => item.id)
        }
        delRealDevice(ids).then(() => {
          $message({
            type: 'success',
            message: '操作成功'
          })
          this.refreshData()
        })
      })
    },
    previewVideo(row) {
      console.log('previewVideo')
      this.previewDialog.visible = row.url
      this.previewDialog.visible = true
    }
  }
}
</script>
