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
import { GetStepFromStatus, InstallStatus, InstallSteps, setFormColumns, StatusForSubmit } from '.'
import SLForm from '@/components/SLForm/index.vue'
import { ISLFormConfig } from '@/components/SLForm'
import SLButton from '@/components/SLButton/index.vue'
import { ISLOperation } from '@/components/SLCardSearch/type'
import { SLConfirm, SLMessage } from '@/utils/global'
import { GetInstallDetail, PostInstallStatus } from '@/api/yinshou/shenqing/InstallApply'

import { IPostStatusParams } from '@/views/yinshou/types/shengqing/InstallApply'
import { useStore } from 'vuex'
import { SLStepsConfig } from '@/components/SLSteps/type'
interface IInstallApply {
  id?: string
  code?: string
  applyTime?: string
  custId?: string
  tel?: string
  bookId?: string
  address?: string
  idCardNo?: string
  packageId?: string
  status?: string
  custName?: string
  kancha_status?: string
  kancha_person?: string
  kancha_time?: string
  kancha_otherCost?: string
  kancha_remark?: string
  kancha_img?: string
  kancha_file?: string
  kancha_createTime?: string
  kancha_custId?: string
  kancha_newName?: string

  jiaofei_status?: string
  jiaofei_time?: string
  jiaofei_createTime?: string
  shigong_status?: string
  shigong_person?: string
  shigong_time?: string
  shigong_remark?: string
  shigong_img?: string
  shigong_createTime?: string
  yanshou_status?: string
  examPerson?: string
  examTime?: string
}
export default defineComponent({
  name: 'InstallApplyDialog',
  components: { SLSteps, SLForm, SLButton },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const fileUrl = store.state.app.actionUrl + 'api/file/file'
    const refSLForm = ref<InstanceType<typeof SLForm>>()
    const state = reactive<{
      title: string
      apply: IInstallApply
      buttons: ISLOperation[]
    }>({
      apply: {
        id: '',
        status: ''
      },
      title: (route.query.title || '报装审批') as string,
      buttons: [
        {
          perm: (() =>
            activeIndex.value >= InstallStatus.DAIJIAOFEI ||
            activeIndex.value < InstallStatus.DAISHENHE) as () => any,
          type: 'default',
          text: '返 回',
          click: () => routerBack()
        },
        // 待审核
        {
          perm: (() => activeIndex.value === InstallStatus.DAISHENHE) as () => any,
          type: 'danger',
          text: '拒 绝',
          click: () => refuseSHENHE()
        },
        {
          perm: (() => activeIndex.value === InstallStatus.REFUZED) as () => any,
          type: 'danger',
          disabled: true,
          text: '已拒绝'
        },
        {
          perm: (() => activeIndex.value === InstallStatus.DAISHENHE) as () => any,
          type: 'primary',
          text: '通 过',
          click: () => passSHENHE()
        },
        // 上门勘察
        {
          perm: (() => activeIndex.value === InstallStatus.SHANGMENKANCHA) as () => any,
          type: 'danger',
          text: '结 束',
          click: () => refuseKANCHA()
        },
        {
          perm: (() => activeIndex.value === InstallStatus.OVER) as () => any,
          type: 'danger',
          text: '已结束',
          disabled: true
        },
        {
          perm: (() => activeIndex.value === InstallStatus.SHANGMENKANCHA) as () => any,
          type: 'primary',
          text: '通 过',
          click: () => passKANCHA()
        },

        // 待缴费
        {
          perm: (() => activeIndex.value === InstallStatus.DAIJIAOFEI) as () => any,
          type: 'primary',
          text: '刷 新',
          click: () => refreshDetail()
        },
        {
          perm: (() => activeIndex.value === InstallStatus.DAIJIAOFEI) as () => any,
          type: 'primary',
          text: '完 成',
          click: () => compJIAOFEI()
        },

        // 上门施工
        {
          perm: (() => activeIndex.value === InstallStatus.SHANGMENSHIGONG) as () => any,
          type: 'primary',
          text: '完 成',
          click: () => compSHIGONG()
        },
        // 待验收
        {
          perm: (() => activeIndex.value === InstallStatus.DAIYANSHOU) as () => any,
          type: 'primary',
          text: '完 成',
          click: () => compYANSHOU()
        },
        {
          perm: (() => activeIndex.value === InstallStatus.COMPLETE) as () => any,
          type: 'primary',
          text: '已完成',
          disabled: true
        }
      ]
    })
    const slStepsConfig = ref<SLStepsConfig>({
      steps: InstallSteps
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
          case InstallStatus.SHANGMENKANCHA:
            para.obj = {
              status: params.kancha_status,
              person: params.kancha_person,
              time: params.kancha_time,
              otherCost: params.kancha_otherCost,
              remark: params.kancha_remark,
              img: params.kancha_img,
              file: params.kancha_file,
              custId: params.kancha_custId,
              newName: params.kancha_newName
            }
            break
          case InstallStatus.DAIJIAOFEI:
            para.obj = {
              status: params.jiaofei_status,
              time: params.jiaofei_time
            }
            break
          case InstallStatus.SHANGMENSHIGONG:
            para.obj = {
              status: params.shigong_status,
              person: params.shigong_person,
              time: params.shigong_time,
              remark: params.shigong_remark,
              img: params.shigong_img
            }
            break
          case InstallStatus.DAIYANSHOU:
            para.status = params.yanshou_status
            break
          default:
            break
        }
        const res = await PostInstallStatus(route.query.id as string, para as IPostStatusParams)
        if (res.data?.success === true) {
          SLMessage.success('操作成功！')
          refreshDetail()
        } else {
          SLMessage.error(res.data?.msg || '操作失败！')
        }
      }
    })

    const refuseSHENHE = () => {
      SLConfirm('确定拒绝？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
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
    const refuseKANCHA = () => {
      SLConfirm('确定结束？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = StatusForSubmit.KANCHA_BUTONGGUO
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch(() => {
          //
        })
    }
    const passKANCHA = () => {
      SLConfirm('确定通过勘察？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = StatusForSubmit.KANCHA_TONGGUO
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch()
    }
    const compJIAOFEI = () => {
      SLConfirm('确定完成缴费？', '提示信息')
        .then(() => {
          slFormConfig.value.setBeforeSubmit = (params: any) => {
            params.status = StatusForSubmit.JIAOFEI_WANCHENG
            return params
          }
          refSLForm.value?.Submit()
        })
        .catch()
    }
    const compSHIGONG = () => {
      SLConfirm('确定完成施工？', '提示信息').then(() => {
        slFormConfig.value.setBeforeSubmit = (params: any) => {
          params.status = StatusForSubmit.SHIGONG_WANCHENG
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
      if (!route.query.id) return
      const res = await GetInstallDetail(route.query.id as string)
      state.apply = {
        ...(res.data || {})
      }
      const step = GetStepFromStatus(state.apply.status)

      if (step >= InstallStatus.SHANGMENKANCHA) {
        state.apply.kancha_status = res.data?.zysInstallSurvey?.status
        state.apply.kancha_person = res.data?.zysInstallSurvey?.person
        state.apply.kancha_time = res.data?.zysInstallSurvey?.time
        state.apply.kancha_otherCost = res.data?.zysInstallSurvey?.otherCost
        state.apply.kancha_remark = res.data?.zysInstallSurvey?.remark
        state.apply.kancha_img = res.data?.zysInstallSurvey?.img
        state.apply.kancha_file = res.data?.zysInstallSurvey?.file
        state.apply.kancha_custId = res.data?.zysInstallSurvey?.custId
        state.apply.kancha_newName = res.data?.zysInstallSurvey?.newName
      }
      if (step >= InstallStatus.DAIJIAOFEI) {
        state.apply.jiaofei_status = res.data?.zysInstallCost?.status
        state.apply.jiaofei_time = res.data?.zysInstallCost?.time
      }
      if (step >= InstallStatus.SHANGMENSHIGONG) {
        state.apply.shigong_status = res.data?.zysInstallBuild?.status
        state.apply.shigong_time = res.data?.zysInstallBuild?.time
        state.apply.shigong_person = res.data?.zysInstallBuild?.person
        state.apply.shigong_remark = res.data?.zysInstallBuild?.remark
        state.apply.shigong_img = res.data?.zysInstallBuild?.img
      }
      if (step >= InstallStatus.DAIYANSHOU) {
        state.apply.yanshou_status = res.data?.status
      }
      refSLForm.value && (refSLForm.value.dataForm = state.apply)
      slFormConfig.value.columns = setFormColumns(step, fileUrl)
    }
    onMounted(async () => {
      refreshDetail()
    })
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
