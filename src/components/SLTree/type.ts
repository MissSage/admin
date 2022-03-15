import { NormalOption } from '@/common/types/common'

interface ITreeSelectFilter {
  key: string
  label: string
  options?: NormalOption[]
  style?: string
  multiple?: boolean
  search?: boolean
  handleChange?: (params: any) => any
  defaultVal?: any
}

interface ITreeSwitch {
  options: any[]
  curVal?: any
  handle?: (val: any) => any
}
interface IBtnPerm {
  editBtn?: any
  delBtn?: any
  addBtn?: any
  noChild?: any
}
export interface SLTreeConfig {
  title?: string
  data: NormalOption[] // 这个可以通过继承来更改
  isFilterTree?: boolean
  loading?: boolean
  selectFilter?: ITreeSelectFilter
  switch?: ITreeSwitch
  operationText?: string[]
  nodeBtnWidth?: number
  currentProject?: any
  showAll?: boolean // 全部项目
  treeNodeHandleClick?: (params: any) => void
  expandNodeId?: any[]
  defaultProps?: any
  allowCreate?: boolean // 是否显示功能按钮
  allowNew?: boolean // 是否可以新增根项
  btnPerms?: IBtnPerm // 按钮授权
  clickAddOrEdit?: any // 点击增加或者编辑
  projectDelete?: any
  activeAll?: boolean
  showAllProject?: () => void
}
