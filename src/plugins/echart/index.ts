import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  ToolboxComponent,
  DataZoomComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components'
import { App } from 'vue'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LineChart,
  ToolboxComponent,
  DataZoomComponent,
  TitleComponent,
  LegendComponent
])

// register globally (or you can do it locally)
export default (app:App) => {
  app.component('VChart', ECharts)
}
