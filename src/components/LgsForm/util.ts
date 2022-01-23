export const rule = {
  change: [
    'checkbox',
    'select',
    'date',
    'datetime',
    'drop',
    'radio',
    'cascader'
  ], // 2020.05.31增加级联类型
  phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
  decimal: /(^[-0-9][0-9]*(.[0-9]+)?)$/,
  number: /(^[-0-9][0-9]*([0-9]+)?)$/
}

export const types = {
  int: 'number',
  byte: 'number',
  decimal: 'number', // "float",
  string: 'string',
  bool: 'boolean',
  datetime: 'datetime',
  date: 'date',
  mail: 'email'
}

export const colPow = Math.pow(10, 3)
