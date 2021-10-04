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
import { loadModules } from 'esri-loader'
import { ref } from 'vue'
import { options } from '@/utils/constans'
import { useStore } from '@/store'
const store = useStore()
const data = ref<{
    label:string
    children:{
        label:string
        layerid:string
        layerurl:string
    }[],

}[]>([{
  label: '底图数据',
  children: [
    {
      label: '暖色系图层',
      layerid: 'layerid',
      layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'
    },
    {
      label: '灰色系图层',
      layerid: 'layerid',
      layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer'
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
}])
const defaultProps = ref<{
        children: string,
        label: string
      }>({
        children: 'children',
        label: 'label'
      })

const handleNodeClick = async (data:any) => {
  if (data.layerurl) {
    // 删除已添加的图层
    const view = store.getters._getDefaultMapView
    const resultLayer = view.map.findLayerById('layerid')
    if (resultLayer) view.map.remove(resultLayer)

    // 处理不同服务类型
    const [TileLayer, FeatureLayer] = await loadModules(
      ['esri/layers/TileLayer', 'esri/layers/FeatureLayer'],
      options
    )
    const c = data.layerurl.split('/')
    const serverType = c[c.length - 1]
    let layer = ''
    switch (serverType) {
      case 'MapServer':
        layer = new TileLayer({ url: data.layerurl, id: data.layerid })
        break
      case 'FeatureServer':
        layer = new FeatureLayer({ url: data.layerurl, id: data.layerid })
        break
      default:
        break
    }
    view.map.add(layer)
  }
}
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
