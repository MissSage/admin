<template>
  <!-- 设备管理 -->
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <div v-loading="detailContainer" class="detailContainer">
          
          <el-scrollbar>
            <h1 class="title">组态列表</h1>
            <div class="scadaContainer">
              <ScadaItem
                v-for="item in scadaList"
                :key="item.id"
                :scada="item"
                @set="setScada"
                @copy="copyScada"
                @del="delScada"
              />
            </div>
          </el-scrollbar>
        </div>
        <AddOrUpdateDialog
          v-if="addOrUpdateConfig.visible"
          ref="addOrUpdate"
          :config="addOrUpdateConfig"
          @refreshData="refreshData"
        />
        <!-- <el-dialog v-if='previewDialog.visible' width='1540px' title="预览视频" :visible.sync="previewDialog.visible">
          <iframe style="height:560px;width:100%" ref="iframe" frameborder="0" scrolling="auto" :src="previewDialog.url"></iframe>
          <span slot="footer" class="dialog-footer">
            <el-button @click="previewDialog.visible = false">关 闭</el-button>
          </span>
        </el-dialog> -->
      </div>
    </template>
  </treeBox>
</template>

<script>
import CardSearch from '@/components/cardSearch/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import ScadaItem from './components/scadaItem.vue'
import { getFindScadaList, deleteScada } from '@/api/scada'
import { getProjectRoot } from '@/api/project'
import { removeSlash } from '@/utils/removeIdSlash'
import TreeList from '@/components/treeList/index.vue'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()

export default {
  name: 'Scada',
  components: { CardSearch, AddOrUpdateDialog, TreeList, ScadaItem },
  mixins: [tBaseMixin],
  data() {
    return {
      totalLoading: false,
      scadaList: [],
      detailContainer: false,
      tenantId: '',
      // previewDialog: {
      //   visible: false,
      //   url: ''
      // },
      cardSearchConfig: {
        operation: {
          search: { text: '查询', handle: () => this.refreshData() },
          add: {
            text: '添加组态',
            perm: true,
            handle: () => {
              this.addOrUpdateConfig.defaultValue = {
                originatorId: this.treeData.currentProject.id,
                protect: 0,
                width: 800,
                height: 600,
                protectPwd: '',
                tenantId: this.tenantId,
                chartType: 'cloud'
              }
              this.addOrUpdateConfig.title = '添加组态'
              this.addOrUpdateConfig.visible = true
            }
          }
        },
        filters: [{ label: '搜索', key: 'name', type: 'input', width: '360px' }]
      },
      addOrUpdateConfig: {
        visible: false,
        title: '添加设备',
        close: () => {
          this.addOrUpdateConfig.visible = false
        },
        addUrl: 'api/zutai/dashboard-list',
        editUrl: 'api/zutai/dashboard-list',
        defaultValue: {},
        externalParams: {},
        setSubmitParams: params => {
          // dashChart: params,
          // token: this.$store.state.user.scadaToken
          console.log(params)
          if (params.dashboardId) {
            params.dashboardId = params.dashboardId
          } else {
            params.dashboardId = uuidv4()
          }
          if (!params.dashboardId) params.dashboardId = uuidv4()
          params.dashboardId = params.dashboardId.replace(/-/g, '')
          const data =
            '{"pageConfig":{"width":' +
            params.width +
            ',"height":' +
            params.height +
            ',"backgroundColor":"#ffffff"},"assets":[],"panels":[]}'
          if (params._id) {
            return {
              ...params,
              data,
              _id: params.id
            }
          } else {
            return {
              ...params,
              protect: false,
              protectPwd: '',
              checked: false,
              data,
              //data: '{"pageConfig":{"width":800,"height":600,"backgroundColor":"#ffffff"},"assets":[],"panels":[]}',
              projectId: this.treeData.currentProject.id
            }
          }
        },
        height: '300px',
        columns: [
          {
            type: 'input',
            label: '组态名称',
            key: 'name',
            rules: [{ required: true, message: '请填写组态名称' }]
          },
          // {
          //   type: 'input',
          //   label: '组态宽度',
          //   key: 'width'
          // },
          // {
          //   type: 'input',
          //   label: '组态高度',
          //   key: 'height'
          // },
          {
            type: 'textarea',
            label: '备注',
            key: 'detail'
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
        treeNodeHandleClick: data => {
          // 设置当前选中项目信息
          this.treeData.currentProject = data
          this.refreshData()
        }
      }
    }
  },
  created() {
    this.tenantId = removeSlash(this.$store.state.user.tenantId)
    this.refreshTree(true)
  },

  methods: {
    async refreshData(isFirst) {
      this.detailContainer = true
      const paramsObj = {
        // page: 1,
        // size: 99,
        projectId: this.treeData.currentProject.id
      }
      if (!isFirst) Object.assign(paramsObj, this.$refs.cardSearch.queryParams)
      try {
        const res = await getFindScadaList(paramsObj)
        this.detailContainer = false
        if (res.status === 200) {
          this.scadaList = []
          // for (const val of res.data) {
          //   val.keyId = val.id
          //   val.time = moment(val.createTime).format('YYYY/MM/DD HH:mm:ss')
          //   if (val.chartType !== 'local') {
          //     this.scadaList.push(val)
          //   }
          // }
          this.scadaList = res.data.data.map(item => {
            item.keyId = item.id
            item.time = moment(item.createTime).format('YYYY/MM/DD HH:mm:ss')
            return item
          })
        } else {
          $message.error('获取失败')
        }
      } catch (error) {
        console.log(error)
        this.detailContainer = false
      }
    },
    refreshTree(isFirst) {
      getProjectRoot()
        .then(res => {
          if (res.data) {
            this.treeData.data = res.data
            const fTData = this.treeData.data.filter(v => !v.disabled)
            this.treeData.currentProject = fTData[0]
            this.totalLoading = false
            this.refreshData(isFirst)
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

    setScada(scada) {
      let data = {}
      if (scada.data) {
        try {
          data = JSON.parse(scada.data)
        } catch (error) {
          console.log(error)
        }
      }

      const defaultValue = {
        ...scada,
        width: data.pageConfig ? data.pageConfig.width : 800,
        height: data.pageConfig ? data.pageConfig.height : 600
      }
      this.addOrUpdateConfig.defaultValue = defaultValue
      this.addOrUpdateConfig.visible = true
    },

    copyScada(scadaId) {
      console.log(scadaId)
    },
    delScada(id) {
      // const params = {
      //   id
      //   // token: this.$store.state.user.scadaToken
      // }
      deleteScada(id).then(() => {
        $message({
          type: 'success',
          message: '删除成功'
        })
        this.refreshData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detailContainer {
  width: 100%;
  flex: 1;
  background-color: #222536;
  overflow-y: auto;
  margin-bottom: 12px;
  padding: 16px;
  .title {
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $text-color-light;
    line-height: 25px;
    margin: 0 0 24px 0;
  }
  .scadaContainer {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
