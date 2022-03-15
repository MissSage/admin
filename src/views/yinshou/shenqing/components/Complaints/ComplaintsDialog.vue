<template>
  <el-card class="order-card">
    <template #header>
      <div class="dialog-title">
        <span class="icon iconfont icon-arrowleft back-btn" @click="routerBack"></span>
        <span class="dialog-title-text">{{ title }}</span>
      </div>
    </template>
    <div class="main">
      <el-scrollbar>
        <SLForm ref="refSLForm" :config="slFormConfig"></SLForm>
      </el-scrollbar>
    </div>
    <div class="footer">
      <SLButton v-for="(btn, i) in buttons" :key="i" :config="btn"></SLButton>
    </div>
  </el-card>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ComplaintsStatus, setFormColumns } from '.'
import SLForm from '@/components/SLForm/index.vue'
import { ISLFormConfig } from '@/components/SLForm'
import SLButton from '@/components/SLButton/index.vue'
import { ISLOperation } from '@/components/SLCardSearch/type'
import { SLConfirm, SLMessage } from '@/utils/Message'
import { ComplaintsReply } from '@/api/yinshou/shenqing/Complaints'
interface IComplaintsApply {
  id?: string
  code?: string
  createTime?: string
  custId?: string
  custName?: string
  remark?: string
  address?: string
  tel?: string
  status?: string
  reply?: string
  replyTime?: string
  img?: string
}
export default defineComponent({
  name: 'ComplaintsApplyDialog',
  components: { SLForm, SLButton },
  setup() {
    const route = useRoute()
    const refSLForm = ref<InstanceType<typeof SLForm>>()
    const state = reactive<{
      title: string
      apply: IComplaintsApply
      buttons: ISLOperation[]
    }>({
      apply: {
        ...((route.query.row && JSON.parse(route.query.row as string)) || {})
        // status: '2'
      },
      title: (route.query.title || '投诉意见') as string,
      buttons: [
        // {
        //   perm: (() =>
        //     activeIndex.value >= ComplaintsStatus.COMPLETE ||
        //     activeIndex.value === ComplaintsStatus.OMITED) as () => any,
        //   type: 'default',
        //   text: '返 回',
        //   click: () => routerBack()
        // },
        // 待审核
        {
          perm: (() => activeIndex.value === ComplaintsStatus.DAIHUIFU) as () => any,
          type: 'danger',
          text: '忽 略',
          click: () => omitApply()
        },

        {
          perm: (() => activeIndex.value === ComplaintsStatus.DAIHUIFU) as () => any,
          type: 'primary',
          text: '回 复',
          click: () => passReply()
        },
        {
          perm: (() => activeIndex.value === ComplaintsStatus.COMPLETE) as () => any,
          type: 'primary',
          text: '已回复',
          disabled: true
        },
        {
          perm: (() => activeIndex.value === ComplaintsStatus.OMITED) as () => any,
          type: 'primary',
          text: '已忽略',
          disabled: true
        }
      ]
    })
    const slFormConfig = ref<ISLFormConfig>({
      defaultValue: {
        ...(JSON.parse((route.query.row as string) || '{}') || {})
      },
      columns: [],
      submit: async (params: any) => {
        const para = {
          id: params.id,
          reply: params.reply,
          status: params.status
        }
        const res = await ComplaintsReply(para)
        if (res.data?.success === true) {
          SLMessage.success(params.status === ComplaintsStatus.OMITED ? '已忽略' : '回复成功!')
          setTimeout(() => {
            routerBack()
          }, 500)
          state.apply.status = params.status
          slFormConfig.value.columns = setFormColumns(params.status)
        } else {
          SLMessage.error('操作失败！')
        }
      }
    })

    const omitApply = () => {
      SLConfirm('确定忽略？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = ComplaintsStatus.OMITED
            return params
          }
          refSLForm.value?.Submit()
          // SLMessage.info('已拒绝')
          // state.apply.status = ComplaintsStatus.OMITED
          // slFormConfig.value.columns = setFormColumns(state.apply.status)
        })
        .catch(() => {
          //
        })
    }
    const passReply = () => {
      SLConfirm('确定完成？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = ComplaintsStatus.COMPLETE
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch(() => {
          //
        })
    }

    const routerBack = () => {
      router.go(-1)
    }
    const activeIndex = computed((): string => state.apply.status || '1')
    onMounted(() => {
      slFormConfig.value.columns = setFormColumns(state.apply.status)
    })
    return {
      ...toRefs(state),
      routerBack,
      slFormConfig,
      refSLForm
    }
  }
})
</script>
<style scoped lang="scss">
.order-card {
  width: 100%;
  height: 100%;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.5);
}
.el-card {
  border-radius: 0;
}
:deep(.el-card__header) {
  border: none;
}
:deep(.el-card__body) {
  height: calc(100% - 56px);
}
.dialog-title {
  .back-btn {
    cursor: pointer;
  }
}
.main {
  height: calc(100% - 80px);
  .main-content {
    height: calc(100% - 100px);
  }
}
.footer {
  height: 60px;
  padding: 0 15px;
  text-align: right;
  border-top: 1px solid #aaaaaa;
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
.step-box {
  margin-right: 15px;
}
</style>
