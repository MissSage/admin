import { ElForm, ElDialog, ElTree, ElTable, ElScrollbar } from 'element-plus'
import { FormRules, FormItemRule } from 'element-plus/es/components/form/src/types'

export type IElForm = InstanceType<typeof ElForm>
export type IElDialog = InstanceType<typeof ElDialog>
export type IElTree = InstanceType<typeof ElTree>
export type IElTable = InstanceType<typeof ElTable>

export type IFormRule = Record<string, FormItemRule[]>
export type IFormItemRule = FormRules
export type IElScrollbar = InstanceType<typeof ElScrollbar>
