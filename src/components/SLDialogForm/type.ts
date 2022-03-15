import { ISLDialogConfig } from '../SLDialog/type'
import { ISLFormConfig } from '../SLForm'

export interface ISLDialogFormConfig {
  formConfig: ISLFormConfig
  dialogConfig: ISLDialogConfig
  showForm?:boolean
}
