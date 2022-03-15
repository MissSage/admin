import { ref } from 'vue'
import { ISLDialogConfig } from './type'

/**
 * 生成弹窗配置
 * @param comfirm 提交按钮回调
 * @param cancel 取消按钮回调
 * @returns
 */
const useSLDialog = (comfirm?: () => Promise<any>, cancel?: () => Promise<any>) => {
  const slDialogConfig = ref<ISLDialogConfig>({
    visible: false,
    title: '',
    scrollbar: true,
    confirm: {
      text: '确 定',
      show: !!comfirm,
      handler: comfirm
    },
    cancel: {
      text: '关 闭',
      handler: async () => {
        slDialogConfig.value.visible = false
        cancel && (await cancel())
      }
    }
  })

  return {
    slDialogConfig
  }
}
export default useSLDialog
