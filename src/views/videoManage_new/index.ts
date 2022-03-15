export const initAddDialogColums = (formattedVideoSource?: SelectOption[]) => {
  if (!formattedVideoSource) {
    formattedVideoSource = []
  }
  return [
    {
      type: 'input',
      label: '摄像头名称',
      key: 'videoName',
      rules: [{ required: true, message: '请填写摄像头名称' }]
    },
    {
      type: 'select',
      label: '摄像源',
      search: true,
      options: formattedVideoSource,
      key: 'serialNumber',
      rules: [{ required: true, message: '请选择摄像源' }]
    },
    {
      type: 'location',
      label: '视频地址',
      key: 'location',
      aInfo: true,
      rules: [{ required: true, message: '请选择地址' }]
    }
    // {
    //   type: 'select',
    //   label: '摄像头类型',
    //   key: 'videoType',
    //   options: [{ label: '萤石云', value: '萤石云' }],
    //   rules: [{ required: true, message: '请选择' }]
    // },
    // {
    //   type: 'input',
    //   label: 'appSecret',
    //   key: 'appSecret',
    //   rules: [{ required: true, message: '请填写appSecret' }]
    // },
    // {
    //   type: 'input',
    //   label: '通道号',
    //   key: 'channelId',
    //   rules: [{ required: true, message: '请填写通道号' }]
    // },
    // {
    //   type: 'input',
    //   label: '序列号',
    //   key: 'serialNumber',
    //   rules: [{ required: true, message: '请填写序列号' }]
    // },
    // {
    //   type: 'input',
    //   label: '验证码',
    //   key: 'captcha',
    //   rules: [{ required: true, message: '请填写验证码' }]
    // },
    // {
    //   type: 'input',
    //   label: '视频流地址',
    //   key: 'url',
    //   rules: [{ required: true, message: '请填写视频流地址' }]
    // }
  ]
}
export const getTreeItem = (data: any[], id?: string) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.id == id) {
      return item
    } else {
      if (item.children) {
        return getTreeItem(item.children, id)
      } else {
        return null
      }
    }
  }
}
export const getInnerFirstChild = (data: any) => {
  if (data.children && data.children.length > 0) {
    const childPros = data.children.filter(item => item.nodeType === 'Project')
    if (childPros && childPros.length > 0) {
      return getInnerFirstChild(childPros[0])
    } else {
      return data
    }
  } else {
    return data
  }
}
