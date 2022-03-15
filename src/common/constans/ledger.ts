// 管理台账 公用
export const TASKSTATUS = {
  WEIKAISHI: '1',
  DAIZHIXING: '2',
  DAIYANSHOU: '3',
  YIWANCHENG: '4'
}
// 处置状态颜色
export const STATUSCOLORS = {
  0: '#DF9444FF',
  1: '#22A846FF',
  2: '#FF59E9FF'
}
// 添加转移状态
export const FORMATSTATUS = {
  0: '未通过',
  1: '已通过',
  2: '待审核'
}
export const FORMATSTATUSTB = [
  { text: '未通过', bcolor: '#DF9444FF' }, // 橙色
  { text: '已通过', bcolor: '#22A846FF' }, // 绿色
  { text: '审核中', ccolor: '#FF59E9FF' }// 紫色
]
// 添加设备类型
export const DEVICETYPE = {
  1: '管道',
  2: '物联网水表',
  3: 'PLC',
  4: '压力计',
  0: '其他'
}
// 添加处置状态
export const DISFORMATSTATUS = {
  0: '不通过',
  1: '已通过',
  2: '待审核'
}
export const DISFORMATSTATUSTB = [
  { text: '未通过', bcolor: '#22A846FF' },
  { text: '已通过', bcolor: '#D1B31CFF' },
  { text: '审核中', ccolor: '#2078C4FF' }
]

// 处置类型颜色
export const CTYPESCOLORS = {
  0: '#FF5757FF',
  1: '#FFF357FF',
  2: '#6DFF57FF'
}
// 处置类型
export const DISTYPEFORMATSTATUS = {
  0: '报废',
  1: '闲置',
  2: '在用'
}

// 盘点状态颜色
export const PSTATUSCOLORS = {
  0: '#DF9444FF', // 橙色
  1: '#FF59E9FF', // 紫色
  2: '#22A846FF'// 绿色
}
// 添加盘点状态
export const CHEFORMATSTATUS = {
  0: '未盘点',
  1: '部分盘点',
  2: '已盘点'
}
export const ISFLAG = {
  0: '否',
  1: '是'
}
export const ISFLAGCOR = {
  0: '#6BD2F8FF',
  1: 'red'
}

export const CHEFORMATSTATUSCOR = {
  0: '#DF9444FF', // 橙色
  1: '#FF59E9FF', // 紫色
  2: '#22A846FF'// 绿色
}

// 添加设备主页类型判断
// 设备状态
export const deviceStatus = {
  0: '在用',
  1: '闲置',
  2: '待维修'
}
// 设备状态颜色
export const deviceStatusCor = {
  0: '#22A846FF',
  1: '#D1B31CFF',
  2: '#2078C4FF'
}
// 设备等级
export const deviceGrade = {
  0: '重点设备',
  1: '主要设备',
  2: '一般设备'
}
// 设备等级颜色
export const deviceGradeCor = {
  0: 'red',
  1: 'yellow',
  2: '#6BD2F8FF'
}
// 设备来源
export const DIVFORMATSOURCE = {
  0: '租赁',
  1: '借用',
  2: '采购'
}
// 设备类别
export const DIVFORMATTYPE = {
  0: '生产设备',
  1: '工艺设备',
  2: '压力设备'
}
// 折旧方法
export const FORMATMETHOD = {
  0: '无',
  1: '年限平均法',
  2: '年数总和法'
}

// 维修任务类型
export const TASKTYPE = {
  1: '固定日期任务',
  2: '触发性任务',
  3: '预防性任务',
  4: '故障报修任务'
}
// 保养任务类型 类型。1：；3：
export const BTASKTYPE = {
  1: '固定日期计划',
  3: '预防性计划'
}
