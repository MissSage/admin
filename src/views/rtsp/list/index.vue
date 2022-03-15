<template>
  <treeBox v-loading="totalLoading">
    <template #tree>
      <TreeList :tree-data="treeData" />
    </template>
    <template #detailBody>
      <div class="tree-right-detail-box">
        <CardSearch ref="cardSearch" :config="cardSearchConfig" />
        <div v-loading="detailContainer" class="detailContainer">
          <el-space
            :size="30"
            fill
            wrap
            :fill-ratio="25"
            :direction="horizontal"
            style="width: 100%"
          >
            <VideoItem
              v-for="item in videoConfigs"
              :key="item.uuid"
              :uuid="item.uuid"
              :name="item.name"
              :channels="item.channels"
              @Edit="handleEdit"
              @Delete="handleDelete"
            />
          </el-space>
        </div>
        <AddOrUpdateDialog
          v-if="addOrUpdateConfig.visible"
          ref="addOrUpdate"
          :config="addOrUpdateConfig"
          @refreshData="refreshData"
        />
      </div>
    </template>
  </treeBox>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'

import CardSearch from '@/components/cardSearch/index.vue'
import VideoItem from './components/videoItem.vue'
import AddOrUpdateDialog from './components/addOrUpdateDialog.vue'
import TreeList from '@/components/treeList/index.vue'

import { tBaseMixin } from '@/views/layout/treeOrDetailFrame/components/tBaseMixIn'

