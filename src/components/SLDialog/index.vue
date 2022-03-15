<template>
  <el-dialog
    ref="dialog"
    v-model="visible"
    :width="width"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="() => handleColse()"
  >
    <template #title>
      <slot name="title"></slot>
    </template>

    <el-scrollbar
      v-if="scrollbar"
      ref="scrollbar"
      :height="contentHeight"
      :max-height="contentMaxHeight"
    >
      <div class="sl-dialog-content">
        <slot />
      </div>
    </el-scrollbar>
    <div
      v-else
      class="sl-dialog-content"
      :style="'overflow:hidden;height:' + contentHeight"
    >
      <slot />
    </div>
    <template #footer>
      <div ref="refDialogFooter" class="sl-dialog__footer">
        <slot name="footer"></slot>
      </div>
      <div class="dialog-footer" :class="footerAlign">
        <el-button
          v-if="cancel && cancel.show !== false"
          size="small"
          @click="cancel.handler"
        >
          {{
            cancel.text
          }}
        </el-button>
        <el-button
          v-if="confirm && confirm.show"
          size="small"
          type="primary"
          :loading="confirmLoading"
          @click="confirm.handler"
        >
          {{ confirm.text }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs
} from 'vue'
import type { PropType } from 'vue'
import type { IElDialog } from '@/common/types/element-plus'
import { ISLDialogConfig } from './type'

export default defineComponent({
  name: 'SlDialog',
  props: {
    config: {
      type: Object as PropType<ISLDialogConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['close', 'heightChangeComplete'],
  setup (props, ctx) {
    const state = reactive<
      ISLDialogConfig & {
        confirmLoading: boolean
        visible:boolean
      }
    >({
      headComponent: props.config.headComponent || null,
      scrollbar: props.config.scrollbar !== false,
      confirmLoading: false,
      visible: true,
      title: props.config.title || '',
      width: props.config.width || '560px',
      contentHeight: props.config.contentHeight,
      contentMaxHeight: props.config.contentMaxHeight,
      confirm: {
        text: (props.config.confirm && props.config.confirm.text) || '保 存',
        show: props.config.confirm && (props.config.confirm.show !== false),
        handler: async () => {
          if (!props.config.confirm) return
          props.config.confirm.handler && (await props.config.confirm.handler())
        }
      },
      cancel: {
        text: props.config.cancel && props.config.cancel.text ? props.config.cancel.text : '关 闭',
        show: props.config.cancel && (props.config.cancel.show !== false),
        handler: () => handleColse()
      },
      footerAlign: props.config.footerAlign || 'right',
      modalClose: props.config.modalClose || false,
      escapeClose: props.config.modalClose !== false
    })
    const handleColse = async () => {
      if (props.config.cancel && props.config.cancel.handler) {
        await props.config.cancel.handler()
      }
      ctx.emit('close')
    }
    const dialog = ref<IElDialog | null>(null)

    const refDialogFooter = ref<HTMLElement>()
    const resetContentHeight = () => {
      if (!props.config.contentHeight) {
        const appMainEl = document.getElementById('app-main')
        const footerHeight = refDialogFooter.value ? refDialogFooter.value.clientHeight : 0
        appMainEl && (state.contentHeight = appMainEl.clientHeight - 190 - footerHeight + 'px')
      } else {
        state.contentHeight = props.config.contentHeight || '600px'
      }
      if (!props.config.contentMaxHeight) {
        state.contentMaxHeight = state.contentHeight
      }
    }
    const resetTop = () => {
      dialog.value && (dialog.value.style['margin-top'] = '70px')
    }
    onBeforeMount(() => {
      resetContentHeight()
    })
    onMounted(() => {
      resetTop()
      nextTick(() => {
        resetContentHeight()
        ctx.emit('heightChangeComplete')
      })
      window.addEventListener('resize', () => resetContentHeight())
    })
    onUnmounted(() => {
      window.removeEventListener('resize', () => resetContentHeight())
    })
    return {
      ...toRefs(state),
      dialog,
      refDialogFooter,
      handleColse
    }
  }
})
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: calc(100% - 8px);
}
:deep(.el-scrollbar__view) {
  height: calc(100%);
}
.sl-dialog-content {
  margin-right: 15px;
  padding-bottom: 8px;
  height: 100%;
}
.el-dialog__footer {
  .right {
    text-align: right;
  }
  .left {
    text-align: left;
  }
}
.sl-dialog__footer {
  width: 100%;
  height: auto;
  text-align: left;
}
.dialog-footer {
  width: 100%;
}
</style>
