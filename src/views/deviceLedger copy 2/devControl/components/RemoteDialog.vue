<template>
  <SLDialog v-if="slDialogConfig.visible" :config="slDialogConfig">
    <template #title>
      <CardHeader :status="config.status" :icon-class="config.iconClass" :title="config.title" />
    </template>
    <div v-if="ControlList.length > 0" class="control-container">
      <el-card v-for="(item, i) in ControlList" :key="i" class="control-card">
        <div class="control-card-main">
          <div class="control-title">
            <i class="icon iconfont icon-xuanzewenjian yellow"></i>
            <span>{{ item.title }}</span>
          </div>
          <div v-if="item.formType !== '2'" class="control-info-box">
            <div class="control-info">
              <span class="control-label">当前值：</span>
              <span class="control-status">{{ item.value }}</span>
            </div>
            <div class="control-date">
              <span class="control-label">更新时间：</span>
              <span class="control-date">{{ item.updateTime }}</span>
            </div>
          </div>
        </div>

        <div class="control-footer">
          <div class="control-footer-form">
            <span class="control-label">控制：</span>
            <div class="control-form-item">
              <el-radio-group
                v-if="item.formType === '4' && item.controlOptions.length > 0"
                v-model="item.tempValue"
              >
                <el-radio
                  v-for="(option, j) in item.controlOptions"
                  :key="j"
                  :label="option.label"
                  >{{ option.value }}</el-radio
                >
              </el-radio-group>
              <el-input v-else v-model="item.tempValue"></el-input>
            </div>
          </div>

          <div class="control-footer-btns">
            <el-button type="primary" :loading="item.sending" @click="sendControlInfo(item)"
              >下发</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
    <div v-else class="no-content"><span class="no-content-text">暂无内容</span></div>
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'
import CardHeader from './cardHeader.vue'
import { defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import useRemote from '../hooks/useRemote'
import { IControlItem, IDialogConfig, PostControlParam } from '../..'
import useGlobal from '@/hooks/global/useGlobal'
import { removeSlash } from '@/utils/removeIdSlash'
import { ISLDialogConfig } from '@/components/SLDialog/type'
// 外 1，3，4
// 内 2，3，4
// 值和时间： 当2时显示
export default defineComponent({
  name: 'RemoteDialog',
  components: { SLDialog, CardHeader },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object as PropType<IDialogConfig>,
      default: () => {
        //
      }
    }
  },
  emits: ['update:model-value', 'refreshData'],
  setup(props, ctx) {
    const { $format, $message } = useGlobal()
    const { ControlList, postControlInfo } = useRemote()
    const state = reactive<{
      slDialogConfig: ISLDialogConfig
    }>({
      slDialogConfig: {
        title: props.config.title,
        visible: props.config.visible,
        scrollbar: true,
        cancel: {
          handler: async() => await ctx.emit('update:model-value', false),
          text: '关 闭'
        },
        width: '60%'
      }
    })
    const refreshData = () => {
      if (!props.config.device) return
      ControlList.value = []
      props.config.device.propertyDataList
        .filter(item => item.propertyType !== '1')
        .map(item => {
          const obj: IControlItem = {
            title: item.propertyName,
            formType: item.propertyType,
            value: item.value,
            tempValue: '',
            updateTime: item.collectionTime ? $format(new Date(item.collectionTime)) : '',
            id: item.property,
            controlOptions: formateControlOprtions(item.controlOptions)
          }
          ControlList.value.push(obj)
        })
    }
    const formateControlOprtions = (controlOptions: string) => {
      if (!controlOptions) return []
      const result: NormalOption[] = []
      const optionsArr = controlOptions.indexOf(';') ? controlOptions.split(';') : []
      optionsArr.map(item => {
        const optionKeyValue: any[] = item.indexOf(':') ? item.split(':') : []
        optionKeyValue.length > 1 &&
          result.push({
            label: optionKeyValue[0],
            value: optionKeyValue[1]
          })
      })
      return result
    }
    const sendControlInfo = async (item: IControlItem) => {
      console.log(item)
      item.sending = true
      const params: PostControlParam = {
        deviceId: removeSlash(props.config.deviceId || ''),
        property: item.id,
        value: item.tempValue
      }
      const res = await postControlInfo(params)
        .finally(() => {
          item.sending = false
        })
        // .catch(() => {
        //   item.sending = false
        // })
      if (res.data?.code === 200) {
        $message.success(res.data?.message)
        // item.value = item.tempValue
      } else $message.error(res.data?.message)
    }
    onMounted(() => {
      refreshData()
    })
    return {
      ...toRefs(state),
      ControlList,
      sendControlInfo
    }
  }
})
</script>

<style lang="scss" scoped>
.yellow {
  color: rgb(255, 217, 0);
}
.control-label {
  font-size: 12px;
  color: #b6b6b6;
}
.no-content {
  width: 100%;
  height: 100%;
  position: relative;
  .no-content-text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
.control-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;

  .control-card {
    margin: 10px 5px;
    :deep(.el-card__body) {
      background-color: #3743514e !important;
      padding: 0;
    }
    flex-basis: calc(50% - 10px);
    .control-card-main {
      padding: 8px;
      height: 95px;
    }
    .control-title {
      height: 38px;
      line-height: 38px;
      font-size: 16px;
    }
    .control-info-box {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      .control-date {
        font-size: 12px;
      }

      .control-status {
        color: lightgreen;
      }
      .control-date {
        float: right;
      }
    }
    .control-footer {
      background-color: #3c3f54;
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 0 8px;
      .control-footer-form {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-content: center;
        .control-label {
          line-height: 40px;
          flex-basis: 40px;
        }
        .control-form-item {
          flex: 1;
          .el-radio-group {
            widows: 100%;
            margin: 13px 0 12px;
          }
          .el-input {
            width: 100%;
            height: 25px;
          }
          :deep(.el-input__inner) {
            width: 100%;
            height: 25px;
            line-height: 20px;
          }
        }
      }
      .control-footer-btns {
        .el-button {
          min-height: 23px;
          padding: 0 15px;
          margin: 8px 15px 7px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
