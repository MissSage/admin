<template>
  <el-card class="order-card">
    <template #header>
      <div class="dialog-title">
        <span class="icon iconfont icon-arrowleft back-btn" @click="routerBack"></span>
        <span class="dialog-title-text">{{ title }}</span>
      </div>
    </template>
    <div class="main">
      <div class="step-box">
        <SLSteps :config="slStepsConfig" :current-index="activeIndex"></SLSteps>
      </div>
      <div class="main-content">
        <el-scrollbar>
          <SLForm ref="refSLForm" :config="slFormConfig"></SLForm>
        </el-scrollbar>
      </div>
    </div>

    <div class="footer">
      <SLButton
        v-for="(btn, i) in buttons"
        :key="i"
        :config="btn"
      ></SLButton>
    </div>
  </el-card>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SLSteps from '@/components/SLSteps/index.vue'
import { LeakStatus, LeakApplySteps, setFormColumns, GetStepFromStatus, StatusForSubmit } from '.'
import SLForm from '@/components/SLForm/index.vue'
import { ISLFormConfig } from '@/components/SLForm'
import SLButton from '@/components/SLButton/index.vue'
import { ISLOperation } from '@/components/SLCardSearch/type'
import { SLConfirm, SLMessage } from '@/utils/global'
import { GetRepaireDetail, PostRepaireStatus } from '@/api/yinshou/shenqing/RepaireApply'
import { SLStepsConfig } from '@/components/SLSteps/type'
interface IInstallApply {
  id?: string
  code?: string
  applyTime?: string
  custId?: string
  remark?: string
  address?: string
  tel?: string
  status?: string
  img?: string
  custName?: string
  repaire_status?: string
  repaire_person?: string
  repaire_time?: string
  repaire_remark?: string
  repaire_img?: string
  repaire_otherCost?: number
}
export default defineComponent({
  name: 'LeakApplyDialog',
  components: { SLSteps, SLForm, SLButton },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const refSLForm = ref<InstanceType<typeof SLForm>>()
    const state = reactive<{
      title: string
      apply: IInstallApply
      buttons: ISLOperation[]
    }>({
      apply: {
        id: ''
      },
      title: (route.query.title || '报漏报修') as string,
      buttons: [
        {
          perm: (() =>
            activeIndex.value >= LeakStatus.SHANGMENWEIXIU ||
            activeIndex.value < LeakStatus.DAISHENHE) as () => any,
          type: 'default',
          text: '返 回',
          click: () => routerBack()
        },
        // 待审核
        {
          perm: (() => activeIndex.value === LeakStatus.DAISHENHE) as () => any,
          type: 'danger',
          text: '拒 绝',
          click: () => refuseSHENHE()
        },
        {
          perm: (() => activeIndex.value === LeakStatus.REFUZED) as () => any,
          type: 'danger',
          disabled: true,
          text: '已拒绝'
        },
        {
          perm: (() => activeIndex.value === LeakStatus.DAISHENHE) as () => any,
          type: 'primary',
          text: '通 过',
          click: () => passSHENHE()
        },

        // 上门维修
        {
          perm: (() => activeIndex.value === LeakStatus.SHANGMENWEIXIU) as () => any,
          type: 'primary',
          text: '完 成',
          click: () => compSHIGONG()
        },
        // 待验收
        {
          perm: (() => activeIndex.value === LeakStatus.DAIYANSHOU) as () => any,
          type: 'primary',
          text: '完 成',
          click: () => compYANSHOU()
        },
        {
          perm: (() => activeIndex.value === LeakStatus.COMPLETE) as () => any,
          type: 'primary',
          text: '已完成',
          disabled: true
        }
      ]
    })
    const slStepsConfig = ref<SLStepsConfig>({
      steps: LeakApplySteps
    })
    const slFormConfig = ref<ISLFormConfig>({
      defaultValue: {
        ...(state.apply || {})
      },
      columns: [],
      submit: async (params: any) => {
        const para: any = {
          status: params.status
        }
        switch (GetStepFromStatus(params.status) - 1) {
          case LeakStatus.SHANGMENWEIXIU:
            para.obj = {
              status: params.repaire_status,
              person: params.repaire_person,
              time: params.repaire_time,
              remark: params.repaire_remark,
              img: params.repaire_img,
              otherCost: params.repaire_otherCost
            }
            break
          default:
            break
        }
        const res = await PostRepaireStatus(route.query.id as string, para)
        if (res.data?.success === true) {
          SLMessage.success('操作成功！')
          refreshDetail()
        } else {
          SLMessage.error('操作失败！')
        }
      }
    })

    const refuseSHENHE = () => {
      SLConfirm('确定拒绝？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            // const para = {
            //   status: StatusForSubmit.SHENHE_BUTONGGUO
            // }
            params.status = StatusForSubmit.SHENHE_BUTONGGUO
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch(() => {
          //
        })
    }
    const passSHENHE = () => {
      SLConfirm('确定通过审核？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = StatusForSubmit.SHENHE_TONGGUO
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch(() => {
          //
        })
    }

    const compSHIGONG = () => {
      SLConfirm('确定完成维修？', '提示信息').then(() => {
        slFormConfig.value.setBeforeSubmit = (params: any) => {
          params.status = StatusForSubmit.WEIXIU_WANCHENG
          return params
        }
        refSLForm.value?.Submit()
      })
    }
    const compYANSHOU = () => {
      SLConfirm('确定完成验收？', '提示信息').then(() => {
        slFormConfig.value.setBeforeSubmit = (params: any) => {
          params.status = StatusForSubmit.YANSHOU_WANCHENG
          return params
        }
        refSLForm.value?.Submit()
      })
    }
    const routerBack = () => {
      router.go(-1)
    }
    const activeIndex = computed((): number => GetStepFromStatus(state.apply.status))
    const refreshDetail = async () => {
      const res = await GetRepaireDetail(route.query.id as string)
      state.apply = {
        ...(res.data || {}),
        // status: '2',
        repaire_status: res.data?.zysRepairC?.status,
        repaire_person: res.data?.zysRepairC?.person,
        repaire_time: res.data?.zysRepairC?.time,
        repaire_remark: res.data?.zysRepairC?.remark,
        repaire_img: res.data?.zysRepairC?.img,
        repaire_otherCost: res.data?.zysRepairC?.otherCost
      }
      refSLForm.value && (refSLForm.value.dataForm = state.apply)
      slFormConfig.value.columns = setFormColumns(GetStepFromStatus(state.apply.status))
    }
    onMounted(() => refreshDetail())
    return {
      ...toRefs(state),
      routerBack,
      slStepsConfig,
      activeIndex,
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
