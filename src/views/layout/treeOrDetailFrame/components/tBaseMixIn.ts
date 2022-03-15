import treeBox from '@/views/layout/treeOrDetailFrame/index.vue'
import { removeSlash, idRemoveSlash } from '@/utils/removeIdSlash'
// import Treeselect from '@riophae/vue-treeselect'
import ECharts from 'vue-echarts'
// 预先 获取设备数据

export const tBaseMixin = {
  components: {
    treeBox,
    chart: ECharts
  },
  // props: [],
  data() {
    return {}
  },
  methods: {
    removeSlash,
    idRemoveSlash
  }
}
