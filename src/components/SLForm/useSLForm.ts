import { ref } from 'vue'
import { ISLFormConfig } from '.'
/**
 * 生成表单配置
 * @param handleSubmit 提交表单方法
 * @returns
 */
const useSLForm = (
  handleSubmit?: (params?: any) => Promise<any>
) => {
  const slFormConfig = ref<ISLFormConfig>({
    labelWidth: '120px',
    defaultValue: {},
    columns: [],
    /**
     * 在提交前整理数据的勾子
     * 需要返回参数对象
     */
    setBeforeSubmit: (params: any) => {
      //
      return params
    },
    submit: handleSubmit
  })
  return {
    slFormConfig
  }
}
export default useSLForm
