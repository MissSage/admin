import { ElMessage, ElMessageBox } from 'element-plus'
import { App } from 'vue'
/**
 * 消息
 */
export const SLMessage = {
  success: (message: string, duration:number = 2000) => {
    ElMessage({
      type: 'success',
      duration,
      showClose: true,
      message: message
    })
  },
  error: (message: string, duration:number = 2000) => {
    ElMessage({
      type: 'error',
      duration,
      showClose: true,
      message: message
    })
  },
  warning: (message: string, duration:number = 2000) => {
    ElMessage({
      type: 'warning',
      duration,
      showClose: true,
      message: message
    })
  },
  info: (message: string, duration:number = 2000) => {
    ElMessage({
      type: 'info',
      duration,
      showClose: true,
      message: message
    })
  }
}
/**
 * 确认框
 * @param message
 * @param title
 * @returns
 */
export const SLConfirm = (message: string, title: string) => {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
