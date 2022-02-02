export const getText = (formFields:any, item:any) => {
  // 2019.10.24修复表单select组件为只读的属性时没有绑定数据源
  const text = formFields[item.field]
  if (typeof text === 'function') return text(formFields)
  if (text === 'null' || text === '' || text === null || text === undefined) { return '--' }
  // 2021.03.02增加只读时日期处理
  if (item.type === 'date') {
    return text.replace('T', ' ').split(' ')[0]
  }
  // 2021.03.31修复表单switch只读时没有转换值的问题
  if (item.type === 'switch') {
    return text ? '是' : '否'
  }
  if (!item.data) return text
  if (item.type === 'selectList' || item.type === 'checkbox') {
    return convertArrayValue(item.data, text)
  }
  const _item = item.data.find((item:any) => {
    return item.key === text
  })
  return _item ? _item.value : text
}
const convertArrayValue = (data:any, val:any) => {
  // 2020.12.13增加表单多选只转换字典
  // 编辑多选table显示
  const valArr = val instanceof Array ? val : val.split(',')
  for (let index = 0; index < valArr.length; index++) {
    const _item = data.find((item:any) => {
      return item.key && item.key !== '0' && item.key + '' === valArr[index] + ''
    })
    if (_item) {
      valArr[index] = _item.value
    }
  }
  return valArr.join(',')
}