import type { IVideoModel, IChannelModel } from '@/common/types/rtsp'
import { IProject } from '@/common/types/common'
import { getMonitors, deleteMonitors } from '@/api/rtsp/index'
import { getProjectRoot } from '@/api/project'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
export default defineComponent({
  components: { VideoItem, CardSearch, AddOrUpdateDialog, TreeList },
  mixins: [tBaseMixin],
  setup() {
    const detailContainer = ref<boolean>(false)
    // 查询组件的实例
    const cardSearch = ref<InstanceType<typeof CardSearch> | null>(null)
    // 摄像头配置数据
    const videoConfigs = ref<IVideoModel[]>([])
    // 保存全部配置数据
    let configOrigin = [] as IVideoModel[]
    // 树配置
    const treeData = reactive({
      title: '项目列表',
      data: [] as IProject[],
      loading: false,
      isFilterTree: true,
      currentId: '',
      currentProject: {} as IProject,
      expandNodeId: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeNodeHandleClick: data => {
        // 设置当前选中项目信息
        treeData.currentProject = data
        treeData.currentId = data.id
        refreshData()
      }
    })
    // 查询配置
    const cardSearchConfig = reactive({
      operation: {
        search: { text: '查询', handle: () => filterData() },
        add: {
          text: '添加摄像头',
          perm: true,
          handle: () => {
            addOrUpdateConfig.externalParams = {
              projectId: treeData.currentProject.id
            }
            addOrUpdateConfig.title = '添加摄像头'
            addOrUpdateConfig.visible = true
            addOrUpdateConfig.addUrl = `/stream/${uuidv4()}/add`
          }
        }
      },
      filters: [{ label: '搜索', key: 'streamName', type: 'input', width: '360px' }]
    })
    const handleEdit = params => {
      console.log(params)
      addOrUpdateConfig.externalParams = {
        id: params.uuid,
        projectId: treeData.currentProject.id
      }
      const ondemand = params['stream-ondemand'] == true ? '0' : '1'
      const debug = params.debug == true ? '1' : '0'
      addOrUpdateConfig.defaultValue = {
        ...params,
        id: params.uuid,
        'stream-ondemand': ondemand,
        debug
      }
      addOrUpdateConfig.title = '编辑摄像头'
      addOrUpdateConfig.visible = true
      addOrUpdateConfig.editUrl = `/stream/${params.uuid}/edit`
    }
    const handleDelete = async uuid => {
      const data = await deleteMonitors(uuid)
      if (data.data.status == 1) {
        refreshData()
        ElMessage.success('删除成功')
      }
    }
    const addOrUpdateConfig = reactive({
      visible: false,
      title: '添加摄像头',
      close: () => {
        addOrUpdateConfig.visible = false
      },
      // baseUrl: 'http://localhost:8888',
      // requestHeaders: {
      //   Authorization: 'Basic ' + btoa('root:root')
      // },
      addUrl: 'api/xjRealDevice/save',
      editUrl: 'api/xjRealDevice/save',
      defaultValue: {},
      externalParams: {},
      // 对提交的表单数据进行额外的整理
      setSubmitParams: queryParams => {
        let on_demand = queryParams['stream-ondemand'] == '0'
        let debug = queryParams.debug == '1'
        let params = {
          name: queryParams.streamName,
          channels: {
            '0': {
              name: '点对点',
              url: queryParams['stream-url'],
              status: 0,
              on_demand,
              debug
            },
            // 第二个channel用来保存项目编号，因为参数格式是固定的，不能更改，所以采用这种无奈之举
            '1': {
              name: '项目信息',
              url: treeData.currentId,
              on_demand: true,
              debug: true,
              status: 0
            }
          }
        }
        return params
      },
      columns: [
        {
          type: 'input',
          label: '摄像头名称',
          key: 'streamName',
          rules: [{ required: true, message: '请填写摄像头名称' }]
        },
        {
          type: 'input',
          label: 'RTSP地址',
          key: 'stream-url',
          rules: [{ required: true, message: '请填写RTSP地址' }]
        },
        {
          type: 'select',
          label: '模式设置',
          key: 'stream-ondemand',
          options: [
            { label: '点播', value: '1' },
            { label: '长连接', value: '0' }
          ],
          rules: [{ required: true, message: '请选择' }]
        },
        {
          type: 'radio',
          label: '调试模式',
          key: 'debug',
          options: [
            { label: '开启', value: '1' },
            { label: '关闭', value: '0' }
          ]
        }
      ]
    }) as AOUConfig
    // 过滤数据列表
    const filterData = async () => {
      let videoname = cardSearch.value?.queryParams.streamName
      if (!!videoname) {
        videoConfigs.value = configOrigin.filter(item => {
          let flag = item.name.indexOf(videoname) !== -1
          return flag
        })
      } else {
        videoConfigs.value = configOrigin
      }
    }
    // 获取当前项目的视频配置
    const refreshData = async () => {
      detailContainer.value = true
      getMonitors()
        .then(res => {
          let data = res.data
          if (data.status == 1) {
            configOrigin = videoConfigFilter(data.payload).filter(item => {
              return item.projectId == treeData.currentId
            })
          } else {
            configOrigin = []
          }
          videoConfigs.value = configOrigin
        })
        .finally(() => {
          detailContainer.value = false
        })
    }
    const refreshTree = () => {
      getProjectRoot(null)
        .then(res => {
          if (res.data) {
            treeData.data = res.data
            const fTData = treeData.data.filter(v => !v.disabled)
            treeData.currentProject = fTData[0]
            treeData.currentId = fTData[0].id
            refreshData()
            // totalLoading = false
          } else {
            ElMessage.warning('暂无项目 不可操作，请创建项目')
            // this.totalLoading = false
          }
        })
        .catch(err => {
          console.log(err)
          ElMessage.warning('暂无项目 不可操作，请创建项目')
          // this.totalLoading = false
        })
    }

    // 把视频配置数据对象过滤成数组
    const videoConfigFilter = payload => {
      const Configs = [] as IVideoModel[]
      for (let key in payload) {
        let channels = payload[key].channels
        let filteredChans = [] as IChannelModel[]
        for (let keyc in channels) {
          let channel = {
            chanId: keyc,
            on_demand: channels[keyc].on_demand,
            url: channels[keyc].url,
            debug: channels[keyc].debug,
            status: channels[keyc].staus
          } as IChannelModel
          filteredChans.push(channel)
        }
        let obj = {
          uuid: key,
          projectId: filteredChans.length > 1 ? filteredChans[1].url : null,
          name: payload[key].name,
          channels: filteredChans
        } as IVideoModel
        Configs.push(obj)
      }
      return Configs
    }
    onMounted(() => {
      refreshTree()
    })
    return {
      detailContainer,
      treeData,
      cardSearch,
      cardSearchConfig,
      videoConfigs,
      addOrUpdateConfig,
      refreshData,
      refreshTree,
      handleEdit,
      handleDelete
    }
  }
})
</script>
<style lang="scss" scoped>
.videoContainer {
  margin: 15px;
}
</style>
