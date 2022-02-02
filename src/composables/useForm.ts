import { DataForm } from '@/components/LgsForm/type'
import { IFormRuleMap } from '@/types/element-plus'
import { ref } from 'vue'

const useForm = () => {
  const formRules = ref<IFormRuleMap>()
  const formData = ref<DataForm>()
  return {
    formRules,
    formData
  }
}
export default useForm
