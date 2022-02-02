import { ElForm, ElDialog, ElTree, ElTable } from 'element-plus'
import { FormItemRule, FormRulesMap } from 'element-plus/packages/components/form/src/form.type'

export type IElForm = InstanceType<typeof ElForm>
export type IElDialog = InstanceType<typeof ElDialog>
export type IElTree = InstanceType<typeof ElTree>
export type IELTable = InstanceType<typeof ElTable>
export type IFormRule = Record<string, FormItemRule[]>
export type IFormRuleMap = FormRulesMap
