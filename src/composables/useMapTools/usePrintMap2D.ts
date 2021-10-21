import { PrintingServer } from '@/utils/constans'
import useGlobal from '../useGlobal'
import PrintTask from '@arcgis/core/tasks/PrintTask'
import PrintTemplate from '@arcgis/core/rest/support/PrintTemplate'
import PrintParameters from '@arcgis/core/rest/support/PrintParameters'
import { ElMessage } from 'element-plus'
const { Global } = useGlobal()
const usePrintMap2D = () => {
  // 地图打印
  const handlePrintMap2D = async () => {
    const view = Global.$view
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
        customTextElements: [{ location: '四川省 成都市' }, { date: '08/11/2021, 08:20:20 AM' }]
      }
    })

    const params = new PrintParameters({
      view: view,
      template: template
    })

    printTask.execute(params).then((printResult:any) => {
      if (printResult.url) window.open(printResult.url)
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
