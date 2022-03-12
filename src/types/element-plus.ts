import { ElForm, ElDialog, ElTree, ElTable } from 'element-plus'
import { FormItemRule, FormRules } from 'element-plus/es/components/form/src/types'

export type IElForm = InstanceType<typeof ElForm>
export type IElDialog = InstanceType<typeof ElDialog>
export type IElTree = InstanceType<typeof ElTree>
export type IELTable = InstanceType<typeof ElTable>
export type IFormRule = Record<string, FormItemRule[]>
export type IFormRuleMap = FormRules
