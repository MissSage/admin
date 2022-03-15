import { computed, watch, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const { body } = document
const WIDTH = 1024
const RATIO = 3

export const useResize = () => {
  // const { sidebar, device } = mapGetters(['sidebar', 'device'])
  // console.log(sidebar, device)
  const store = useStore()
  const route = useRoute()
  const sidebar = computed(() => store.getters.sidebar)
  const device = computed(() => store.getters.device)

  const _isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
  }
  const resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = _isMobile()
      store.dispatch('app/ToggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        store.dispatch('app/CloseSideBar', { withoutAnimation: true })
      }
    }
  }
  watch(
    () => route,
    () => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        store.dispatch('app/CloseSideBar', { withoutAnimation: false })
      }
    }
  )
  onMounted(() => {
    const isMobile = _isMobile()
    if (isMobile) {
      store.dispatch('app/ToggleDevice', 'mobile')
      store.dispatch('app/CloseSideBar', { withoutAnimation: true })
    }
  })
  onBeforeMount(() => window.addEventListener('resize', resizeHandler))

  return { sidebar, device }
}
