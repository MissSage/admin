import { ISLFormItem, ISLFormSelect, ISLFormUser } from './type'

export const resolveValue = (config: ISLFormItem, val?: any) => {
  switch (config.type) {
    case 'checkbox':
    case 'cascader':
    case 'daterange':
    case 'datetimerange':
      return val ? (val instanceof Array ? val : [val]) : []
    case 'select':
      return config.multiple ? resolveSelectMultiple(config, val) : val
    case 'number':
      return val ? (typeof val === 'number' ? val : parseFloat(val)) : undefined

    default:
      return val
  }
}
export const deresolveValue = (config: ISLFormItem, val?: any) => {
  switch (config.type) {
    case 'user':
      return deresolveUser(config, val)
    case 'select':
      return config.multiple ? deresolveMultiple(config, val) : val
    default:
      return val
  }
}

const resolveSelectMultiple = (config: ISLFormSelect, val?: any) => {
  if (!val) return []
  else {
    if (val instanceof Array) return val
    else return val.split(',')
  }
}
const deresolveMultiple = (config: ISLFormSelect, val?: any) => {
  if (!val) return config.returnType === 'arr' ? [] : val
  else {
    if (val instanceof Array) {
      return config.returnType === 'str' ? val.join(',') : val
    } else {
      return config.returnType === 'str' ? val : val.split(',')
    }
  }
}
export const deresolveUser = (config:ISLFormUser, val?:any) => {
  if (!val) return val
  else {
    if (val instanceof Array) {
      return val.map(item => item.id).join(',')
    } else {
      return val
    }
  }
}
