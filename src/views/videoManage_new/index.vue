<template>
  <!-- 视频 -->
  <treeBox>
    <template #tree>
      <TreeList ref="refTreeList" :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <CardTable :config="cardTableConfig" />
        <AddOrUpdateDialog
          v-if="addOrUpdateConfig.visible"
          ref="addOrUpdate"
          :config="addOrUpdateConfig"
          :dialog-width="'50%'"
          @refreshData="refreshData"
        />
      </div>
      <el-dialog
        v-if="previewDialog.visible"
        v-model="previewDialog.visible"
        width="1540px"
        title="预览"
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

<script lang="ts">
import CardSearch from '@/components/cardSearch/index.vue'
import AddOrUpdateDialog from '@/components/addOrUpdateDialog/index.vue'
import CardTable from '@/components/cardTable/index.vue'
import TreeList from '@/components/SLTree/index.vue'
import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'
import { getProjectRoot } from '@/api/project'
// import { delRealDevice } from '@/api/device'
import useGlobal from '@/hooks/global/useGlobal'
import {
  SuYuan_GetVideos,
  SuYuan_SaveVideo,
  getVideosName,
  SuYuan_SignVideo,
  SuYuan_DeleteVideo,
  SuYuan_VideoRecords
} from '@/api/video'
import { MENBERKEY } from '@/common/constants/videos'
import { defineComponent, reactive } from 'vue-demi'
import { computed, onMounted, ref } from 'vue'
import { IListVideoItem, INyVideo, ISaveVideo } from '@/common/types/video'
import { getInnerFirstChild, initAddDialogColums } from './index'
const { $message, $confirm } = useGlobal()
// import axios from 'axios'
export default defineComponent({
  name: 'VideoManage',
  components: {
    TreeList,
    CardSearch,
    AddOrUpdateDialog,
    CardTable
  },
  mixins: [tBaseMixin],
  setup() {
    const previewDialog = reactive<{
      visible: boolean
      url: string
    }>({
      visible: false,
      url: ''
    })
    const refTreeList = ref<InstanceType<typeof TreeList>>()
    const videoSources = ref<INyVideo[]>([])
    const cardSearchConfig = ref<CSSearchConfig>({
      operation: {
        search: { text: '查询', handle: () => refreshData() },
        add: {
          text: '添加摄像头',
          perm: true,
          handle: () => {
            addOrUpdateConfig.value.externalParams = {
              projectId: treeData.value.currentProject.id
            }
            addOrUpdateConfig.value.defaultValue = { location: ['116.4', '39.91'] }
            addOrUpdateConfig.value.title = '添加摄像头'
            addOrUpdateConfig.value.visible = true
          }
        },
        del: {
          text: '批量删除',
          disableHandle: () => {
            return !cardTableConfig.value.selectList.length
          },
          perm: true,
          handle: () => handleDelete()
        }
      },
      filters: [{ label: '搜索', key: 'videoName', type: 'input', width: '360px' }]
    })

    const formateonline = row => {
      return row.online == '1' ? '在线' : '离线'
    }
    const cardTableConfig = ref<CTCardTable>({
      loading: false,
      dataList: [],
      selectList: [],
      tableSelectChangeHandle: val => (cardTableConfig.value.selectList = val),
      columns: [
        { prop: 'videoName', label: '摄像头名称' },
        {
          prop: 'online',
          label: '在线状态',
          formatter: formateonline
        }
        // { prop: 'id', label: '序列号' }
      ],
      operations: [
        // {
        //   label: '预览',
        //   perm: true,
        //   icon: 'iconfont icon-copy',
        //   handle: row => this.previewVideo(row)
        // },
        // {
        //   label: '录像',
        //   perm: true,
        //   icon: 'iconfont icon-copy',
        //   handle: row => this.handleVideoRecord(row)
        // },
        {
          label: '编辑',
          perm: true,
          icon: 'iconfont icon-bianji',
          handle: row => {
            console.log(row)
            addOrUpdateConfig.value.title = '编辑摄像头'
            addOrUpdateConfig.value.defaultValue = { ...row, ...JSON.parse(row.additionalInfo) }
            console.log(addOrUpdateConfig.value.defaultValue)
            addOrUpdateConfig.value.visible = true
          }
        },
        {
          perm: true,
          label: '删除',
          icon: 'iconfont icon-bianji',
          handle: row => handleDelete(row)
        }
      ],
      operationWidth: '200px',
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
    const addOrUpdateConfig = ref({
      visible: false,
      title: '添加摄像头',
      close: () => {
        addOrUpdateConfig.value.visible = false
      },
      // addUrl: 'api/xjRealDevice/save',
      // editUrl: 'api/xjRealDevice/save',
      submit: SuYuan_SaveVideo,
      defaultValue: { location: ['116.4', '39.91'] },
      externalParams: {},
      setSubmitParams: (params: IListVideoItem) => {
        const nyVideo: INyVideo =
          videoSources.value.find(item => item.deviceid == params.serialNumber) || ({} as INyVideo)

        const newparam: ISaveVideo = {
          id: params.id,
          nyVideo,
          additionalInfo: params.additionalInfo,
          videoName: params.videoName,
          serialNumber: params.serialNumber,
          projectId: params.projectId
        }
        return newparam
      },
      columns: initAddDialogColums()
    })
    const treeData = ref<SLTreeConfig>({
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
      treeNodeHandleClick: data => {
        // 设置当前选中项目信息
        treeData.value.currentProject = data
        refreshData()
      }
    })
    const handleVideoRecord = async (row: IListVideoItem) => {
      const params = {
        param:
          '{"deviceid":"' +
          row.serialNumber +
          '","memberkey":"4jqDiL2nzeFRfObhDdY7","starttime":"2021-09-0918:52:28","endtime":"2021-10-0918:52:28","sort":0,"pagenum":1,"pageSize":20}'
      }
      const res1 = await SuYuan_SignVideo(params).catch(error => console.log(error))
      const params1 = {
        parmdata: {
          deviceid: row.serialNumber,
          memberkey: MENBERKEY,
          starttime: '2021-09-09 18:52:28',
          endtime: '2021-10-09 18:52:28',
          sort: 0,
          pagenum: 1,
          pageSize: 20
        },
        sign: res1 ? res1.data.sign : ''
      }
      const res = await SuYuan_VideoRecords(params1)
      console.log(res)
    }
    const refreshData = async () => {
      cardTableConfig.value.loading = true
      try {
        const res = await SuYuan_GetVideos(treeData.value.currentProject.id)
        console.log(res.data)
        const videos = res.data.map(item => {
          const videoSource = videoSources.value.find(a => a.deviceid == item.serialNumber)
          item.online = videoSource && videoSource.online
          item.status = videoSource && videoSource.status
          return item
        })
        cardTableConfig.value.loading = false
        if (res) {
          cardTableConfig.value.dataList = videos
          cardTableConfig.value.pagination.page = 1
          cardTableConfig.value.pagination.limit = res.data.length
          cardTableConfig.value.pagination.total = res.data.length
        } else {
          $message.error('获取失败')
        }
      } catch (error) {
        cardTableConfig.value.loading = false
      }
    }
    const refreshTree = () => {
      getProjectRoot()
        .then(res => {
          if (res.data) {
            treeData.value.data = res.data
            const fTData = treeData.value.data.filter(v => !v.disabled)
            const deeppro = getInnerFirstChild(fTData[0])
            treeData.value.currentProject = deeppro
            refreshData()
          } else {
            $message('暂无项目 不可操作，请创建项目')
          }
        })
        .catch(err => {
          console.log(err)
          $message('暂无项目 不可操作，请创建项目')
        })
    }
    const getVideoSources = async () => {
      // const params = {
      //   param: '{"accesstype":1,"memberkey":"' + MENBERKEY + '","networktype":1,"m3u8Type":1}'
      // }
      // const res = await SuYuan_SignVideo(params).catch(error => console.log(error))
      // const sourceParam = {
      //   sign: res ? res.data.sign : '',
      //   parmdata: {
      //     accesstype: 1,
      //     memberkey: MENBERKEY,
      //     networktype: 1,
      //     m3u8Type: 1
      //   }
      // }
      getVideosName().then(res => {
        videoSources.value = res ? res.data : ''
        const formattedVideoSource = videoSources.value.map((item: any) => {
          return {
            label: item.name,
            value: item.indexCode
          }
        })
        addOrUpdateConfig.value.columns = initAddDialogColums(formattedVideoSource)
      })
    }
    const handleDelete = (row?: IListVideoItem) => {
      $confirm('确定删除指定摄像头?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除角色方法
        let ids: string[] = []
        if (row) {
          ids = [row.id]
        } else {
          ids = cardTableConfig.value.selectList.map(item => item.id)
        }
        SuYuan_DeleteVideo(ids).then(res => {
          if (res.data == true) {
            $message({
              type: 'success',
              message: '操作成功'
            })
            refreshData()
          } else {
            $message({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      })
    }
    const previewVideo = (row: IListVideoItem) => {
      console.log('previewVideo')
      previewDialog.url = row.url
      previewDialog.visible = true
    }
    const currentProject = computed(() => {
      return treeData.value.currentProject
    })
    onMounted(() => {
      getVideoSources().finally(() => {
        refreshTree()
      })
    })
    return {
      previewDialog,
      videoSources,
      cardSearchConfig,
      cardTableConfig,
      addOrUpdateConfig,
      treeData,
      currentProject,
      refTreeList,
      initAddDialogColums,
      handleVideoRecord,
      refreshData,
      refreshTree,
      getVideoSources,
      handleDelete,
      previewVideo
    }
  }
})
</script>
