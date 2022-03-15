const valueTextMap = {
  // 统计类型
  statType: {
    1: '累计值',
    0: '瞬时值'
  },
  // 数据类型
  dataType: {
    char: '8位有符号数',
    byte: '8位无符号数',
    short: '16位有符号数',
    word: '16位无符号数',
    DINT: '32位有符号数',
    Dword: '32位无符号数',
    float: '单精度浮点数',
    REAL: '双精度浮点数',
    String: 'String字符串',
    Long: 'Long',
    Boolean: 'Boolean',
    hlong: '有符号Long',
    ulong: '无符号Long',
    part: '24位特殊读取',
    bit: 'Bit'
  },
  // 变量类型
  propertyType: {
    // 1: '模拟输入量',
    // 2: '数字输入量',
    // 3: '数字输出量',
    // 4: '模拟输出量'
    1: '只读量',
    2: '只写量',
    3: '读写量',
    4: '开关量'
  },
  // 寄存器类型
  registerType: {
    1: '位寄存器',
    0: '普通寄存器'
  },
  // 数据有无符号
  registerSignFlag: {
    1: '有符号',
    0: '无符号'
  },
  // 大小端
  order: {
    big: '大端在前',
    little: '小端在前'
  }
}

export default valueTextMap
