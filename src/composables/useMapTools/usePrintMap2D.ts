import { PrintingServer } from '@/utils/constans'
import useGlobal from '../useGlobal'
import PrintTask from '@arcgis/core/tasks/PrintTask'
import PrintTemplate from '@arcgis/core/rest/support/PrintTemplate'
import PrintParameters from '@arcgis/core/rest/support/PrintParameters'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ComponentInternalInstance } from 'vue'
const usePrintMap2D = (ins: ComponentInternalInstance|null) => {
  // 地图打印
  const handlePrintMap2D = async () => {
    const { $view } = useGlobal(ins)
    const printTask = new PrintTask({
      url: PrintingServer
    })

    const template = new PrintTemplate({
      format: 'pdf',
      exportOptions: {
        dpi: 100
      },
      layout: 'a4-portrait',
      layoutOptions: {
        titleText: '地图出图demo',
        authorText: 'lgs',
        customTextElements: [
          { location: '四川省 成都市' },
          { date: '08/11/2021, 08:20:20 AM' }
        ]
      }
    })

    const params = new PrintParameters({
      view: $view,
      template: template
    })
    ElMessageBox.alert('若长时间未响应，请稍候再试', '地图打印窗口正在打开', {
      confirmButtonText: 'OK'
    })
    printTask.execute(params).then((printResult:any) => {
      if (printResult.url) {
        ElMessage.info('地图打印已在新的窗口打开')
        window.open(printResult.url)
      }
    })
      .catch((printError) => {
        if (printError) ElMessage.error('地图打印失败')
      })
  }
  return {
    handlePrintMap2D
  }
}

export default usePrintMap2D
