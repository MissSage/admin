<template>
  <div
    class="maptree-pannel"
    v-show="$store.getters._getDefaultMapTreeVisible"
  >
    <div class="maptree-header">
      <span>图层管理</span>
      <i
        class="el-icon-close"
        @click="closeMapTreePannel"
      />
    </div>
    <el-tree
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import useLayerControl from '@/composables/useLayers/useLayerControl'
import { StreetGrayServices, StreetPurplishBlueServices, StreetWarmServices } from '@/utils/constans'
import { getCurrentInstance, ref } from 'vue'
const store = useStore()
const defaultProps = ref<{
  children: string;
  label: string;
}>({
  children: 'children',
  label: 'label'
})
const data = ref<
  {
    label: string;
    children: {
      label: string;
      layerid: string;
      layerurl: string;
    }[];
  }[]
>([
  {
    label: '底图数据',
    children: [
      {
        label: '暖色系图层',
        layerid: 'layerid',
        layerurl: StreetWarmServices
      },
      {
        label: '灰色系图层',
        layerid: 'layerid',
        layerurl: StreetGrayServices

      }, {
        label: '深色第图层',
        layerid: 'layerid',
        layerurl: StreetPurplishBlueServices
      }
    ]
  },

  {
    label: '行政区划数据',
    children: [
      {
        label: '省数据',
        layerid: 'layerid',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHProvince_WebMokatuo/FeatureServer'
      },
      {
        label: '市数据',
        layerid: 'layerid',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer'
      },
      {
        label: '县数据',
        layerid: 'layerid',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty_WebMokatuo/FeatureServer'
      }
    ]
  },
  {
    label: '业务数据',
    children: [
      {
        label: '火车站数据 84',
        layerid: 'layerid',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainstationdata/FeatureServer'
      },
      {
        label: '火车站数据 Mekatuo',
        layerid: 'layerid',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainstation_WebMokatuo/FeatureServer'
      },
      {
        label: '卷帘分析 top',
        layerid: 'swipeLayerTop',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHProvince_WebMokatuo/FeatureServer'
      },
      {
        label: '卷帘分析 bottom',
        layerid: 'swipeLayerBottom',
        layerurl:
          'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer'
      }
    ]
  },
  {
    label: 'Pipe',
    children: [
      {
        label: '管线',
        layerid: 'pipeLayer',
        layerurl: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG/MapServer'
      }
    ]
  }
])
const { handleNodeClick } = useLayerControl(getCurrentInstance())
const closeMapTreePannel = () => {
  const currentVisible = store.getters._getDefaultMapTreeVisible
  store.commit('_setDefaultMapTreeVisible', !currentVisible)
}
</script>

<style>
.maptree-pannel {
  position: absolute;
  top: 20px;
  left: 15px;
  width: 200px;
  height: 300px;
  background-color: #fff;
}
.maptree-header {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 5px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.maptree-header > span {
  line-height: 35px;
  font-size: 16px;
  font-weight: 600;
}
.maptree-header > i {
  line-height: 35px;
  cursor: pointer;
}
</style>
