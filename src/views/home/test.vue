<template>
  <el-dialog v-model="visible">
    <div class="test">
      {{ props.flag?'true':'false' }}
    </div>
    <button @click="emitChange">emit</button>
  </el-dialog>
</template>
<script setup lang='ts'>import { ref, watch } from 'vue'

const props = defineProps({
  flag: {
    type: Boolean,
    default: false
  }
})
interface EmitsType {
  (e: 'change', flag: boolean): void
}

const emit = defineEmits<EmitsType>()
const visible = ref<boolean>(false)
watch(() => props.flag, (val:boolean) => { visible.value = val })
const emitChange = () => {
  emit('change', !props.flag)
}
</script>
<style scoped lang='scss'>

</style>
