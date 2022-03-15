export const initAddComponentCloums = (typeList: SelectOption[]) => {
  console.log(typeList)
  const cloums = [
    {
      type: 'input',
      label: '备件编号',
      key: 'code',
      rules: [{ required: true, message: '请填写编号' }]
    },
    {
      type: 'input',
      label: '备件名称',
      key: 'name',
      rules: [{ required: true, message: '请填写名称' }]
    },
    {
      type: 'input',
      label: '类别',
      key: 'type',
      rules: [{ required: true, message: '请填写类别' }]
    },
    // {
    //   type: 'select',
    //   label: '类别',
    //   key: 'type',
    //   options: typeList,
    //   search:true,
    //   allowCreate:true,
    //   multiple:true,
    //   multipleLimit:1,
    //   defaultFirst:true,
    //   rules: [{ required: true, message: '请填写名称' }]
    // },
    {
      type: 'input',
      label: '规格型号',
      key: 'specification',
      rules: [{ required: true, message: '请填写规格型号' }]
    }, {
      type: 'input',
      label: '度量单位',
      key: 'unit',
      rules: [{ required: true, message: '请填写度量单位' }]
    }
  ] as AOUCloumn[]
  return cloums
}
/**
 * 备件出入库，1为入库，2 为出库
 */
export const OptionType = {
  IN: '1',
  OUT: '2'
}