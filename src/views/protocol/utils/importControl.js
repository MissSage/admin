import { saveTemplateProtocol } from '@/api/device'
import Excel from 'exceljs/dist/es5/exceljs.browser'

const template = {
  NBMQTT: [
    'name',
    'propertyCategory',
    'statType',
    'propertyType',
    'unit',
    'sampleDeviation',
    'dataOffset',
    'samplingMax',
    'samplingMin',
    'sampleCoef',
    'unitCoef',
    'range',
    'formulaProperty',
    'group'
  ],
  MQTT: [
    'name',
    'propertyCategory',
    'statType',
    'propertyType',
    'unit',
    'sampleDeviation',
    'dataOffset',
    'samplingMax',
    'samplingMin',
    'sampleCoef',
    'unitCoef',
    'range',
    'formulaProperty',
    'group'
  ],
  MODBUS: [
    'name',
    'propertyCategory',
    'statType',
    'dataType',
    'propertyType',
    'unit',
    'registerType',
    'functionCode',
    'registerAddress',
    'byteCount',
    'bitPosition',
    'registerSignFlag',
    'sampleDeviation',
    'order',
    'byteOrder',
    'dataOffset',
    'samplingMax',
    'samplingMin',
    'sampleCoef',
    'unitCoef',
    'range',
    'formulaProperty',
    'group'
  ],
  DTU: [
    'name',
    'propertyCategory',
    'statType',
    'dataType',
    'propertyType',
    'unit',
    'registerType',
    'functionCode',
    'registerAddress',
    'byteCount',
    'bitPosition',
    'registerSignFlag',
    'sampleDeviation',
    'order',
    'byteOrder',
    'dataOffset',
    'samplingMax',
    'samplingMin',
    'sampleCoef',
    'unitCoef',
    'range',
    'formulaProperty',
    'group'
  ],
  NBDTU: [
    'name',
    'propertyCategory',
    'statType',
    'dataType',
    'propertyType',
    'unit',
    'registerType',
    'functionCode',
    'registerAddress',
    'byteCount',
    'bitPosition',
    'registerSignFlag',
    'sampleDeviation',
    'order',
    'byteOrder',
    'dataOffset',
    'samplingMax',
    'samplingMin',
    'sampleCoef',
    'unitCoef',
    'range',
    'formulaProperty',
    'group'
  ]
}
// const temNameMAp = {
//   '变量名称': 'name',
//   '实际变量名称(非中文)': 'propertyCategory',
//   '统计类型': 'statType',
//   '数据类型': 'dataType',
//   '变量类型': 'propertyType',
//   '单位': 'unit',
//   '寄存器类型': 'registerType',
//   '功能码': 'functionCode',
//   '寄存器地址': 'registerAddress',
//   '读取寄存器个数': 'byteCount',
//   '位寄存器读取地址': 'bitPosition',
//   '数据有无符号': 'registerSignFlag',
//   '每小时数据偏差值': 'sampleDeviation',
//   '大小端': 'order',
//   '解析顺序': 'byteOrder',
//   '数据偏移量': 'dataOffset',
//   '采样最大值': 'samplingMax',
//   '采样最小值': 'samplingMin',
//   '采样系数': 'sampleCoef',
//   '数据小数位': 'unitCoef',
//   '量程': 'range',
//   '公式': 'formulaProperty'
// }

export async function importFileHandle(that, file, protocol, cTemplate) {
  const dataList = []
  const fileName = file.name.split('.')
  // if (fileName[fileName.length -1]=== "xlsx" ||
  //   fileName[fileName.length -1]=== "xls" ||
  //   fileName[fileName.length -1]=== "xltx" ||
  //   fileName[fileName.length -1]=== "xlt" ||
  //   fileName[fileName.length -1]=== "xlsm" ||
  //   fileName[fileName.length -1]=== "xlsb" ||
  //   fileName[fileName.length -1]=== "xltm" ||
  //   fileName[fileName.length -1]=== "csv"
  // ) {
  if (fileName[fileName.length - 1] === 'xlsx') {
    //
  } else {
    this.$message.error('仅支持Excel文件数据上传! 请下载模板后在模板编辑')
    return
  }
  // 加载文件
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  // 在读取器加载资源停止进度时读取表格文件
  reader.onloadend = () => {
    const arrayBuffer = reader.result
    const workbook = new Excel.Workbook()
    workbook.xlsx.load(arrayBuffer).then(workbook => {
      // 只读取文档的第一个sheet页
      const sheet = workbook.worksheets[0]
      // 获取每一行的数据
      sheet.eachRow((row, rowNumber) => {
        const data = {}
        console.log('全：', row)
        // 从第三行开始读取数据（第二行为备注信息）
        if (rowNumber > 2) {
          console.log('有效', rowNumber, row)
          template[protocol].forEach((val, valIdx) => {
            data[val] = row.values[valIdx + 1]
          })
          dataList.push(data)
        }
      })

      console.log(dataList, 'dataList')
      // cTemplate.protocolList = cTemplate.protocolList.concat(dataList)
      cTemplate.protocolList = dataList
      that.$message('保存中 请稍后')
      saveTemplateProtocol(cTemplate).then(() => {
        that.$message('保存成功')
        that.uploadDis = false
        that.getTemlate()
      })
    })
  }
}
