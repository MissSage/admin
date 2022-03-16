// import Excel from 'exceljs/dist/es5/exceljs.browser'
import Excel from 'exceljs/index'
import fileDownload from 'js-file-download'
import $ from 'jquery'

export class TrueExcel {
  workbook:any
  sheet:any
  head:any
  imageCol:number
  constructor () {
    this.workbook = new Excel.Workbook()
    this.workbook.created = new Date()
    this.sheet = this.workbook.addWorksheet('My Sheet')
    this.head = null
    this.imageCol = 0
  }

  addElTable (table: any) {
    this.workbook = new Excel.Workbook()
    this.workbook.created = new Date()
    this.sheet = this.workbook.addWorksheet('My Sheet')
    this.head = null
    this.addTableHeader(table)
    this.addTableBody(table)
  }

  /**
   * 添加表头
   * 20220207 lichao 修复因el-table存在固定列而导致的导出的列数据对应不正确的问题
   * @param {*} table
   */
  addTableHeader (table:any) {
    const headerArray:any[] = []
    const headerItems = $(table.$el).find('.el-table__header-wrapper .el-table__header th')
    const fixedHeaderItems:any = $(table.$el).find('.el-table__fixed .el-table__header th')
    headerItems.map((i: string | number, item: { innerText: any; classList: { contains: (arg0: string) => any } }) => {
      const head:any = {}

      head.header = item.innerText
      head.key = item.innerText
      head.width = 30
      if (item.classList.contains('is-hidden')) {
        if (fixedHeaderItems && fixedHeaderItems.length >= headerItems.length) {
          head.header = fixedHeaderItems[i].innerText
          head.key = fixedHeaderItems[i].innerText
        }
      }
      headerArray.push(head)
    })
    if (headerArray.length > 0) {
      this.sheet.columns = headerArray
      this.sheet.getRow(1).eachCell((cell: { fill: { type: string; pattern: string; fgColor: { argb: string } } }, cellNum: any) => {
        if (!cell) console.log(cellNum)
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'eeeeee' }
        }
      })
    }
  }

  /**
   * 添加表数据
   * 20220207 lichao 修复因el-table存在固定列而导致的导出的列数据对应不正确的问题
   * @param {*} table
   */
  addTableBody (table: { $el: any }) {
    const bodyRows = $(table.$el).find('.el-table__body-wrapper .el-table__body tr')
    const fixedBodyRows:any = $(table.$el).find('.el-table__fixed .el-table__body tr')
    bodyRows.map((i: string | number, row: any) => {
      const rowArray:any[] = []
      const rowItems = $(row).find('td')
      rowItems.map((j: string | number, item:any) => {
        // 如果单元格有is-hidden表示可能固定列,需要从固定列中取对应行列的单元格值
        if (item.classList.contains('is-hidden')) {
          if (fixedBodyRows.length >= rowArray.length) {
            const fiexedCells:any = $(fixedBodyRows[i]).find('td')
            if (fiexedCells.length >= rowItems.length) {
              rowArray.push(fiexedCells[j].innerText)
            }
          }
        } else {
          if (item.innerText === '') {
            rowArray.push(item.innerText)
          } else {
            rowArray.push(
              Number(item.innerText) || Number(item.innerText) === 0
                ? Number(item.innerText)
                : item.innerText
            )
          }
        }
      })
      this.sheet.addRow(rowArray)
    })
  }

  removeOperateRow () {
    const operateRow = this.sheet.getColumn('操作')
    this.sheet.spliceColumns(operateRow.number, 1)
  }

  removeSelectRow () {
    // const operateRow = this.sheet.getColumn('操作')
    this.sheet.spliceColumns(1, 1)
  }

  addImage (img: { src: any; width: number; height: number }) {
    const lastCol = this.sheet.columns.length
    const imgId = this.workbook.addImage({
      base64: img.src,
      extension: 'png'
    })
    this.sheet.addImage(imgId, {
      tl: {
        col: lastCol,
        row: this.imageCol
      },
      br: {
        col: img.width / 5 / 19.2 + lastCol,
        row: img.height / 5 / 5 + this.imageCol
      },
      editAs: 'oneCell'
    })
    this.imageCol += img.height / 5 / 5 + 5
  }

  export () {
    this.workbook.xlsx
      .writeBuffer({
        base64: true
      })
      .then(function (xls64: any) {
        fileDownload(xls64, 'export.xlsx')
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

// export class DownloadExcel {
//   trueExcel() {
//     this.workbook = new Excel.Workbook()
//     this.sheet = this.workbook.addWorksheet('Sheet one')

//     this.workbook.creator = '能源管理系统'
//     this.workbook.created = new Date()
//     this.workbook.modified = new Date()
//   }
//   tabelExportToExcel(data) {
//     this.sheet.properties.defaultRowHeight = 25
//     this.sheet.columns = []
//     const col = Object.keys(data[0])

//     if (data[0].label) {
//       col.forEach(v => {
//         const columnsInfo = {}
//         data.forEach(v => {
//           columnsInfo.header = v.label
//         })
//         columnsInfo.key = v
//         columnsInfo.width = 20
//         this.sheet.columns.push(columnsInfo)
//       })
//     } else {
//       col.forEach(v => {
//         const columnsInfo = {}
//         columnsInfo.header = v
//         columnsInfo.key = v
//         columnsInfo.width = 20
//         this.sheet.columns.push(columnsInfo)
//       })
//     }

//     data.forEach(item => {
//       this.sheet.addRow(item)

//     })
//   }
//   imageExportToExcel() {}

//   downloadExcel() {

//     this.workbook.xlsx.writeBuffer({
//       base64: true
//     }).then((xls64) => {
//       // 构建锚标记和附加文件（在chrome中工作）
//       var a = document.createElement('a')
//       var data = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

//       var url = URL.createObjectURL(data)
//       a.href = url
//       a.download = Date.now() + 'export.xlsx'
//       document.body.appendChild(a)
//       a.click()
//       setTimeout(() => {
//         document.body.removeChild(a)
//         window.URL.revokeObjectURL(url)
//       }, 0)
//     }).catch((error) => {

//     })
//   }
// }

// // -----------------------------------------------------------------------
// export class Download {
//   tabelExportToExcel(data) {
//     const workbook = new Excel.Workbook()
//     workbook.creator = '能源管理系统'
//     workbook.created = new Date()
//     workbook.modified = new Date()

//     const sheet = workbook.addWorksheet('My Sheet')
//     sheet.properties.defaultRowHeight = 25

//     sheet.columns = [
//       { header: '时间', key: 'date', width: 20 },
//       { header: '姓名', key: 'name', width: 10 },
//       { header: '地址', key: 'address', width: 40 }
//     ]
//     data.forEach(item => {
//       sheet.addRow(item)

//     })

//     workbook.xlsx.writeBuffer({
//       base64: true
//     }).then(xls64 => {
//       // build anchor tag and attach file (works in chrome)
//       // 构建锚标记和附加文件（在chrome中工作）
//       var a = document.createElement('a')
//       var data = new Blob([xls64], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

//       var url = URL.createObjectURL(data)
//       a.href = url
//       a.download = 'export.xlsx'
//       document.body.appendChild(a)
//       a.click()
//       setTimeout(() => {
//         document.body.removeChild(a)
//         window.URL.revokeObjectURL(url)
//       }, 0)
//     }).catch(error => {

//     })
//   }
// }
